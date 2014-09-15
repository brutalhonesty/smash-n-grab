var colors = require('colors');
var nano = require('nano')('http://localhost:5984');
db = nano.use('smash_n_grab');
// _deleted
db.view('smash_n_grab', 'all', {reduce: false}, function (error, reply) {
  if(error) {
    return console.log(error);
  }
  var codeDocs = [];
  for (var i = 0; i < reply.rows.length; i++) {
    var code = reply.rows[i].value;
    code._deleted = true;
    codeDocs.push(code);
  }
  db.bulk({docs: codeDocs}, function (error, reply) {
    if(error) {
      return console.log(error);
    }
    console.log(reply);
    console.log('All codes deleted.'.green);
  });
});