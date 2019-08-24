import React, { Component } from 'react'
import Axios from 'axios'
import Gameboard from './Gameboard'

class Populateboard extends Component {
  componentDidMount() {
    // console.log('1')
    Axios({
      method: 'get',
      url: 'http://minesweeper-api.herokuapp.com/games' + `${this.board}`
    }).then(result => {
      console.log(result)
      this.setState({
        board: result.data.board
      })
    })
  }

  render() {
    return <Gameboard />
  }
}
