import {DOMElementHelper} from '../dom-element-helper';

describe('DOMElementHelper tests', () => {
    const element = document.createElement('div');
    element.getBoundingClientRect = jest.fn();
    element.getBoundingClientRect.mockReturnValue({
        left: 50,
        right: 250,
        width: 200,
        top: 100,
        botton: 400,
        height: 300
    });

    Object.defineProperty(element, 'clientWidth', {value: 200});
    Object.defineProperty(element, 'clientHeight', {value: 300});

    window.scrollX = 10;
    window.scrollY = 20;


    const computedStyle = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'other-prop'];
    computedStyle['padding-left'] = '10px';
    computedStyle['padding-right'] = '20px';
    computedStyle['padding-top'] = '30px';
    computedStyle['padding-bottom'] = '40px';
    computedStyle['other-prop'] = '10px';

    const beforeComputedStyle = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'other-prop'];
    beforeComputedStyle['padding-left'] = '12px';
    beforeComputedStyle['padding-right'] = '22px';
    beforeComputedStyle['padding-top'] = '32px';
    beforeComputedStyle['padding-bottom'] = '42px';
    beforeComputedStyle['other-prop'] = '12px';

    const afterComputedStyle = ['padding-left', 'padding-right', 'padding-top', 'padding-bottom', 'other-prop'];
    afterComputedStyle['padding-left'] = '14px';
    afterComputedStyle['padding-right'] = '24px';
    afterComputedStyle['padding-top'] = '34px';
    afterComputedStyle['padding-bottom'] = '44px';
    afterComputedStyle['other-prop'] = '14px';

    computedStyle.getPropertyValue = jest.fn((style) => computedStyle[style]);
    beforeComputedStyle.getPropertyValue = jest.fn((style) => beforeComputedStyle[style]);
    afterComputedStyle.getPropertyValue = jest.fn((style) => afterComputedStyle[style]);
    window.getComputedStyle = jest.fn();
    window.getComputedStyle
        .mockReturnValueOnce(computedStyle)
        .mockReturnValueOnce(beforeComputedStyle)
        .mockReturnValueOnce(afterComputedStyle);
    const domElementHelper = new DOMElementHelper(element);

    test('DOMElementHelper returns correct size for given DOM element', () => {
        expect(domElementHelper.getSize()).toEqual({width: 170, height: 230});
    });

    test('DOMElementHelper returns correct size for given DOM element', () => {     
        expect(domElementHelper.getPadding()).toEqual({paddingBottom: 40, paddingLeft: 10, paddingRight: 20, paddingTop: 30});
    });

    test('DOMElementHelper returns correct computedStyles for given DOM element', () => {     
        expect(domElementHelper.getComputedStyles()).toEqual({
            base: [
                {key: 'padding-left', value: '10px'},
                {key: 'padding-right', value: '20px'},
                {key: 'padding-top', value: '30px'},
                {key: 'padding-bottom', value: '40px'},
                {key: 'other-prop', value: '10px'}
            ],
            before: [
                {key: 'padding-left', value: '12px'},
                {key: 'padding-right', value: '22px'},
                {key: 'padding-top', value: '32px'},
                {key: 'padding-bottom', value: '42px'},
                {key: 'other-prop', value: '12px'}
            ],
            after: [
                {key: 'padding-left', value: '14px'},
                {key: 'padding-right', value: '24px'},
                {key: 'padding-top', value: '34px'},
                {key: 'padding-bottom', value: '44px'},
                {key: 'other-prop', value: '14px'}
            ], 
        });
    });
});