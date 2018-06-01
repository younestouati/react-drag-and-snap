import React from 'react';
import PropTypes from 'prop-types';

const AvatarContainer = ({
    x, y, z, scale, children, rotation, diameter,
}) => (
    <div
        className="avatar-container"
        style={{
            lineHeight: 0,
            left: `${x - diameter / 2}px`,
            top: `${y - diameter / 2}px`,
            zIndex: z,
            transform: `rotate(${rotation}deg) scale(${scale})`,
        }}
    >
        {children}
    </div>
);

AvatarContainer.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    children: PropTypes.element.isRequired,
    diameter: PropTypes.number.isRequired,
};

export { AvatarContainer };
