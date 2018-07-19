import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { LFSDepts, buildURL } from './util/constants'
import { getYear } from './util/get'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      depts: LFSDepts,
      courses: [],
      activeTerm: 'W'
    }
  }

  componentDidMount () {
    const year = getYear()
    // const responses = Promise.all(
    //   this.state.depts
    //     .map(dept => fetch(buildURL(year, this.state.activeTerm, dept), {mode: 'no-cors'}))
    // )
    // responses
    this.getCoursesInDept('APBI')
  }

  getCoursesInDept = async (dept) => {
    const year = getYear()
    console.log(buildURL(year, this.state.activeTerm, dept))
    const response = await fetch(buildURL(year, this.state.activeTerm, dept), {headers: {
      'Content-Type': 'application/xml'
    },mode: 'no-cors'})
    console.log(response)
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
