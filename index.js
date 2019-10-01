'use strict';

const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const os = require('os');
const jsonc = require('jsonc-parser');

const cacheSubDirName = '.';
// TODO: Implement json5, yaml, and yml
// const supportedFileExtensions = [ '.json5', '.yaml', '.yml', '.json' ];
const supportedFileExtensions = [ '.json', '.jsonc' ];

class Config {
	constructor(options) {
		options = {
			deepMerge:             false,
			profiles:              [],
			files:                 [],
			userFilenameSuffix:    '.user',
			projectFilenameSuffix: '.project',
			globalFilenameSuffix:  '.global',
			systemFilenameSuffix:  '.system',
			name:                  'geek',
			onlyFiles:             false,
			...options,
		};


		// console.error(`options: ${JSON.stringify(options, null, 2)}`);

		// if (!options.cwd) {
		// 	throw new Error('options.cwd is required.');
		// }
		// if (!options.name) {
		// 	throw new Error('options.name is required.');
		// }

		this.name = options.name;
		this.fileExtensions = options.fileExtensions || options.fileExtension || supportedFileExtensions;

		if (_.isString(this.fileExtensions)) {
			this.fileExtensions = this.fileExtensions.split(',').map(item => item.trim());
		}

		if (_.isString(options.only)) {
			options.files =  options.only.split(',').map(item => item.trim());
			options.onlyFiles = true;
		} else if (_.isArray(options.only)) {
			options.files =  options.only;
			options.onlyFiles = true;
		} else if (_.isString(options.files)) {
			options.files =  options.files.split(',').map(item => item.trim());
		}

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

		// console.error(`options: ${JSON.stringify(options, null, 2)}`);


		// specified file configs
		_.forEach(options.files, file => {
			const filePath = path.parse(file);
			filePath.dir = filePath.dir.replace('~', os.homedir);
			// console.error(`filePath: ${JSON.stringify(filePath, null, 2)}`);
			addConfigFile(this.getConfigFile({ cwd: filePath.dir, filename: filePath.name, ext: filePath.exports }));
		});

		// console.error(`configFiles: ${JSON.stringify(configFiles, null, 2)}`);

		// console.error(`options.onlyFiles: ${JSON.stringify(options.onlyFiles, null, 2)}`);

		// project user configs
		options.onlyFiles || _.forEach(options.profiles, profile => {
				 addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${profile}${options.userFilenameSuffix}` }));
		});

		// project profile configs
		options.onlyFiles || _.forEach(options.profiles, profile => {
			addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${profile}${options.projectFilenameSuffix}`  }));
		});


		// user config
		options.onlyFiles || addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}${options.userFilenameSuffix}` }));


		// project config
		options.onlyFiles || addConfigFile(this.getConfigFile({ cwd: options.cwd, filename: `${options.name}${options.projectFilenameSuffix}` }));


		// global profile configs
		options.onlyFiles || _.forEach(options.profiles, profile => {
			addConfigFile(this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}.${profile}${options.globalFilenameSuffix}` }));
		});

		// global config
		options.onlyFiles || addConfigFile(this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}${options.globalFilenameSuffix}` }));


		// system config
		options.onlyFiles || addConfigFile(this.getConfigFile({ cwd: globalConfigDirectory, filename: `${options.name}${options.systemFilenameSuffix}` }));


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

			// console.error(`options.defaults: ${JSON.stringify(options.defaults, null, 2)}`);
			configFiles.push(options.defaults);
		}


		// console.error(`configFiles: ${JSON.stringify(configFiles, null, 2)}`);

		const finalConfig = {};
		if (options.deepMerge) {
			_.merge(finalConfig, ...configFiles.reverse());
		} else {
			_.defaults(finalConfig, ...configFiles);
		}

		// console.error(`finalConfig: ${JSON.stringify(finalConfig, null, 2)}`);

		this.store = finalConfig;

		function getConfigDirectory() {

			const homedir = os.homedir();
			const cacheDirName = path.join(homedir, cacheSubDirName, `.${options.name}`);

			return cacheDirName;

		}

	}

	getConfigFile(options = {}) {

		if (!options.cwd) {
			throw new Error('options.cwd is required.');
		}
		if (!options.filename) {
			throw new Error('options.filename is required.');
		}

		let configFile;

		_.forEach(this.fileExtensions, ext => {

			const filepath = path.join(options.cwd, `${options.filename}${ext}`);
			console.error(`filepath: ${JSON.stringify(filepath, null, 2)}`);
			if (! fs.pathExistsSync(filepath)) {
				// console.error('you are here → file not found');
				return true;
			}

			try {

				// TODO:  Add support for JSON5 and yaml
				switch (ext) {
					case '.json':
					case '.jsonc':
						// configFile = fs.readJsonSync(filepath, 'utf8');
						const content = fs.readFileSync(filepath, 'utf8');
						const errors = [];
						configFile = jsonc.parse(content, errors, { allowTrailingComma: false });
						if (errors.length) {
							console.errors(filepath);
							throw Error(`an error occurred when parsing the file: ${filepath}`);
						}
						break;

					default:
						throw Error(`file extension not supported by @geek/config:  ${ext}`);
				}
			} catch (error) {
				if (error.code === 'ENOENT') {
					return true;
				}
				console.error(error);
				throw error;
			}

			return false;

		});

		return configFile;


		// _.forEach(supportedFileExtensions, ext => {
		// 	const configFile = this.getConfigFile({ cwd: options.cwd, filename: `${options.name}.${profile}.user`, ext: ext });
		// 	if (configFile) {
		// 		addConfigFile(configFile);
		// 		return false;
		// 	}
		// });

		// try {

		// 	// TODO:  Add support for JSON5 and yaml
		// 	switch (options.ext) {
		// 		case 'json':
		// 			return fs.readJsonSync(filepath, 'utf8');

		// 		default:
		// 			throw Error(`extension not supported by config:  ${options.ext}`);
		// 	}
		// } catch (error) {
		// 	if (error.code === 'ENOENT') {
		// 		return;
		// 	}
		// 	console.error(error);
		// 	throw error;
		// }


	}


	get(key, defaultValue) {


		if (!key) {
			return defaultValue || key;
		}
		// console.error(`key: ${JSON.stringify(key, null, 2)}`);
		const env_var_name = `${this.name.toUpperCase()}_${key.toUpperCase().replace('.', '_')}`;
		// console.error(`env_var_name: ${JSON.stringify(env_var_name, null, 2)}`);
		const env_var = process.env[env_var_name];
		// console.error(`env_var: ${JSON.stringify(env_var, null, 2)}`);
		if (! _.isNil(env_var)) {
			// console.error('you are here → found env_var');
			return env_var;
		}
		// console.error(`this.store: ${JSON.stringify(this.store, null, 2)}`);
		// const test =  _.get(this.store, key, defaultValue);


		// console.error(`test: ${JSON.stringify(test, null, 2)}`);
		// const test2 = this.store[key];
		// console.error(`test2: ${JSON.stringify(test2, null, 2)}`);

		// console.error(`typeof this.store: ${JSON.stringify(typeof this.store, null, 2)}`);
		// console.error(`_.keysIn(this.store): ${JSON.stringify(_.keysIn(this.store), null, 2)}`);

		return _.get(this.store, key, defaultValue);
	}


}


module.exports = Config;
