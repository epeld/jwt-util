const fs = require('fs');
const jwt = require('jsonwebtoken');
const c = require('crypto');

if (process.argv.length < 4) {
  console.log('Usage: jwt <content> <PEM> [<options>]');
  console.log('Here, <content> can be');
  console.log('- Either a JSON-encoded string');
  console.log('- OR a filename prefixed with "file:". E.g "file:~/hello.json"');
} else {
  let content = process.argv[2];
  let pem = process.argv[3];
  let options = process.argv[4];
  // console.log(content, pem);
  let secret;
  if (content.startsWith('file:')) {
    content = fs.readFileSync(content.split(':')[1]);
  }
  try {
    content = JSON.parse(content);
  } catch(e) {
    console.error(`Invalid json: ${content}`);
    console.error(e);
  }

  if (pem.startsWith('file:')) {
    const key = fs.readFileSync(pem.split(':')[1], 'utf8');
    const passphrase = pem.split(':')[2];
    secret = c.createPrivateKey({key, passphrase});
  } else {
    secret = pem;
  }
  
  if (options) {
    if (options.startsWith('file:')) {
      options = fs.readFileSync(options.split(':')[1]);
    }
    try {
      options = JSON.parse(options);
    } catch(e) {
      console.error(`Invalid json: ${options}`);
      console.error(e);
    }
  }
  Object.assign(options, {
    algorithm: "RS256",
  }, options);
  console.log(jwt.sign(content, secret, options));
}
