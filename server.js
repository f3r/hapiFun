var Hapi = require('hapi');
var Good = require('good');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({port: 3000 });

// Add the route
server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    reply('hello world');
  }
});

// Adding a second route
server.route({
  method: 'GET',
  path: '/{name}',
  handler: function (request, reply) {
    reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
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
