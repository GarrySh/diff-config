import yaml from 'js-yaml';
import ini from 'ini';

const extensionTypes = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const parseFile = (file, fileExtension) => {
  const parse = extensionTypes[fileExtension];
  if (!parse) {
    throw new Error('unsupported file extension');
  }
  return parse(file);
};

export default parseFile;
