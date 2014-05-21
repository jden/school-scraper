var level = require('level')
var levelPromise = require('level-promise')
var sublevel = require('sublevel')

var db = level('./db/bigdata', {
  createIfMissing: true,
  valueEncoding: 'json'
})

// db.createKeyStream().on('data', console.log.bind(console,'k'))

module.exports = levelPromise(sublevel(db, 'schools'))
