// Test transaction API to see date format
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/transactions',
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
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.length > 0) {
        console.log('Sample transaction:');
        console.log(JSON.stringify(jsonData[0], null, 2));
        console.log('\nDate field type:', typeof jsonData[0].date);
        console.log('Date field value:', jsonData[0].date);
        
        // Test date parsing
        try {
          const testDate = new Date(jsonData[0].date);
          console.log('Parsed date:', testDate);
          console.log('Is valid date:', !isNaN(testDate.getTime()));
          console.log('toLocaleDateString():', testDate.toLocaleDateString());
        } catch (e) {
          console.log('Date parsing error:', e.message);
        }
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Raw response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
