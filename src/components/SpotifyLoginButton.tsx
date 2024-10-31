import React from 'react';

import './SpotifyLoginButton.css';
import SpotifyLogo from './SpotifyLogo';

interface SpotifyLoginButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
}

const SpotifyLoginButton: React.FC<SpotifyLoginButtonProps> = ({ onClick, children }) => {
    return (
        <button className="spotify-login" onClick={onClick}>
            <SpotifyLogo className="spotify-logo" color="black" />
            {children}
        </button>
    );
};

export default SpotifyLoginButton;
