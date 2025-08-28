import { DEFAULT_PLAYLISTS_META_DATA } from "../config";

type PlaylistItem = {
  title: string;
  artist: string;
  spotifyId: string;
  year: string;
};
type CardNumber = string;
type Playlist = Record<CardNumber, PlaylistItem>;

type CountryCode = string;
type SKU = string;
type HitsterPlaylistKey = CountryCode | `${CountryCode}-${SKU}`;

const SPOTIFY_PROTOCOL_TRACK_LINK_REGEX = /^spotify:track:.+$/;
const SPOTIFY_OPEN_TRACK_LINK_REGEX =
  /^https:\/\/open\.spotify\.com\/track\/.+$/;
const HISTER_SKU_URL_REGEX =
  /^www\.hitstergame\.com\/(?<country_code>[a-z]{2})\/(?<sku>\w+)\/(?<card_number>\d+)$/;
const HISTER_COUNTRY_URL_REGEX =
  /^www\.hitstergame\.com\/(?<country_code>[a-z]{2})\/(?<card_number>\d+)$/;

const loadPlaylist = (() => {
  const playlistCache: Record<HitsterPlaylistKey, Playlist> = {};

  return async (
    countryCode: string,
    sku: string | null
  ): Promise<Playlist | null> => {
    const key: HitsterPlaylistKey =
      `${countryCode}` + (sku !== null ? `-${sku}` : "");
    if (playlistCache[key]) {
      return playlistCache[key];
    }
    const fileName = `hitster-${key}`;
    const url = `playlists/hitster/${countryCode}/${fileName}.json`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Could not fetch playlist JSON for SKU ${sku}`);
        return null;
      }
      const playlist: Playlist = await res.json();
      playlistCache[key] = playlist;
      return playlist;
    } catch (err) {
      console.error("Failed to fetch playlist JSON:", err);
      return null;
    }
  };
})();

export type SpotifyResult =
  | { status: "success"; spotifyUri: string }
  | { status: "error"; reason: "unsupported_hitster_card_format" }
  | {
      status: "error";
      reason: "unsupported_country";
      details: { country_code: string };
    }
  | {
      status: "error";
      reason: "playlist_not_found";
      details: { country_code: string; sku: string | null };
    }
  | {
      status: "error";
      reason: "song_not_found";
      details: { sku: string | null; card_number: string };
    }
  | { status: "error"; reason: "unknown_format" };

const matchHitsterUrl = (
  qrData: string
): { country_code: string; sku: string | null; card_number: string } | null => {
  const skuUrlMatch = HISTER_SKU_URL_REGEX.exec(qrData);
  const countryUrlMatch = HISTER_COUNTRY_URL_REGEX.exec(qrData);

  if (skuUrlMatch?.groups) {
    const { country_code, sku, card_number } = skuUrlMatch.groups;
    return { country_code, sku, card_number };
  }

  if (countryUrlMatch?.groups) {
    const { country_code, card_number } = countryUrlMatch.groups;
    return { country_code, sku: null, card_number };
  }

  return null;
};

export async function extractSpotifyUri(
  qrData: string
): Promise<SpotifyResult> {
  if (
    SPOTIFY_PROTOCOL_TRACK_LINK_REGEX.test(qrData) ||
    SPOTIFY_OPEN_TRACK_LINK_REGEX.test(qrData)
  ) {
    return { status: "success", spotifyUri: qrData };
  }

  if (qrData.startsWith("www.hitstergame.com")) {
    const hitsterUrlMatch = matchHitsterUrl(qrData);
    if (!hitsterUrlMatch) {
      return {
        status: "error",
        reason: "unsupported_hitster_card_format",
      };
    }

    const { card_number, country_code, sku } = hitsterUrlMatch;

    const hitsterCountryPlaylists =
      DEFAULT_PLAYLISTS_META_DATA.hitster[country_code];

    if (
      !hitsterCountryPlaylists ||
      Object.keys(hitsterCountryPlaylists).length == 0
    ) {
      return {
        status: "error",
        reason: "unsupported_country",
        details: { country_code },
      };
    }

    const playlist = await loadPlaylist(country_code, sku);
    if (!playlist) {
      return {
        status: "error",
        reason: "playlist_not_found",
        details: { country_code, sku },
      };
    }

    const song = playlist[card_number.padStart(5, "0")];
    if (!song) {
      return {
        status: "error",
        reason: "song_not_found",
        details: { sku, card_number },
      };
    }
    return { status: "success", spotifyUri: `spotify:track:${song.spotifyId}` };
  }

  return { status: "error", reason: "unknown_format" };
}
