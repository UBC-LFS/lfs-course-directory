import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
// import { LFSDepts, buildURL } from './util/constants'
// import { getYear } from './util/get'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      depts: [],
      courses: [],
      activeTerm: 'W'
    }
  }

  componentDidMount () {
    fetch('http://localhost:8081/')
      .then(x => x.json())
      .then(x => console.log(x))
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
