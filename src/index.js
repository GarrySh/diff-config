import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parseFile from './parsers';

const propertyCompare = [
  {
    type: 'nested',
    check: (before, after) => _.isObject(before) && _.isObject(after),
    getChildren: (func, before, after) => func(before, after),
  },
  {
    type: 'added',
    check: before => _.isUndefined(before),
    getChildren: () => [],
  },
  {
    type: 'deleted',
    check: (before, after) => _.isUndefined(after),
    getChildren: () => [],
  },
  {
    type: 'unchanged',
    check: (before, after) => before === after,
    getChildren: () => [],
  },
  {
    type: 'changed',
    check: (before, after) => before !== after,
    getChildren: () => [],
  },
];

const getPropertyOfCompare = (valueBefore, valueAfter) => _.find(propertyCompare, ({ check }) =>
  check(valueBefore, valueAfter));

const getAst = (fileBefore, fileAfter) => {
  const uniqKeys = _.union(_.keys(fileBefore), _.keys(fileAfter));
  return uniqKeys.map((key) => {
    const valueBefore = fileBefore[key];
    const valueAfter = fileAfter[key];
    const { type, getChildren } = getPropertyOfCompare(valueBefore, valueAfter);
    const children = getChildren(getAst, valueBefore, valueAfter);
    return { key, valueBefore, valueAfter, type, children };
  });
};

const indent = nestingLevel => ' '.repeat((nestingLevel * 4) + 2);
const indentShort = nestingLevel => ' '.repeat(nestingLevel * 4);

const renderString = (key, value, compareResult, nestingLevel) => {
  if (_.isObject(value)) {
    const objKeysValues = _.keys(value).map(k => `${indent(nestingLevel + 1)}  ${k}: ${value[k]}`);
    const objToString = ['{', objKeysValues, `${indentShort(nestingLevel + 1)}}`].join('\n');
    return `${indent(nestingLevel)}${compareResult} ${key}: ${objToString}`;
  }
  return `${indent(nestingLevel)}${compareResult} ${key}: ${value}`;
};

const renderTypes = {
  added: (nestingLevel, key, before, after) => renderString(key, after, '+', nestingLevel),
  deleted: (nestingLevel, key, before) => renderString(key, before, '-', nestingLevel),
  unchanged: (nestingLevel, key, before) => renderString(key, before, ' ', nestingLevel),
  nested: (nestingLevel, key, before, after, rendedChildren) => renderString(key, rendedChildren, ' ', nestingLevel),
  changed: (nestingLevel, key, before, after) => [renderString(key, after, '+', nestingLevel), renderString(key, before, '-', nestingLevel)].join('\n'),
};

const renderDiff = (ast, nestingLevel = 0) => {
  const diff = ast.map((value) => {
    const { key, valueBefore, valueAfter, type, children } = value;
    const rendedChildren = renderDiff(children, nestingLevel + 1);
    const action = renderTypes[type];
    return action(nestingLevel, key, valueBefore, valueAfter, rendedChildren);
  }).join('\n');
  return ['{', diff, `${indentShort(nestingLevel)}}`].join('\n');
};

const gendiff = (pathToCfgBefore, pathToCfgAfter) => {
  const fileBefore = fs.readFileSync(pathToCfgBefore, 'utf8');
  const fileAfter = fs.readFileSync(pathToCfgAfter, 'utf8');
  const parsedFileBefore = parseFile(fileBefore, path.extname(pathToCfgBefore));
  const parsedFileAfter = parseFile(fileAfter, path.extname(pathToCfgAfter));
  const ast = getAst(parsedFileBefore, parsedFileAfter);
  return renderDiff(ast);
};

export default gendiff;
