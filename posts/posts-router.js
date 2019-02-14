const express = require('express');
const db = require('../data/db');
const router = express.Router();

// incoming base route '/api/posts'

// post request, returns 0 or 1 on successful addition
router.post('/', (req, res) => {
  const { title, contents } = req.body;
  const newPost = { title, contents };

  if (!title || !contents) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide title and contents for the post.'
    });
  } else {
    db.insert(newPost)
      .then(post => {
        res.status(201).json({ success: true, post });
      })
      .catch(err =>
        res.status(500).json({
          success: false,
          error: 'There was an error while saving the post to the database'
        })
      );
  }
});

// get request, returns array of objects with all posts
router.get('/', (req, res) => {
  db.find()
    .then(posts => res.status(200).json({ success: true, posts }))
    .catch(err =>
      res.status(500).json({
        success: false,
        error: 'The posts information could not be retrieved.'
      })
    );
});

// get request by id, returns array with matching object, or empty array if no match
router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (post.length === 0) {
        res.status(404).json({
          success: false,
          message: "Cannot find the post you're looking for"
        });
      } else {
        res.status(200).json({ success: true, post });
      }
    })
    .catch(err =>
      res.status(500).json({
        success: false,
        error: 'The posts information could not be retrieved.'
      })
    );
});

// put request by id, returns 0 or 1 with successful update and updated object
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const change = req.body;

  if (!change.title || !change.contents) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide title and contents for the post.'
    });
  }

  db.update(id, change)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated, change });
      } else {
        res.status(404).json({
          success: false,
          message: "Cannot find the post you're looking for"
        });
      }
    })
    .catch(err =>
      res.status(500).json({
        success: false,
        error: 'The post information could not be modified.'
      })
    );
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(deleted => {
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'The post with the specified ID does not exist.'
        });
      } else {
        res.status(204).end();
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ success: false, error: 'The post could not be removed' })
    );
});

module.exports = router;
