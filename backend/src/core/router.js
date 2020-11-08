const router = require('express').Router();
const RoomsController = require('../controllers/room.controller');

router.get('/rooms/:roomId', RoomsController.get)
router.get('/rooms', RoomsController.all)

module.exports = router
