const http = require('http');

http.get('http://localhost:3001/api/users?viewerId=Alice', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('GET users response:', data.substring(0, 500));
  });
});
