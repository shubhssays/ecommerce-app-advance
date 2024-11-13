const express = require('express')
const router = express.Router();

const InventoryController = require('../controllers/inventory.controller');
const routeHandler = require('../handlers/route.handler');
const schemaValidator = require('../middlewares/schemaValidators');
const { addProductToInventorySchema, updateProductToInventorySchema, getProductInventoryDetailsSchema, deleteProductInventoryDetailsSchema, findProductInInventoryDetailsSchema } = require('../schemas/inventory.schemas');

router.post('/', schemaValidator(addProductToInventorySchema), routeHandler(InventoryController.addProductToInventoryHandler));
router.put('/', schemaValidator(updateProductToInventorySchema), routeHandler(InventoryController.updateProductInInventoryHandler));
router.get('/:product_id', schemaValidator(getProductInventoryDetailsSchema), routeHandler(InventoryController.getProductDetailsHandler));
router.get('/product/:product_id', schemaValidator(findProductInInventoryDetailsSchema), routeHandler(InventoryController.findProductDetailsHandler));
router.delete('/:product_id', schemaValidator(deleteProductInventoryDetailsSchema), routeHandler(InventoryController.deleteProductFromInventoryHandler));

module.exports = router;