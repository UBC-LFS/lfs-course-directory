/* global fetch */
import React from 'react'
import { Grid, Row, Col, FormControl } from 'react-bootstrap'
import 'react-dropdown/style.css'
import './App.css'
import ToggleButton from 'react-toggle-button'
import ResultsTable from './ResultsTable'
import {exampleInputW} from './inputW'
import {exampleInputS} from './inputS'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [],
      activeTerm: 'W'
    }
  }

  componentDidMount () {
    this.getCoursesForTerm(this.state.activeTerm)
  }

  getCoursesForTerm = async (term) => {
    // const courses = await fetch(`http://localhost:8081/${term}`)
    // .then(x => x.json())
    
    if (term === 'W') {
      this.setState({
        courses: exampleInputW
      })
    } else {
      this.setState({
        courses: exampleInputS
      })
    }
  }

  handleToggle = async value => {
    if (value) {
      await this.setState({
        activeTerm: 'S'
      })
      this.getCoursesForTerm(this.state.activeTerm)
    } else {
      await this.setState({
        activeTerm: 'W'
      })
      this.getCoursesForTerm(this.state.activeTerm)
    }
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col>
            <h2>Course Directory</h2>
          </Col>
          <Col>
          <ToggleButton
            activeLabel={'S'}
            inactiveLabel={'W'}
            value={this.state.value}
            onToggle={(value) => {
              this.setState({
                value: !value
              })
              this.handleToggle(!value)}
             } />
          </Col>
        </Row>
        <Row><br /></Row>
        <Row>
          <FormControl type="text" inputRef={el => this.searchbar = el} onChange={this.handleSearchInputUpdate} 
            placeholder="Search a course code... (ex: FNH200)">
          </FormControl>
        </Row>
        <br />
        <Row>
          <ResultsTable courses={this.state.courses}/>
        </Row>
      </Grid>
    )
  }
}

export default App