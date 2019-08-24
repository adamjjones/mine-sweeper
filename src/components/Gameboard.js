import React, { Component } from 'react'
import Axios from 'axios'
import Populateboard from './Populateboard'

export class Gameboard extends Component {
  state = {
    board: []
  }

  componentDidMount() {
    // console.log('1')
    Axios({
      method: 'post',
      url: 'http://minesweeper-api.herokuapp.com/games'
    }).then(result => {
      // console.log('3')
      this.setState({
        board: result.data.board
      })
    })
  }

  createCell = () => {
    // console.log('4')
    console.log(this.state.board)
    const rows = this.state.board.map(row => {
      const cells = row.map(value => {
        return <td className="cell">{value}</td>
      })
      return <tr className="row">{cells}</tr>
    })
    return rows
  }

  render() {
    // console.log('2')
    return (
      <div>
        <table className="table">
          <tbody>{this.createCell()}</tbody>
        </table>
      </div>
    )
  }
}

export default Gameboard
