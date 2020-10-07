const express = require('express')
const passport = require('passport')
const ProductsService = require('../../services/products')
const { productIdSchema, productTagSchema, createProductSchema,
    updateProductSchema } = require('../../utils/schemas/products')

const validation = require('../../utils/middlewares/validationHandler')

//JWT Strategy
require('../../utils/auth/strategies/jwt')

const cacheResponse = require('../../utils/cacheResponse')
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time')


function productsApi(app) {
    const router = express.Router()
    app.use('/api/products', router)

    const productsService = new ProductsService()

    router.get('/', async function (req, res, next) {
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
        const { tags } = req.query
        try {
            const products = await productsService.getProducts({ tags })
            res.status(200).json({
                data: products,
                message: 'products listed'
            })
        } catch (err) {
            next(err)
        }
    })

    router.get('/:productId', async function (req, res, next) {
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
        const { productId } = req.params
        try {
            const product = await productsService.getProduct({ productId })

            res.status(200).json({
                data: product,
                message: 'product retrieved'
            })
        } catch (err) {
            next(err)
        }
    })

    router.post('/', validation(createProductSchema), async function (req, res, next) {
        const { body: product } = req
        try {
            const createdProduct = await productsService.createProduct({ product })
            res.status(201).json({
                data: createdProduct,
                message: 'products created'
            })
        } catch (err) {
            next(err)
        }
    })

    router.put('/:productId',
        passport.authenticate('jwt', { session: false }),
        validation({ productId: productIdSchema }, "params"),
        validation(updateProductSchema),
        async function (req, res, next) {
            const { productId } = req.params
            const { body: product } = req
            try {
                const updatedProduct = await productsService.updateProduct({ productId, product })

                res.status(200).json({
                    data: updatedProduct,
                    message: 'products updated'
                })
            } catch (err) {
                next(err)
            }
        })

    router.delete('/:productId',
        passport.authenticate('jwt', { session: false }),
        async function (req, res, next) {
            const { productId } = req.params
            try {
                const product = await productsService.deleteProduct({ productId })

                res.status(200).json({
                    data: product,
                    message: 'products deleted'
                })
            } catch (err) {
                next(err)
            }
        })
}

module.exports = productsApi