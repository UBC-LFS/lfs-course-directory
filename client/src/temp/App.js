// import React, { Component } from 'react'
// import logo from './logo.svg'
// import { Grid, Row, Col, FormControl } from 'react-bootstrap';
// import './App.css'
// // import { LFSDepts, buildURL } from './util/constants'
// // import { getYear } from './util/get'

// class App extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       courses: [],
//       activeTerm: 'W'
//     }
//   }

//   componentDidMount () {
//     this.getCoursesForTerm(this.state.activeTerm)
//   }

//   getCoursesForTerm = async (term) => {
//     const courses = await fetch(`http://localhost:8081/${term}`)
//     .then(x => x.json())
//     this.setState({
//       courses: courses
//     })
//   }

//   render () {
//     return (
//       <Grid>
//         <Row>
//           <Col>
//             <h2>Syllabi Archive</h2>
//           </Col>
//         </Row>
//         <Row>
//           <FormControl type="text" inputRef={el => this.searchbar = el} onChange={this.handleSearchInputUpdate} 
//             placeholder="Search a course code... (ex: FNH200)">
//           </FormControl>
//         </Row>
//         <br />
//         <Row>
//         </Row>
//       </Grid>
//     )
//   }
// }

// export default App
