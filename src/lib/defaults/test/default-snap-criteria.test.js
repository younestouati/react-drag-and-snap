import Criteria from '../default-snap-criteria';

test('Criteria.always returns true', () => {
    expect(Criteria.always()).toEqual(true);
});

test('Criteria.never returns false', () => {
    expect(Criteria.never()).toEqual(false);
});

test('Criteria.isCenterOverTarget returns true when center is over target, false otherwise', () => {
    const targetWidth = 20;
    const targetHeight = 20;

    expect(Criteria.isCenterOverTarget({transform: {x: 5, y: 5}, targetWidth, targetHeight})).toBe(true);
    expect(Criteria.isCenterOverTarget({transform: {x: 15, y: 15}, targetWidth, targetHeight})).toBe(false);
});

test('Criteria.isCenterWithinRadius returns true when center is within given radius (no hysteresis)', () => {
    const criterium = Criteria.isCenterWithinRadius(10);
    const ownProps = {draggedItems: [{id: 1, isSnappingToThisTarget: false}]};

    const targetWidth = 20;
    const targetHeight = 20;

    expect(criterium({id: 1, transform: {x: 5, y: 5}, targetWidth, targetHeight}, ownProps)).toBe(true);
    expect(criterium({id: 1, transform: {x: 15, y: 15}, targetWidth, targetHeight}, ownProps)).toBe(false);
});

test('Criteria.isCenterWithinRadius returns true when center is within given radius (with hysteresis)', () => {
    const id = 1;
    const criterium = Criteria.isCenterWithinRadius(10, 30);
    const ownProps = {draggedItems: [{id, isSnappingToThisTarget: true}]};

    const targetWidth = 20;
    const targetHeight = 20;

    expect(criterium({transform: {x: 5, y: 5}, id, targetWidth, targetHeight}, ownProps)).toBe(true);
    expect(criterium({transform: {x: 15, y: 15}, id, targetWidth, targetHeight}, ownProps)).toBe(true);
});

test('Criteria.isNoOtherDraggableSnapping returns true when no other draggable is snapping, false if it is', () => {
    expect(Criteria.isNoOtherDraggableSnapping({id: 1},  {draggedItems: [{id: 1, isSnappingToThisTarget: true}]})).toBe(true);
    expect(Criteria.isNoOtherDraggableSnapping({id: 1}, {draggedItems: [{id: 1, isSnappingToOtherTarget: true}]})).toBe(false);
});

test('Criteria.isDragDataProp returns true when prop matches, false otherwise', () => {
    const criterium = Criteria.isDragDataProp('type', 'knight');
    expect(criterium({dragData: {type: 'knight'}})).toBe(true);
    expect(criterium({dragData: {type: 'pawn'}})).toBe(false);
});