import { MODES, modeStyles, getModeAttribute } from '../drag-modes';

test('MODES are default, move and clone', () => {
    expect(MODES).toHaveLength(3);
    expect(MODES.indexOf('default')).toBeGreaterThan(-1);
    expect(MODES.indexOf('move')).toBeGreaterThan(-1);
    expect(MODES.indexOf('clone')).toBeGreaterThan(-1);
});

test('modeStyles', () => {
    expect(modeStyles).toEqual(`
    [data-drag-mode-move],
    [data-drag-mode-move][style] {
        display: none!important;
    }
    [data-drag-mode-default],
    [data-drag-mode-default][style] {
        visibility: hidden!important;
    }
`);
});

test('getModeAttribute returns correct atttribute', () => {
    expect(getModeAttribute('move')).toEqual('data-drag-mode-move');
    expect(getModeAttribute('CLONE')).toEqual('data-drag-mode-clone');
    expect(getModeAttribute('dEfaULT')).toEqual('data-drag-mode-default');
});
