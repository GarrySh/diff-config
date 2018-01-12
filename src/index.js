import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const extensionTypes = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseFile = (pathToFile) => {
  const fileExtension = path.extname(pathToFile);
  // console.log(fileExtension);
  const parse = extensionTypes[fileExtension];
  // console.log(ini);
  if (!parse) {
    throw new Error('unsupported file extension');
  }
  const file = fs.readFileSync(pathToFile, 'utf8');
  return parse(file);
};

const propertyCompare = [
  {
    type: 'added_node',
    check: (before, after) => _.isUndefined(before) && _.isObject(after),
    getChildren: (func, before, after) => func(after, after),
  },
  {
    type: 'deleted_node',
    check: (before, after) => _.isObject(before) && _.isUndefined(after),
    getChildren: (func, before) => func(before, before),
  },
  {
    type: 'node',
    check: (before, after) => _.isObject(before) && _.isObject(after),
    getChildren: (func, before, after) => func(before, after),
  },
  {
    type: 'unchanged_leaf',
    check: (before, after) => before === after,
    getChildren: () => [],
  },
  {
    type: 'added_leaf',
    check: before => _.isUndefined(before),
    getChildren: () => [],
  },
  {
    type: 'deleted_leaf',
    check: (before, after) => _.isUndefined(after),
    getChildren: () => [],
  },
  {
    type: 'changed_leaf',
    check: (before, after) => before !== after,
    getChildren: () => [],
  },
  {
    // Error of data type
    check: () => { throw new Error('unsupported data type'); },
  },
];

const getPropertyOfCompare = (valueBefore, valueAfter) => _.find(propertyCompare, ({ check }) =>
  check(valueBefore, valueAfter));

const getAst = (fileBefore = {}, fileAfter = {}) => {
  const uniqKeys = _.union(_.keys(fileBefore), _.keys(fileAfter));
  return uniqKeys.map((key) => {
    const valueBefore = fileBefore[key];
    const valueAfter = fileAfter[key];
    const { type, getChildren } = getPropertyOfCompare(valueBefore, valueAfter);
    const children = getChildren(getAst, valueBefore, valueAfter);
    return { key, valueBefore, valueAfter, type, children };
  });
};

const propertyRender = [
  {
    type: 'added_node',
    action: (nestingLevel, key, before, after, renderChildren) => `${' '.repeat((nestingLevel * 4) + 2)}+ ${key}: ${renderChildren}`,
  },
  {
    type: 'deleted_node',
    action: (nestingLevel, key, before, after, renderChildren) => `${' '.repeat((nestingLevel * 4) + 2)}- ${key}: ${renderChildren}`,
  },
  {
    type: 'node',
    action: (nestingLevel, key, before, after, renderChildren) => `${' '.repeat((nestingLevel * 4) + 2)}  ${key}: ${renderChildren}`,
  },
  {
    type: 'unchanged_leaf',
    action: (nestingLevel, key, before) => `${' '.repeat((nestingLevel * 4) + 2)}  ${key}: ${before}`,
  },
  {
    type: 'added_leaf',
    action: (nestingLevel, key, before, after) => `${' '.repeat((nestingLevel * 4) + 2)}+ ${key}: ${after}`,
  },
  {
    type: 'deleted_leaf',
    action: (nestingLevel, key, before) => `${' '.repeat((nestingLevel * 4) + 2)}- ${key}: ${before}`,
  },
  {
    type: 'changed_leaf',
    action: (nestingLevel, key, before, after) => `${' '.repeat((nestingLevel * 4) + 2)}+ ${key}: ${after}\n${' '.repeat((nestingLevel * 4) + 2)}- ${key}: ${before}`,
  },
];

const getPropertyOfRender = type => _.find(propertyRender, { type });

// const renderDiff = ast => ast;

const renderDiff = (ast, nestingLevel = 0) => {
  const diff = ast.map((value) => {
    const { key, valueBefore, valueAfter, type, children } = value;
    const renderChildren = renderDiff(children, nestingLevel + 1);
    const { action } = getPropertyOfRender(type);
    return action(nestingLevel, key, valueBefore, valueAfter, renderChildren);
  }).join('\n');
  const result = ['{', diff, `${' '.repeat(nestingLevel * 4)}}`];
  return result.join('\n');
};

const gendiff = (pathToCfgBefore, pathToCfgAfter) => {
  const fileBefore = parseFile(pathToCfgBefore);
  const fileAfter = parseFile(pathToCfgAfter);
  const ast = getAst(fileBefore, fileAfter);
  return renderDiff(ast);
};

export default gendiff;
