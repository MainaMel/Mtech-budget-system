const express = require("express")
const router = express.Router();
const controller = require("../controllers/requestsControllers")


router.get('/', controller.getRequests);
router.get('/:id', controller.singleRequest);
router.post('/', controller.validateOnCreate, controller.createRequests);
router.put('/:id', controller.validateOnUpdate, controller.updateRequest);
router.put('/review/:id', controller.validateApprover, controller.updateReviewStatus)
router.delete('/:id', controller.deleteRequest);

module.exports = router;