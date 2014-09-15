var smash = require('./src/smash');

smash.grab(function (err, emailResponse) {
  if(err) {
    return console.log(err);
  }
  console.log(emailResponse);
});