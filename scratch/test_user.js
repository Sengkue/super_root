const http = require('http');

http.get('http://localhost:3001/api/users', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const response = JSON.parse(data);
    const users = response.data;
    if (users.length >= 2) {
      const u1 = users[0];
      const u2 = users[1];
      console.log(`Will test GET user for ${u2.username} as viewer ${u1.username}`);
      
      http.get(`http://localhost:3001/api/users/${u2.id}?viewerId=${u1.id}`, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          console.log('GET user response:', data2);
        });
      });
    }
  });
});
