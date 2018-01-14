import _ from 'lodash';

const indent = nestingLevel => ' '.repeat((nestingLevel * 4) + 2);
const indentShort = nestingLevel => ' '.repeat(nestingLevel * 4);

const renderString = (key, value, compareResult, nestingLevel) => {
  if (_.isObject(value)) {
    const objKeyValue = _.keys(value).map(k => `${indent(nestingLevel + 1)}  ${k}: ${value[k]}`);
    const objToString = ['{', objKeyValue, `${indentShort(nestingLevel + 1)}}`].join('\n');
    return `${indent(nestingLevel)}${compareResult} ${key}: ${objToString}`;
  }
  return `${indent(nestingLevel)}${compareResult} ${key}: ${value}`;
};

const rendererTypes = {
  added: (nestingLevel, key, before, after) => renderString(key, after, '+', nestingLevel),
  deleted: (nestingLevel, key, before) => renderString(key, before, '-', nestingLevel),
  unchanged: (nestingLevel, key, before) => renderString(key, before, ' ', nestingLevel),
  nested: (nestingLevel, key, before, after, children, func) => renderString(key, func(children, nestingLevel + 1), ' ', nestingLevel),
  changed: (nestingLevel, key, before, after) => [renderString(key, after, '+', nestingLevel),
    renderString(key, before, '-', nestingLevel)].join('\n'),
};

const renderText = (ast, nestingLevel = 0) => {
  const diff = ast.map((node) => {
    const { key, type, before, after, children } = node;
    const action = rendererTypes[type];
    return action(nestingLevel, key, before, after, children, renderText);
  }).join('\n');
  return ['{', diff, `${indentShort(nestingLevel)}}`].join('\n');
};

export default renderText;
