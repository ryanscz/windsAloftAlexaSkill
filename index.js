const _ = require('lodash')
const axios = require('axios')
const cheerio = require('cheerio')
const { trim } = require('underscore.string')
const airportCodes = require('./airportCodes')

const fetchPage = async (airportCode = 'PWM') => {
  const url = `http://www.pcprg.com/cgi-bin/windsaloft.cgi?station1=${airportCode}&temps=on`
  const { data } = await axios.get(url)
  return data
}

const scrapePage = (markup) => {
  const $ = cheerio.load(markup)
  const data = []
  $('tbody tr').each(function (index, el) {
    const altitude = Number($(this).find('td').eq(0).text())
    if (_.isNaN(altitude)) return

    const imageUrl = $(this).find('td').eq(1).find('img').attr('src')
    const windDirection = Number(`${imageUrl.replace(/.+(\d.)+\..+/gim, "$1")}0`)
    const speed = $(this).find('td').eq(2).text()
    const temp = trim($(this).find('td').eq(3).text()).split(' ')[2]

    data.push({
      altitude,
      windDirection,
      speed: Number(speed.split('Knots')[1].split(' ')[0]),
      temp: _.isNaN(Number(temp)) ? 'N/A' : Number(temp)
    })
  })

  return _.reverse(_.sortBy(data, 'altitude'))
}

fetchPage()
  .then(scrapePage)
  .then(console.log)
