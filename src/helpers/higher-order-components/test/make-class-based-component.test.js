import React from 'react';
import { mount } from 'enzyme';
import makeClassBasedComponent from '../make-class-based-component';

describe('Make class-based componnent', () => {
    /* eslint-disable-next-line react/prefer-stateless-function */
    class ClassComponent extends React.Component {
        render() {
            return <div>Originally Class-based</div>;
        }
    }

    const FunctionalComponent = () => <div>Originally functional!</div>;
    FunctionalComponent.prototype = {};

    test('makeClassBasedComponent leaves an already class-based component a class-based compoment', () => {
        const C = makeClassBasedComponent(ClassComponent);
        expect(!!C.prototype.render).toBe(true);

        const rendered = mount(<C />);
        expect(rendered.html()).toEqual('<div>Originally Class-based</div>');
    });

    test('makeClassBasedComponent returns a class based component when given a functional compoment', () => {
        const C = makeClassBasedComponent(FunctionalComponent);
        expect(!!C.prototype.render).toBe(true);

        const rendered = mount(<C />);
        expect(rendered.html()).toEqual('<div>Originally functional!</div>');
    });
});
