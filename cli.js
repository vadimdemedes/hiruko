#!/usr/bin/env node
'use strict';

/**
 * Dependencies
 */

const serve = require('koa-static');
const chalk = require('chalk');
const join = require('path').join;
const meow = require('meow');
const koa = require('koa');


/**
 * CLI
 */

const cli = meow(`
	Usage
		$ hiruko [path]
`);


/**
 * Server
 */

const app = koa();
const path = join(process.cwd(), cli.input[0] || '');
const port = process.env.PORT || 3000;
const staticServer = serve(path);

app.use(function * (next) {
	if (/\.[a-z]{2,4}$/.test(this.url)) {
		yield staticServer.call(this, next);
		return;
	}

	this.url = '/';
	yield staticServer.call(this, next);
});

app.listen(port);

console.log(chalk.green('Serving', path, 'on port', port));
