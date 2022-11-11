const uuid = require("uuid");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const {User, WatchList, Comments} = require("../models/models");
const ApiError = require("../error/ApiError");
const MailService = require('../services/mail-service')

const generateJwt = (id, email, roles, img, nickname, isActivated) => {
    return jwt.sign(
        {id, email, roles, img, nickname, isActivated},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}

class UserController {
    async registration(req, res, next){
       try {
           const {email, password, nickname} = req.body
           const candidate = User.findOne({where: {email}})
           if (candidate.email){
               return next(ApiError.internal("User with this email or nickname already exist"))
           }
           const {img} = req.files
           let fileName = uuid.v4() + '.jpg'
           img.mv(path.resolve(__dirname, '..', 'static', fileName))
           const hashPassword = await bcrypt.hash(password, 3);
           const activationLink = uuid.v4()
           const user = await User.create({email, password: hashPassword, img: fileName, activationLink, nickname})
           await MailService.senActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`, user.nickname);
           const watchList = await WatchList.create({userId: user.id})
           const token = generateJwt(user.id, user.email, user.role, user.img, user.nickname, user.isActivated)
           return res.json({token})
       }
       catch (e) {
           next(ApiError.invalidInput('Wrong request'))
       }
    }
    async login(req, res, next){
        try {
            const {email, password} = req.body
            const user = await User.findOne({where: {email}})
            if (!user) {
                return next(ApiError.internal('Пользователь не найден'))
            }
            let comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.internal('Указан неверный пароль'))
            }
            const token = generateJwt(user.id, user.email, user.role, user.img, user.nickname, user.isActivated)
            return res.json({token})
        }
        catch (e) {
            next(ApiError.invalidInput('Wrong request'))
        }
    }
    async check(req, res, next) {
        try{
            const token = generateJwt(req.user.id, req.user.email, req.user.role, req.user.img, req.user.nickname, req.user.isActivated)
            return res.json({token})
        }
        catch (e) {
            next(ApiError.invalidInput("Wrong data"))
        }
    }
    async activate(req, res, next){
        const {activationLink} = req.params
        const user = await User.findOne({where: {activationLink}})
        if (!user) {
            throw ApiError.invalidInput('Неккоректная ссылка активации')
        }
        user.update({isActivated: true})
        user.reload()
        return res.redirect(process.env.CLIENT_URL)
    }

    async getOne(req, res, next){
        try {
            const {id} = req.params
            const user = await User.findByPk(id)
            return res.json(user)
        }
        catch (e) {
            next(ApiError.internal('USer with this id not found'))
        }
    }

}
module.exports = new UserController()