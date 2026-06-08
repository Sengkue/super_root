const https = require('https');

const url = 'https://www.facebook.com/share/v/1B9i1SDw3f/';

https.get(url, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  if (res.headers.location) {
    console.log('Redirects to:', res.headers.location);
  } else {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // Try to find og:url
      const match = data.match(/<meta property="og:url" content="([^"]+)"/);
      if (match) {
        console.log('Found og:url:', match[1]);
      } else {
        console.log('No redirect and no og:url found');
      }
    });
  }
}).on('error', (e) => {
  console.error(e);
});
