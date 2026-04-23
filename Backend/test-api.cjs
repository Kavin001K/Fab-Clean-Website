const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/send-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`BODY: ${data}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(JSON.stringify({ phone: '8825702072' }));
req.end();

const options2 = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/stores',
  method: 'GET',
};

const req2 = http.request(options2, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`STORES STATUS: ${res.statusCode}`);
    console.log(`STORES BODY: ${data}`);
  });
});
req2.end();
