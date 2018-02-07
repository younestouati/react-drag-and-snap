import {RULES} from '../rules/rules';

const isMoveLegal = ({dragData}, {props}) => {
    if (!props.position) {
        console.log('The props are: ', props);
    }

    return RULES[dragData.piece].isLegalMove(dragData.position, props.position);
}

export {isMoveLegal};