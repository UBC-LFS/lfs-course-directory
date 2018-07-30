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
      activeTerm: 'W',
      syllabi: false,
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

  handleToggleForTerm = async value => {
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

  handleToggleForSyllabi = async newvalue => {
    if (newvalue) {
      await this.setState({
        syllabi: true
      })
    } else {
      await this.setState({
        syllabi: false
      })
    }
  }

  handleSearchInputUpdate = async () => {
    var text = this.searchbar.value.toUpperCase().split(/\s+/)
    var dept = text[0]
    var section = text[1]
    console.log(text)
    console.log(dept)
    console.log(section)

    var filteredCoursesList
    if (section) {
      await this.componentDidMount()
      filteredCoursesList = this.state.courses.map(courses => 
        courses.filter(course => {
          return course.dept.includes(dept) && course.course.includes(section)
        }))
    } else if (dept) {
      await this.componentDidMount()
      filteredCoursesList = this.state.courses.map(courses =>
        courses.reduce((acc, cur) => {
          if (cur.dept.includes(dept) || cur.course.includes(dept)) {
            acc.push(cur)
          } return acc
        }, []))
    } else {
      return this.componentDidMount()
    }

    console.log(filteredCoursesList)

    let filteredCourses = filteredCoursesList.filter(courses => courses.length !== 0)

    console.log(filteredCourses)

    if (filteredCourses) {
      this.setState({
        courses: filteredCourses
      })
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
          <ToggleButton key={'term'}
            activeLabel={'S'}
            inactiveLabel={'W'}
            value={this.state.value}
            onToggle={(value) => {
              this.setState({
                value: !value
              })
              this.handleToggleForTerm(!value)}
             } />
          </Col>
        </Row>
        <Row><br /></Row>
        <Row>
          <Col>
          <ToggleButton key={'syllabi'}
            activeLabel={'syllabi'}
            inactiveLabel={''}
            value={this.state.newvalue}
            onToggle={(value) => {
              this.setState({
                newvalue: !value
              })
              this.handleToggleForSyllabi(!value)}
             } />
          </Col>
        </Row>
        <Row><br /></Row>
        <Row>
          <FormControl type="text" inputRef={el => this.searchbar = el} onChange={this.handleSearchInputUpdate} 
            placeholder="Search a course code... (ex: FNH 200)">
          </FormControl>
        </Row>
        <br />
        <Row>
          <ResultsTable 
            courses={this.state.courses}
            syllabi={this.state.syllabi}/>
        </Row>
      </Grid>
    )
  }
}

export default App