const Router = require('express')
const router = new Router()
const RatingController = require('../controllers/ratingController.js')
const authMiddleware = require('../middleware/authMiddleware.js')


router.get('/title/:titleId([0-9]+)', RatingController.getOne)
router.post('/title/:titleId([0-9]+)/rate/:rate([1-10])', /*authMiddleware,*/ RatingController.create)

module.exports = router