# @geek/config

[![@geek/config](https://img.shields.io/npm/v/@geek/config.png)](https://www.npmjs.com/package/@geek/config)

> Geek Configuration Manager for Node.js - The complete solution for managing config settings for your Node.js application



## 🚀 Getting Started

### Install

> Install `@geek/config`

```bash
$ npm install @geek/config
```


## Priority of config files


| priority 	| source 	| example  	|   location	|
|:-:	|:-:	|:-:	|:-:	|
| 1.  	| **process.env**  	| `MYAPP_PROPERTY1="environment-value" ` 		| environment variable  	|
| 2.  	| **overrides**  	| `{ "property1": "override-value" }`	| parameter: `overrides`  	|
| 3.  	| **user environment config file**  	| `myapp.dev.user.json`    	| *project directory*  	|
| 4.  	| **user config file**  	| `myapp.user.json`  	|   *project directory*  	|
| 5.  	| **project environment config file**  	| `myapp.dev.project.json`  	| *project directory*  	|
| 6.  	| **project config file**  	| `myapp.project.json`  	| *project directory*  	|
| 7.  	| **global environment config fil**e  	| `myapp.dev.global.json`  		| *home config directory*  	|
| 8.  	| **global config file**  	| `myapp.global.json`  		| *home config directory*  	|
| 9.  	| **default values**  	|  `{ "property1": "default-value" }`	  	| parameter: `defaults`  	|

## Examples


> if no parameters are passed in

- process.env 
- manual overrides
- myapp.user.json
- myapp.project.json
- myapp.global.json
- default values


> if passed in environment only:  `--environment dev`

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

> if passed in specific config file:  `--config mytest.json   --environment dev`

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
