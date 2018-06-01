class StyleInjector {
    static remove(node) {
        node.parentNode.removeChild(node);
    }

    constructor(mountNode = document.getElementsByTagName('head')[0]) {
        this.mountNode = mountNode;
    }

    inject(style, first = false) {
        const node = document.createElement('style');
        node.type = 'text/css';
        node.innerHTML = style;

        if (first) {
            this.mountNode.insertBefore(node, this.mountNode.firstChild);
        } else {
            this.mountNode.appendChild(node);
        }

        return node;
    }
}

export default StyleInjector;
