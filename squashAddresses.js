var db = require('./db')
var charybdis = require('charybdis')

db.createValueStream({start:'000', end: 'ZZZ'})
  .pipe(charybdis(function (school) {
   if (!school.addresses) {
    console.warn('no addresses for', school.id, school.name)
    return
   } 
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
    .then(function () {
      console.log('processed ', school.name)
    })

}))
.then(function () {
  console.log('done')
})
.catch(console.error)