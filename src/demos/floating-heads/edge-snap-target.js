import React from 'react';
import makeSnapTarget from '../../lib/make-snap-target';
import {Criteria} from '../../lib/defaults/default-snap-criteria';
import {snapToEdge} from './custom-snap-descriptors/snap-to-edge';
import {snapRotation} from './custom-snap-descriptors/snap-rotation';
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
	releaseSnapCriteria: Criteria.always,
	releaseSnapDescriptor: snapToEdge,
	dragSnapCriteria: whenCloseToEdge(40),
	dragSnapDescriptor: snapRotation
 };

const EdgeSnapTarget = makeSnapTarget(snapConfig)(Edge);

export {EdgeSnapTarget};
