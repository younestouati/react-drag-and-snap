import { RULES } from '../rules/rules';

const isMoveLegal = ({ dragData }, { props }) => {
    return RULES[dragData.piece].isLegalMove(dragData.position, props.position);
};

export { isMoveLegal };
