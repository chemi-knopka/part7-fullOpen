import React, { useState } from 'react'
import {
  Switch, 
  Link, 
  Route, 
  useRouteMatch, 
  useHistory
} from 'react-router-dom'
import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>home</Link>
      <Link to="/about" style={padding}>about</Link>
      <Link to="/create" style={padding}> create </Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id}>
          <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
        </li>)
      }
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => (
  <div>
    <h2>{anecdote.content}</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const history = useHistory()

  let content = useField('content')
  let author = useField('author')
  let info = useField('info')

  const removeReset = (array) =>{
    const {reset, ...withoutReset} = array
    return withoutReset
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    history.push('/')
  }

  // clear all fields
  const resetAll = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...removeReset(content)} />
        </div>
        <div>
          author
          <input {...removeReset(author)} />
        </div>
        <div>
          url for more info
          <input {...removeReset(info)} />
        </div>
        <button>create</button>
        <button onClick={resetAll}>reset</button>
      </form>
    </div>
  )

}

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }
  return (
    <div style={{"border": "1px solid"}}>
      {notification}
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState('')

  const match = useRouteMatch('/:id')
  const anecdote = match
    ? anecdotes.find(anecdote => anecdote.id === match.params.id)
    : null

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
    displayNotification(`a new anecdote '${anecdote.content}!'`)
  }

  const displayNotification = (text) => {
    setNotification(text)
    setTimeout(() => setNotification(''), 3000)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification}/>
      <div>
        <Switch>
          <Route path="/create">
              <CreateNew addNew={addNew} />
          </Route>
          <Route path="/about">
              <About />
          </Route>
          <Route path='/:id'>
            <Anecdote anecdote={anecdote} />
          </Route>
          <Route path="/">
              <AnecdoteList anecdotes={anecdotes} />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

export default App;
