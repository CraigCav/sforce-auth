var http = require('http'),
    httpProxy = require('http-proxy'),
    url = require('url'),
    express = require('express');

// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({ secure: true });

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = require('http').createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  var endpoint = req.headers['salesforceproxy-endpoint'];
  var target = 'http://localhost:8000';

  if (endpoint) {
    var auth = req.headers['x-authorization'];
    if (auth) req.headers['Authorization'] = auth;
    // http-proxy module uses the url path to generate the path of new outgoing request
    req.url = endpoint;

    // Building the target host url from the endpoint information.
    var targetURL = url.parse(endpoint);
    target = targetURL.protocol + "//" + targetURL.host;
  }

  proxy.web(req, res, { target: target });
});

//
// Listen for the `error` event on `proxy`.
server.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

//
// Listen for the `proxyRes` event on `proxy`.
//
server.on('proxyRes', function (res) {
  console.log('RAW Response from the target', JSON.stringify(res.headers, true, 2));
});

server.listen(process.env.PORT || 9000);
console.log('Listening on port %d', server.address().port);

// Create express application (http://expressjs.com) ###
var app = express();
app.use(express.static(__dirname));

// serve the bower components
app.use(express.static(__dirname + '/../../bower_components'));

// server the components from sforce-auth root
app.use(express.static(__dirname + '/../../'));

// handle the oauth callback url (by serving the same index page we started on)
app.get('/oauth/_callback', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// host the app on port 3000
var appServer = app.listen(3000, function() {
  console.log('Listening on port %d', appServer.address().port);
});