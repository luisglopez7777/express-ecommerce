const express = require('express')
const router = express.Router()
const ProductsService = require('../services/products')

const productsService = new ProductsService()


router.get('/', async function (req, res, next) {
    const { tags } = req.query
    try {
        const products = productsService.getProducts({ tags })
        res.render('products', { products })
    } catch (err) {
        next(err)
    }
})

module.exports = router