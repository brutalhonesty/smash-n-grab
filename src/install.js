var colors = require('colors');
var nano = require('nano')('http://localhost:5984');

var codeView = {views: {"all": {"map": "function(doc) {emit(null, doc)}"}, "reduce": "_count"}};

nano.db.create('smash_n_grab', function (error, reply) {
  if(error && error.status_code !== 412) {
    return console.log(error);
  }
  db = nano.use('smash_n_grab');
  db.insert(codeView, '_design/smash_n_grab', function (error) {
    // 409 is Document update conflict.
    if(error && error.status_code !== 409) {
      console.log('Error creating database view.'.red);
      return console.log(error);
    }
    console.log('DB Installation successful.'.green);
  });
});