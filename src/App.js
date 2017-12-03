import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.board = [];
    this.cols = 50;
    this.rows = 30;
    this.speed= 100;
    this.state = {
      fullBoard: [],
      generation:0,
      isPlaying: true,
    };
    this.togglePlay = this.togglePlay.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.resetMap = this.resetMap.bind(this);
    this.resetCount = this.resetCount.bind(this);
    this.checkCount = this.checkCount.bind(this);
    this.createRandomMap = this.createRandomMap.bind(this);
    this.nextGeneration = this.nextGeneration.bind(this);
    this.toggleBoxIsAlive = this.toggleBoxIsAlive.bind(this);
    this.setSlow=this.setSlow.bind(this);
    this.setMedium=this.setMedium.bind(this);
    this.setFast=this.setFast.bind(this);
  }

  componentDidMount() {
    // create initial random map
      this.createRandomMap();
      this.interval = setInterval(this.nextGeneration, this.speed);

  }
  createRandomMap() {
    for(let i = 0; i < this.rows; i++) {
      this.board.push([]);
      for(let j = 0; j < this.cols; j++) {
        this.board[i].push({ count : 0, isalive: Math.random(0,1) < 0.5 ? false : true,})
      }
    }
    this.setState({
      fullBoard: this.board,
    });
  }
  checkCount(){
    this.resetCount();
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        if(this.board[i][j].isalive) {
          if(i>0 && j>0) {this.board[i-1][j-1].count++;}
          if(i>0) {this.board[i-1][j].count++;}
          if(i>0 && j<(this.cols-1)) {this.board[i-1][j+1].count++;}
          if(j>0) {this.board[i][j-1].count++;}
          if(j<(this.cols-1)) {this.board[i][j+1].count++;}
          if(i<(this.rows-1) && j>0) {this.board[i+1][j-1].count++;}
          if(i<(this.rows-1)) {this.board[i+1][j].count++;}
          if(i<(this.rows-1) && j<(this.cols-1)) {this.board[i+1][j+1].count++;}
        }
      }
    }
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        switch (this.board[i][j].count) {
          case 2:
            break;
          case 3:
            this.board[i][j].isalive=true;
            break;
          default:
            this.board[i][j].isalive=false;
            break;
        }
      }
    }
  }
  resetCount() {
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        this.board[i][j].count = 0 ;
        }
      }
  }
  resetMap() {
    clearInterval(this.interval);
      this.board = [];
      for(let i = 0; i < this.rows; i++) {
        this.board.push([]);
        for(let j = 0; j < this.cols; j++) {
          this.board[i].push({ count : 0, isalive: false,});
        }
      }
      this.setState({
        generation:1,
        isPlaying: false,
        fullBoard: this.board,
      });


  }
  togglePlay() {
    clearInterval(this.interval);
    if(!this.state.isPlaying) {
    this.interval = setInterval(this.nextGeneration, this.speed);
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }
  nextGeneration() {
    this.checkCount();
    if(this.state.isPlaying){
      this.setState({
        fullBoard: this.board,
        generation: this.state.generation + 1,
      });
    }

    }

  toggleBoxIsAlive(e) {
    var index = e.target.id.split('_');
    this.board[index[0]][index[1]].isalive = !this.board[index[0]][index[1]].isalive;
    this.setState({
      fullBoard: this.board,
    });

  }
  setSlow() {
    clearInterval(this.interval);
    this.speed=700;
    this.interval = setInterval(this.nextGeneration, this.speed);
  }
  setMedium() {
    clearInterval(this.interval);
    this.speed=400;
    this.interval = setInterval(this.nextGeneration, this.speed);
}
  setFast() {
    clearInterval(this.interval);
    this.speed=100;
    this.interval = setInterval(this.nextGeneration, this.speed);
}
  render() {
    if(this.state.generation > 0) {
      var fieldList = [];
      for (let i = 0; i<this.rows; i++) {
        for (let j = 0; j<this.cols; j++) {
          fieldList.push(<Box key={i.toString()+'_'+j.toString()} id={i.toString()+'_'+j.toString()} handleClick={this.toggleBoxIsAlive} isalive={this.state.fullBoard[i][j].isalive} className={this.state.fullBoard[i][j].isalive.toString()}/>);
        }
      }
    }
    return (
      <div className="app">
        <h1>Game of life</h1>
          <div className="buttons">
            <Button onClick={this.togglePlay} text={this.state.isPlaying ? "Pause" : "Play"}/>
            <Button onClick={this.resetMap} text="Reset"/>
            <Generation text={this.state.generation}/>
          </div>

          <div id="board">
              {fieldList}
          </div>
          <div className="buttons">
            <Button onClick={this.setSlow} text=">"/>
            <Button onClick={this.setMedium} text=">>"/>
            <Button onClick={this.setFast} text=">>>"/>
          </div>
      </div>
    );
  }
}
class Box extends Component {
  constructor(props){
    super(props);
    this.shouldComponentUpdate=this.shouldComponentUpdate.bind(this);
    }
    shouldComponentUpdate(nextProps) {
    return this.props.className !== nextProps.className || this.props.isalive === !nextProps.isalive;
  }
  render() {
    return <div id={this.props.id} className={this.props.className} onClick={this.props.handleClick}></div>;
  }
}
class Button extends Component {
  constructor(props){
    super(props);
    this.shouldComponentUpdate=this.shouldComponentUpdate.bind(this);
    }
    shouldComponentUpdate(nextProps) {
    return this.props.text !== nextProps.text;
  }
  render() {
    return <div className="option" onClick={this.props.onClick}>{this.props.text}</div>;
  }
}
class Generation extends Component {

  render() {
    return <div id="generation">Generation:{this.props.text}</div>;
  }
}

export default App;
