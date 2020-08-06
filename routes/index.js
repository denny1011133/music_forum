const musicController = require('../controllers/musicController.js')
module.exports = app => {

  app.get('/', (req, res) => res.redirect('/all-music'))
  app.get('/all-music', musicController.getAllMusic)
}