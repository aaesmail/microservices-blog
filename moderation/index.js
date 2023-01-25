const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const handleEvent = (event) => {
  const { type, data } = event

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved'

    axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
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

app.post('/events', (req, res) => {
  handleEvent(req.body)

  res.send({})
})

app.listen(4003, () => {
  console.log('Listening on 4003')

  loadAllEvents()
})
