const Router = require('express')
const router = new Router()
const genreController = require('../controllers/genreController')

router.post('/', genreController.create)
router.get('/getall', genreController.getAll)
router.get('/getgenre/:id', genreController.getOne)
router.delete('delete/:id', genreController.delete)
router.put('update/:id', genreController.update)
module.exports = router
