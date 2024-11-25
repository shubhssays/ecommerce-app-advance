const express = require('express')
const router = express.Router();

const CartController = require('../controllers/cart.controller');
const routeHandler = require('../handlers/route.handler');
const schemaValidator = require('../middlewares/schemaValidators');
const { addToCartSchema, updateQuantityInCartSchema, getCartSchema, removeItemFromCartSchema } = require('../schemas/cart.schemas');

router.post('/', schemaValidator(addToCartSchema), routeHandler(CartController.addItemToCartHandler));
router.put('/', schemaValidator(updateQuantityInCartSchema), routeHandler(CartController.updateCartItemHandler));
router.get('/:user_id', schemaValidator(getCartSchema), routeHandler(CartController.getCartItemsHandler));
router.delete('/', schemaValidator(removeItemFromCartSchema), routeHandler(CartController.removeItemFromCartHandler));

module.exports = router;