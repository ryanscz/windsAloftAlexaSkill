const _ = require('lodash')
const Alexa = require('ask-sdk-core')
const { getPhrase } = require('./api')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
  },
  handle(handlerInput) {
    const speechText = 'To get a winds aloft report, you can say the name of a drop zone'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Winds Aloft', speechText)
      .getResponse()
  },
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
  },
  handle(handlerInput) {
    const speechText = 'You can say "ask winds aloft about skydive new england," for example'

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Winds Aloft', speechText)
      .getResponse()
  },
}

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!'

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Winds Aloft', speechText)
      .getResponse()
  },
}

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`)

    return handlerInput.responseBuilder.getResponse()
  },
}

const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`)

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse()
  },
}

const WindReportHandler = {
  canHandle (input) {
    return input.requestEnvelope.request.type === 'IntentRequest'
    && input.requestEnvelope.request.intent.name === 'WindsIntent'
  },
  async handle (input) {
    const dropzone = _.get(input, 'requestEnvelope.request.intent.slots.dropZone.value')

    try {
      let phrase = await getPhrase(dropzone)
      console.log('phrase', phrase)
      return input.responseBuilder
        .speak(phrase)
        .withSimpleCard('Winds Aloft Report', phrase)
        .getResponse()
    } catch (err) {
      console.log('async error', err.message)
    }
  }
}

const skillBuilder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    WindReportHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
