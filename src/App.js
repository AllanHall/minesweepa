import React, { Component } from 'react'
import Header from './components/Header'
import { blockParams } from 'handlebars'

class App extends Component {
  state = {
    game: {},
    board: [],
    display: '',
    value: '0',
    overlayDisplay: 'none'
  }
  componentDidMount() {
    this.resetGame()
  }

  checkGame = (row, column) => {
    fetch(
      `https://minesweeper-api.herokuapp.com/games/${this.state.game.id}/check`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ row: row, col: column })
      }
    )
      .then(resp => {
        return resp.json()
      })
      .then(gameData => {
        this.setState({
          game: gameData,
          board: gameData.board
        })
        if (this.state.game.state === 'won') {
          this.setState({
            display: 'Winner!',
            overlayDisplay: 'block'
          })
        } else if (this.state.game.state === 'lost') {
          this.setState({
            display: 'Oh no, I lost!',
            overlayDisplay: 'block'
          })
        }
      })
  }

  resetGame = () => {
    fetch('https://minesweeper-api.herokuapp.com/games', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        difficulty: this.state.value
      })
    })
      .then(resp => {
        return resp.json()
      })
      .then(gameData => {
        this.setState({
          game: gameData,
          board: gameData.board
        })
        this.setState({
          display: ''
        })
      })
  }

  flagGame = (e, row, column) => {
    e.preventDefault()
    fetch(
      `https://minesweeper-api.herokuapp.com/games/${this.state.game.id}/flag`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ row: row, col: column })
      }
    )
      .then(resp => {
        return resp.json()
      })
      .then(gameData => {
        this.setState({
          game: gameData,
          board: gameData.board
        })
      })
  }

  updateDifficulty = event => {
    console.log(event.target.value)
    this.setState(
      {
        value: event.target.value
      },
      () => {
        this.resetGame()
      }
    )
  }

  // Overlay

  closeOverlay = () => {
    this.setState({
      overlayDisplay: 'none'
    })
    this.resetGame()
  }

  render() {
    return (
      <>
        <Header />
        <select className="select" onChange={this.updateDifficulty}>
          <option value="0" selected>
            Easy
          </option>
          <option value="1">Medium</option>
          <option value="2">Hard</option>
        </select>
        <table className="main">
          <tbody className="game-box">
            {this.state.board.map((row, i) => {
              return (
                <tr key={i}>
                  {row.map((column, j) => {
                    return (
                      <td
                        className="cell"
                        key={j}
                        onClick={() => this.checkGame(i, j)}
                        onContextMenu={e => this.flagGame(e, i, j)}
                      >
                        {this.state.board[i][j]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <div
          className="overlay"
          style={{
            display: `${this.state.overlayDisplay}`
          }}
        >
          <div className="overlay-display">
            <div className="winner-display">{this.state.display}</div>
            <button className="close" onClick={() => this.closeOverlay()}>
              New Game?
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default App
