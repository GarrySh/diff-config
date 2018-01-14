const renderJSON = ast => JSON.stringify(ast, (key, value) => {
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
});

export default renderJSON;
