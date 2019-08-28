#!/usr/bin/env node

const args = process.argv.slice(2);
if (args.length < 2) {
	console.error('config requires at least 2 parameters: cwd and name');
	process.exit(1);
}


// console.error(`args: ${JSON.stringify(args, null, 2)}`);

const Config = require('..');
const config = new Config({ cwd: args[0], name: args[1], profiles: args[2], overrides: args[3], defaults: args[4] });
console.log(config.store);


// const prop1 = config.get('property1');

// console.error(`prop1: ${JSON.stringify(prop1, null, 2)}`);
