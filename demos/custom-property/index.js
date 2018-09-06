import React from 'react';
import { DragSnapContext } from '../lib-proxy';
import { DraggableBall } from './ball';
import { SquareTargetDefault, RoundTargetDefault } from './targets';

import './styles.css';

class CustomPropertyDemo extends React.Component {
    render() {
        return (
            <div className="custom-property-demo">
                <DragSnapContext>
                    <div className="target-wrapper">
                        <SquareTargetDefault />
                    </div>
                    <div className="target-wrapper">
                        <RoundTargetDefault />
                    </div>
                    <div className="ball-wrapper">
                        <DraggableBall />
                    </div>
                </DragSnapContext>
            </div>
        );
    }
}

export { CustomPropertyDemo };
