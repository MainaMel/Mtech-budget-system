const express = require("express")
const router = express.Router();
const controller = require("../controllers/processhistoryControllers")


// router.get('/', controller.getprocesshistory)
// router.get('/:id',controller.singleprocesshistory)
router.post('/',controller.validationOnCreate,controller.createprocesshistory)
router.put('/:id',controller.validationOnUdpadate,controller.updateprocesshistory)
// router.delete('/:id',controller.deleteprocesshistory)

module.exports = router;