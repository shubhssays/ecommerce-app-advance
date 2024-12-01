const express = require('express')
const router = express.Router();
const ProductController = require('../controllers/products.controller');
const routeHandler = require('../handlers/route.handler');
const schemaValidator = require('../middlewares/schemaValidators');
const { createProductSchema, updateProductSchema, getProductsSchema, getProductDetailsSchema, deleteProductSchema } = require('../schemas/product.schemas');

router.post('/', schemaValidator(createProductSchema), routeHandler(ProductController.addProductHandler));
router.get('/', schemaValidator(getProductsSchema), routeHandler(ProductController.getProductHandler));
router.put('/', schemaValidator(updateProductSchema), routeHandler(ProductController.updateProductHandler));
router.get('/:product_id', schemaValidator(getProductDetailsSchema), routeHandler(ProductController.getProductDetailsHandler));
router.delete('/:product_id', schemaValidator(deleteProductSchema), routeHandler(ProductController.deleteProductHandler));

module.exports = router;