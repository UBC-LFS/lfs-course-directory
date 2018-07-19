import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courses: [],
      activeTerm: 'S'
    }
  }

  componentDidMount () {
    this.getCoursesForTerm(this.state.activeTerm)
  }

  getCoursesForTerm = async (term) => {
    const courses = await fetch(`http://localhost:8081/${term}`)
      .then(x => x.json())
    this.setState({
      courses: courses
    })
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome to React</h1>
        </header>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
