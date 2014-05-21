var db = require('./db')

db.get('005').then(function (school) {
  // console.log(school.addresses.length)

  var streets = school.addresses.reduce(
    function (streets, segment) {
      var name = segment.streetName.trim()
      var street = streets[name] || {ranges:[]}
      street.ranges.push({low: parseInt(segment.lowEven), high: parseInt(segment.highEven), even: true})
      street.ranges.push({low: parseInt(segment.lowOdd), high: parseInt(segment.highOdd), even: false})
      streets[name] = street
      return streets
    }
  , {})

  school.streets = streets

  return db.put(school.id, school)

})
.catch(console.error)