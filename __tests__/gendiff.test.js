import gendiff from '../src';

describe('flat data', () => {
  const expected = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`;

  test('diff JSON files ', () => {
    expect(gendiff('__tests__/__fixtures__/before_flat.json', '__tests__/__fixtures__/after_flat.json')).toBe(expected);
  });

  test('diff YAML files ', () => {
    expect(gendiff('__tests__/__fixtures__/before_flat.yaml', '__tests__/__fixtures__/after_flat.yaml')).toBe(expected);
  });

  test('diff INI files ', () => {
    expect(gendiff('__tests__/__fixtures__/before_flat.ini', '__tests__/__fixtures__/after_flat.ini')).toBe(expected);
  });
});

describe('recursive data', () => {
  const expected = `{
    common: {
        setting1: Value 1
      - setting2: 200
        setting3: true
        setting6: {
            key: value
          + ops: vops
        }
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
    }
    group1: {
      + baz: bars
      - baz: bas
        foo: bar
    }
  - group2: {
        abc: 12345
    }
  + group3: {
        fee: 100500
    }
}`;

  test('diff JSON files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(expected);
  });

  test('diff YML files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(expected);
  });

  test('diff INI files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini')).toBe(expected);
  });
});
