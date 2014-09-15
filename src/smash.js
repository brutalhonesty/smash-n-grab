var rereddit = require('rereddit');
var nodemailer = require('nodemailer');
var cheerio = require('cheerio');
var moment = require('moment');
var EMAIL_USER = process.env.EMAIL_USER || null;
var FROM_EMAIL = process.env.FROM_EMAIL || null;
var TO_EMAIL = process.env.TO_EMAIL || null;
var EMAIL_PASS = process.env.EMAIL_PASS || null;
var nano = require('nano')('http://localhost:5984');
db = nano.use('smash_n_grab');

var grab = function(callback) {
    rereddit.read('nintendo').end(function (err, nintendoPosts) {
      if(err) {
        return callback(err);
      }
      rereddit.read('smashbros').end(function (err, smashPosts) {
        var posts = nintendoPosts.data.children.concat(smashPosts.data.children);
        parsePosts(posts, function (error, codes) {
          if(error) {
            return callback(error);
          }
          checkCodes(codes, function (err, newCodes) {
            if(err) {
              return callback(err);
            }
            if(newCodes.length > 0) {
              addCodes(newCodes, function (err, reply) {
                if(err) {
                  return callback(err);
                }
                createCodeBody(newCodes, function (error, emailBody) {
                  if(error) {
                    return callback(error);
                  }
                  email(emailBody, function (error, response) {
                    if(error) {
                      return callback(error);
                    }
                    return callback(null, response);
                  });
                });
              });
            } else {
              return callback('No new codes. :(');
            }
          });
        });
      });
    });
};

var email = function(emailBody, callback) {
  if(!EMAIL_USER || !EMAIL_PASS) {
    return callback('Missing email username and password from environment variables.');
  }
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS
      }
  });
  if(!FROM_EMAIL || !TO_EMAIL) {
    return callback('Missing to and from emails from environment variables');
  }
  var mailOptions = {
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: 'Super Smash Brothers 3DS Code Updates ✔',
      html: emailBody
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return callback(error);
      }
      return callback(null, info.response);
  });
};

var createCodeBody = function(codes, callback) {
  var $ = cheerio.load('<table></table>');
  $('table').append('<tr><th>Code</th><th>Date/Time</th></tr>');
  for(var i = 0; i < codes.length; i++) {
    var fromNowStr = moment(codes[i].milli).fromNow();
    $('table').append('<tr><td>'+ codes[i].code + '</td><td>' + fromNowStr + '</td></tr>')
  }
  return callback(null, $.html());
};

var checkCodes = function(codes, callback) {
  db.view('smash_n_grab', 'all', {reduce: false}, function (error, reply) {
    if(error) {
      return callback(error);
    }
    var existingCodes = reply.rows;
    for(var i = 0; i < existingCodes.length; i++) {
      for(var j = 0; j < codes.length; j++) {
        if(existingCodes[i].value.code === codes[j].code) {
          codes.splice(j, 1);
        }
       }
    }
    return callback(null, codes);
  });
};

var addCodes = function (codes, callback) {
  db.bulk({docs: codes}, function (error, reply) {
    if(error) {
      return callback(error);
    }
    return callback(null, reply);
  });
};

var parsePosts =  function (unparsedPosts, callback) {
  var codes = [];
  for (var unparsedIndex = 0; unparsedIndex < unparsedPosts.length; unparsedIndex++) {
    if(unparsedPosts[unparsedIndex].kind === 't3') {
      var codeIndex = unparsedPosts[unparsedIndex].data.selftext.indexOf('A05V');
      if(codeIndex !== -1) {
        var code = unparsedPosts[unparsedIndex].data.selftext.slice(codeIndex, codeIndex + 16).replace(/ /g, '');
        var postId = unparsedPosts[unparsedIndex].data.id;
        var createdEpoch = unparsedPosts[unparsedIndex].data.created_utc;
        var createdDate = new Date(createdEpoch*1000).toString();
        codes.push({redditId: postId, code: code, _id: code, epoch: createdEpoch, date: createdDate, milli: createdEpoch * 1000});
      }
    }
  }
  return callback(null, codes);
};

module.exports = {
  grab: grab
};