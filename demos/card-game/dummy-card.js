import React from 'react';
import PropTypes from 'prop-types';
import Deck from '@younestouati/playing-cards-standard-deck';
import { makeDraggable } from '../lib-proxy';

const DummyCard = ({ width, height }) => (
    <div
        style={{
            width,
            height,
            position: 'relative',
            display: 'inline-block',
        }}
    >
        <div
            style={{
                float: 'left',
                paddingTop: 0,
            }}
        />
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundSize: 'contain',
                display: 'inline-block',
                backgroundImage: `url(data:image/svg+xml;base64,${Deck['12c']})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: 'white',
                backgroundPosition: '50%',
                borderRadius: '2%',
                border: '1px solid lightgray',
            }}
        />
    </div>
);

DummyCard.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
};

export default makeDraggable({ mode: 'clone' })(DummyCard);
