import {toArray} from '../array-utils';

test('toArray wraps non array type in array', () => {
    const array = toArray('hej');
    expect(array).toEqual(expect.arrayContaining(['hej']));
    expect(array.length).toEqual(1);
});

test('toArray leaves arrays untouched', () => {
    const array = toArray(['hej']);
    expect(array).toEqual(expect.arrayContaining(['hej']));
    expect(array.length).toEqual(1);
});