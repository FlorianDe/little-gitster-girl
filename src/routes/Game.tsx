import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

// import { useCameraPermission } from '../hooks/useCameraPermission';
import QrReader, { QrReaderRef, ScanResult } from '../components/QrReader';
import { useSpotifyWebPlayerContext } from '../context/SpotifyWebPlayerContext';
import WebPlayback from '../components/WebPlayback';
import { useSpotifyAuth } from '../auth';
import { useToast } from '../context/Toast';
import { isSpotifyError } from '../services/spotify-helper';

import './Game.css';
import { useTranslation } from '../i18n';
import {
    ArtworkImage,
    createArtworkTitleImage
} from '../paintings/title-image';
import Equalizer from '../components/Equalizer';
import PlayPauseButton from '../components/PlayPauseButton';
import AbsoluteCenterWrapper from '../components/AbsoluteCenterWrapper';
import { extractSpotifyUri } from '../services/qrcode-song-extractor';

function Game() {
    const { t } = useTranslation();

    // const { hasPermission, requestPermission, canRequest } = useCameraPermission();

    const { showToast } = useToast();
    const { sdk: spotifySdk, user } = useSpotifyAuth();
    const { deviceId, player, isPaused } = useSpotifyWebPlayerContext();
    const [qrScanningStarted, setQrScanningStarted] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | undefined>(
        undefined
    );
    const qrCodeReader = useRef<QrReaderRef>(null);

    const artworks = useMemo(() => {
        return [
            createArtworkTitleImage({ size: 512 }),
            createArtworkTitleImage({ size: 128 })
        ];
    }, []);

    const setStaticMediaSessionInformation = useCallback(
        (description: string, artworks: ArtworkImage[]) => {
            if ('mediaSession' in navigator) {
                if (
                    !navigator.mediaSession.metadata ||
                    navigator.mediaSession.metadata?.title !==
                        import.meta.env.VITE_APP_NAME
                ) {
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: import.meta.env.VITE_APP_NAME,
                        artist: description,
                        artwork:
                            artworks?.map((a) => ({
                                src: a.imageDataUrl,
                                sizes: a.dimensionsString,
                                type: a.imageMimeType
                            })) ?? []
                    });
                }
            }
        },
        []
    );

    const handlePlayerReady = async (id: string) => {
        if (spotifySdk) {
            try {
                const playbackState =
                    await spotifySdk.player.getPlaybackState();

                if (
                    playbackState === null ||
                    (playbackState !== null && playbackState?.device?.id !== id)
                ) {
                    await spotifySdk.player
                        .transferPlayback([id], false)
                        .then(() =>
                            showToast(
                                `${t('toastTransferedPlayback')} ${
                                    playbackState?.device
                                        ? `${t('toastFromDevice')} ${
                                              playbackState?.device?.name
                                          }`
                                        : ''
                                }`,
                                'info'
                            )
                        )
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .catch((_e) =>
                            showToast(t('toastTransferPlaybackError'), 'error')
                        );
                } else {
                    console.log('The player is already active!');
                }
            } catch (e) {
                console.error(e);
                showToast(t('toastTransferPlaybackError'), 'error');
            }
        }
    };

    const scanNextSong = () => {
        if (!qrScanningStarted) {
            player?.activateElement();
            qrCodeReader.current?.start(() => setQrScanningStarted(true));
        } else {
            qrCodeReader.current?.pause();
            setQrScanningStarted(false);
        }
    };

    const handleStopScanning = () => {
        setQrScanningStarted(false);
    };

    const togglePlayPause = () => {
        //TODO CHECK STATE BEFORE MAYBE?!
        if (isPaused) {
            player?.resume();
        } else {
            player?.pause();
        }
    };

    const handleSuccessScan = async (result: ScanResult) => {
        const qrData = result?.data;
        console.log({ qrData: result?.data });
        if (!qrData) {
            return;
        }

        qrCodeReader.current?.pause();

        const extractionResult = await extractSpotifyUri(qrData);
        if (extractionResult.status !== 'success') {
            //TODO FlorianDe: Translate
            switch (extractionResult.reason) {
                case 'unsupported_hitster_card_format':
                    showToast(
                        'This hitster card format is not yet supported.',
                        'error',
                        5000
                    );
                    break;
                case 'unsupported_country':
                    showToast(
                        `These Hitster cards from ${extractionResult.details.country_code} are currently not supported.`,
                        'error',
                        8000
                    );
                    break;
                case 'playlist_not_found':
                    showToast(
                        `Hitster playlist for country ${extractionResult.details.country_code} with sku ${extractionResult.details.sku} not found.`,
                        'error',
                        10000
                    );
                    break;
                case 'song_not_found':
                    showToast(
                        `Song ${extractionResult.details.card_number} not found in playlist ${extractionResult.details.sku}.`,
                        'error',
                        8000
                    );
                    break;
                case 'unknown_format':
                    showToast('Scanned QR Code not supported.', 'error', 5000);
                    break;
            }
            return;
        }

        if (spotifySdk) {
            //device_id: string, context_uri?: string, uris?: string[], offset?: object, positionMs?: number
            const device_id = deviceId as string; //hack try to not set device id...
            const uris = [extractionResult.spotifyUri];

            setQrScanningStarted(false); //TODO: refactor!!

            try {
                //https://developer.spotify.com/documentation/web-playback-sdk/reference#spotifyplayeractivateelement
                await spotifySdk.player.startResumePlayback(
                    device_id,
                    undefined,
                    uris
                );

                //TODO: If needed, set repeatMode to track!
                // const repeatMode = 'track';
                // if (playbackState?.repeat_state !== repeatMode) {
                //     console.log("Setting repeat mode to:", repeatMode)
                //     await spotifySdk.player.setRepeatMode(repeatMode, id);
                // }
            } catch (error) {
                if (isSpotifyError(error)) {
                    console.error('Error starting playback:', error.message);

                    if (error.status === 404) {
                        console.log('Handling 404 error:', error.message);
                        //TODO Created types for Spotify Errors etc
                        if (error.reason === 'NO_ACTIVE_DEVICE') {
                            console.log(
                                'No active device found. Please connect a device.'
                            );
                            showToast(
                                t('toastStartResumeError'),
                                'error',
                                10000
                            );
                        }
                    } else {
                        console.log('An unexpected error occurred:', error);
                    }
                } else {
                    console.log('An unexpected error type occurred:', error);
                }
            }
        }
    };

    useEffect(() => {
        if (player && !isPaused) {
            setStaticMediaSessionInformation(
                t('mediaSessionDescription'),
                artworks
            );
        }
    }, [isPaused, player, setStaticMediaSessionInformation, artworks, t]);

    useEffect(() => {
        const getAccessToken = async () => {
            if (user && spotifySdk) {
                const accessToken = await spotifySdk.getAccessToken();
                setAccessToken(() => accessToken?.access_token);
            }
        };

        getAccessToken();
    }, [user, spotifySdk]);

    return (
        <div className="game">
            {accessToken && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center'
                    }}
                >
                    <WebPlayback
                        token={accessToken}
                        onPlayerReady={handlePlayerReady}
                        hidePlayer={true}
                    />
                </div>
            )}
            {/* {hasPermission === false && (
                <div>
                    <h2>{t("cameraPermissionDenied")}</h2>
                    {!canRequest && <p>{t("cameraPermissionUserManualChangeAdvice")}</p>}
                </div>
            )}
            {canRequest && hasPermission === false && (
                <button className="request-permissions-btn" onClick={requestPermission}>
                    {t("requestCameraPermission")}
                </button>
            )}
            {hasPermission && ( */}
            <div className="game-main-section">
                <div className="qr-reader-container">
                    <QrReader
                        onScanSuccess={handleSuccessScan}
                        ref={qrCodeReader}
                        isStarted={qrScanningStarted}
                        onStopScanning={handleStopScanning}
                    />
                    {!qrScanningStarted && (
                        <>
                            <Equalizer
                                state={isPaused ? 'paused' : 'playing'}
                            />
                            <AbsoluteCenterWrapper
                                className={`play-pause-btn-wrapper ${
                                    isPaused ? 'paused' : 'playing'
                                }`}
                            >
                                <PlayPauseButton
                                    wrapperStyle={{
                                        backgroundColor:
                                            'var(--background-color)',
                                        borderRadius: '50%',
                                        zIndex: 2
                                    }}
                                    style={{
                                        height: '100px',
                                        width: '100px',
                                        color: 'var(--accent-color)'
                                    }}
                                    isPaused={isPaused}
                                    onClick={togglePlayPause}
                                />
                            </AbsoluteCenterWrapper>
                        </>
                    )}
                </div>
                <div className="game-main-section__next-song-btn">
                    <button onClick={scanNextSong}>
                        {qrScanningStarted
                            ? t('stopScanning')
                            : t('scanNextSong')}
                    </button>
                </div>
            </div>
            {/* )} */}
        </div>
    );
}

export default Game;
