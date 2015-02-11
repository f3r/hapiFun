// https://coderwall.com/p/-h1h1w/how-to-use-jslint-in-node-js-projects-properly
/* jslint node: true */
"use strict";

/*
 * Server configuration can be found at:
 *  http://hapijs.com/api
 *
 * http://nodemon.io
 *   Nodemon is a utility that will monitor for any changes in your source
 *   and automatically restart your server
 *
 *     $ npm install -g nodemon
 *     $ nodemon server.js
 */

// https://github.com/wycats/handlebars.js/
// npm install --save handlebars
var Handlebars  = require('handlebars');
var Path = require('path');
var Hapi = require('hapi');
var Good = require('good');
var Util = require('util');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({port: 3000 });

// Configure templating engine
// http://hapijs.com/tutorials/views
server.views({
  engines: {
    // register handlebars module for .html templates
    html: Handlebars.create()
  },
  path: './views',
  layout: true,
  layoutPath:   './views/layouts',
  partialsPath: './views/partials',
  helpersPath:  './views/helpers',
});

// http://hapijs.com/tutorials/routing
server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    // http://hapijs.com/api#request-properties    
    console.log(Util.inspect(request, {colors: true, depth: 1}));

    reply.view('index', {body: "yeah"});
  }
});

server.route({
  // GET | POST | PUT | PATCH | DELETE etc
  method: 'GET',
  
  // named parameters, max one per segments
  // Can access params with (request.params)
  // can have optional 'hi/{optional?}', 
  // Can have multiple segments 
  // - /hi/{user*2} will match ==> /hi/fer/martin
  // - /hi/{user*}  will match ==> /hi/a/b/c/d/e (only last route param)
  path: '/hi/{name}', 
  
  // http://hapijs.com/api#request-properties
  handler: function (request, reply) {
    reply('Waddup, ' + encodeURIComponent(request.params.name) + '!');
  }
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      args:[{ log: '*', response: '*' }]
    }]
  }
}, function (err) {
  if (err) {
    throw err;
  }

  // Start the server
  server.start(function () {
    server.log('info', 'Server running at: '+ server.info.uri);
  });
});
