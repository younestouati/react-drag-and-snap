import arrayUtils from '../array-utils';

test('toArray wraps non array type in array', () => {
    const array = arrayUtils.toArray('hej');
    expect(array).toEqual(expect.arrayContaining(['hej']));
    expect(array).toHaveLength(1);
});

test('toArray leaves arrays untouched', () => {
    const array = arrayUtils.toArray(['hej']);
    expect(array).toEqual(expect.arrayContaining(['hej']));
    expect(array).toHaveLength(1);
});
