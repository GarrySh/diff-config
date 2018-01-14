import renderText from './rendererText';
import renderPlain from './rendererPlain';
import renderJSON from './renderJSON';

const rendererTypes = {
  text: renderText,
  plain: renderPlain,
  json: renderJSON,
};

const getRenderer = (outputFormat) => {
  const render = rendererTypes[outputFormat];
  if (!render) {
    throw new Error( 'unsupported output format');
  }
  return render;
};

export default getRenderer;
