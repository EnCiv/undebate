/*
 * function takes an address in Hartford CT
 * returns a list of offices that are relevant to
 * assembly districts and senatorial districts
 * pertinent to the the given address
 **/
const https = require('https')
const geocodeRootURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' // must be followed by a '+' separated string where + is space
const key = `&key=${process.env.API_KEY}`

export default async function listOffices(address) {
  const query = address.trim().replace(/\s+/g, '+') // removes trailing whitespace and replaces inner spaces with '+'

  console.log(query)

  //const response = await fetch(geocodeRootURL + query + key)
  //console.log(response)

  https
    .get(geocodeRootURL + query + key, resp => {
      let data = ''
      resp.on('data', chunk => {
        data += chunk
      })

      resp.on('end', () => {
        console.log(JSON.parse(data).results[0].geometry)
      })
    })
    .on('error', err => {
      console.log('Error: ' + err)
    })

  // validate the address to check if it meets all the requirements
  // check google maps to get a long + lat coordinate for the address
  // send coordinates in a ballotpedia url get request format ?lat=xx.xxxx&long=xx.xxxx
  // take list of offices and filter for relevant offices.
}
