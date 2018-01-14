import _ from 'lodash';

const renderValue = (value) => {
  if (_.isObject(value)) {
    return 'complex value';
  }
  return `value: '${value}'`;
};

const rendererTypes = {
  added: (key, before, after) => `Property '${key}' was added with ${renderValue(after)}`,
  deleted: key => `Property '${key}' was removed`,
  unchanged: () => '',
  nested: (key, before, after, children, func) => func(children, key),
  changed: (key, before, after) =>
    `Property '${key}' was updated. From ${renderValue(after)} to ${renderValue(before)}`,
};

const renderPlain = (ast, parentKey) => {
  const diff = ast.map((node) => {
    const { key, type, before, after, children } = node;
    const newKey = _.isUndefined(parentKey) ? key : `${parentKey}.${key}`;
    const action = rendererTypes[type];
    return action(newKey, before, after, children, renderPlain);
  });
  return diff.filter(v => v !== '').join('\n');
};

export default renderPlain;
