import fs from 'fs';
import gendiff from '../src';

describe('flat data', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/result_flat.txt', 'utf8');

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
  const expected = fs.readFileSync('__tests__/__fixtures__/result.txt', 'utf8');

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
