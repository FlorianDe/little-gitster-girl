import React from 'react';

interface CirclePlayIconProps {
    color?: string;
    style?: React.CSSProperties;
    className?: string;
}

/* 
*   Font Awesome Free 6.6.0 by @fontawesome https://fontawesome.com 
*   License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> 
*/ 
const CirclePlayIcon: React.FC<CirclePlayIconProps> = ({ color = 'currentColor', style, className }) => (
    <svg
        style={{ fill: color, ...style }}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        aria-hidden="true"
        focusable="false"
    >
        <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9l0-176c0-8.7 4.7-16.7 12.3-20.9z"/>    
    </svg>
);

export default CirclePlayIcon;

