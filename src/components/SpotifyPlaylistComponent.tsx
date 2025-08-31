import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import type { Page, SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';

import { useTranslation } from '../i18n';
import { SimplifiedPlaylistTracksRequired } from '../types/Spotify';

import './SpotifyPlaylistComponent.css';

import PlaylistComponent, { PlaylistItem } from './PlaylistComponent';

type SpotifyPlaylistComponentProps = {
  isGenerating: boolean;
  onGenerate: (playlists: Array<SimplifiedPlaylistTracksRequired>) => void;
  isAuthenticated: boolean;
  spotifySdk: SpotifyApi | null;
  user: UserProfile;
};

const SpotifyPlaylistComponent: React.FC<SpotifyPlaylistComponentProps> = ({
  isGenerating,
  onGenerate,
  isAuthenticated,
  spotifySdk,
  user,
}) => {
  const { t } = useTranslation();
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<
    Record<string, SimplifiedPlaylistTracksRequired>
  >({});
  const hasLoadedInitial = useRef(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [errorFetching, setErrorFetching] = useState<Error | null>(null);

  const loader = useRef<HTMLDivElement | null>(null);
  const limit = 10; // Set a reasonable limit for each batch

  // Function to fetch user playlists, memoized to prevent re-creating on every render
  const loadPlaylists = useCallback(async () => {
    if (loading || !hasMore || !spotifySdk || !isAuthenticated || errorFetching) return; // Prevent fetching if already loading or no more items

    setLoading(true);
    // Test loading
    // await new Promise((res) => setTimeout(res, 3000));
    try {
      const token = await spotifySdk.getAccessToken(); // Ensure token is available

      // https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists
      const response = await fetch(
        `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token?.access_token}`,
          },
        },
      );

      const data: Page<SimplifiedPlaylistTracksRequired> = await response.json();

      //Spotify broke the API (https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api)
      // 8. Algorithmic and Spotify-owned editorial playlists
      // fetching playlists can now result in items being null inside the returned array...
      const filteredItems = data.items.filter((playlist) => playlist !== null && 'id' in playlist);

      // Update playlists state and pagination
      const newItems = Object.fromEntries(filteredItems.map((item) => [item.id, item]));
      setSpotifyPlaylists((prev) => ({ ...prev, ...newItems }));
      setHasMore(data.next !== null); // If next is null, there's no more data
      setOffset((prev) => prev + data.items.length); // Update offset for pagination
    } catch (e) {
      const error = e as Error;
      console.error('Error fetching playlists:', error);
      setErrorFetching(error);
    } finally {
      setLoading(false); // Ensure loading is reset even on failure
    }
  }, [loading, hasMore, spotifySdk, offset, isAuthenticated, errorFetching]); // Depend on relevant states including offset

  // TODO: Bug with StrictMode in React18!
  // Initial loading of playlists when sdk is ready
  useEffect(() => {
    if (!hasLoadedInitial.current && isAuthenticated && spotifySdk) {
      loadPlaylists();
      hasLoadedInitial.current = true;
    }
  }, [spotifySdk, loadPlaylists, isAuthenticated]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading && isAuthenticated) {
        loadPlaylists();
      }
    },
    [hasMore, loading, loadPlaylists, isAuthenticated],
  );

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.5, // Trigger when 50% of the loader is visible
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, handleObserver]);

  const handleGenerate = (ids: string[]) => {
    const selectedPlaylist = ids.map((id) => spotifyPlaylists[id]);
    if (selectedPlaylist) {
      onGenerate(selectedPlaylist);
    }
  };

  const playlists = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(spotifyPlaylists).map(([id, p]) => {
          const playlistItem: PlaylistItem = {
            id,
            name: p.name,
            tracks: p.tracks.total,
            public: p.public,
            playlistImage: p.images && p.images.length > 0 ? p.images[0] : undefined,
          };
          return [id, playlistItem];
        }),
      ),
    [spotifyPlaylists],
  );

  return (
    <PlaylistComponent
      playlists={playlists}
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      title={`${user.display_name}${t('yourPlaylists')}`}
    >
      <div ref={loader} style={{ height: '20px' }} />
    </PlaylistComponent>
  );
};

export default SpotifyPlaylistComponent;
