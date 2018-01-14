import _ from 'lodash';

const rendererTypes = {
  added: (key, before, after) => `Property '${key}' was added with ${_.isObject(after) ?
    'complex value' : `value: '${after}'`}`,
  deleted: key => `Property '${key}' was removed`,
  unchanged: () => '',
  nested: (key, before, after, children, func) => func(children, key),
  changed: (key, before, after) => `Property '${key}' was updated. From '${after}' to '${before}'`,
};

const renderPlain = (ast, parentKey) => {
  const diff = ast.map((node) => {
    const { key, type, before, after, children } = node;
    const newKey = [parentKey, key].filter(v => v).join('.');
    const action = rendererTypes[type];
    return action(newKey, before, after, children, renderPlain);
  });
  return diff.filter(v => v).join('\n');
};

export default renderPlain;
