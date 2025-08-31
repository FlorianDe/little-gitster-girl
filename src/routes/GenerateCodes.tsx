import React, { useState } from 'react';
import type { Page, PlaylistedTrack } from '@spotify/web-api-ts-sdk';

import SpotifyPlaylistComponent from '../components/SpotifyPlaylistComponent';
import LoadingOverlay from '../components/LoadingOverlayView';
// import { generatePdf } from '../services/playlist-pdf-generator';
import { MainContentWrapper } from '../components/MainContentWrapper';
import { useSpotifyAuth } from '../auth';
import { useTranslation } from '../i18n';
import {
    PlaylistWithTracks,
    ReducedPlaylistedTrack,
    ReducedSimplifiedAlbum,
    ReducedTrack,
    SimplifiedPlaylistTracksRequired,
} from '../types/Spotify';
import { usePdfGenerationWorker } from '../worker/pdf-generation-worker/hooks';
import { Tabs } from '../components/Tabs';
import PrebuiltPlaylistComponent from '../components/PrebuiltPlaylistComponent';
import { DEFAULT_PLAYLISTS_META_DATA, PlaylistMetaData } from '../data/config';
import { loadHitsterPlaylist, PlaylistTracksMap } from '../services/qrcode-song-extractor';

const GenerateCodes: React.FC = () => {
    const { t } = useTranslation();

    const { sdk: spotifySdk, user, isAuthenticated } = useSpotifyAuth();

    const [isGenerating, setIsGenerating] = useState(false);
    const [, setGenerationError] = useState<string | null>(null); //TODO: Use the generation error
    const [progress, setProgress] = useState<number>(0);
    const [progressSection, setProgressSection] = useState<string | null>(null);
    const { generatePdf } = usePdfGenerationWorker();

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    //TODO FlorianDe: Generify maybe
    // const handleGenerateQrCodesPdf = async (playlistsWithTracks: Array<PlaylistMetaData>) => {

    // }

    const handleGenerateForPrebuiltPlaylist = async (
        playlists: Record<string, PlaylistMetaData>,
    ) => {
        setIsGenerating(true);
        setGenerationError(null);
        setProgress(0);
        setProgressSection('Fetching Song Information...');

        //TODO FlorianDe: Workaround to work with the spotify types for now instead of adjusting the QR Code Generator part.
        type HisterPlaylistWithTracks = PlaylistMetaData & { trackInfos: PlaylistTracksMap };
        function mapPlaylistTracksToSpotify(
            playlist: HisterPlaylistWithTracks,
        ): PlaylistWithTracks {
            const trackInfos: ReducedPlaylistedTrack[] = Object.values(playlist.trackInfos).map(
                (track) => {
                    const reducedTrack: ReducedTrack = {
                        id: track.spotifyId,
                        uri: `spotify:track:${track.spotifyId}`,
                        name: track.title,
                        duration_ms: 0,
                        explicit: false,
                        popularity: 0,
                        type: 'track',
                        artists: [
                            {
                                id: track.artist,
                                name: track.artist,
                                type: 'artist',
                                uri: '',
                                external_urls: { spotify: '' },
                                href: '',
                            },
                        ],
                        album: {
                            id: '',
                            name: '',
                            album_type: 'album',
                            total_tracks: 0,
                            release_date: track.year,
                            release_date_precision: 'year',
                        } as ReducedSimplifiedAlbum,
                    };
                    return { track: reducedTrack } as ReducedPlaylistedTrack;
                },
            );

            return {
                id: playlist.spotifyPlaylistId,
                name: playlist.name,
                owner: {
                    display_name: 'HITSTER',
                    external_urls: {
                        spotify: `https://open.spotify.com/playlist/${playlist.spotifyPlaylistId}`,
                    },
                    href: '',
                    id: playlist.spotifyPlaylistId,
                    type: 'user',
                    uri: '',
                },
                description: '',
                uri: '',
                type: '',
                public: true,
                tracks: { total: playlist.songs, href: '' },
                images: [],
                collaborative: false,
                external_urls: { spotify: '' },
                followers: { href: '', total: 0 },
                href: '',

                primary_color: '',
                snapshot_id: '',
                trackInfos,
            };
        }

        const totalTracks = (Object.values(playlists) ?? []).reduce(
            (acc, cur) => acc + cur.songs,
            0,
        );
        const playlistsWithTracks: Array<HisterPlaylistWithTracks> = [];
        let totalFetched = 0;

        try {
            for (const [sku, playlistMetaData] of Object.entries(playlists)) {
                const playlistTracksMap = await loadHitsterPlaylist(
                    playlistMetaData.countryCode,
                    playlistMetaData.isCountriesDefaultPlaylist === true ? null : sku,
                );
                if (!playlistTracksMap) {
                    throw new Error(`Failed to fetch items for playlist: ${playlistMetaData}`);
                }

                totalFetched += Object.keys(playlistTracksMap).length;
                setProgress((totalFetched / totalTracks) * 100);

                const res: HisterPlaylistWithTracks = {
                    ...playlistMetaData,
                    trackInfos: playlistTracksMap,
                };
                playlistsWithTracks.push(res);
                await delay(50);
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setGenerationError(error.message);
            } else {
                setGenerationError('An unknown error occurred.');
            }
            setProgress(0);
        }

        await createAndOpenPdf(playlistsWithTracks.map((p) => mapPlaylistTracksToSpotify(p)));
        setIsGenerating(false);
    };

    const handleGenerateQrCodesForSpotifyPlaylist = async (
        playlists: Array<SimplifiedPlaylistTracksRequired>,
    ) => {
        setIsGenerating(true);
        setGenerationError(null);
        setProgress(0);
        setProgressSection('Fetching Song Information...');

        const totalTracks = (playlists ?? []).reduce((acc, cur) => acc + cur.tracks.total, 0);
        const playlistsWithTracks: Array<PlaylistWithTracks> = [];
        let totalFetched = 0;

        try {
            for (const list of playlists) {
                const playlist_id: string = list.id;
                const market = undefined;
                // https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
                const fields =
                    'limit,next,offset,total,items(track(id,uri,name,duration_ms,explicit,artists,type,popularity,album(id,name,album_type,total_tracks,release_date,release_date_precision),show(id)))';
                const limit = 50;
                let offset = 0;

                let allItems: PlaylistedTrack[] = [];

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const res: Page<PlaylistedTrack> | undefined =
                        await spotifySdk?.playlists.getPlaylistItems(
                            playlist_id,
                            market,
                            fields,
                            limit,
                            offset,
                        );

                    if (!res) {
                        throw new Error(`Failed to fetch items for playlist: ${playlist_id}`);
                    }

                    if (res.items) {
                        allItems = allItems.concat(res.items);
                        totalFetched += res.items.length;
                        setProgress((totalFetched / totalTracks) * 100);
                    }

                    if (!res.next) {
                        break;
                    }

                    offset += limit;
                    await delay(50);
                }
                const res: PlaylistWithTracks = { ...list, trackInfos: allItems };
                playlistsWithTracks.push(res);
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setGenerationError(error.message);
            } else {
                setGenerationError('An unknown error occurred.');
            }
            setProgress(0);
        }

        await createAndOpenPdf(playlistsWithTracks);
        setIsGenerating(false);
    };

    const createAndOpenPdf = async (playlists: PlaylistWithTracks[]) => {
        const pdfBlob = await generatePdf({
            payload: { playlists },
            onProgress: async ({ section, progress }) => {
                setProgressSection((prevSection) =>
                    prevSection !== section ? section : prevSection,
                );
                setProgress(progress);
            },
        });

        const pdfUrl = URL.createObjectURL(pdfBlob);
        const popup = window.open(pdfUrl);
        if (!popup) {
            // If the popup is blocked, fallback to download
            console.warn('Popup blocked, initiating download fallback.');
            const documentName = `${new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', '_')
                .replace(/:/g, '_')
                .replace(/-/g, '_')}}_${import.meta.env.VITE_APP_NAME.replace(' ', '_')}.pdf`;
            const anchor = document.createElement('a');
            anchor.href = pdfUrl;
            anchor.download = documentName;
            anchor.click();
        }
    };

    return (
        <div>
            {isGenerating && (
                <LoadingOverlay
                    header={<p>{progressSection}</p>}
                    footer={<p>{Math.ceil(progress)}%</p>}
                    progress={progress}
                />
            )}
            <Tabs
                defaultTab="prebuilt"
                tabs={[
                    {
                        id: 'prebuilt',
                        label: t('prebuilt'),
                        content: (
                            <PrebuiltPlaylistComponent
                                playlists={DEFAULT_PLAYLISTS_META_DATA.hitster.de}
                                isGenerating={isGenerating}
                                onGenerate={handleGenerateForPrebuiltPlaylist}
                                spotifySdk={spotifySdk}
                                title={t('prebuiltPlaylistsTitle')}
                            />
                        ),
                    },
                    {
                        id: 'spotify',
                        label: 'Spotify',
                        content: user ? (
                            <SpotifyPlaylistComponent
                                onGenerate={handleGenerateQrCodesForSpotifyPlaylist}
                                isGenerating={isGenerating}
                                isAuthenticated={isAuthenticated}
                                spotifySdk={spotifySdk}
                                user={user}
                            />
                        ) : (
                            <MainContentWrapper>
                                <h1>{t('generateCodesViewAuthMissingErrorMsg')}</h1>
                            </MainContentWrapper>
                        ),
                    },
                ]}
            />
        </div>
    );
};

export default GenerateCodes;
