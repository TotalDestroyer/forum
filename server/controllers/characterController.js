const {Character, Comments, Genre} = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");
const fileService = require("../services/file-service");

class characterController{
    async create(req, res, next) {
      try {
          const {name, description} = req.body
          const {img} = req.files
          let fileName = uuid.v4() + '.jpg'
          img.mv(path.resolve(__dirname, '..', 'static', fileName))
          const character = await Character.create({name, description, img: fileName})
          return res.json(character)
      }
      catch (e) {
          return next(ApiError.internal(e))
      }
    }
    async getAll(req, res, next) {
        try {
            const character = await Character.findAll()
            return res.json(character)
        }
        catch (e) {
            return next(ApiError.internal(e))
        }
    }
    async getOne(req, res, next){
        try {
            const {id} = req.params
            const character = await Character.findOne(
                {
                    where: {id},
                    include: [{model: Comments, as: 'comments'}]
                },
            )
            return res.json(character)
        }
        catch (e) {
           return  next(ApiError.internal(e))
        }
    }
    async update(req, res, next){
        try {
            const {id} = req.params
            const {name, description} = req.body
            const {img} = req.files
            if (!id){
                return next(ApiError.badRequest('id not specified'))
            }

            if(Object.keys(req.body).length === 0){
                return next(ApiError.badRequest('No data for update'))
            }

            const character = await Genre.findOne({where: {id}})
            if(!character){
                return next(ApiError.internal('Character with this id not found'))
            }
            const file = fileService.save(img)
            if(file && character.img){
                fileService.delete(character.img)
            }
            character.update({name: name, description: description, img: file})
            return res.json(character)
        }
        catch (e) {
            return next(ApiError.internal(e))
        }
    }
    async delete(req, res, next){
        try {
            const {id} = req.params
            const  character = await Character.destroy({ where: { id: id } })
            return res.json(character)
        }
        catch (e) {
            return next(ApiError.internal(e))
        }
    }
}
module.exports = new characterController()