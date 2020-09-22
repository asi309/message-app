const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/posts', isAuth, feedController.getPosts); //Fetching all posts

//Fetching a single post with postId
router.get('/post/:postId', isAuth, feedController.getPost);

//Fetching Status of user
router.get('/status', isAuth, feedController.getStatus);

//Update Status of user
router.put('/status', isAuth, feedController.setStatus);

//Creating post
router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

//Editing Post with postId
router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.editPost
);

//Delete post with postId
router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
