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
    const mph = _.round(speed.split('Knots')[1].split(' ')[0])
    const temp = trim($(this).find('td').eq(3).text()).split(' ')[2]

    data.push({
      altitude,
      windDirection,
      speed: _.round(mph),
      temp: _.isNaN(Number(temp)) ? null : _.round(temp)
    })
  })

  return _.reverse(_.sortBy(data, 'altitude'))
}

const phrasify = (data) => {
  const phrase = _.map(data, row => {
    const { altitude, windDirection, speed, temp } = row

    if (_.isNaN(windDirection) || _.isNaN(speed)) {
      return `At ${altitude} feet, it's wicked slow guy.`
    }

    const tempPhrase = temp ? `, and is ${temp} degrees` : ''
    return `At ${altitude} feet, the wind is coming out of ${windDirection} at ${speed} miles per hour${tempPhrase}.`
  })
  return phrase.join(' ')
}

const getPhrase = async (dropzone) => {
  const airportCode = getAirportCode(dropzone)
  const markup = await fetchPage(airportCode)
  const data = await scrapePage(markup)
  return phrasify(data)
}

const getAirportCode = (dropzone) => {
  if (!dropzone) return 'PWM'

  if (dropzone === 'SNE' || dropzone === 'skydive new england') return 'PWM'

  if (dropzone === 'eloy' || dropzone === 'skydive arizona') return 'PHX'

  if (dropzone === 'jumptown' || dropzone === 'jump town') return 'BDL'

  if (dropzone === 'pepperell' || dropzone === 'skydive pepperell') return 'BOS'

  if (dropzone === 'chicago' || dropzone === 'skydive chicago') return 'JOT'

  if (dropzone === 'spaceland' || dropzone === 'skydive spaceland') return 'HOU'

  if (dropzone === 'perris' || dropzone === 'skydive perris') return 'ONT'

  if (dropzone === 'deland' || dropzone === 'skydive deland') return 'MLB'

  if (dropzone === 'ranch' || dropzone === 'skydive the ranch') return 'ALB'

  if (dropzone === 'paraclete' || dropzone === 'skydive paraclete') return 'RDU'
  
}

module.exports = { getPhrase }
