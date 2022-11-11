const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, primaryKey: true, unique: true},
    password: {type: DataTypes.STRING},
    roles: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ["USER"]},
    img: {type: DataTypes.STRING, allowNull: false},
    isActivated: {type: DataTypes.BOOLEAN,  defaultValue: false, },
    nickname: {type: DataTypes.STRING, unique: true},
    activationLink: {type: DataTypes.STRING},
})
const WatchList = sequelize.define('watch_list', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Title = sequelize.define('title', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.STRING, allowNull: false},
    episodes: {type: DataTypes.INTEGER},
    type: {type: DataTypes.STRING},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
})

const Genre = sequelize.define('genre', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
})

const Character = sequelize.define('character', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING, allowNull: false},
})
const News = sequelize.define('news', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING, allowNull: false},
})
const Comments = sequelize.define('comments', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // type: {type: DataTypes.STRING, unique: true, allowNull: false},
    userId: {type: DataTypes.INTEGER},
    karma: {type: DataTypes.INTEGER, defaultValue: 0},
    body: {type: DataTypes.STRING}
})
const GenreTitle = sequelize.define('genre_title', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const TitleCharacter = sequelize.define('title_character', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})
const WatchListTitle = sequelize.define('watch_list_title', {
    quantity: {type: DataTypes.INTEGER, defaultValue: 1},
    series: {type: DataTypes.INTEGER, defaultValue: 1},
    type: {type: DataTypes.STRING, defaultValue: "planned"}
})

const Rating = sequelize.define('rating', {
    rate: {type: DataTypes.INTEGER, allowNull: false},
})


WatchList.belongsToMany(Title, { through: WatchListTitle, onDelete: 'CASCADE' })
Title.belongsToMany(WatchList, { through: WatchListTitle, onDelete: 'CASCADE' })

WatchList.hasMany(WatchListTitle)
WatchListTitle.belongsTo(WatchList)
Title.hasMany(WatchListTitle)
WatchListTitle.belongsTo(Title)

Title.belongsToMany(User, {through: Rating, onDelete: 'CASCADE'})
User.belongsToMany(Title, {through: Rating, onDelete: 'CASCADE'})

Title.hasMany(Rating)
Rating.belongsTo(Title)
User.hasMany(Rating)
Rating.belongsTo(User)

User.hasOne(WatchList)
WatchList.belongsTo(User)

Genre.hasMany(Comments)
Comments.belongsTo(Genre)

Character.hasMany(Comments)
Comments.belongsTo(Character)

Title.hasMany(Comments)
Comments.belongsTo(Title)

News.hasMany(Comments)
Comments.belongsTo(News)

Title.belongsToMany(Genre, {through: GenreTitle})
Genre.belongsToMany(Title, {through: GenreTitle})



Character.belongsToMany(Title, {through: TitleCharacter} )
Title.belongsToMany(Character, {through: TitleCharacter})

// Title.hasMany(TitleCharacter)
// TitleCharacter.belongsTo(Title)
// Character.hasMany(TitleCharacter)
// TitleCharacter.belongsTo(Character)

module.exports =  {
    User,
    WatchList,
    Title,
    Genre,
    Character,
    News,
    Comments,
    GenreTitle,
    TitleCharacter,
    WatchListTitle,
    Rating
}



