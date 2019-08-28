'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const cacheSubDirName = '.';

class Config {
	constructor(options) {
		options = {
			fileExtension: 'json',
			deepMerge:     false,
			profiles:      [],
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
		const globalConfigDirectory = getConfigDirectory();
		const configFiles = [];

		if (_.isString(options.profile)) {
			options.profiles = options.profile.split(',').map(item => item.trim());
		} else if (_.isString(options.profiles)) {
			options.profiles = options.profiles.split(',').map(item => item.trim());
		}


		if (options.overrides) {
			if (_.isString(options.overrides)) {
				try {
					//TODO:  Add support for yaml and JSON5
					options.overrides = JSON.parse(options.overrides);
				} catch (err) {
					throw new Error(`Cannot parse options.overrides: ${err.message}`);
				}
			} else if (!_.isObject(options.overrides)) {
				throw new Error(`options.overrides is not an object: ${typeof options.overrides}`);
			}

			configFiles.push(options.overrides);
		}

		const addConfigFile = configFile => {
			if (_.isObject(configFile)) {
				configFiles.push(configFile);
			}
		};

		console.error(`options: ${JSON.stringify(options, null, 2)}`);

		// project user configs
		_.forEach(options.profiles, profile => {
			addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${profile}.user`, ext: options.fileExtension }));
		});

		// project profile configs
		_.forEach(options.profiles, profile => {
			addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${profile}.project`, ext: options.fileExtension }));
		});


		// user config
		addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.user`, ext: options.fileExtension }));


		// project config
		addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.project`, ext: options.fileExtension }));


		// global profile configs
		_.forEach(options.profiles, profile => {
			addConfigFile(this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}.${profile}.global`, ext: options.fileExtension }));
		});

		// global config
		addConfigFile(this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}.global`, ext: options.fileExtension }));


		if (options.defaults) {
			if (_.isString(options.defaults)) {
				try {
					//TODO:  Add support for yaml and JSON5
					options.defaults = JSON.parse(options.defaults);
				} catch (err) {
					throw new Error(`Cannot parse options.defaults: ${err.message}`);
				}
			} else if (!_.isObject(options.defaults)) {
				throw new Error(`options.defaults is not an object: ${typeof options.defaults}`);
			}

			configFiles.push(options.defaults);
		}


		console.error(`configFiles: ${JSON.stringify(configFiles, null, 2)}`);

		const finalConfig = {};
		if (options.deepMerge) {
			_.merge(finalConfig, ...configFiles.reverse());
		} else {
			_.defaults(finalConfig, ...configFiles);
		}

		console.error(`finalConfig: ${JSON.stringify(finalConfig, null, 2)}`);

		this.store = finalConfig;

		function getConfigDirectory() {

			const os = require('os');
			const homedir = os.homedir();
			const cacheDirName = path.join(homedir, cacheSubDirName, `.${options.name}`);

			return cacheDirName;

		}

	}

	getConfigFile(options = {}) {
		options = { ...options  };

		if (!options.cwd) {
			throw new Error('options.cwd is required.');
		}
		if (!options.filename) {
			throw new Error('options.filename is required.');
		}
		if (!options.ext) {
			throw new Error('options.ext is required.');
		}
		const filepath = path.join(options.cwd, `${options.filename}.${options.ext}`);
		console.error(`filepath: ${JSON.stringify(filepath, null, 2)}`);
		if (! fs.pathExistsSync(filepath)) {
			console.error('you are here → file not found');
			return;
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
				return;
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
