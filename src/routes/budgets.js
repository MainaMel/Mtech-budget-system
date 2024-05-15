const express = require("express")
const router = express.Router();
const controller = require("../controllers/budgetsControllers");


router.get('/', controller.getBudgets);
router.get('/:id',controller.singleBudget);
router.post('/',controller.validationOnCreate,controller.createBudgets);
router.put('/:id',controller.validationOnUpdate,controller.updateBudget);
router.delete('/:id',controller.deleteBudget);

module.exports = router;