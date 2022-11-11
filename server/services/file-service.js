const uuid = require('uuid')
const path = require('path')
const fs  = require('fs')

class File {
    save(file) {
        if (!file) return null
        const [, ext] = file.mimetype.split('/')
        const fileName = uuid.v4() + '.' + ext
        const filePath = path.resolve('static', fileName)
        file.mv(filePath)
        return fileName
    }
    delete(file) {
        if (file) {
            const filePath = path.resolve('static', file)
            if (fs.existsSync(filePath)) {
                console.log(filePath)
                fs.unlinkSync(filePath)
            }
        }
    }
}

module.exports = new File()