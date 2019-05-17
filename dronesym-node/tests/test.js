const https = require('http');


try {
  // eslint-disable-next-line no-unused-vars
  const request = https.get({host: '127.0.0.1:3000/feed'}, function(response) {
    Console.log(response.statusCode);
  });
} catch (e) {
  Console.error(e.message);
}
