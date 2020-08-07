const db = require('../models')
const Album = db.Album
const Category = db.Category

const albumController = {
  getAllAlbums: (req, res) => {
    let whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Album.findAll({ include: Category, where: whereQuery }).then(albums => {
      const data = albums.map(a => ({
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
          categoryId
        })
      })
    })
  },
  getAlbum: (req, res) => {
    return Album.findByPk(req.params.id, { include: Category }).then(album => {
      return res.render('album', { album: album.toJSON() })
    })
  }
}
module.exports = albumController