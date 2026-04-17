const express = require("express");
const router = express.Router();

const installerController = require("../controllers/installer.controller");

router.post("/install", installerController.install);

module.exports = router;
