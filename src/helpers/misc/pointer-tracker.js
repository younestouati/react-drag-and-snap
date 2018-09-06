import { extractPointFromEvent, extractFirstIdentifier } from './mouse-touch-event';
import { subtractPoints, averagePoints, scalePoint, getOrigo } from '../../utils/point-utils';
import EventThrottler from './event-throttler';
import { shallowClone } from '../../utils/object-utils';

const AVERAGING_WINDOW = 3;

class PointerTracker {
    constructor(startCallback, moveCallback, endCallback, InjectedEventThrottler = EventThrottler) {
        this.startCallback = startCallback;
        this.endCallback = endCallback;
        this.pointerIdentifier = null;

        this.boundMoveHandler = this.moveHandler.bind(this);
        this.boundEndHandler = this.endHandler.bind(this);
        this.boundCancelHandler = this.cancelHandler.bind(this);

        this.eventThrottler = new InjectedEventThrottler(moveCallback);
    }

    destroy() {
        this.removeEventHandlers();
    }

    removeEventHandlers() {
        window.removeEventListener('mousemove', this.boundMoveHandler, { passive: false });
        window.removeEventListener('mouseup', this.boundEndHandler, { passive: false });
        window.removeEventListener('touchmove', this.boundMoveHandler, { passive: false });
        window.removeEventListener('touchend', this.boundEndHandler, { passive: false });
        window.removeEventListener('touchcancel', this.boundCancelHandler, { passive: false });
    }

    addEventHandlers() {
        this.removeEventHandlers();

        window.addEventListener('mousemove', this.boundMoveHandler, { passive: false });
        window.addEventListener('mouseup', this.boundEndHandler, { passive: false });
        window.addEventListener('touchmove', this.boundMoveHandler, { passive: false });
        window.addEventListener('touchend', this.boundEndHandler, { passive: false });
        window.addEventListener('touchcancel', this.boundCancelHandler, { passive: false });
    }

    resetVelocities() {
        this.point = null;
        this.prevTime = null;
        this.prevPosition = null;
        this.animationId = null;
        this.velocities = [];
    }

    updateVelocities(point) {
        const currentTime = performance.now();

        if (this.prevTime) {
            const deltaPosition = subtractPoints(point, this.prevPosition);
            const deltaTime = (currentTime - this.prevTime);
            this.velocities.push(scalePoint(deltaPosition, 1 / deltaTime));


            if (this.velocities.length === AVERAGING_WINDOW) {
                this.velocities.shift();
            }
        }

        this.prevTime = currentTime;
        this.prevPosition = shallowClone(point);
    }

    getVelocity() {
        return this.velocities.length ? averagePoints(this.velocities) : getOrigo();
    }

    startHandler(e) {
        e.stopPropagation();
        const point = extractPointFromEvent(e, this.pointerIdentifier);

        this.startCallback({ position: point, velocity: { x: 0, y: 0 } });
    }

    moveHandler(e) {
        const point = extractPointFromEvent(e, this.pointerIdentifier);

        if (point) {
            e.preventDefault();
            this.updateVelocities(point);
            this.eventThrottler.addEvent({ position: point, velocity: this.getVelocity() });
        }
    }

    endHandler(e) {
        const point = extractPointFromEvent(e, this.pointerIdentifier);

        if (point) {
            this.endCallback({ position: point, velocity: this.getVelocity() });
            this.removeEventHandlers();
            this.eventThrottler.pause();
        }
    }

    cancelHandler(e) {
        this.endHandler(e);
    }

    track(e) {
        this.pointerIdentifier = extractFirstIdentifier(e);
        this.resetVelocities();
        this.addEventHandlers();
        this.startHandler(e);
    }
}

export default PointerTracker;
