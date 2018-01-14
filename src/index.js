import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parseFile from './parsers';
import getRenderer from './renderers';

const propertyCompare = [
  {
    type: 'nested',
    check: (before, after) => _.isObject(before) && _.isObject(after),
    process: (before, after, func) => ({ children: func(before, after) }),
  },
  {
    type: 'added',
    check: before => _.isUndefined(before),
    process: (before, after) => ({ after }),
  },
  {
    type: 'deleted',
    check: (before, after) => _.isUndefined(after),
    process: before => ({ before }),
  },
  {
    type: 'unchanged',
    check: (before, after) => before === after,
    process: (before, after) => ({ before, after }),
  },
  {
    type: 'changed',
    check: (before, after) => before !== after,
    process: (before, after) => ({ before, after }),
  },
];

const getPropertyOfCompare = (valueBefore, valueAfter) => _.find(propertyCompare, ({ check }) =>
  check(valueBefore, valueAfter));

const getAst = (fileBefore, fileAfter) => {
  const uniqKeys = _.union(_.keys(fileBefore), _.keys(fileAfter));
  return uniqKeys.map((key) => {
    const valueBefore = fileBefore[key];
    const valueAfter = fileAfter[key];
    const { type, process } = getPropertyOfCompare(valueBefore, valueAfter);
    const node = { key, type, before: '', after: '', children: [] };
    const nodeProperty = process(valueBefore, valueAfter, getAst);
    return { ...node, ...nodeProperty };
  });
};

const gendiff = (pathToCfgBefore, pathToCfgAfter, outputFormat) => {
  const fileBefore = fs.readFileSync(pathToCfgBefore, 'utf8');
  const fileAfter = fs.readFileSync(pathToCfgAfter, 'utf8');
  const parsedFileBefore = parseFile(fileBefore, path.extname(pathToCfgBefore));
  const parsedFileAfter = parseFile(fileAfter, path.extname(pathToCfgAfter));
  const ast = getAst(parsedFileBefore, parsedFileAfter);
  const render = getRenderer(outputFormat);
  return render(ast);
};

export default gendiff;
