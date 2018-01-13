#!/usr/bin/env node
import commander from 'commander';
import gendiff from '..';

commander
  .description('Compares two configuration files and shows a difference.')
  .version('0.6.1')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig, options) => {
    const outputFormat = options.format || 'text';
    return console.log(gendiff(firstConfig, secondConfig, outputFormat));
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
