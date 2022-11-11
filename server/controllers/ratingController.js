const {Rating, Title, User} = require("../models/models");
const ApiError = require("../error/ApiError");

class RatingController {

    async getOne(req, res, next) {
        const {titleId} = req.params
        const title = await Title.findByPk(titleId)
        if (!title) {
            return  new ApiError.forbidden("title did not found")
        }
        const votes = await Title.count({where: {titleId}})
        if (votes) {
            const rates = await Title.sum('rate', {where: {titleId}})
            return {rates, votes, rating: rates/votes}
        }
        return res.json({rates: 0, votes: 0, rating: 0})
    }

    async create(req, res, next) {
        const {titleId, rate} = req.params
        const {userId} = req.body
        const title = await Title.findByPk(titleId)
        if (!title) {
            throw new Error('Товар не найден в БД')
        }
        const user = await User.findByPk(userId)
        if (!user) {
            throw new Error('Пользователь не найден в БД')
        }
        const rating = await Rating.create({userId, titleId, rate})
        return res.json(rating)
    }
}

module.exports = new RatingController()