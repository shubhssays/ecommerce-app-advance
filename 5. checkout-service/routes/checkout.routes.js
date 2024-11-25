const express = require('express')
const router = express.Router();

const CheckoutController = require('../controllers/checkout.controller');
const routeHandler = require('../handlers/route.handler');
const schemaValidator = require('../middlewares/schemaValidators');
const { checkoutSchema } = require('../schemas/checkout.schemas');

router.post('/', schemaValidator(checkoutSchema), routeHandler(CheckoutController.checkoutHandler));

module.exports = router;