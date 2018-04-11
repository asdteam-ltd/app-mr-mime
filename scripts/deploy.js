const { host, username, password, port } = process.env;
const path = require('path');
const colors = require('colors');
const uniq = require('lodash/uniq');
const Client = require('ssh2-sftp-client');

const { putDir, progress, done, error, finish } = require('./helpers');

const sftp = new Client();

const remotePath = '/data/app.mrmime'; // Remote path

console.log('\x1Bc');
console.log(colors.green('____________________________'));
console.log('');
console.log(' H O S T:         '.bgGreen.black, host.cyan);
console.log(' P O R T:         '.bgGreen.black, `${port}`.cyan);
console.log(' U S E R N A M E: '.bgGreen.black, username.cyan);
console.log(' P A S S W O R D: '.bgGreen.black, password.cyan);
console.log(colors.green('____________________________'));

sftp.connect({ host, port, username, password })
  .then(() => progress(' Updating "index.html"... '))
  .then(() => sftp.delete(`${remotePath}/index.html`))
  .catch(() => console.log(`${remotePath}/index.html - already deleted.`.yellow))
  .then(() => sftp.put(path.join(__dirname, '../dist/index.html'), `${remotePath}/index.html`))
  .then(done)

  .then(() => progress(' Updating "service-worker.js"... '))
  .then(() => sftp.delete(`${remotePath}/service-worker.js`))
  .catch(() => console.log(`${remotePath}/service-worker.js - already deleted.`.yellow))
  .then(() => sftp.put(path.join(__dirname, '../dist/service-worker.js'), `${remotePath}/service-worker.json`))
  .then(done)

  .then(() => progress(' Updating "manifest.json"... '))
  .then(() => sftp.delete(`${remotePath}/manifest.json`))
  .catch(() => console.log(`${remotePath}/manifest.json - already deleted.`.yellow))
  .then(() => sftp.put(path.join(__dirname, '../dist/manifest.json'), `${remotePath}/manifest.json`))
  .then(done)

  .then(() => progress(' Updating "images" folder... '))
  .then(() => sftp.rmdir(`${remotePath}/images`, true))
  .catch(() => console.log(' "images" folder already removed. '))
  .then(() => sftp.mkdir(`${remotePath}/images`))
  .then(() => putDir(path.join(__dirname, '../dist/images'), `${remotePath}/images`, sftp))
  .then(done)

  .then(() => progress(' Updating "css" folder... '))
  .then(() => sftp.rmdir(`${remotePath}/css`, true))
  .catch(() => console.log(' "css" folder already removed '))
  .then(() => sftp.mkdir(`${remotePath}/css`))
  .then(() => putDir(path.join(__dirname, '../dist/css'), `${remotePath}/css`, sftp))
  .then(done)

  .then(() => progress(' Updating "components" folder... '))
  .then(() => sftp.rmdir(`${remotePath}/components`, true))
  .catch(() => console.log(' "components" folder already removed '))
  .then(() => sftp.mkdir(`${remotePath}/components`))
  .then(() => putDir(path.join(__dirname, '../dist/components'), `${remotePath}/components`, sftp))
  .then(done)

  .then(() => progress(' Updating "fonts" folder... '))
  .then(() => sftp.rmdir(`${remotePath}/fonts`, true))
  .catch(() => console.log(' "fonts" folder already removed '))
  .then(() => sftp.mkdir(`${remotePath}/fonts`))
  .then(() => putDir(path.join(__dirname, '../dist/fonts'), `${remotePath}/fonts`, sftp))
  .then(done)

  .then(() => progress(' Updating "js" folder... '))
  .then(() => sftp.rmdir(`${remotePath}/js`, true))
  .catch(() => console.log(' "js" folder already removed '))
  .then(() => sftp.mkdir(`${remotePath}/js`))
  .then(() => putDir(path.join(__dirname, '../dist/js'), `${remotePath}/js`, sftp))
  .then(done)

  .then(finish)
  .then(sftp.end)
  .catch((err) => {
    error();
    console.log('Error: ', err);
    sftp.end();
  });
