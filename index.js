const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const boom = require('@hapi/boom')
const debug = require('debug')('app:server')
const helmet = require('helmet')
const productsRouter = require('./routes/views/products')
const productsApiRouter = require('./routes/api/products')
const authApiRouter = require('./routes/api/auth')

const {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
} = require('./utils/middlewares/errorsHandlers')

const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi')

//App
const app = express()

//Middlewares
app.use(helmet())
app.use(bodyParser.json())

//Static Files
app.use("/static", express.static(path.join(__dirname, 'public')))

//View engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//Routes
app.use('/products', productsRouter)
productsApiRouter(app)
app.use('/api/auth', authApiRouter)

//Redirect
app.get('/', function (req, res) {
    res.redirect('/products')
})

app.use(function (req, res, next) {
    if (isRequestAjaxOrApi(req)) {
        const { output: { statusCode, payload } } = boom.notFound()
        res.status(statusCode).json(payload)
    }
    res.status(404).render("404")
})

//error handlers
app.use(logErrors)
app.use(wrapErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

//Server
const server = app.listen(8000, () => {
    debug(`Listening on port http://localhost:${server.address().port}`)
})