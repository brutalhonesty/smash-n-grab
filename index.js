var smash = require('./src/smash');

setInterval(function () {
  smash.grab(function (err, emailResponse) {
    if(err) {
      return console.log(err);
    }
    console.log(emailResponse);
  });
}, 6000);