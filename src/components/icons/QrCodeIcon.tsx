import React from 'react';

interface QrCodeIconProps {
    color?: string;
    style?: React.CSSProperties;
}

/* 
*   Font Awesome Free 6.6.0 by @fontawesome https://fontawesome.com 
*   License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> 
*/        
const QrCodeIcon: React.FC<QrCodeIconProps> = ({ color = 'currentColor', style }) => (
    <svg
        style={{ width: '1em', height: '1em', fill: color, ...style }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        aria-hidden="true"
        focusable="false"
    >
    <path d="M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48L0 80zM64 96l0 64 64 0 0-64L64 96zM0 336c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96zm64 16l0 64 64 0 0-64-64 0zM304 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm80 64l-64 0 0 64 64 0 0-64zM256 304c0-8.8 7.2-16 16-16l64 0c8.8 0 16 7.2 16 16s7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16l0 96c0 8.8-7.2 16-16 16l-64 0c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-160zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z" />
    </svg>
);

export default QrCodeIcon;
