const express = require("express");
const aiCOntroller = require("../controllers/ai.controller");
const aiController = require("../controllers/ai.controller");
const router = express.Router();

router.post("/get-review", aiController.getReview);


module.exports = router;