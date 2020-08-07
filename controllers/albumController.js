const db = require('../models')
const Album = db.Album
const Category = db.Category

const albumController = {
  getAllAlbums: (req, res) => {
    Album.findAll({ include: Category }).then(albums => {
      const data = albums.map(a => ({
        ...a.dataValues,
        description: a.dataValues.description.substring(0, 40),
        categoryName: a.Category.name
      }))
      return res.render('allAlbums', {
        albums: data
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