const http = require('http');

http.get('http://localhost:3001/api/users', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const users = JSON.parse(data).data;
    if (users.length > 0) {
      const u1 = users[0];
      
      http.get(`http://localhost:3001/api/posts/saved?viewerId=${u1.id}`, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          console.log(`Saved posts for ${u1.username}:`, data2);
        });
      });
    }
  });
});
