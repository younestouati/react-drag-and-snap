import React from 'react';
import PropTypes from 'prop-types';
import {TransitionMotion, spring, presets} from 'react-motion';

const ScaleEntry = ({entries, idProp, children, springConfig, className}) => {
	return (
		<TransitionMotion
			willEnter={() => ({scale: 0})}
			styles={
				entries.map((entry) => ({
					key: entry[idProp] + '',
					data: entry,
					style: {scale: spring(1, springConfig)}
				}))
			}
		>
			{
				(interpolatedStyles) => (
					<div className={className}>
					{
						interpolatedStyles.map((config) => (
							children(config.data, config.style.scale)
						))
					}
					</div>
				)
			}
		</TransitionMotion>
	)
};

ScaleEntry.propTypes = {
	idProp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	className: PropTypes.string,
	springConfig: PropTypes.shape({
		damping: PropTypes.number.isRequired,
		stiffness: PropTypes.number.isRequired
	})
};

ScaleEntry.defaultProps = {
	className: '',
	springConfig: presets.wobbly
};

export {ScaleEntry};