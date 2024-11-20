import React from 'react';

interface CirclePauseIconProps {
    color?: string;
    style?: React.CSSProperties;
    className?: string;
}

/* 
*   Font Awesome Free 6.6.0 by @fontawesome https://fontawesome.com 
*   License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--> 
*/ 
const CirclePauseIcon: React.FC<CirclePauseIconProps> = ({ color = 'currentColor', style, className }) => (
    <svg
        style={{ fill: color, ...style }}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        aria-hidden="true"
        focusable="false"
    >
       <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm224-72l0 144c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-144c0-13.3 10.7-24 24-24s24 10.7 24 24zm112 0l0 144c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-144c0-13.3 10.7-24 24-24s24 10.7 24 24z"/>
    </svg>
);

export default CirclePauseIcon;






