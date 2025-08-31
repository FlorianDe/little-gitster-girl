import React, { useEffect, useMemo, useState } from 'react';
import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { PlaylistMetaDataMap } from '../data/config';
import PlaylistComponent, { PlaylistItem } from './PlaylistComponent';

type PrebuiltPlaylistComponentProps = {
  spotifySdk: SpotifyApi | null;
  onGenerate: (playlists: PlaylistMetaDataMap) => void;
  isGenerating: boolean;
  playlists: PlaylistMetaDataMap;
  title?: string;
};

const PrebuiltPlaylistComponent: React.FC<PrebuiltPlaylistComponentProps> = ({
  spotifySdk,
  onGenerate,
  isGenerating,
  playlists: initialPlaylists,
  title,
}) => {
  const [prebuiltPlaylists, setPrebuiltPlaylists] = useState<PlaylistMetaDataMap>(initialPlaylists);

  useEffect(() => {
    if (!spotifySdk) return;

    const fetchImages = async () => {
      const token = await spotifySdk.getAccessToken();
      if (!token) return;

      const entries = Object.entries(initialPlaylists);
      const concurrency = 6;
      const results: Record<string, { url?: string }> = {};

      let index = 0;

      const runNext = async () => {
        if (index >= entries.length) return;
        const [sku, p] = entries[index++];

        try {
          const res = await fetch(
            `https://api.spotify.com/v1/playlists/${p.spotifyPlaylistId}/images`,
            {
              headers: { Authorization: `Bearer ${token?.access_token}` },
            },
          );
          const data = await res.json();
          const url = Array.isArray(data) && data[0]?.url ? data[0].url : undefined;
          if (url) {
            results[sku] = { url };
          }
        } catch (err) {
          console.warn(`Failed to fetch cover for ${p.name}:`, err);
        }

        await runNext();
      };

      const initialPromises = Array(concurrency)
        .fill(0)
        .map(() => runNext());

      await Promise.all(initialPromises);

      setPrebuiltPlaylists((prev) => {
        const updated: typeof prev = { ...prev };
        for (const [sku, val] of Object.entries(results)) {
          updated[sku] = { ...updated[sku], playlistCover: val };
        }
        return updated;
      });
    };

    fetchImages();
  }, [spotifySdk, initialPlaylists]);

  const handleGeneratePrebuilt = (skus: string[]) => {
    const selectedPlaylist = Object.fromEntries(skus.map((sku) => [sku, prebuiltPlaylists[sku]]));
    if (selectedPlaylist) {
      onGenerate(selectedPlaylist);
    }
  };

  const playlists: Record<string, PlaylistItem> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(prebuiltPlaylists).map(([sku, p]) => {
        const playlistItem: PlaylistItem = {
          id: sku,
          name: p.name,
          tracks: p.songs,
          public: true,
          playlistImage: p?.playlistCover?.url
            ? {
                url: p?.playlistCover?.url,
              }
            : undefined,
        };
        return [sku, playlistItem];
      }),
    );
  }, [prebuiltPlaylists]);

  return (
    <PlaylistComponent
      playlists={playlists}
      onGenerate={handleGeneratePrebuilt}
      isGenerating={isGenerating}
      title={title}
    />
  );
};

export default PrebuiltPlaylistComponent;
