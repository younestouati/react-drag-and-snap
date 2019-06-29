import React from 'react';
import PropTypes from 'prop-types';
import Deck from '@younestouati/playing-cards-standard-deck';
import { makeDraggable } from '../lib-proxy';
import { makeStandardDeck } from './tmp';

const StandardCard = makeStandardDeck(Deck);

const DRAG_SHADOW = 16; // Shadow offset to use while being dragged

const CustomCard = ({
    customSnapProps,
    dragState,
    shadow,
    ...rest
}) => (
    <StandardCard
        {...rest}
        faceUp={customSnapProps.faceUp} // If undefined, card will automatically inherit faceUp value of its stack
        shadow={(dragState === 'dragged') ? DRAG_SHADOW : shadow}
        animateRotation={0.4}
    />
);

CustomCard.propTypes = {
    customSnapProps: PropTypes.shape({
        faceUp: PropTypes.number,
    }).isRequired,
    shadow: PropTypes.number.isRequired,
    dragState: PropTypes.oneOf(['grabbed', 'dragged', 'released', 'inactive']).isRequired,
};

export default makeDraggable({ mode: 'move' })(CustomCard);
