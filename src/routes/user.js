 const express = require("express")
 const router = express.Router();

 //import your controller

 const controller = require("../controllers/userControllers")

router.get('/', controller.getUsers)
router.get('/:id', controller.singleUser)
router.post('/', controller.validationOnUsers,controller.Users)
router.put('/:id',controller.validationOnUpdate,controller.updateUser)
router.delete('/:id',controller.deleteUser)

 module.exports = router;