const {WatchList, Title, WatchListTitle} = require("../models/models");
const ApiError = require("../error/ApiError");

class WatchListController {
   async append (req, res, next){
      try{
          let {titleId} = req.params
          let {watchListId} = req.body
          let watchList = await WatchList.findByPk(watchListId, {
              attributes: ['id'],
              include: [
                  {model: Title, attributes: ['id', 'name', 'img']},
              ]
          })
          if (!watchList) {
              ApiError.internal('No watchList found')
          }
          const watchList_title = await WatchListTitle.findOne({
              where: {watchListId, titleId}
          })
          if (watchList_title) {
              return  ApiError.badRequest("Title already added")
          } else {
              await WatchListTitle.create({watchListId, titleId})
          }
          await watchList.reload()
          return res.json(watchList)
      }
      catch (e) {
          console.log(e)
      }
    }
    async delete(req, res, next){

    }
    async getOne(req, res, next){
        const {watchListId} = req.body
        let watchList = await WatchList.findOne(
            {where: watchListId,
            attributes: ['id'],
            include: [
                {model: Title, attributes: ['id', 'name', 'img']},
            ],
        })
        return res.json(watchList)
    }
    async incrementSeries(req, res, next){
        const {titleId, quantity} = req.params
        const {watchListId} = req.body

        let watch_List = await WatchList.findByPk(watchListId, {
            include: [{model: Title}]
        })
        if(!watch_List){
            return next(ApiError.internal("Watch list did not found"))
        }
        const watchList_title = await WatchListTitle.findOne({
            where: {watchListId, titleId}
        })
       if (watchList_title) {
           await watchList_title.increment('series', {by: quantity})
           await watch_List.reload()
       }
       return res.json(watch_List)
    }
    async decrementSeries(req, res, next){
        const {titleId, quantity} = req.params
        const {watchListId} = req.body
        let watch_List = await WatchList.findByPk(watchListId, {
            include: [{model: Title}]
        })
        if(!watch_List){
            return next(ApiError.internal("Watch list did not found"))
        }
        const watchList_title = await WatchListTitle.findOne({
            where: {watchListId, titleId}
        })
        if (watchList_title) {
            await watchList_title.decrement('series', {by: quantity})
            await watch_List.reload()
        }
        return res.json(watch_List)
    }
    async changeType(req, res, next){
        const {titleId, newType} = req.params
        const {watchListId} = req.body
        let watch_List = await WatchList.findByPk(watchListId, {
            include: [{model: Title}]
        })
        if(!watch_List){
            return next(ApiError.internal("Watch list did not found"))
        }
        const watchList_title = await WatchListTitle.findOne({
            where: {watchListId, titleId}
        })
        if (watchList_title) {
            await watchList_title.update({type: newType})
            await watch_List.reload()
        }
        return res.json(watch_List)
    }
    async remove(req, res, next){
        const {titleId} = req.params
        const {watchListId} = req.body

        let watch_list = await WatchList.findByPk(watchListId, {
            include: [{model: Title}]
        })
        if(!watch_list){
            return next(ApiError.internal("Watch list did not found"))
        }
        const watchList_title = await WatchListTitle.findOne({
            where: {watchListId, titleId}
        })
        if (watchList_title) {
            await watchList_title.destroy()
            await watch_list.reload()
        }
        return res.json(watch_list)
    }
    async getByType(req, res, next){
        const {type} = req.params
        const watchListId = req.body
        let watch_list = await WatchList.findByPk(watchListId, {
            include: [{model: Title}]
        })
        if(!watch_list){
            return next(ApiError.internal("Watch list did not found"))
        }
        const watchList_titles = await WatchListTitle.findOne({
            where: {watchListId, type}
        })
        return res.json(watchList_titles)
    }

}
module.exports = new WatchListController()