const Router = require('express')
const router = new Router()
const commentsController = require('../controllers/commentsController')

router.post('/', commentsController.create)
// router.get('/', commentsController.getAll)
router.delete('/:id', commentsController.delete)

module.exports = router