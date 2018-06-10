import React from 'react';
import { shallow } from 'enzyme';
import StyleEnforcer from '../style-enforcer';

const removeSpaces = str => str.replace(/\s/g, '');

test('StyleEnforcer wraps children in a div, with classname and injects proper classes', () => {
    const computedStyles1 = {
        base: [{ key: 'base-key', value: 'base-value-1' }],
        before: [{ key: 'before-key', value: 'before-value-1' }],
        after: [{ key: 'after-key', value: 'after-value-1' }],
    };

    const computedStyles2 = {
        base: [{ key: 'base-key', value: 'base-value-2' }],
        before: [{ key: 'before-key', value: 'before-value-2' }],
        after: [{ key: 'after-key', value: 'after-value-2' }],
    };

    const DOMElementHelper = {
        getSize: jest.fn(() => ({ width: 10, height: 20 })),
        getPadding: jest.fn(() => ({
            paddingLeft: 1, paddingRight: 2, paddingTop: 3, paddingBottom: 4,
        })),
        getComputedStyles: jest.fn(invalidate => (invalidate ? computedStyles1 : computedStyles2)),
    };

    const StyleInjector = jest.fn();
    StyleInjector.prototype.inject = jest.genMockFn();

    const createGuid = jest.fn();
    createGuid.mockReturnValue('guid');

    const wrapper = shallow((
        <StyleEnforcer
            StyleInjector={StyleInjector}
            createGuid={createGuid}
            DOMElementHelper={DOMElementHelper}
        >
            <div>
                Some child
            </div>
        </StyleEnforcer>
    ));

    expect(StyleInjector.prototype.inject.mock.calls).toHaveLength(2);
    /* eslint-disable max-len */
    expect(removeSpaces(StyleInjector.prototype.inject.mock.calls[0][0])).toMatch('.ID_guid>*{base-key:base-value-2;}.ID_guid>*:before{before-key:before-value-2;}.ID_guid>*:after{after-key:after-value-2;}');
    expect(removeSpaces(StyleInjector.prototype.inject.mock.calls[1][0])).toMatch('#ID_guid>*,#ID_guid>*{display:inline-block!important;box-sizing:content-box!important;float:none!important;position:static!important;min-width:none!important;max-width:none!important;min-height:none!important;max-height:none!important;width:10px!important;height:20px!important;padding-left:1px!important;padding-right:2px!important;padding-top:3px!important;padding-bottom:4px!important;}');
    /* eslint-enable max-len */
    expect(wrapper.contains(<div id="ID_guid" className="ID_guid"><div>Some child</div></div>)).toEqual(true);
});
