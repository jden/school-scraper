var db = require('./db')
var charybdis = require('charybdis')
var _ = require('funderscore')

// db.get('005').then(function (s) {
//   console.log(s.streets['YOGI LANE'])
// })

function getSchoolsForAddress(addressStr) {
  console.log('getting schools for ', addressStr)
  var schools = []

  var address = splitAddress(addressStr)

  return db.createValueStream({start: '000', end: '999'})
    .pipe(charybdis(function (school) {
      
      if (_.some(school.streets, function (street, streetName) {
        return address.street == streetName &&
          addressInRanges(address, street.ranges)
      })) {
        schools.push({
          id: school.id,
          name: school.name
        })
      }

    }))
    .then(function () {
      return schools
    })

}

function addressInRanges(address, ranges) {
  var even = address.number % 2 === 0
  return ranges.some(function (range) {
    return range.even === even &&
      address.number >= range.low &&
      address.number <= range.high
  })
}

function splitAddress(address) {
  var number = address.substr(0, address.indexOf(' '))
  var street = address.substr(address.indexOf(' ')+1)
  return {
    original: address,
    number: parseInt(number),
    street: street
  }
}

getSchoolsForAddress('1492 YOGI LANE')
  .then(console.log)