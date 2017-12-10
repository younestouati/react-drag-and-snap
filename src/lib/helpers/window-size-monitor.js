function debounce(fn, wait = 100) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.call(this, ...args), wait);
    };
}

class WindowSizeMonitor {
    constructor() {
        this.nextId = 0;
        this.subscriptions = {};
    }

    subscribeToResizeEnd(callback) {
        const id = this.nextId;
        const debouncedCallback = debounce(callback);
        window.addEventListener('resize', debouncedCallback);
        this.subscriptions[id] = debouncedCallback;
        this.nextId++;
        
        return id;
    }

    unsubscribeToResizeEnd(id) {
        const method = this.subscriptions[id];
 
        if (method) {
            window.removeEventListener('resize', method);
        }

        this.subscriptions[id] = undefined;
    };
}

export {WindowSizeMonitor};