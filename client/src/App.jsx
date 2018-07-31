/* global fetch */
import React from 'react'
import { Grid, Row, Col, FormControl } from 'react-bootstrap'
import 'react-dropdown/style.css'
import './App.css'
import ToggleButton from 'react-toggle-button'
import Select from 'react-select'
import ResultsTable from './ResultsTable'
import {exampleInputW} from './inputW'
import {exampleInputS} from './inputS'

const options = [
  { value: '-', label: '-' }, 
  { value: 'APBI', label: 'APBI'}, 
  { value: 'FNH', label:'FNH'},
  { value: 'FOOD', label:'FOOD'},
  { value: 'FRE', label:'FRE'},
  { value: 'GRS', label:'GRS'},
  { value: 'HUNU', label:'HUNU'},
  { value: 'LFS', label:'LFS'},
  { value: 'LWS', label:'LWS'},
  { value: 'PLNT', label:'PLNT'},
  { value: 'SOIL', label:'SOIL'},
]

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      courses: [],
      activeTerm: 'W',
      syllabi: false,
      resultCourses: []
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
        courses: exampleInputW,
        resultCourses: exampleInputW
      })
    } else {
      this.setState({
        courses: exampleInputS,
        resultCourses: exampleInputS
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

    let filteredCourses = filteredCoursesList.filter(courses => courses.length !== 0)

    if (filteredCourses) {
      this.setState({
        resultCourses: filteredCourses
      })
    }
  }
  
  handleSelection = async (event) => {
    if (event.value === '-') {
      return this.componentDidMount()
    } else {
      await this.componentDidMount()
      let selectedCourseList = this.state.courses.map(courses =>
        courses.filter(course => {
          return (course.dept === event.value)
        }))
      selectedCourseList = selectedCourseList.filter(courses => courses.length !== 0)
      this.setState({
        resultCourses:selectedCourseList
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
          <Col>
          <Select
            className='basic-single'
            classNamePrefix='select'
            defaultValue={options[0]}
            options= {options}
            onChange={this.handleSelection}
            />
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
            resultCourses={this.state.resultCourses}
            syllabi={this.state.syllabi}/>
        </Row>
      </Grid>
    )
  }
}

export default App