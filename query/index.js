const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const handleEvent = (event) => {
  const { type, data } = event

  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = { id, title, comments: [] }
  }
  else if (type === 'CommentCreated') {
    const { id, content, postId, status } = data

    posts[postId].comments.push({ id, content, status })
  }
  else if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data

    const comment = posts[postId].comments.find((comment) => comment.id === id)

    comment.content = content
    comment.status = status
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

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/events', (req, res) => {
  handleEvent(req.body)

  res.send({})
})

app.listen(4002, () => {
  console.log('Listening on 4002')

  loadAllEvents()
})
