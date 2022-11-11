const {Comments} = require("../models/models");

class CommentsController {
    async create(req, res) {
        const {userId, body, genreId, characterId, titleId, newsId} = req.body
        const comment = await Comments.create({userId, body, titleId, genreId, characterId, newsId})
        return res.json(comment)
    }

    async delete(req, res) {
        const {id} = req.params
        const comment = await Comments.destroy({where: {id: id}})
        return res.json(comment)
    }


}
module.exports = new CommentsController()