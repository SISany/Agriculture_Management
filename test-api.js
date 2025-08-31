// Simple test script to check the products API
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/products',
  method: 'GET',
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
    console.log('Status Code:', res.statusCode);
    console.log('Response Headers:', res.headers);
    console.log('Response Data:');
    try {
      const jsonData = JSON.parse(data);
      console.log('Number of products:', jsonData.length);
      if (jsonData.length > 0) {
        console.log('First product:');
        console.log(JSON.stringify(jsonData[0], null, 2));
        console.log('Sample product structure:');
        console.log('Keys:', Object.keys(jsonData[0]));
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
