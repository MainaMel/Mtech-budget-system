const express = require("express")
const router = express.Router();
const controller = require("../controllers/roleControllers")


router.get('/', controller.getRoles)
router.get('/:id', controller.singleRole)
router.post('/', controller.validationOnCreate, controller.createRoles)
router.put('/:id', controller.validateOnUpdate, controller.updateRole)
router.delete('/:id', controller.deleteRole)

module.exports = router;