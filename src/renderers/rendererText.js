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
  added: (nestingLevel, key, value) => renderString(key, value, '+', nestingLevel),
  deleted: (nestingLevel, key, value) => renderString(key, value, '-', nestingLevel),
  unchanged: (nestingLevel, key, value) => renderString(key, value, ' ', nestingLevel),
  nested: (nestingLevel, key, value, func) => renderString(key, func(value, nestingLevel + 1), ' ', nestingLevel),
  changed: (nestingLevel, key, value) => [renderString(key, value.after, '+', nestingLevel),
    renderString(key, value.before, '-', nestingLevel)].join('\n'),
};

const renderText = (ast, nestingLevel = 0) => {
  const diff = ast.map((node) => {
    const { key, value, type } = node;
    const action = rendererTypes[type];
    return action(nestingLevel, key, value, renderText);
  }).join('\n');
  return ['{', diff, `${indentShort(nestingLevel)}}`].join('\n');
};

export default renderText;
