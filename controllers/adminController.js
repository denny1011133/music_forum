const db = require('../models')
const Album = db.Album

const adminController = {
  getAllAlbums: (req, res) => {
    return Album.findAll({ raw: true })
      .then(albums => {
        return res.render('admin/allAlbums', { albums })
      })
  },

  createAlbum: (req, res) => {
    return res.render('admin/create')
  },

  postAlbum: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請輸入專輯名稱!")
      return res.redirect('back')
    }
    return Album.create({
      name: req.body.name,
      date: req.body.date,
      description: req.body.description
    })
      .then(() => {
        req.flash('success_messages', '專輯已成功建立!')
        res.redirect('/admin/allAlbums')
      })
  },
}

module.exports = adminController