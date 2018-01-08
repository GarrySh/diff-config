// import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const extensionTypes = {
  '.json': JSON.parse,
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

const getAst = () => {

};

const renderDiff = () => {

};

const gendiff = (pathToFirstConfig, pathToSecondConfig) => {
  const fileData1 = parseFile(pathToFirstConfig);
  const fileData2 = parseFile(pathToSecondConfig);
  const ast = getAst(fileData1, fileData2);
  return renderDiff(ast);
};

export default gendiff;
