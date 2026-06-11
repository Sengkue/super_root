const axios = require('axios');

async function checkBody() {
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  app.put('/test', (req, res) => {
    console.log('Body received:', req.body);
    res.json(req.body);
  });
  
  const server = app.listen(3002, async () => {
    // we'll run useApi through a simulated nuxt context next, or just look at useApi
    console.log('Listening');
    server.close();
  });
}
checkBody();
