const musicController = require('../controllers/musicController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')



module.exports = (app, passport) => {

  app.get('/', (req, res) => res.redirect('/all_music'))
  app.get('/all_music', musicController.getAllMusic)

  app.get('/admin', (req, res) => res.redirect('/admin/all_music'))
  app.get('/admin/all_music', adminController.getAllMusic)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}