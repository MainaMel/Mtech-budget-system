const express = require("express")
const router = express.Router();

const controller = require("../controllers/loginControllers")
//import your controller


router.post('/', controller.getlogin)

module.exports = router;