// import your node modules
const express = require('express');
const db = require('./data/db.js');
const server = express();

server.use(express.json());
// add your server code starting here

server.get('/api/posts', (req, res) => {
  db.find()
    .then(posts => res.status(200).json({ success: true, posts }))
    .catch(err =>
      res.status(err.code).json({
        success: false,
        error: 'The posts information could not be retrieved.'
      })
    );
});

server.get('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(posts => res.status(200).json({ success: true, posts }))
    .catch(err =>
      res.status(err.code).json({
        success: false,
        error: 'The posts information could not be retrieved.'
      })
    );
});

server.delete('/api/posts/:id', (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(deleted => res.status(204).end())
    .catch(err =>
      res.status(err.code).json({ success: false, message: err.message })
    );
});

server.post('/api/posts', (req, res) => {
  const { title, contents } = req.body;
  const newPost = { title, contents };

  if (!title || !contents) {
    return res.status(500).json({
      success: false,
      errorMessage: 'Please provide title and contents for the post.'
    });
  }
  db.insert(newPost)
    .then(post => {
      res.status(201).json({ success: true, post });
    })
    .catch(err => res.status(err.code).json({ success: false, message }));
});

server.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const change = req.body;

  db.update(id, change)
    .then(updated => {
      if (updated) {
        res.status(200).json({ success: true, updated });
      } else {
        res.status(404).json({
          success: false,
          message: "Cannot find the hub you're looking for"
        });
      }
    })
    .catch(err => res.status(err.code).json({ success: false, message }));
});

server.listen(4000, () => {
  console.log('running');
});
