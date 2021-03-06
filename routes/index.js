const albumController = require('../controllers/albumController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/allAlbums'))
  app.get('/allAlbums', authenticated, albumController.getAllAlbums)
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/allAlbums'))
  app.get('/admin/allAlbums', authenticatedAdmin, adminController.getAllAlbums)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/admin/albums/create', authenticatedAdmin, adminController.createAlbum)
  app.post('/admin/albums', authenticatedAdmin, upload.single('image'), adminController.postAlbum)
  app.get('/admin/albums/:id', authenticatedAdmin, adminController.getAlbum)
  app.get('/admin/albums/:id/edit', authenticatedAdmin, adminController.editAlbum)
  app.put('/admin/albums/:id', authenticatedAdmin, upload.single('image'), adminController.putAlbum)
  app.delete('/admin/albums/:id', authenticatedAdmin, adminController.deleteAlbum)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)
  app.get('/albums/feeds', authenticated, albumController.getFeeds)
  app.get('/albums/top', authenticated, albumController.getTopAlbums)
  app.get('/albums/:id', authenticated, albumController.getAlbum)
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
  app.get('/users/top', authenticated, userController.getTopUser)
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
  app.post('/favorite/:albumId', authenticated, userController.addFavorite)
  app.delete('/favorite/:albumId', authenticated, userController.removeFavorite)
  app.post('/like/:albumId', authenticated, userController.addLike)
  app.delete('/like/:albumId', authenticated, userController.removeLike)
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)

}