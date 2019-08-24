import React, { Component } from 'react'
import Axios from 'axios'

export class Gameboard extends Component {
  constructor() {
    super()
    this.getCurrentGameState = this.getCurrentGameState.bind(this)
    this.postAction = this.postAction.bind(this)
    this.clickHandler = this.clickHandler.bind(this)

    this.state = {
      board: [],
      id: 0
    }
  }

  // console.log('1')
  componentDidMount() {
    this.createNewGame()
  }
  createNewGame() {
    Axios({
      method: 'post',
      url: 'http://minesweeper-api.herokuapp.com/games'
    }).then(result => {
      // console.log('3')
      this.setState(Object.assign(this.state, result.data))
      // this.setState({
      //   board: result.data.board,
      //   id: result.data.id
      // })
    })
  }

  clickHandler(event) {
    event.persist()
    const action = event.ctrlKey ? 'flag' : 'check'
    const row = event.target.getAttribute('row')
    const col = event.target.getAttribute('col')
    this.postAction(action, row, col)
  }
  postAction(action, row, col) {
    Axios({
      method: 'post',
      url: `http://minesweeper-api.herokuapp.com/games/${this.state.id}/${action}`,
      data: {
        id: this.state.id,
        row: row,
        col: col
      }
    }).then(result => {
      console.log('result', result)
      this.setState(Object.assign(this.state, result.data))
      // this.setState({
      //   board: result.data.board,
      //   id: result.data.id,
      //   state: result.data.state,
      //   mines: result.data.mines
      // })
    })
  }

  getCurrentGameState() {
    console.log('getCurrentGameState called', this)
    Axios({
      method: 'get',
      url: `http://minesweeper-api.herokuapp.com/games/${this.state.id}`
    }).then(result => {
      console.log(result)
      this.setState(Object.assign(this.state, result.data))
      // this.setState({
      //   id: result.data.id,
      //   board: result.data.board,
      //   state: result.data.state,
      //   mines: result.data.mines
      // })
    })
  }

  createCell = () => {
    // console.log('4')
    console.log(this.state.board)
    let countRow = 0
    const rows = this.state.board.map(row => {
      let countCell = -1
      const cells = row.map(value => {
        countCell++
        return (
          <td
            onClick={this.clickHandler}
            onContextMenu={this.clickHandler}
            key={`cell-${countCell}`}
            row={countRow}
            col={countCell}
            className="cell"
          >
            {value}
          </td>
        )
      })
      countRow += 1
      return (
        <tr key={`row-${countRow}`} className="row">
          {cells}
        </tr>
      )
    })
    return rows
  }

  render() {
    // console.log('2')
    return (
      <div id="gameboard">
        <div id="game">
          <h1>{this.state.state}</h1>
          <table className="table">
            <tbody>{this.createCell()}</tbody>
          </table>
          <button onClick={this.getCurrentGameState}>Get Game State</button>
        </div>
        <div id="debug">
          <pre>{JSON.stringify(this.state, ' ', 2)}</pre>
        </div>
      </div>
    )
  }
}

export default Gameboard
