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
        categoryName: a.Category.name,
        isFavorited: req.user.FavoritedAlbums.map(d => d.id).includes(a.id),
        isLiked: req.user.LikedAlbums.map(d => d.id).includes(a.id)
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
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(album => {
      const isFavorited = album.FavoritedUsers.map(d => d.id).includes(req.user.id)
      const isLiked = album.LikedUsers.map(d => d.id).includes(req.user.id)
      return res.render('album', {
        album: album.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked
      })
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
  },
  getTopAlbums: (req, res) => {
    return Album.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(albums => {
        albums = albums.map(a => ({
          ...a.dataValues,
          description: a.dataValues.description.substring(0, 50),
          FavoriteCount: a.FavoritedUsers.length,
          isFavorited: req.user.FavoritedAlbums.map(d => d.id).includes(a.id)
        }))
        albums = albums.sort((a, b) => (b.FavoriteCount - a.FavoriteCount)).slice(0, 10)
        return res.render('topAlbum', { albums })
      })
      .catch(err => res.send(console.log(err)))
  }
}
module.exports = albumController