'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const plainObject = () => Object.create(null);

const cacheSubDirName = '.';

class Config {
	constructor(options) {
		options = {
			fileExtension: 'json',
			deepMerge:     false,
			...options,
		};


		// console.error(`options: ${JSON.stringify(options, null, 2)}`);

		if (!options.cwd) {
			throw new Error('options.cwd is required.');
		}
		if (!options.name) {
			throw new Error('options.name is required.');
		}

		this.name = options.name;

		if (options.overrides) {
			if (_.isString(options.overrides)) {
				try {
					//TODO:  Add support for yaml and JSON5
					options.overrides = JSON.parse(options.overrides);
				} catch (err) {
					throw new Error(`Cannot parse options.overrides: ${err.message}`);
				}
			} else if (typeof options.overrides !== 'object') {
				throw new Error(`options.overrides is not an object: ${typeof options.overrides}`);
			}
		}

		const projectConfig = this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.project`, ext: options.fileExtension });
		const userConfig = this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.user`, ext: options.fileExtension });
		const userEnvConfig = options.env ? this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${options.env}.user`, ext: options.fileExtension, env: options.env }) : plainObject;
		const projectEnvConfig = options.env ? this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${options.env}.project`, ext: options.fileExtension, env: options.env }) : plainObject;

		const globalConfigDirectory = getConfigDirectory();

		const globalConfig = this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}.global`, ext: options.fileExtension });
		const globalEnvConfig = options.env ? this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}.${options.env}.global`, ext: options.fileExtension }) : plainObject;


		// console.error(`projectConfig: ${JSON.stringify(projectConfig, null, 2)}`);
		// console.error(`userConfig: ${JSON.stringify(userConfig, null, 2)}`);
		// console.error(`userEnvConfig: ${JSON.stringify(userEnvConfig, null, 2)}`);
		// console.error(`projectEnvConfig: ${JSON.stringify(projectEnvConfig, null, 2)}`);
		// console.error(`globalConfig: ${JSON.stringify(globalConfig, null, 2)}`);
		// console.error(`globalEnvConfig: ${JSON.stringify(globalEnvConfig, null, 2)}`);

		const finalConfig = {};
		if (options.deepMerge) {
			_.merge(finalConfig, globalConfig, globalEnvConfig, projectConfig, projectEnvConfig, userConfig, userEnvConfig, options.overrides);
		} else {
			_.defaults(finalConfig, options.overrides, userEnvConfig, userConfig, projectEnvConfig, projectConfig, globalEnvConfig, globalConfig);
		}

		// console.error(`finalConfig: ${JSON.stringify(finalConfig, null, 2)}`);

		this.store = finalConfig;

		function getConfigDirectory() {

			const os = require('os');
			const homedir = os.homedir();
			const cacheDirName = path.join(homedir, cacheSubDirName, `.${options.name}`);

			return cacheDirName;

		}

	}

	getConfigFile(options = {}) {
		options = {
			env: '',
			...options,
		};

		if (!options.cwd) {
			throw new Error('options.cwd is required.');
		}
		if (!options.filename) {
			throw new Error('options.filename is required.');
		}
		if (!options.ext) {
			throw new Error('options.ext is required.');
		}

		// let filename = `${options.name}.${options.type}`;
		// options.env && (filename += `.${options.env}`);
		// filename += `.${options.ext}`;

		const filepath = path.join(options.cwd, `${options.filename}.${options.ext}`);
		// console.error(`filepath: ${JSON.stringify(filepath, null, 2)}`);
		if (! fs.pathExistsSync(filepath)) {
			// console.error('you are here → file not found');
			return plainObject;
		}

		try {

			// TODO:  Add support for JSON5 and yaml
			switch (options.ext) {
				case 'json':
					return fs.readJsonSync(filepath, 'utf8');

				default:
					throw Error(`extension not supported by config:  ${options.ext}`);
			}
		} catch (error) {
			if (error.code === 'ENOENT') {
				return plainObject;
			}
			console.error(error);
			throw error;
		}


	}


	get(key, defaultValue) {

		const env_var_name = `${this.name.toUpperCase()}_${key.toUpperCase().replace('.', '_')}`;
		console.error(`env_var_name: ${JSON.stringify(env_var_name, null, 2)}`);
		const env_var = process.env[env_var_name];
		console.error(`env_var: ${JSON.stringify(env_var, null, 2)}`);
		if (! _.isNil(env_var)) {
			return env_var;
		}
		return _.get(this.store, key, defaultValue);
	}


}


module.exports = Config;
