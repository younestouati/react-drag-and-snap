import invariant from 'invariant';
import { isNumber, isBoolean } from '../utils/type-utils';

const defaultConfig = {
    stiffness: 390,
    damping: 35,
    sticky: true,
    mode: 'default',
};
const normalizeDraggableConfig = (customConfig = {}) => {
    const config = { ...defaultConfig, ...customConfig };

    invariant(
        isNumber(config.stiffness),
        `Invalid property 'stiffness' in draggable config. Must be a number. Was: ${config.stiffness}`
    );

    invariant(
        isNumber(config.damping),
        `Invalid property 'damping' in draggable config. Must be a number. Was: ${config.damping}`
    );

    invariant(
        isBoolean(config.sticky),
        `Invalid property 'sticky' in draggable config. Must be a boolean. Was: ${config.sticky}`
    );

    invariant(
        ['default', 'clone', 'move'].indexOf(config.mode) > -1,
        `Invalid property 'mode' in draggable config. Must be either 'default', 'clone', or 'move'. Was: ${config.move}`
    );

    return config;
};

export default normalizeDraggableConfig;
