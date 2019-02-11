// import your node modules
const express = require('express');
const db = require('./data/db.js');
const server = express();

server.use(express.json());
// add your server code starting here

console.log(db.posts);

server.get('/api/posts', (req, res) => {
  db.find()
    .then(posts => res.status(200).json({ success: true, posts }))
    .catch(erc => res.status(err.code).json({ success: false, message }));
});

server.post('/api/posts', (req, res) => {
  const post = req.body;

  db.insert(post)
    .then(post => {
      res.status(201).json({ success: true, post });
    })
    .catch(err => res.status(err.code).json({ success: false, message }));
});

server.listen(4000, () => {
  console.log('running');
});
