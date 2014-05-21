var db = require('./db')

db.createKeyStream()
  .on('data', function (data) {
    console.log(data)
  })