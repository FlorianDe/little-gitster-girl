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
    pause: () => void;
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
    // const qrBoxEl = useRef<HTMLDivElement>(null);

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

    const pause = () => {
        try {
            scanner?.current?.pause();
        } catch (e) {
            console.error('Somehow wasnt able to pause the qr code scanner!');
        }
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
        pause,
        stop,
    }));

    useEffect(() => {
        if (videoEl?.current && !scanner.current) {
            scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
                // maxScansPerSecond: 20,
                onDecodeError: onScanFail,
                preferredCamera: 'environment',
                highlightScanRegion: true,
                highlightCodeOutline: true,
                // overlay: qrBoxEl?.current || undefined,
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
        </div>
    );
});
QrReader.displayName = 'QrReader';
export default QrReader;
