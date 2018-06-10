import React from 'react';
import { DragSnapContext } from '../lib-proxy';
import { DraggableBall } from './ball';
import { LargeReachTarget, LeavesPositionTarget } from './targets';

import './styles.css';

class RendererDemo extends React.Component {
    render() {
        return (
            <div className="renderer-demo">
                <DragSnapContext>
                    <div className="target-wrapper">
                        <LargeReachTarget />
                    </div>
                    <div className="target-wrapper">
                        <LargeReachTarget />
                    </div>
                    <div className="target-wrapper">
                        <LeavesPositionTarget />
                    </div>
                    <div className="ball-wrapper">
                        <DraggableBall />
                        <DraggableBall />
                        <DraggableBall />
                    </div>
                </DragSnapContext>
            </div>
        );
    }
}

export { RendererDemo };
