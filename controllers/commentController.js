const db = require('../models')
const Comment = db.Comment
let commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      AlbumId: req.body.albumId,
      UserId: req.user.id
    })
      .then(() => {
        res.redirect(`/albums/${req.body.albumId}`)
      })
  }
}
module.exports = commentController