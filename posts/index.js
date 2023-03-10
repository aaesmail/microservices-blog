const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')
const { randomBytes } = require('crypto')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

const handleEvent = (event) => {
  const { type, data } = event
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

app.post('/posts/create', (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body

  posts[id] = { id, title }

  axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: { id, title },
  })

  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
  handleEvent(req.body)

  res.send({})
})

app.listen(4000, () => {
  console.log('Listening on 4000')

  loadAllEvents()
})
