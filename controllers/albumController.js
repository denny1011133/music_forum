const db = require('../models')
const Album = db.Album
const Comment = db.Comment
const User = db.User
const Category = db.Category
const pageLimit = 10
const albumController = {
  getAllAlbums: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Album.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(a => ({
        ...a.dataValues,
        description: a.dataValues.description.substring(0, 40),
        categoryName: a.Category.name
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('allAlbums', {
          albums: data,
          categories,
          categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getAlbum: (req, res) => {
    return Album.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(album => {
      return res.render('album', { album: album.toJSON() })
    })
  },
  getFeeds: (req, res) => {
    return Album.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(albums => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Album]
      }).then(comments => {
        return res.render('feeds', {
          albums,
          comments
        })
      })
    })
  }
}
module.exports = albumController