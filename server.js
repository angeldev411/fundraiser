var exec = require('child_process').exec;

var child = exec('npm run server:start', // command line argument directly in string
  function (error, stdout, stderr) {      // one easy function to capture data/errors
    console.log('stdout: ' + stdout);
    console.error('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
      process.exit();
    }
});
