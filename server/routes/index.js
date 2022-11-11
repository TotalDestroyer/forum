const Router = require('express')
const router = new Router()
const genreRouter = require('./genreRouter')
const userRouter = require('./userRouter')
const characterRouter = require('./characterRouter')
const titleRouter = require('./titleRouter')
const commentsRouter = require('./commentsRouter')
const watchListRouter = require('./watchListRouter')
const ratingRouter = require("./ratingRouter");

router.use('/user', userRouter)
router.use('/genre', genreRouter)
router.use('/character', characterRouter)
router.use('/title', titleRouter)
router.use('/comments', commentsRouter)
router.use('/watchList', watchListRouter)
router.use('/rating', ratingRouter)

module.exports = router