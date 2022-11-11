const {Genre, Comments} = require("../models/models");
const ApiError = require("../error/ApiError");

class genreController{
    async create(req, res) {
        const {name, description} = req.body
        const genre = await Genre.create({name, description})
        return res.json(genre)
    }

    async getAll(req, res) {
        const genre = await Genre.findAll()
        return res.json(genre)
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params
            const genre = await Genre.findOne(
                {
                    where: {id},
                    include: [{model: Comments, as: 'comments'}]
                },
            )
            return res.json(genre)
        }
        catch (e) {
           return  next(ApiError.internal('Character with this id not found'))
        }
    }
    async update(req, res, next){
        try {
            const {id} = req.params
            const {name, description} = req.body
            if (!id){
                return next(ApiError.badRequest('id not specified'))
            }
            if(Object.keys(req.body).length === 0){
                return next(ApiError.badRequest('No data for update'))
            }

            const genre = await Genre.findOne({where: {id}})
            if(!genre){
                return next(ApiError.internal('Genre with this id not found'))
            }



            genre.update({name: name, description: description})
            return res.json(genre)

        }
        catch (e) {
            return next(ApiError.internal(e))
        }
    }
    async delete(req, res, next){
        try {
            const {id} = req.params
            const  genre = await Genre.destroy({ where: { id: id } })
            return res.json(genre)
        }
        catch (e) {
            return next(ApiError.internal(e))
        }
    }
}
module.exports = new genreController()