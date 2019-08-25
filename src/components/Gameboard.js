import React, { Component } from 'react'
import Axios from 'axios'

export class Gameboard extends Component {
  constructor() {
    super()
    this.getCurrentGameState = this.getCurrentGameState.bind(this)
    this.postAction = this.postAction.bind(this)
    this.clickHandler = this.clickHandler.bind(this)
    this.createNewGame = this.createNewGame.bind(this)

    this.state = {
      board: [],
      turn: 1,
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
      const newState = Object.assign(this.state, result.data)
      newState.turn++
      this.setState(newState)

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
      // if (this.state.state == lost) {
      //   return <h1> You have lost </h1>
      // }
      this.setState(Object.assign(this.state, result.data))
      // this.setState({
      //   id: result.data.id,
      //   board: result.data.board,
      //   state: result.data.state,
      //   mines: result.data.mines
      // })
    })
  }

  renderValue(value) {
    console.log('value', value)
    switch (value) {
      case 1:
        return (
          <span class="fa-stack fa-1x style-1">
            <i className="fa fa-stack-1x fa-square-o"></i>
            <strong className="fa fa-stack-1x">1</strong>
          </span>
        )
      case 2:
        return (
          <span class="fa-stack fa-1x style-2">
            <i className="fa fa-stack-1x fa-square-o"></i>
            <strong className="fa fa-stack-1x">2</strong>
          </span>
        )
      case 3:
        return (
          <span class="fa-stack fa-1x style-3">
            <i className="fa fa-stack-1x fa-square-o"></i>
            <strong className="fa fa-stack-1x">3</strong>
          </span>
        )
      case '*':
        return <i className="fa fa-bomb style-bomb"></i>
    }
    return value
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
            {this.renderValue(value)}
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
  composeGameMessage() {
    switch (this.state.state) {
      case 'new':
        return 'Here we go!'
      case 'playing':
        return `Turn #${this.state.turn}`
      case 'lost':
        return 'You lost!'
      case 'won':
        return 'You won!'
      default:
        return `state = ${this.state.state}`
    }
  }

  render() {
    // console.log('2')
    const gameOver = this.state.state === 'lost' || this.state.state === 'won'
    const startOverButton = gameOver ? (
      <div className="startover">
        <button onClick={this.createNewGame}>Play again</button>
      </div>
    ) : (
      ''
    )
    return (
      <div id="gameboard">
        <div id="game">
          <h1 id="game-message">{this.composeGameMessage()}</h1>
          <table className="table">
            <tbody>{this.createCell()}</tbody>
          </table>
        </div>
        {startOverButton}
        {/* <div id="debug">
          <pre>{JSON.stringify(this.state, ' ', 2)}</pre>
        </div> */}
      </div>
    )
  }
}

export default Gameboard
