import _ from 'lodash';

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

const rendererText = (ast, nestingLevel = 0) => {
  const diff = ast.map((value) => {
    const { key, valueBefore, valueAfter, type, children } = value;
    const renderedChildren = rendererText(children, nestingLevel + 1);
    const action = renderTypes[type];
    return action(nestingLevel, key, valueBefore, valueAfter, renderedChildren);
  }).join('\n');
  return ['{', diff, `${indentShort(nestingLevel)}}`].join('\n');
};

export default rendererText;
