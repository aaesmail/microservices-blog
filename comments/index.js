const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const { randomBytes } = require('crypto')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const commentsByPostId = {}

const handleEvent = (event) => {
  const { type, data } = event

  if (type === 'CommentModerated') {
    const { id, postId, status } = data

    const comment = commentsByPostId[postId].find((comment) => comment.id === id)

    comment.status = status

    axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        status,
        postId,
        content: comment.content,
      },
    })
  }
}

const loadAllEvents = async () => {
  try {
    const res = await axios.get('http://event-bus-srv:4005/events')

    for (let event of res.data) {
      handleEvent(event)
    }
  } catch {}
}

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body

  const comments = commentsByPostId[req.params.id] || []

  comments.push({ id: commentId, content, status: 'pending' })

  commentsByPostId[req.params.id] = comments

  axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  })

  res.status(201).send(comments)
})

app.post('/events', (req, res) => {
  handleEvent(req.body)

  res.send({})
})

app.listen(4001, () => {
  console.log('Listening on 4001')

  loadAllEvents()
})
