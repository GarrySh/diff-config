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
  const parse = extensionTypes[fileExtension];
  if (!parse) {
    throw new Error('unsupported file extension');
  }
  const file = fs.readFileSync(pathToFile, 'utf8');
  return parse(file);
};

const propertyCompare = [
  {
    type: 'added',
    check: before => _.isUndefined(before),
    getChildren: (func, before, after) => func(after, after),
  },
  {
    type: 'deleted',
    check: (before, after) => _.isUndefined(after),
    getChildren: (func, before) => func(before, before),
  },
  {
    type: 'unchanged',
    check: (before, after) => (_.isObject(before) && _.isObject(after)) || (before === after),
    getChildren: (func, before, after) => func(before, after),
  },
  {
    type: 'changed',
    check: (before, after) => before !== after,
    getChildren: () => [],
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
    const children = _.isObject(valueBefore) || _.isObject(valueAfter) ?
      getChildren(getAst, valueBefore, valueAfter) : [];
    return { key, valueBefore, valueAfter, type, children };
  });
};

const indent = nestingLevel => ' '.repeat((nestingLevel * 4) + 2);
const indentShort = nestingLevel => ' '.repeat(nestingLevel * 4);

const propertyRender = {
  added: (nestingLevel, key, before, after, renderChildren) => `${indent(nestingLevel)}+ ${key}: ${_.isNull(renderChildren) ? after : renderChildren}`,
  deleted: (nestingLevel, key, before, after, renderChildren) => `${indent(nestingLevel)}- ${key}: ${_.isNull(renderChildren) ? before : renderChildren}`,
  unchanged: (nestingLevel, key, before, after, renderChildren) => `${indent(nestingLevel)}  ${key}: ${_.isNull(renderChildren) ? before : renderChildren}`,
  changed: (nestingLevel, key, before, after) => `${indent(nestingLevel)}+ ${key}: ${after}\n${indent(nestingLevel)}- ${key}: ${before}`,
};

const renderDiff = (ast, nestingLevel = 0) => {
  const diff = ast.map((value) => {
    const { key, valueBefore, valueAfter, type, children } = value;
    const renderChildren = _.isEmpty(children) ? null : renderDiff(children, nestingLevel + 1);
    const action = propertyRender[type];
    return action(nestingLevel, key, valueBefore, valueAfter, renderChildren);
  }).join('\n');
  const result = ['{', diff, `${indentShort(nestingLevel)}}`];
  return result.join('\n');
};

const gendiff = (pathToCfgBefore, pathToCfgAfter) => {
  const fileBefore = parseFile(pathToCfgBefore);
  const fileAfter = parseFile(pathToCfgAfter);
  const ast = getAst(fileBefore, fileAfter);
  return renderDiff(ast);
};

export default gendiff;
