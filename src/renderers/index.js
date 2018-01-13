import rendererText from './rendererText';
import rendererPlain from './rendererPlain';

const rendererTypes = {
  text: rendererText,
  plain: rendererPlain,
};

const getRenderer = (outputFormat) => {
  const render = rendererTypes[outputFormat];
  if (!render) {
    throw new Error('unsupported output format');
  }
  return render;
};

export default getRenderer;
