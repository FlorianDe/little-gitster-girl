type CountryCode = string;
type SKU = string;
type Category = "hitster";
export type PlaylistMetaData = {
  spotifyPlaylistId: string;
  name: string;
};
export type DEFAULT_PLAYLISTS_META_DATA_TYPE = Record<
  Category,
  Record<CountryCode, Record<SKU, PlaylistMetaData>>
>;

export const DEFAULT_PLAYLISTS_META_DATA: DEFAULT_PLAYLISTS_META_DATA_TYPE = {
  hitster: {
    de: {
      aaaa0002: {
        spotifyPlaylistId: "26zIHVncgI9HmHlgYWwnDi",
        name: "Hitster DE",
      },
      aaaa0007: {
        spotifyPlaylistId: "0USUpphpG4nAuz9IUudfl9",
        name: "Hitster - Schlager Party",
      },
      aaaa0012: {
        spotifyPlaylistId: "15hZ0ez6sHYhTeCCshxJTN",
        name: "Hitster - Deutschland Summer Party",
      },
      aaaa0015: {
        spotifyPlaylistId: "2u0vgWYqU1TWVcDehJnZuN",
        name: "Hitster - Deutschland Guilty Pleasures",
      },
      aaaa0019: {
        spotifyPlaylistId: "58y9xPPIRWd8tqlOaKoDOI",
        name: "Hitster - Bingo Deutschland",
      },
      aaaa0025: {
        spotifyPlaylistId: "2zWVMuxHcoLgThgaBhDzmK",
        name: "Hitster - Bayern1Expansion",
      },
      aaaa0026: {
        spotifyPlaylistId: "2jlbmBYM1RLZrsyY67wuDQ",
        name: "Hitster - Deutschland Soundtrack Expansion",
      },
      aaaa0039: {
        spotifyPlaylistId: "4oYTRg0JI48jucsJOLily1",
        name: "Hitster - Deutschland Rock",
      },
    },
  },
} as const;
