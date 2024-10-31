import { createContext } from 'react';
import { SpotifyApi, UserProfile } from '@spotify/web-api-ts-sdk';

export type SpotifyAuthContextType = {
    sdk: SpotifyApi | null;
    isAuthenticated: boolean;
    user: UserProfile | null;
    authenticate: () => Promise<void>;
    logOut: () => Promise<void>;
    error: Error | null;
    isCheckingAuthentication: boolean;
};

export const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);
