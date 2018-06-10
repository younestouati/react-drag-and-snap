import React from 'react';
import { makeDraggable } from '../lib-proxy';

import Deck from '@younestouati/playing-cards-standard-deck';
import { makeStandardDeck } from 'react-board-game-components';

const StandardCard = makeStandardDeck('demo-bundle/' + Deck);

const DraggablePlayingCard = makeDraggable()(StandardCard);

export { DraggablePlayingCard };
