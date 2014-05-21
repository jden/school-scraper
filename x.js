var wd = require('selenium-webdriver')
var db = require('./db')

db.get('schools!005').then(function (school) {

  var driver = new wd.Builder()
    .withCapabilities(wd.Capabilities.chrome())
    .build()

  driver.get('http://96.4.230.162/zonefinder/StreetListings.aspx')
  driver.executeScript(selectSchoolById, school.id)

  var schoolData = {
    scraped: Date.now(),
    id: school.id,
    name: school.name,
    addresses: []
  }


  function tick() {
    return driver.executeScript(scrapeSchoolTable).then(function (page) {
      schoolData.addresses = schoolData.addresses.concat(page)
      return driver.executeScript(next).then(function (cont) {
        if (cont) { return tick() }
      })
    })  
  }

  return tick().then(function () {
    driver.quit()

    return db.put(school.id, schoolData)
      .then(function () {
        console.log(schoolData)
        console.log('done')
        process.exit()
      })
  })

})
.catch(function (e) {
  console.error('error:', e)
})




// var schoolNum = parseInt(process.argv[2]) || 0


// minq.connect('mongodb://scraper:scraper@oceanic.mongohq.com:10087/hamcoschools').then(function (db) {








// })



function selectSchoolById(id) {
  var schools = document.getElementById('cboSchool')
  var school = [].slice.call(schools.childNodes).filter(function (e) { return e.nodeType == 1 && e.value == id})[0]
  schools.selectedIndex = school.index
  if (school.index == 0) {
    document.getElementById('btnSubmit').click()
  } else {
    schools.onchange()
  }
}

function scrapeSchoolTable() {
  var rows = [].slice.call(document.querySelectorAll('#dgListing tr.rptText'))
    .map(function (row) {
      var cols = [].slice.call(row.childNodes)
            .filter(function(x) { return x.nodeType == 1});
      return {
        lowOdd: cols[0].textContent,
        highOdd: cols[1].textContent,
        lowEven: cols[2].textContent,
        highEven: cols[3].textContent,
        streetName: cols[4].textContent
      } 
    })
  return rows
}

function next() {
  var nextPage = document.querySelector('#dgListing tr:last-child span + a')
  if (nextPage) { nextPage.click(); return true }
  else { return false }
}
