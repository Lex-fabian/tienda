const express = require('express')
const router = express.Router();
const loginControl = require('../controller/loginControl');

router.post('/login', loginControl.compararUsuarioyClave);

module.exports = router;