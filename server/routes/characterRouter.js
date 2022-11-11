const Router = require('express')
const router = new Router()
const characterController = require('../controllers/characterController')

router.post('/create', characterController.create)
router.get('/getall', characterController.getAll)
router.get('/getcharacter/:id', characterController.getOne)
router.delete('/delete/:id', characterController.delete)
router.put('/update/:id', characterController.update)

module.exports = router