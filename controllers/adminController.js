const db = require('../models')
const Album = db.Album
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Album.create({
          name: req.body.name,
          artist: req.body.artist,
          company: req.body.company,
          date: req.body.date,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then(() => {
          req.flash('success_messages', '專輯已成功建立!')
          return res.redirect('/admin/allAlbums')
        })
      })
    }
    else {
      return Album.create({
        name: req.body.name,
        artist: req.body.artist,
        company: req.body.company,
        date: req.body.date,
        description: req.body.description,
        image: null
      }).then(() => {
        req.flash('success_messages', '專輯已成功建立!')
        return res.redirect('/admin/allAlbums')
      })
    }
  },
  getAlbum: (req, res) => {
    return Album.findByPk(req.params.id, { raw: true })
      .then(album => {
        return res.render('admin/album', { album })
      })
  },
  editAlbum: (req, res) => {
    return Album.findByPk(req.params.id, { raw: true })
      .then(album => {
        return res.render('admin/create', { album })
      })
  },
  putAlbum: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請輸入專輯名稱!")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Album.findByPk(req.params.id)
          .then((album) => {
            album.update({
              name: req.body.name,
              artist: req.body.artist,
              company: req.body.company,
              date: req.date,
              description: req.body.description,
              image: file ? img.data.link : album.image
            }).then(() => {
              req.flash('success_messages', '專輯已成功修改!')
              res.redirect('/admin/allAlbums')
            })
          })
      })
    }
    else {
      return Album.findByPk(req.params.id)
        .then((album) => {
          album.update({
            name: req.body.name,
            artist: req.body.artist,
            company: req.body.company,
            date: req.body.date,
            description: req.body.description,
            image: album.image
          }).then(() => {
            req.flash('success_messages', '專輯已成功修改!')
            res.redirect('/admin/allAlbums')
          })
        })
    }
  },
  deleteAlbum: (req, res) => {
    return Album.findByPk(req.params.id)
      .then(album => {
        album.destroy()
          .then(() => {
            res.redirect('/admin/Allalbums')
          })
      })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users })
    })
  },
  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (user.isAdmin) {
          user.update({ isAdmin: false })
          req.flash('success_messages', "admin is updated to user successfully!")
        }
        else {
          user.update({ isAdmin: true })
          req.flash('success_messages', "user is updated to admin successfully!")
        }
        return res.redirect('/admin/users')
      })

  }
}

module.exports = adminController