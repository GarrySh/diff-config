import fs from 'fs';
import gendiff from '../src';

describe('flat data', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/result_flat.txt', 'utf8');

  test('diff JSON files ', () => {
    expect(gendiff('__tests__/__fixtures__/before_flat.json', '__tests__/__fixtures__/after_flat.json', 'text')).toBe(expected);
  });

  test('diff YAML files ', () => {
    expect(gendiff('__tests__/__fixtures__/before_flat.yaml', '__tests__/__fixtures__/after_flat.yaml', 'text')).toBe(expected);
  });

  test('diff INI files ', () => {
    expect(gendiff('__tests__/__fixtures__/before_flat.ini', '__tests__/__fixtures__/after_flat.ini', 'text')).toBe(expected);
  });
});

describe('recursive data', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/result_text.txt', 'utf8');

  test('diff JSON files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json', 'text')).toBe(expected);
  });

  test('diff YML files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml', 'text')).toBe(expected);
  });

  test('diff INI files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini', 'text')).toBe(expected);
  });
});

describe('recursive data parsed in plain format ', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/result_plain.txt', 'utf8');

  test('diff JSON files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json', 'plain')).toBe(expected);
  });

  test('diff YML files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml', 'plain')).toBe(expected);
  });

  test('diff INI files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini', 'plain')).toBe(expected);
  });
});

describe('recursive data parsed in JSON format ', () => {
  const expected = fs.readFileSync('__tests__/__fixtures__/result_JSON.json', 'utf8');

  test('diff JSON files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json', 'json')).toBe(expected);
  });

  test('diff YML files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml', 'json')).toBe(expected);
  });

  test('diff INI files ', () => {
    expect(gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini', 'json')).toBe(expected);
  });
});
