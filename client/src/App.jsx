/* global fetch */
import React from 'react'
import { Grid, Row, Col, FormControl } from 'react-bootstrap';
import 'react-dropdown/style.css'
import './App.css'
import ResultsTable from './ResultsTable'

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
    const courses = await fetch(`http://localhost:8081/${term}`)
    .then(x => x.json())
    this.setState({
      courses: courses
    })
  }

  render () {
    return (
      <Grid>
        <Row>
          <Col>
            <h2>Course Directory</h2>
          </Col>
        </Row>
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