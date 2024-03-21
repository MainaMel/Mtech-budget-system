const express = require("express")
const router = express.Router();

const controller = require("../controllers/currenciesControllers");


router.get('/',controller.getCurrencies)
router.get('/:id', controller.singlecurrency)
router.post('/',controller.validationOnCreate,controller.createCurrencies)
router.put('/:id',controller.validationOnUpadate,controller.updateCurrency)
router.delete('/:id',controller.deleteCurrency)

module.exports = router;
      