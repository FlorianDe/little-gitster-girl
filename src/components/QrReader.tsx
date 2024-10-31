import { useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';

import './QrReader.css';

import QrScanner from 'qr-scanner';

/*
* MonkeyPatch getContext method to add willReadFrequently:true to the options
*/
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
    this: HTMLCanvasElement,
    contextId: "2d",
    options?: CanvasRenderingContext2DSettings
): RenderingContext | null {
    if (contextId === '2d') {
        options = { willReadFrequently: true };
    }
    return originalGetContext.call(this, contextId, options);
} as never;

export type QrReaderRef = {
    start: (onSuccessCb?: () => void, onErrorCb?: (e: Error) => void) => void;
    stop: () => void;
};

export type QrReaderProps = {
    onScanSuccess: (result: QrScanner.ScanResult, scanner?: QrScanner) => void;
    onStopScanning: () => void;
    onScanFail?: (err: string | Error) => void;
    isStarted: boolean;
};

const QrReader = forwardRef<QrReaderRef, QrReaderProps>((props, ref) => {
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);

    const onScanSuccess = useCallback((result: QrScanner.ScanResult) => {
        props.onScanSuccess(result, scanner?.current);
    }, [props]);

    const onScanFail = useCallback((err: string | Error) => {
        console.debug(err);
    }, []);

    const start = (onSuccessCb?: () => void, onErrorCb?: (e: Error) => void) => {
        scanner?.current
            ?.start()
            .then(() => {
                if (onSuccessCb) {
                    onSuccessCb();
                }
            })
            .catch((err) => {
                if (err) {
                    if (onErrorCb) {
                        const error = err instanceof Error ? err : new Error(`${err}`);
                        onErrorCb(error);
                    }
                }
            });
    };

    const stop = () => {
        try {
            scanner?.current?.stop();
        } catch (e) {
            console.error('Somehow wasnt able to stop the qr code scanner!');
        }
    };

    useImperativeHandle(ref, () => ({
        start,
        stop,
    }));

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                maxScansPerSecond: 5,
                onDecodeError: onScanFail,
                preferredCamera: 'environment',
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl?.current || undefined,
                returnDetailedScanResult: true,
            });
        }

        return () => {
            if (!videoEl?.current) {
                scanner?.current?.stop();
            }
        };
    }, [onScanFail, onScanSuccess]);

    return (
        <div className="qr-reader">
            <video ref={videoEl}>{/* <track default kind="captions" srcLang="en" /> */}</video>
            <div ref={qrBoxEl} className="qr-box">
                <svg
                    width={256}
                    height={256}
                    className="qr-frame"
                    viewBox="0 0 128 128"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M32 127C32 127.55 31.55 128 31 128L1 128C0.45 128 5.3662e-09 127.55 1.19249e-08 127L3.69671e-07 97C3.7623e-07 96.45 0.45 96 1 96C1.55 96 2 96.45 2 97L2 126L31 126C31.55 126 32 126.45 32 127Z"
                        fill="#FEFEFE"
                    />
                    <path
                        d="M127 96C127.55 96 128 96.45 128 97L128 127C128 127.55 127.55 128 127 128L97 128C96.45 128 96 127.55 96 127C96 126.45 96.45 126 97 126L126 126L126 97C126 96.45 126.45 96 127 96Z"
                        fill="#FEFEFE"
                    />
                    <path
                        d="M1 32C0.45 32 0 31.55 0 31V1C0 0.45 0.45 0 1 0H31C31.55 0 32 0.45 32 1C32 1.55 31.55 2 31 2H2V31C2 31.55 1.55 32 1 32Z"
                        fill="#FEFEFE"
                    />
                    <path
                        d="M96 0.999999C96 0.449999 96.45 -1.37909e-06 97 -1.35505e-06L127 -4.37114e-08C127.55 -1.96701e-08 128 0.45 128 1L128 31C128 31.55 127.55 32 127 32C126.45 32 126 31.55 126 31L126 2L97 2C96.45 2 96 1.55 96 0.999999Z"
                        fill="#FEFEFE"
                    />
                </svg>
            </div>
        </div>
    );
});
QrReader.displayName = 'QrReader';
export default QrReader;