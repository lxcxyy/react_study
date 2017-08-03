import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function calculateWinner(squares){
	let whiteNum = 0;
	let blackNum = 0;
	let flag = true;
	for(let i = 0; i < 64; i++){
		if(squares[i] === "Black"){
			blackNum ++;
		}
		else if(squares[i] === "White"){
			whiteNum ++;
		}
		else{
			flag = false;
			break;
		}
	}
	if (flag){
		if(whiteNum > blackNum){
			return "White";
		}
		else if(whiteNum < blackNum){
			return "Black";
		}
		else{
			return "Draw";
		}
	}
	else{
		return flag;
	}
}
function indexToPos(index){
	return{
		y: parseInt(index / 8),
		x: index % 8,
	};
}
function posToIndex(x,y){
	if(x > 8 || x < 0 || y > 8 || y < 0){
		return -1;
	}
	return x+y*8;
}
function Reversi(squares,num){
	const curPos = indexToPos(num);
	const square = squares[num];
	const dirArr = [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1}];
	let newsquares = squares.slice();
	for(let i = 0; i < 4; i++){
		let dir = dirArr[i];
		let step = 1,stepAdd = 1;
		while(true){
			let next = posToIndex(curPos.x + step*dir.x,curPos.y + step*dir.y);
			if(!squares[next] || square === squares[next]){
				if(step > 0){
					step = stepAdd = -1;
					continue;
				}else{
					break;
				}
			}else{
				while(true){
					step += stepAdd;
					next = posToIndex(curPos.x + step*dir.x,curPos.y + step*dir.y);
					if(next < 0 || next > 63 || !squares[next]){
						break;
					}else if(square === squares[next]){
						for(; step != 0; step -= stepAdd){
							next = posToIndex(curPos.x + step*dir.x,curPos.y + step*dir.y);
							newsquares[next] = square;
						}
						break;
					}
				}
			}
		}
	}
	if(newsquares.toString() === squares.toString()){
		return false;
	}
	else{
		return newsquares;
	}
}
class Square extends React.Component {
	render(){
		var classString = 'chesspiece';
	  if (this.props.value === "Black") {
	    classString += ' black';
	  }
	  else if(this.props.value === "White") {
	    classString += ' white';
	  }
	  else {
	  	classString += ' none';
	  }
		return(
			<div className="square" onClick = {() => this.props.onClick()}>
				<div className={classString}></div>
			</div>
		)
	}
}
class Board extends React.Component {
	renderSquare(i){
		return <Square value={this.props.squares[i]} onClick = {() => this.props.onClick(i)}/>;
	}
	render(){
		const board = () => {
			let res = [];
			for(let i = 0; i < 8; i++){
				res.push(<div className="board-row"></div>);
				for(let j = 0; j < 8; j++){
					res.push(this.renderSquare(i*8+j));
				}
			}
			return res
		};
		return(
			<div>
				{board()}
			</div>
		)
	}
}
class Game extends React.Component {
	constructor(){
		super();
		let squares = Array(64).fill(null);
		squares[36] = squares[27] = "White";
		squares[35] = squares[28] = "Black";
    this.state = {
      history: [{
      	squares: squares,
      }],
      stepNumber: 0,
      blackIsNext: true,
    }
	}
	handleClick(i){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.blackIsNext ? 'Black' : 'White';
    if(Reversi(squares,i)){
	    squares = Reversi(squares,i);
	    this.setState({
	      history: history.concat([{
	        squares: squares
	      }]),
	      stepNumber: history.length,
	      blackIsNext: !this.state.blackIsNext,
	    });
	  }
	  else{
	  	alert("you can't reversi the other's chesspiece.you can't do this!");
	  }
	}
	jumpTo(step) {
    this.setState({
      stepNumber: step,
      blackIsNext: (step % 2) ? false : true,
    });
  }
	render(){
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });
    let status;
    let classString = 'status chesspiece';
    if (winner) {
    	if(winner === "Draw"){
    		status = 'It ends in a draw';
      	classString += ' none';
    	}
    	else{
      	status = 'Winner: ' + winner;
      	classString += (winner==="Black"? ' black':' white');
    	}
    } else if(this.state.blackIsNext){
      status = 'Next player: Black';
	    classString += ' black';
    }else if(!this.state.blackIsNext) {
	    status = 'Next player: White';
	    classString += ' white';
	  }
		return(
			<div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
        	<div><h2>Othello</h2></div>
          <div>{status}<div className={classString}></div></div>
          <ol>{moves}</ol>
        </div>
      </div>
		)
	}
}
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);