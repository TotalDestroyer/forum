const Router = require('express')
const router = new Router()
const watchListController = require('../controllers/watchListController')

router.get('/', watchListController.getOne)
router.get('/mylist/:type', watchListController.getByType)
router.delete('/:id', watchListController.delete)
router.put('/title/:titleId([0-9]+)/append', watchListController.append)
router.put('/title/:titleId([0-9]+)/incrementSeries/:quantity([0-9]+)', watchListController.incrementSeries)
router.put('/title/:titleId([0-9]+)/decrementSeries/:quantity([0-9]+)', watchListController.decrementSeries)
router.put('/title/:titleId([0-9]+)/changeType/:newType', watchListController.changeType)
router.put('/title/:titleId([0-9]+)/remove', watchListController.remove)
module.exports = router
