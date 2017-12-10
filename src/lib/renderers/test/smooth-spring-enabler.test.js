import React from 'react';
import {mount} from 'enzyme';
import {SmoothSpringEnabler} from '../smooth-spring-enabler';

test('Smooth spring enabler returns given spring values when not enabling spring', () => {
    const wrapper = mount((
        <SmoothSpringEnabler
            isSpringEnabled={false}
            x={10}
            y={20}
            xSpring={30}
            ySpring={0}
        >
            {
                ({xSpring, ySpring, isEnablingSpring}) => {
                    expect(xSpring).toBe(30);
                    expect(ySpring).toBe(0);
                    expect(isEnablingSpring).toBe(false);

                    return <div/>;
                }
            }
        </SmoothSpringEnabler>
      ));
});

test('Smooth spring enabler returns given spring values when not enabling spring', (done) => {
    let hasEnabledSpring = false;
    let justEnabledSpring = false;
    
    const wrapper = mount((
        <SmoothSpringEnabler
            isSpringEnabled={false}
            x={10}
            y={20}
            xSpring={30}
            ySpring={0}
        >
            {
                ({xSpring, ySpring, isEnablingSpring}) => {
                    if (justEnabledSpring) {
                        //xSpring and ySpring should be closer to the props (xSpring and ySpring) than the x and y props where (i.e. the SpringEnablers output is gradually approaching the xSpring and ySpring prop values)
                        const springDistanceX = Math.abs(xSpring - 30);
                        const preSpringDistanceX = Math.abs(10 - 30);
                        const springDistanceY = Math.abs(ySpring - 0);
                        const preSpringDistanceY = Math.abs(20 - 0);

                        expect(springDistanceX).toBeLessThan(preSpringDistanceX);
                        expect(springDistanceY).toBeLessThan(preSpringDistanceY);
                        justEnabledSpring = false;
                    }

                    if (hasEnabledSpring && !isEnablingSpring) {
                        //The graudal enabling has completed, and the returned xSpring and ySpring now matches the given xSpring and ySpring props.
                        expect(xSpring).toBe(30);
                        expect(ySpring).toBe(0);
                        done();
                    }

                    return <div/>;
                }
            }
        </SmoothSpringEnabler>
    ));

    wrapper.setProps({isSpringEnabled: true});
    hasEnabledSpring = true;
    justEnabledSpring = true;
});
