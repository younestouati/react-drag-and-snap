import { shallowClone } from '../../utils/object-utils';

class EventThrottler {
    constructor(handler) {
        this.handler = handler;
        this.latestEvent = null;
        this.animationId = null;
    }

    invokeCallback() {
        this.handler(this.latestEvent);
        this.animationId = requestAnimationFrame(this.invokeCallback.bind(this));
    }

    pause() {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
    }

    addEvent(event) {
        this.latestEvent = shallowClone(event);
        if (!this.animationId) {
            this.animationId = requestAnimationFrame(this.invokeCallback.bind(this));
        }
    }
}

export default EventThrottler;
