import {StyleInjector} from '../style-injector';

test('styleInjector correctly injects and removes the given styles', () => {
    //Insert 'existing style'
    const node = document.createElement('style');
    node.type = 'text/css';
    node.innerHTML = '.dummy-style {}';
    document.head.appendChild(node);

    //Inject new style AFTER existing style
    const style1 = '.some-class { background: red}';
    const styleInjector = new StyleInjector();
    const style1Node = styleInjector.inject(style1);

    expect(document.querySelectorAll('style')[1].textContent).toEqual(style1);

    //Inject new style BEFORE existing styles
    const style2 = '.another-class { background: blue}';
    const style2Node = styleInjector.inject(style2, true);

    expect(document.querySelectorAll('style')[0].textContent).toEqual(style2);

    //Remove the injected styles
    styleInjector.remove(style1Node);
    expect(document.querySelectorAll('style').length).toBe(2);

    styleInjector.remove(style2Node);
    expect(document.querySelectorAll('style').length).toBe(1);
});