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
    const windDirection = Number(`${imageUrl.replace(/.+(\d.)+\..+/gim, '$1')}0`)
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

const windCompass = (windDirection) => {
  if ((windDirection >= 0 && windDirection <= 22.5)||(windDirection > 337.5 && windDirection <= 360)) return 'North';
  if (windDirection > 22.5 && windDirection <= 67.5) return 'North East';
  if (windDirection > 67.5 && windDirection <= 112.5) return 'East';
  if (windDirection > 112.5 && windDirection <= 157.5) return 'South East';
  if (windDirection > 157.5 && windDirection <= 202.5) return 'South';
  if (windDirection > 202.5 && windDirection <= 247.5) return 'South West';
  if (windDirection > 247.5 && windDirection <= 290.5) return 'West';
  if (windDirection > 290.5 && windDirection <= 337.5) return 'North West';
}

const phrasify = (data, airportCode) => {
  const phrase = _.map(data, row => {
    const { altitude, windDirection, speed, temp } = row

    if (_.isNaN(windDirection) || _.isNaN(speed)) {
      return `At ${altitude} feet, it's wicked slow guy.`
    }

    const convertWindDirection = windCompass(windDirection)
    return `At ${altitude} feet, the wind is coming out of the ${convertWindDirection} at ${speed} miles per hour.`
  })

  const dropzone = getDropzoneName(airportCode)
  return `For ${dropzone}: ${phrase.join(' ')}`
}

const getPhrase = async (dropzone) => {
  const airportCode = getAirportCode(dropzone)

  if (!airportCode) {
    return `Sorry, we don't currently support ${dropzone}.`
  }

  const markup = await fetchPage(airportCode)
  const data = await scrapePage(markup)
  return phrasify(data, airportCode)
}

const getAirportCode = (dropzone) => {
  if (!dropzone) return 'PWM'

  dropzone = _.toLower(dropzone)

  if (dropzone === 'SNE' || dropzone === 'skydive new england') return 'PWM'

  if (dropzone === 'eloy' || dropzone === 'skydive arizona') return 'PHX'

  if (dropzone === 'jumptown' || dropzone === 'jump town') return 'BDL'

  if (dropzone === 'pepperell' || dropzone === 'skydive pepperell') return 'BOS'

  if (dropzone === 'chicago' || dropzone === 'skydive chicago') return 'JOT'

  if (dropzone === 'spaceland' || dropzone === 'skydive spaceland') return 'HOU'

  if (dropzone === 'perris' || dropzone === 'skydive perris') return 'ONT'

  if (dropzone === 'deland' || dropzone === 'skydive deland') return 'MLB'

  if (dropzone === 'ranch' || dropzone === 'the ranch' || dropzone === 'skydive the ranch') return 'ALB'

  if (dropzone === 'paraclete' || dropzone === 'skydive paraclete') return 'RDU'

  return undefined
}

const getDropzoneName = (airportCode) => {
  switch (airportCode) {
    case 'PWM': return 'Skydive New England'
    case 'PHX': return 'Skydive Arizona'
    case 'BDL': return 'Jump Town'
    case 'BOS': return 'Skydive Pepperell'
    case 'JOT': return 'Skydive Chicago'
    case 'HOU': return 'Skydive Spaceland'
    case 'ONT': return 'Skydive Perris'
    case 'MLB': return 'Skydive Deland'
    case 'ALB': return 'Skydive the Ranch'
    case 'RDU': return 'Skydive Paraclete'
    default: return undefined
  }
}

module.exports = { getPhrase }
