const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Album = db.Album
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/allAlbums')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    const id = req.params.id
    User.findByPk(id, { include: { model: Comment, include: [Album] } })
      .then(user => {
        return res.render('profile', { user: user.toJSON() })
      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('editProfile', {
          user: user.toJSON()
        })
      })
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請輸入名字!")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            return user.update({
              name: req.body.name,
              image: img.data.link
            }).then(() => {
              req.flash('success_messages', '已成功更新個人資料!')
              return res.redirect(`/users/${user.id}`)
            })
          })
          .catch(err => res.send(err))
      })
    }
    else {
      return User.findByPk(req.params.id)
        .then(user => {
          return user.update({
            name: req.body.name,
            image: user.image
          }).then(() => {
            req.flash('success_messages', '已成功更新個人資料!')
            return res.redirect(`/users/${user.id}`)
          })
        })
        .catch(err => res.send(err))
    }
  }
}

module.exports = userController