

import { sentryCreateBrowserRouter } from './services/sentry-service';

import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';

import App from './routes/App';
import Game from './routes/Game';
import PlaylistComponent from './routes/GenerateCodes';
import NotFound from './routes/NotFound';
import ErrorComponent from './routes/ErrorComponent';
import ProtectedRoute from './routes/ProtectedRoute';
// import { RootHome } from './routes/RootHome';
import { TranslationProvider } from './i18n';
import { SpotifyAuthProvider } from './auth';
import { ToastProvider } from './context/Toast';
import { SpotifyPlayerContextProvider } from './context/SpotifyWebPlayerContext';

import './index.css';

const router = sentryCreateBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [
                // {
                //     index: true,
                //     element: <RootHome />,
                // },
                {
                    path: '/game',
                    element: (
                        <ProtectedRoute>
                            <Game />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '/generate',
                    element: (
                        <ProtectedRoute>
                            <PlaylistComponent />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: '*',
                    element: <NotFound />,
                },
            ],
            errorElement: <ErrorComponent />,
        },
    ],
    { basename: import.meta.env.BASE_URL }
);

//using react 17 because of --> https://community.spotify.com/t5/Spotify-for-Developers/Spotify-Web-Playback-SDK-example-playback-buttons-don-t-work/td-p/5516960?hwSuccess=1682633176302
createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SpotifyAuthProvider>
            <SpotifyPlayerContextProvider>
                <TranslationProvider>
                    <ToastProvider>
                        <RouterProvider router={router} />
                    </ToastProvider>
                </TranslationProvider>
            </SpotifyPlayerContextProvider>
        </SpotifyAuthProvider>
    </React.StrictMode>
);
