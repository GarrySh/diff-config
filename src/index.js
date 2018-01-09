import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const extensionTypes = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
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
    type: 'unchanged',
    check: (before, after) => before === after,
  },
  {
    type: 'added',
    check: before => _.isUndefined(before),
  },
  {
    type: 'deleted',
    check: (before, after) => _.isUndefined(after),
  },
  {
    type: 'changed',
    check: (before, after) => before !== after,
  },
];

const getPropertyOfCompare = (valueBefore, valueAfter) => _.find(propertyCompare, ({ check }) =>
  check(valueBefore, valueAfter));

const getAst = (fileBefore, fileAfter) => {
  const uniqKeys = _.union(_.keys(fileBefore), _.keys(fileAfter));
  return uniqKeys.map((key) => {
    const valueBefore = fileBefore[key];
    const valueAfter = fileAfter[key];
    const { type } = getPropertyOfCompare(valueBefore, valueAfter);
    return { key, valueBefore, valueAfter, type };
  });
};

const propertyRender = [
  {
    type: 'unchanged',
    action: (key, before) => `    ${key}: ${before}`,
  },
  {
    type: 'added',
    action: (key, before, after) => `  + ${key}: ${after}`,
  },
  {
    type: 'deleted',
    action: (key, before) => `  - ${key}: ${before}`,
  },
  {
    type: 'changed',
    action: (key, before, after) => `  + ${key}: ${after}\n  - ${key}: ${before}`,
  },
];

const getPropertyOfRender = type => _.find(propertyRender, { type });

const renderDiff = (ast) => {
  const diff = ast.map((value) => {
    const { key, valueBefore, valueAfter, type } = value;
    const { action } = getPropertyOfRender(type);
    return action(key, valueBefore, valueAfter);
  }).join('\n');
  const result = ['', '{', diff, '}'];
  return result.join('\n');
};

const gendiff = (pathToCfgBefore, pathToCfgAfter) => {
  const fileBefore = parseFile(pathToCfgBefore);
  const fileAfter = parseFile(pathToCfgAfter);
  const ast = getAst(fileBefore, fileAfter);
  return renderDiff(ast);
};

export default gendiff;
