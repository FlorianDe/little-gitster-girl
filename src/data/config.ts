type CountryCode = string;
type SKU = string;
type Category = 'hitster';

export type PlaylistMetaData = {
  isCountriesDefaultPlaylist?: boolean;
  countryCode: string;
  spotifyPlaylistId: string;
  name: string;
  songs: number;
  playlistCover?: {
    url?: string;
  };
};
export type PlaylistMetaDataMap = Record<SKU, PlaylistMetaData>;
export type DEFAULT_PLAYLISTS_META_DATA_TYPE = Record<
  Category,
  Record<CountryCode, PlaylistMetaDataMap>
>;

export const DEFAULT_PLAYLISTS_META_DATA: DEFAULT_PLAYLISTS_META_DATA_TYPE = {
  hitster: {
    de: {
      aaaa0002: {
        countryCode: 'de',
        spotifyPlaylistId: '26zIHVncgI9HmHlgYWwnDi',
        name: 'Hitster - Deutsch',
        songs: 308,
        isCountriesDefaultPlaylist: true,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0007: {
        countryCode: 'de',
        spotifyPlaylistId: '0USUpphpG4nAuz9IUudfl9',
        name: 'Hitster - Schlager Party',
        songs: 308,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0012: {
        countryCode: 'de',
        spotifyPlaylistId: '15hZ0ez6sHYhTeCCshxJTN',
        name: 'Hitster - Deutschland Summer Party',
        songs: 308,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0015: {
        countryCode: 'de',
        spotifyPlaylistId: '2u0vgWYqU1TWVcDehJnZuN',
        name: 'Hitster - Deutschland Guilty Pleasures',
        songs: 308,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0019: {
        countryCode: 'de',
        spotifyPlaylistId: '58y9xPPIRWd8tqlOaKoDOI',
        name: 'Hitster - Bingo Deutschland',
        songs: 226,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0025: {
        countryCode: 'de',
        spotifyPlaylistId: '2zWVMuxHcoLgThgaBhDzmK',
        name: 'Hitster - Bayern1Expansion',
        songs: 154,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0026: {
        countryCode: 'de',
        spotifyPlaylistId: '2jlbmBYM1RLZrsyY67wuDQ',
        name: 'Hitster - Deutschland Soundtrack Expansion',
        songs: 154,
        playlistCover: {
          url: undefined,
        },
      },
      aaaa0039: {
        countryCode: 'de',
        spotifyPlaylistId: '4oYTRg0JI48jucsJOLily1',
        name: 'Hitster - Deutschland Rock',
        songs: 308,
        playlistCover: {
          url: undefined,
        },
      },
    },
  },
} as const;
