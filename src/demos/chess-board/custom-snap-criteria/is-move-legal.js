import {RULES} from '../rules/rules';

const isMoveLegal = ({dragData}, {position: dst}) => RULES[dragData.piece].isLegalMove(dragData.position, dst);

export {isMoveLegal};