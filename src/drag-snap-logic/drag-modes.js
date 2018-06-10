import { getCSSHidingRulesAsString } from '../helpers/misc/css-hider'; 
/**
 * Dragging elements around works by rendering a clone of the draggable, which follows the mouse/finger. That means,
 * while dragging is going on, two versions of the element will be rendered (the original may or may not be visible -
 * but it is there).
 *
 * Draggable elements can be configured to work in one of three modes (through the dragMode prop), while dragging is
 * conducted:
 * 1. default: The original element will be hidden, but still occupy space.
 * 2. move: The original will be hidden and no longer occupy any space (i.e. display:none)
 * 3. clone: The original remains visible while the clone is being dragged around
 */

const DRAG_MODES = ['default', 'move', 'clone'];

// [style] is a way of overwriting even inline styles (https://css-tricks.com/override-inline-styles-with-css/)
const dragModeStyles = `
    [data-drag-mode-move],
    [data-drag-mode-move][style] {
        display: none!important;
    }
    [data-drag-mode-default],
    [data-drag-mode-default][style] {
        ${getCSSHidingRulesAsString()}
    }
`;

const getDragModeAttribute = dragMode => `data-drag-mode-${dragMode.toLowerCase()}`;

export { DRAG_MODES, dragModeStyles, getDragModeAttribute };
