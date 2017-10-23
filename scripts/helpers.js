const recursive = require('recursive-readdir');
const uniq = require('lodash/uniq');
const colors = require('colors');

const progress = (text) => console.log(text.bgYellow.black);

const done = () => {
  console.log('Done'.bgGreen.black);
  console.log('');
}

const error = () => {
  console.log(' E R R O R '.bgRed.white);
  console.log('');
}

const finish = () => {
  console.log('');
  console.log(' F I N I S H '.bgGreen.black);
  console.log('');
}

const dirRegExp = /\/(.*\/|)(.*)$/g;
const putDir = (localDir, remoteDir, sftp) =>
  new Promise((resolve, reject) => {
    progress(` Transferring ${localDir.white} ${'into'.black} ${remoteDir.white} `);
    recursive(localDir, ['.DS_Store'])
      .then(files =>
        files.map(file => file.replace(localDir, ''))
      )
      .then(files =>
        files.map(file => file.replace(dirRegExp, `$1`))
      )
      .then(dirs => dirs.filter(dir => dir))
      .then(dirs => uniq(dirs))
      .then(dirs =>
        Promise.all(
          dirs.map(dir => sftp.mkdir(`${remoteDir}/${dir}`, true))
        )
      )
      .then(() =>
        recursive(localDir, ['.DS_Store'])
      )
      .then(files =>
        files.map(file => file.replace(localDir, ''))
      )
      .then(files =>
        files.map(file => file.replace(dirRegExp, `$1`) + file.replace(dirRegExp, `$2`))
      )
      .then(files =>
        Promise.all(
          files.map(file => {
            progress(` ${file} `);
            return sftp.put(`${localDir}/${file}`, `${remoteDir}/${file}`)
          })
        )
      )
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject(Error(err));
      })
  });


module.exports = { putDir, progress, done, error, finish };
