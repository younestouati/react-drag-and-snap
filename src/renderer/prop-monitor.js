import { shallowEqual } from '../utils/object-utils';
import { isNullOrUndefined } from '../utils/type-utils';

class PropMonitor {
    constructor(oldProps, newProps) {
        this.oldProps = oldProps;
        this.newProps = newProps;
    }

    ifBecomingFalse(prop, callback) {
        if (this.oldProps[prop] && !this.newProps[prop]) {
            callback();
        }
    }

    ifValueChange(prop, callback) {
        if (this.oldProps[prop] !== this.newProps[prop]) {
            callback();
        }
    }

    ifDefinedValueChange(prop, callback) {
        if (
            this.oldProps[prop] !== this.newProps[prop] &&
            !isNullOrUndefined(this.oldProps[prop]) &&
            !isNullOrUndefined(this.newProps[prop])
        ) {
            callback();
        }
    }

    ifBecomingTrue(prop, callback) {
        if (!this.oldProps[prop] && this.newProps[prop]) {
            callback();
        }
    }

    ifBooleanChange(prop, callback) {
        if (this.oldProps[prop] !== this.newProps[prop]) {
            callback();
        }
    }

    ifShallowChange(prop, callback) {
        if (!shallowEqual(this.oldProps[prop], this.newProps[prop])) {
            callback();
        }
    }
}

export default PropMonitor;
