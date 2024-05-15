const express = require("express")
const router = express.Router();

//import your controller

const controller = require("../controllers/departmentControllers")

router.get('/', controller.getDepartments)
router.get('/:id', controller.singleDepartment)
router.post('/',controller.validationOnCreate,controller.createDepartments)
router.put('/:id',controller.validationOnUpdate,controller.updateDepartment)
router.delete('/:id',controller.deleteDepartment)


module.exports = router;