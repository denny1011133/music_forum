const musicController = require('../controllers/musicController.js')
const adminController = require('../controllers/adminController.js')



module.exports = app => {

  app.get('/', (req, res) => res.redirect('/all_music'))
  app.get('/all_music', musicController.getAllMusic)

  app.get('/admin', (req, res) => res.redirect('/admin/all_music'))
  app.get('/admin/all_music', adminController.getAllMusic)


}