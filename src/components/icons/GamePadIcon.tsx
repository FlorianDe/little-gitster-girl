import React from 'react';

interface GamePadIconProps {
    color?: string;
    style?: React.CSSProperties;
}

const GamePadIcon: React.FC<GamePadIconProps> = ({ color = 'currentColor', style }) => (
    <svg
        style={{ width: '1em', height: '1em', fill: color, ...style }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        aria-hidden="true"
        focusable="false"
       
    >
        <path d="M192 64C86 64 0 150 0 256S86 448 192 448l256 0c106 0 192-86 192-192s-86-192-192-192L192 64zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0 0-32z" />
    </svg>
);

export default GamePadIcon;