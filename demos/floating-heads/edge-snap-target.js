import React from 'react';
import makeSnapTarget from '../../src/make-snap-target';
import SnapCriteria from '../../src/defaults/default-snap-criteria';
import {snapToEdge} from './custom-snap-transformers/snap-to-edge';
import {snapRotation} from './custom-snap-transformers/snap-rotation';
import {whenCloseToEdge} from './custom-snap-criteria/when-close-to-edge';

const Edge = () => (
	<div
		style={{
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			position: 'absolute',
			pointerEvents: 'none'
		}}
	/>
);

const snapConfig = {
	releaseSnapCriteria: SnapCriteria.always,
	releaseSnapTransform: snapToEdge,
	dragSnapCriteria: whenCloseToEdge(40),
	dragSnapTransform: snapRotation
 };

const EdgeSnapTarget = makeSnapTarget(snapConfig)(Edge);

export {EdgeSnapTarget};
