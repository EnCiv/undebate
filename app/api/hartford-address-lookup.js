import getViewersByOffice from '../server/util/get-viewers-by-office'

/*
 * function takes an address in Hartford CT
 * returns a list of offices that are relevant to
 * assembly districts and senatorial districts
 * pertinent to the the given address
 **/
const https = require('https')
const geocodeRootURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' // must be followed by a '+' separated string where + is space
const key = `&key=${process.env.GOOGLE_MAPS_API_KEY}`

const getOfficials = (long, lat, doOnSuccess, address_found) => {
  try {
    https
      .get(`${process.env.ELECTED_OFFICIALS_URL}?long=${long}&lat=${lat}`, resp => {
        let data = ''
        resp.on('data', chunk => {
          data += chunk
        })

        resp.on('end', async () => {
          const success = JSON.parse(data).success
          if (success) {
            const officials = JSON.parse(data).data[0].elected_officials
            const districts = officials.districts

            /*
             * districts is an array of objects
             * format:
             * name: String -> containing district name
             * id: Number
             * type: String -> containing type of district e.g. School District
             * state: 'CT'
             * offices: [{id, name:???,office_holders}]
             * */

            let officeNames = []
            districts.forEach(district => {
              if (
                district.offices &&
                (district.type === 'State Legislative (Upper)' || district.type === 'State Legislative (Lower)')
              ) {
                district.offices.forEach(async office => {
                  officeNames.push({
                    id: office.id,
                    name: office.name,
                    type: district.type,
                  })
                })
              }
            })
            console.log(officeNames, 'oh hey there')
            officeNames.forEach(office => {
              console.log(parseInt(office.name[office.name.length - 1]))
            })
            let viewers = []
            for (let office of officeNames) {
              let viewer = await getViewersByOffice(String(office.id))
              viewers.push(viewer)
            }
            doOnSuccess({ ok: true, address_found, officeNames, viewers })
          } else {
            doOnSuccess({ ok: false, error: JSON.parse(data) })
          }
        })
      })
      .on('error', err => {
        console.log('Error: ' + err)
      })
  } catch (error) {
    console.log(error)
  }
}

export default async function listOffices(address, doOnSuccess) {
  const query = address.trim().replace(/\s+/g, '+') // removes trailing whitespace and replaces inner spaces with '+'

  try {
    https
      .get(geocodeRootURL + query + key, resp => {
        let data = ''
        resp.on('data', chunk => {
          data += chunk
        })
        resp.on('end', () => {
          const jsonData = JSON.parse(data)
          const { status } = jsonData
          console.log(jsonData)
          if (status === 'OK') {
            const geo = jsonData.results[0].geometry
            const address_found = jsonData.results[0].formatted_address
            const lng = geo.location.lng
            const lat = geo.location.lat
            getOfficials(lng, lat, doOnSuccess, address_found)
          } else {
            doOnSuccess({ ok: false, jsonData })
          }
        })
      })
      .on('error', err => {
        console.log('Error: ' + err)
      })
  } catch (error) {
    console.log(error)
  }

  // validate the address to check if it meets all the requirements
  // check google maps to get a long + lat coordinate for the address
  // send coordinates in a ballotpedia url get request format ?lat=xx.xxxx&long=xx.xxxx
  // take list of offices and filter for relevant offices.
}
