import React from 'react';
import PropTypes from 'prop-types';
import Deck from '@younestouati/playing-cards-standard-deck';
import { makeDraggable } from '../lib-proxy';
import { makeStandardDeck } from './tmp';

const StandardCard = makeStandardDeck(Deck);

const DRAG_SHADOW = 0;//16; // Shadow offset to use while being dragged

const CustomCard = ({
    customSnapProps,
    dragState,
    isSnappingBack,
    ...rest
}) => {
    const shadow = (dragState !== 'inactive' && !isSnappingBack)
        ? customSnapProps.shadow || DRAG_SHADOW
        : rest.shadow; //TODO: AGAIN THIS: undefined; // If undefined the card uses shadow prop from the stack

    return (
        <StandardCard
            {...rest}
            rotateY={customSnapProps.rotateY} // If undefined the card uses rotateY prop from the stack
            shadow={shadow}
            animateRotation={0.4}
        />
    );
};

CustomCard.propTypes = {
    customSnapProps: PropTypes.shape({
        shadow: PropTypes.number,
    }).isRequired,
    dragState: PropTypes.oneOf(['grabbed', 'dragged', 'released', 'inactive']).isRequired,
    isSnappingBack: PropTypes.bool.isRequired,
};

export default makeDraggable({mode: 'clone'})(CustomCard);
