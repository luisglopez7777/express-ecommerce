const boom = require('@hapi/boom')
const debug = require('debug')('app: error')
const { config } = require('../../config')
const isRequestAjaxOrApi = require('../../utils/isRequestAjaxOrApi')

function withErrorStack(err, stack) {
    if (config.dev) {
        return { ...err, stack }
    }
}

function logErrors(err, req, res, next) {
    debug(err.stack)
    next(err)
}

function wrapErrors(err, req, res, next) {
    if (!isBoom) {
        next(boom.badImplementation(err))
    }
    next(err)
}

function clientErrorHandler(err, req, res, next) {
    const { output: { statusCode, payload } } = err
    // catch errors for ajax request or if an error occurs while streaming
    if (isRequestAjaxOrApi(req) || res.headersSent) {
        res.status(statusCode).json(withErrorStack(payload, err.stack))
    } else {
        next(err)
    }
}

function errorHandler(err, req, res, next) {
    const { output: { statusCode, payload } } = err

    res.status(statusCode)
    res.render('error', withErrorStack(payload, err.stack))
}

module.exports = {
    logErrors, wrapErrors, clientErrorHandler, errorHandler
}
