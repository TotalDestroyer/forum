const uuid = require('uuid')
const {Title, Comments, Genre, Character, TitleCharacter} = require("../models/models");
const fileService = require('../services/file-service')
const ApiError = require("../error/ApiError");
class titleController{
    async create(req, res, next){
        try{
            let {name, description, status, episodes, type, genreId, characterId} = req.body
            const {img} = req.files
            const savedImage =  fileService.save(img) ?? ''
            const title = Title.create({name, description, status, episodes, type, characterId, genreId, img: savedImage})
            return res.json(title)
            // characterId.map(value => {
            //     TitleCharacter.create({characterId, titleId: title.id})
            // })
        }
        catch (e) {
            next(ApiError.invalidInput('Wrong data'))
        }
    }
    async delete(req, res, next){
        try {
            const {id} = req.params
            const  title = await Title.destroy({ where: { id: id } })
            return res.json(title)
        }
        catch (e) {
            return next(ApiError.internal('Title with this id not found'))
        }
    }
    async getAll(req, res, next){
         try {
             let {characterId, genreId, type, name, limit, page} = req.query
             page = page || 1
             limit = limit || 9
             let offset = page * limit - limit
             let titles;
             if(!characterId && !genreId && !type && !name){
                 titles = await Title.findAndCountAll({limit, offset})
             }
             if(characterId && !genreId && !type && !name) {
                 titles = await Title.findAndCountAll({where:{characterId}, limit, offset})
             }
             if(!characterId && genreId && !type && !name) {
                 titles = await Title.findAndCountAll({where:{genreId}, limit, offset})
             }
             if(!characterId && !genreId && type && !name) {
                 titles = await Title.findAndCountAll({where:{type}, limit, offset})
             }
             if(!characterId && genreId && type && name) {
                 titles = await Title.findAndCountAll({where:{type, genreId, name}, limit, offset})
             }
             if(!characterId && !genreId && !type && name) {
                 titles = await Title.findAndCountAll({where:{name}, limit, offset})
             }
             return res.json(titles)
         }
         catch (e) {
             return next(ApiError.invalidInput('Wrong data'))
         }
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params
            const title = await Title.findOne(
                {
                    where: {id},
                    include: [
                        {model: Comments, as: 'comments'},
                        {model: Character, as: 'characters'},
                        {model: Genre, as: 'genres'},
                    ]
                },
            )
            return res.json(title)
        }
        catch (e) {
           return  next(ApiError.internal('Title with this id not found'))
        }
    }
    async update(req, res, next){
        try {
            const {id} = req.params
            const {img} = req.files
            const {name, description,  status,  episodes,  type, genreId, characterId} = req.body
            if(!id){
                return next(ApiError.badRequest('id not specified'))
            }
            if(Object.keys(req.body).length === 0){
                return next(ApiError.badRequest('No data for update'))
            }
            const title = await Title.findOne(
                {
                    where: {id},
                    include: [{model: Genre, as: 'genres'}, {model: Character, as: 'characters'}]
                })
            if(!title){
                return next(ApiError.internal('Title not found'))
            }
            const file = fileService.save(img)
            if(file && title.img){
                fileService.delete(title.img)
            }
            title.update({name: name, description: description, status: status, episodes: episodes, type: type, img: file})
            return res.json(title)
        }
        catch (e) {
            return next(ApiError.internal(e))
        }
        // TODO апдейт для каждого, разделить на сервисы ?
    }
}
module.exports = new titleController()