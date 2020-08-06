const db = require('../models')
const Album = db.Album




const adminController = {
  getAllMusic: (req, res) => {
    return Album.findAll({ raw: true })
      .then(albums => {
        return res.render('admin/allMusic', { albums })
      })
  }
}

module.exports = adminController