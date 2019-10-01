# @geek/config

[![@geek/config](https://img.shields.io/npm/v/@geek/config.png)](https://www.npmjs.com/package/@geek/config)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=brentonhouse/geek-config)](https://dependabot.com)


> Geek Configuration Manager for Node.js - The complete solution for managing config settings for your Node.js application



## 🚀 Getting Started

### Install

> Install `@geek/config`

```bash
npm install @geek/config
```

## Usage

```JavaScript
const Config = require('@geek/config');

// single profile
const config1 = new Config({
	cwd:       __dirname,
	name:      'myapp',
	profile:   'dev',
	overrides: { property2: 'override-value'  },
	defaults:  { property9: 'default-value'  },
});

// multiple profiles
const config2 = new Config({
	cwd:       __dirname,
	name:      'myapp',
	profiles:  [ 'dev', 'ios' ],
	overrides: { property2: 'override-value'  },
	defaults:  { property9: 'default-value'  },
});
```


## Priority of config files


| priority 	| source 	| example  	|   location	|
|:-:	|:-:	|:-:	|:-:	|
| 1.  	| **process.env**  	| `MYAPP_PROPERTY1="environment-value" ` 		| environment variable  	|
| 2.  	| **overrides**  	| `{ "property1": "override-value" }`	| parameter: `overrides`  	|
| 4.  	| **files**  	| `['~/.titanium/config.json', '~/.tn.json']`	| parameter: `files`  	|
| 5.  	| **user profile config file**  	| `myapp.dev.user.json`    	| *project directory*  	|
| 6.  	| **user config file**  	| `myapp.user.json`  	|   *project directory*  	|
| 7.  	| **project profile config file**  	| `myapp.dev.project.json`  	| *project directory*  	|
| 8.  	| **project config file**  	| `myapp.project.json`  	| *project directory*  	|
| 9.  	| **global profile config fil**e  	| `myapp.dev.global.json`  		| *home config directory*  	|
| 10.  	| **global config file**  	| `myapp.global.json`  		| *home config directory*  	|
| 11.  	| **system config file**  	| `myapp.system.json`  		| *home config directory*  	|
| 12.  	| **default values**  	|  `{ "property1": "default-value" }`	  	| parameter: `defaults`  	|

## Examples

> **NOTE:  Currently only the file extension `.json` is supported.  Support for more file extensions will be added very soon.**
   
   
> This following part of the documentation has not been updated yet to reflect support for profiles but it will be updated soon.   
> 

### Parameters: name


```JavaScript
cost Config = require('@geek/config');
const config = new Config({ name: 'myapp' });
```

* `process.env variables` *(if exists)*

> Loaded objects fromm all the manually entered filenames:

* `files`  *(from parameter )*



> One of the following:

* `myapp.user.json5` *(if exists)*
* `myapp.user.yaml` *(if exists)*
* `myapp.user.yml` *(if exists)*
* `myapp.user.json` *(if exists)*

> One of the following:

* `myapp.project.json5` *(if exists)*
* `myapp.project.yaml` *(if exists)*
* `myapp.project.yml` *(if exists)*
* `myapp.project.json` *(if exists)*

> One of the following:

* `~/.myapp/global.json5` *(if exists)*
* `~/.myapp/global.yaml` *(if exists)*
* `~/.myapp/global.yml` *(if exists)*
* `~/.myapp/global.json` *(if exists)*

> One of the following:

* `~/.myapp/system.json5` *(if exists)*
* `~/.myapp/system.yaml` *(if exists)*
* `~/.myapp/system.yml` *(if exists)*
* `~/.myapp/system.json` *(if exists)*

### Parameters: `name, overrides, defaults` 


```JavaScript
cost Config = require('@geek/config');
const config = new Config({ name: 'myapp', overrides: { variable2: 'overrides' }, defaults: variable9: 'defaults' });
```

* `process.env variables` *(if exists)*
* `overrides` (from parameter)

> Loaded objects fromm all the manually entered filenames:

* `files`  *(from parameter )*

> One of the following:

* `myapp.user.json5` *(if exists)*
* `myapp.user.yaml` *(if exists)*
* `myapp.user.yml` *(if exists)*
* `myapp.user.json` *(if exists)*

> One of the following:

* `myapp.project.json5` *(if exists)*
* `myapp.project.yaml` *(if exists)*
* `myapp.project.yml` *(if exists)*
* `myapp.project.json` *(if exists)*

> One of the following:

* `~/.myapp/global.json5` *(if exists)*
* `~/.myapp/global.yaml` *(if exists)*
* `~/.myapp/global.yml` *(if exists)*
* `~/.myapp/global.json` *(if exists)*

> One of the following:

* `~/.myapp/system.json5` *(if exists)*
* `~/.myapp/system.yaml` *(if exists)*
* `~/.myapp/system.yml` *(if exists)*
* `~/.myapp/system.json` *(if exists)*


> default values

* `defaults` (from parameter)




### No parameters are passed in


- process.env 
- manual overrides
- myapp.user.json
- myapp.project.json
- myapp.global.json
- default values


> if passed in environment only:  `--profile dev`

- process.env 
- manual overrides
- myapp.dev.user.json
- myapp.user.json
- myapp.dev.project.json
- myapp.project.json
- myapp.dev.global.json
- myapp.global.json
- default values

> if passed in:  `--local-only`

- process.env 
- manual overrides
- myapp.dev.user.json
- myapp.user.json
- myapp.dev.project.json
- myapp.project.json
- default values
  

> if passed in specific config file:  `--config mytest.json`   (with no environment specified)

- process.env 
- manual overrides
- mytest.json
- myapp.user.json
- myapp.project.json
- myapp.global.json
- default values

> if passed in specific config file:  `--config mytest.json   --profile dev`

- process.env 
- manual overrides
- mytest.json
- myapp.dev.user.json
- myapp.user.json
- myapp.dev.project.json
- myapp.project.json
- myapp.dev.global.json
- myapp.global.json
- default values

> if passed in:  `--only mytest.json`

- process.env 
- manual overrides
- mytest.json
- default values


## 📚Learn More

- 


## 📣 Feedback

Have an idea or a comment?  [Join in the conversation here](https://github.com/brentonhouse/geek-config/issues)! 
