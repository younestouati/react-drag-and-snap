import React from 'react';
import PropTypes from 'prop-types';
import { makeSnapTarget, SnapCriteria } from '../lib-proxy';
import { isMoveLegal } from './custom-snap-criteria/is-move-legal';

class Square extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (
            this.props.isCenterOverTarget !== nextProps.isCenterOverTarget ||
            this.props.isLegalMove !== nextProps.isLegalMove ||
            !!this.props.children !== !!nextProps.children
        );
    }

    render() {
        const {
            position, children, width, height, isCenterOverTarget, isLegalMove,
        } = this.props;

        const classes = [
            'square',
            isCenterOverTarget ? 'is-over' : '',
            isLegalMove ? 'legal-move' : '',
            (position[0] + position[1]) % 2 === 0 ? 'black' : '',
        ];

        return (
            <div className={classes.join(' ')} style={{ width, height }}>
                {children}
            </div>
        );
    }
}

Square.propTypes = {
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    children: PropTypes.element,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    isCenterOverTarget: PropTypes.bool.isRequired,
    isLegalMove: PropTypes.bool.isRequired,
};

const snapConfig = {
    dragSnapCriteria: SnapCriteria.never,
    releaseSnapCriteria: [
        SnapCriteria.isCenterOverTarget,
        isMoveLegal,
    ],
};

const customCollector = (draggableDescriptor, targetDescriptor) => ({
    isCenterOverTarget: draggableDescriptor.some(draggableDescriptor => SnapCriteria.isCenterOverTarget(draggableDescriptor, targetDescriptor)),
    isLegalMove: draggableDescriptor.some(draggableDescriptor => isMoveLegal(draggableDescriptor, targetDescriptor)),
});

const SquareTarget = makeSnapTarget(snapConfig, customCollector)(Square);
export { SquareTarget };
