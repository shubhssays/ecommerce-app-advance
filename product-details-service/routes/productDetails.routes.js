const express = require('express')
const router = express.Router();

const ProductDetailsController = require('../controllers/productDetails.controller');
const routeHandler = require('../handlers/route.handler');
const schemaValidator = require('../middlewares/schemaValidators');
const { createProductDetailsSchema, updateProductDetailsSchema, getProductDetailsSchema, deleteProductDetailsSchema, findProductDetailsSchema } = require('../schemas/productDetails.schemas');

router.post('/', schemaValidator(createProductDetailsSchema), routeHandler(ProductDetailsController.addProductDetailsHandler));
router.put('/', schemaValidator(updateProductDetailsSchema), routeHandler(ProductDetailsController.updateProductDetailsHandler));
router.get('/:product_id', schemaValidator(getProductDetailsSchema), routeHandler(ProductDetailsController.getAllProductDetailsHandler));
router.get('/product/:id', schemaValidator(findProductDetailsSchema), routeHandler(ProductDetailsController.findProductDetailsByProductIdHandler));
router.delete('/:product_id', schemaValidator(deleteProductDetailsSchema), routeHandler(ProductDetailsController.deleteProductDetailsHandler));

module.exports = router;