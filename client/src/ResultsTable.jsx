import React from 'react'
import { Table } from 'react-bootstrap'
/*
* Props: courses - list of courses to render
* Renders a table of courses with links to their syllabi
*/

class ResultsTable extends React.Component {
  render() {
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
          {this.props.filteredCourses.map(course => {
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
  }
}

export default ResultsTable
