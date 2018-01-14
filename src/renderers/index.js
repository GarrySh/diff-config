import renderText from './rendererText';
import renderPlain from './rendererPlain';

const rendererTypes = {
  text: renderText,
  plain: renderPlain,
};

const getRenderer = (outputFormat) => {
  const render = rendererTypes[outputFormat];
  if (!render) {
    throw new Error('unsupported output format');
  }
  return render;
};

export default getRenderer;
