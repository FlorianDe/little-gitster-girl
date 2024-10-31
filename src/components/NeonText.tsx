import React from 'react';
import './NeonText.css';

interface NeonTitleProps {
    style?: React.CSSProperties;
    text: string;
}
const NeonTitle: React.FC<NeonTitleProps> = (props) => {
    return (
        <div className="neon-container" style={props.style}>
            <h1 className="neon-text">{props.text}</h1>
        </div>
    );
};

export default NeonTitle;
