import rendererText from './rendererText';
import rendererPlain from './rendererPlain';

const rendererTypes = {
  text: rendererText,
  plain: rendererPlain,
};

const getRenderer = outputFormat => rendererTypes[outputFormat];

export default getRenderer;

