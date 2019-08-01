import React, { Component } from 'react'
import Header from './components/Header'

import sound from './sounds/sound.mp3'

const width = 2600
const height = 900

const game = new Phaser.Game(width, height, Phaser.AUTO, 'phaser-example', {
  preload: preload,
  create: create,
  update: update
})

const sprite
const deadGroup = null

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

  preload() {
    game.load.crossOrigin = 'Anonymous'
    game.load.spritesheet(
      'ms',
      'https://jjwallace.github.io/assets/examples/images/boom.png',
      256,
      256,
      64
    )
  }

  create() {
    createSprite(
      random(0, width),
      random(0, height),
      randomRotation(),
      Math.floor(Math.random() * 30)
    )
  }

  createSprite(x, y, r, f) {
    deadGroup = game.add.group()
    sprite = game.add.sprite(40, 100, 'ms')
    sprite.x = x
    sprite.y = y
    sprite.angle = r
    var anim = sprite.animations.add('boom')
    anim.frame = f
    anim.play('boom', 60, false)
    anim.killOnComplete = true
    anim.onComplete.add(function() {
      deadGroup.add(this)
    }, sprite)
  }

  update() {
    if (deadGroup != null) {
      deadGroup.forEach(function(sprite) {
        console.debug('destroying:', sprite.name)
        sprite.destroy()
        console.log('destroyed: ', sprite)
      })
    }
    createSprite(random(0, width), random(0, height), randomRotation(), 0)
  }

  random(min, max) {
    return Math.floor(Math.random() * max + min)
  }

  randomRotation() {
    return Math.floor(Math.random() * 180 - 180)
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
            display: 'Oh no, you lost!',
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

  checkCell = cell => {
    let cellClass = 'cell'
    if (cell === 'F') {
      cellClass += ' flag'
    }
    if (cell === '*') {
      cellClass += ' bomb'
    }
    return cellClass
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
                        className={this.checkCell(this.state.board[i][j])}
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
        <figure>
          <figcaption>Minecraft Music</figcaption>
          <audio src={sound} controls>
            Your browser does not support the audio element.
          </audio>
        </figure>
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
