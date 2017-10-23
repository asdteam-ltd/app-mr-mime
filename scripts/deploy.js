const { host, username, password, port } = require('../ssh-config');
const path = require('path');
const colors = require('colors');
const uniq = require('lodash/uniq');
const Client = require('ssh2-sftp-client');

const { putDir, progress, done, error, finish } = require('./helpers');

const sftp = new Client();

const remotePath = '/var/public/app.mrmime'; // Remote path

console.log('\x1Bc');
console.log(colors.green('____________________________'));
console.log('');
console.log(' H O S T:         '.bgGreen.black, host.cyan);
console.log(' P O R T:         '.bgGreen.black, `${port}`.cyan);
console.log(' U S E R N A M E: '.bgGreen.black, username.cyan);
console.log(' P A S S W O R D: '.bgGreen.black, password.cyan);
console.log(colors.green('____________________________'));

sftp.connect({ host, port, username, password })
  .then(() => {
    progress(' Updating "index.html"... ');
    return sftp.delete(`${remotePath}/index.html`)
  })
  .catch(() => console.log(`${remotePath}/index.html - already deleted.`.yellow))
  .then(() => sftp.put(path.join(__dirname, '../dist/index.html'), `${remotePath}/index.html`))
  .then(() => {
    progress(' Updating "service-worker.js"... ');
    return sftp.delete(`${remotePath}/service-worker.js`)
  })
  .catch(() => console.log(`${remotePath}/service-worker.js - already deleted.`.yellow))
  .then(() => sftp.put(path.join(__dirname, '../dist/service-worker.js'), `${remotePath}/service-worker.json`))
  .then(() => {
    progress(' Updating "manifest.json"... ');
    return sftp.delete(`${remotePath}/manifest.json`)
  })
  .catch(() => console.log(`${remotePath}/manifest.json - already deleted.`.yellow))
  .then(() => sftp.put(path.join(__dirname, '../dist/manifest.json'), `${remotePath}/manifest.json`))
  .then(() => {
    done();
    progress(' Updating "images" folder... ')
    return sftp.rmdir(`${remotePath}/images`, true);
  })
  .catch(() => console.log(' "images" folder already removed. '))
  .then(() => {
    return sftp.mkdir(`${remotePath}/images`);
  })
  .then(() => {
    return putDir(path.join(__dirname, '../dist/images'), `${remotePath}/images`, sftp);
  })
  .then(() => {
    done();
    progress(' Updating "css" folder... ');
    return sftp.rmdir(`${remotePath}/css`, true);
  })
  .catch(() => console.log(' "css" folder already removed '))
  .then(() => {
    return sftp.mkdir(`${remotePath}/css`);
  })
  .then(() => {
    return putDir(path.join(__dirname, '../dist/css'), `${remotePath}/css`, sftp);
  })
  .then(() => {
    done();
    progress(' Updating "components" folder... ');
    return sftp.rmdir(`${remotePath}/components`, true);
  })
  .catch(() => console.log(' "components" folder already removed '))
  .then(() => {
    return sftp.mkdir(`${remotePath}/components`);
  })
  .then(() => {
    return putDir(path.join(__dirname, '../dist/components'), `${remotePath}/components`, sftp);
  })
  .then(() => {
    done();
    progress(' Updating "fonts" folder... ');
    return sftp.rmdir(`${remotePath}/fonts`, true);
  })
  .catch(() => console.log(' "fonts" folder already removed '))
  .then(() => {
    return sftp.mkdir(`${remotePath}/fonts`);
  })
  .then(() => {
    return putDir(path.join(__dirname, '../dist/fonts'), `${remotePath}/fonts`, sftp);
  })
  .then(() => {
    done();
    progress(' Updating "js" folder... ');
    return sftp.rmdir(`${remotePath}/js`, true);
  })
  .catch(() => console.log(' "js" folder already removed '))
  .then(() => {
    return sftp.mkdir(`${remotePath}/js`);
  })
  .then(() => {
    return putDir(path.join(__dirname, '../dist/js'), `${remotePath}/js`, sftp);
  })
  .then(() => {
    finish();
    sftp.end();
  })
  .catch((err) => {
    error();
    sftp.end();
    console.log('Error: ', err);
  });
