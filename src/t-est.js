import React, { Component } from 'react';
import TestAnimator from './test-animator';

const nDamping = 1;
const nStiffness = 1;

class Test extends Component {
	constructor(props) {
		super(props);
	}

	//const SPRING_CONFIG = {stiffness: 180, damping: 12};//{stiffness: 1000, damping: 50};
//const SPRING_CONFIG = {stiffness: 5000, damping: 30};//{stiffness: 390, damping: 35};//presets.stiff;

	componentDidMount() {
		[...Array(nDamping).keys()].forEach(nd => {
			[...Array(nStiffness).keys()].forEach(ns => {
				this['n_' + (nd * ns + ns)].animate(30, 2500);
			})
		});
	}

	render() {
		return (
			<div>
				{
					[...Array(nDamping * nStiffness).keys()].map((n) => <TestAnimator ref={e => this['n_' + n] = e} key={n}/>)
				}
			</div>
		);
	}
}

export {Test};

//Almost immediate: damping: 60, stiffness: 2500
//Lower damping a bit if something more visible (but also jumping) is required (for example 30)