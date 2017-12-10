import React from 'react';
import {mount} from 'enzyme';
import {SmoothSpringDisabler} from '../smooth-spring-disabler';

test('Smooth spring disabler returns given spring config when not enabled', () => {
    const wrapper = mount((
        <SmoothSpringDisabler
            isSpringEnabled={true}
            springConfig={{
                stiffness: 10,
                damping: 20
            }}
        >
            {
                ({stiffness, damping, isDisablingSpring}) => {
                    expect(stiffness).toBe(10);
                    expect(damping).toBe(20);
                    expect(isDisablingSpring).toBe(false);

                    return <div/>;
                }
            }
        </SmoothSpringDisabler>
      ));
});

test('Smooth spring disabler gradually tightens the spring config', (done) => {
    let hasSpringBeenDisabled = false;

    const wrapper = mount((
        <SmoothSpringDisabler
            isSpringEnabled={true}
            springConfig={{
                stiffness: 10,
                damping: 20
            }}
        >
            {
                ({stiffness, damping, isDisablingSpring}) => {
                    if (hasSpringBeenDisabled && !isDisablingSpring) {
                        expect(stiffness).toBe(2500);
                        expect(damping).toBe(60);
                        done();    
                    }

                    return <div/>;
                }
            }
        </SmoothSpringDisabler>
      ));

      wrapper.setProps({isSpringEnabled: false});
      hasSpringBeenDisabled = true;
});