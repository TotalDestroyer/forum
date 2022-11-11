const Router = require('express')
const router = new Router()
const titleController = require('../controllers/titleController')

router.post('/', titleController.create)
router.get('/', titleController.getAll)
router.get('/watch/:id', titleController.getOne)
router.delete('/:id', titleController.delete)
router.put('/update/:id', titleController.update)

module.exports = router
