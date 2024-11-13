const express = require('express')
const router = express.Router();

const InventoryController = require('../controllers/inventory.controller');
const routeHandler = require('../handlers/route.handler');
const schemaValidator = require('../middlewares/schemaValidators');
const { addProductToInventorySchema, updateProductToInventorySchema, getProductInventoryDetailsSchema, deleteProductInventoryDetailsSchema } = require('../schemas/inventory.schemas');

router.post('/', schemaValidator(addProductToInventorySchema), routeHandler(InventoryController.addProductDetailsHandler));
router.put('/', schemaValidator(updateProductToInventorySchema), routeHandler(InventoryController.updateProductDetailsHandler));
router.get('/:product_id', schemaValidator(getProductInventoryDetailsSchema), routeHandler(InventoryController.getAllProductDetailsHandler));
router.delete('/:product_id', schemaValidator(deleteProductInventoryDetailsSchema), routeHandler(InventoryController.deleteProductDetailsHandler));

module.exports = router;