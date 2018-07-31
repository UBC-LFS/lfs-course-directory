import React from 'react'
import { Table } from 'react-bootstrap'
/*
* Props: courses - list of courses to render
* Renders a table of courses with links to their syllabi
*/

class ResultsTable extends React.Component {
  render() {
    if (!this.props.syllabi) {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Department</th>
              <th>Section</th>
              <th>Description</th>
              <th>Syllabus</th>
            </tr>
          </thead>
          <tbody>
            {this.props.resultCourses.map(course => {
              return (
                course.map(coursesByDept => {
                  return (
                    <tr key={coursesByDept.dept + coursesByDept.course + coursesByDept.description + coursesByDept.syllabus}>
                      <th style={{ fontWeight: 'normal' }}>
                        {coursesByDept.dept}
                      </th>
                      <th style={{ fontWeight: 'normal' }}>
                        {coursesByDept.course}
                      </th>
                      <th style={{ fontWeight: 'normal' }}>
                        {coursesByDept.description}
                      </th>
                      <th style={{ fontWeight: 'normal' }}>
                        {coursesByDept.syllabus}
                      </th>
                    </tr>
                  )
                })
              )
            })}
          </tbody>
        </Table>
      )
    } else {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Department</th>
              <th>Section</th>
              <th>Description</th>
              <th>Syllabus</th>
            </tr>
          </thead>
          <tbody>
            {this.props.resultCourses.map(course => {
              return (
                course.map(coursesByDept => {
                  if (coursesByDept.syllabus) {
                    return (
                      <tr key={coursesByDept.dept + coursesByDept.course + coursesByDept.description + coursesByDept.syllabus}>
                        <th style={{ fontWeight: 'normal' }}>
                          {coursesByDept.dept}
                        </th>
                        <th style={{ fontWeight: 'normal' }}>
                          {coursesByDept.course}
                        </th>
                        <th style={{ fontWeight: 'normal' }}>
                          {coursesByDept.description}
                        </th>
                        <th style={{ fontWeight: 'normal' }}>
                          {coursesByDept.syllabus}
                        </th>
                      </tr>
                    )
                  } else {
                    return (
                      <tr></tr>
                    )
                  }
                })
              )
            })}
          </tbody>
        </Table>
      )
    }
  }
}

export default ResultsTable
