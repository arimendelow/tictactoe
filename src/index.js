import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


// Sqaure is a "function component" - a simpler way to write components that only contain a 'render' method and don't have their own state 
// This function takes props as input and returns what should be rendered.
function Square(props) {
	return (
	  <button className="square" onClick={props.onClick}>
		{props.value}
	  </button>
	);
  }
  
  class Board extends React.Component {  
	renderSquare(i) {
	  // - split this return element into multiple lines for readibility
	  // - added parentheses so that JS doesn't insert a semicolon after 'return' and break our code
	  return (
		// Passing down two props from Board to Square: 'value' and 'onClick'
		// - The onClick prop is a function that Square can call when clicked
		<Square
		  value={this.props.squares[i]}
		  // "() => ..." is the same as "function() {...}"
		  onClick={() => this.props.onClick(i)}
		/>
	  );
	}
  
	render() {
	  return (
		<div>
		  <div className="board-row">
			{this.renderSquare(0)}
			{this.renderSquare(1)}
			{this.renderSquare(2)}
		  </div>
		  <div className="board-row">
			{this.renderSquare(3)}
			{this.renderSquare(4)}
			{this.renderSquare(5)}
		  </div>
		  <div className="board-row">
			{this.renderSquare(6)}
			{this.renderSquare(7)}
			{this.renderSquare(8)}
		  </div>
		</div>
	  );
	}
  }
  
class Game extends React.Component {
	// Game will keep track of the state of the game and fully control it
	// the constructor goes in the class that tracks the game's state
	constructor(props) {
	  super(props);
	  this.state = {
		history: [{
		  squares: Array(9).fill(null),
		}],
		stepNumber: 0, // indicate which step we're currently viewing
		xIsNext: true, // for tracking whose turn it is (x or o) 
	  };
	}
	
	handleClick(i) {
		// Slice() here makes sure that if we go back in time and make a new move, we throw away all the "future" history
		// that is now incorrect.
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
	  	const current = history[history.length - 1];
		/*
			Call '.slice()' to create a copy of the squares array, and modify that instead of modifying the existing array.
			Generally two ways to modify data:
			- Mutate the data by directly changing its values
			- Replace the data with a new copy that has the desired changes
			There are several reasons to follow the second method, called immutability, a couple of which are that it makes it easier to
			undo changes as well as identify changes to the data.
			Being able to identify changes is the main benefit of immutability: it helps us build pure components in React. We can easily
			determine when a component requires re-rendering. Look more into shouldComponentUpdate() for building pure components to optimize performance.
		*/
	  	const squares = current.squares.slice();
		// If someone's already won OR the square has already been filled, return early, effectively stopping the player from going
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			// Unlike push(), concat() doesn't mutate the original array
			history: history.concat([{
				squares: squares,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext, // Flips the boolean so that users can take turns
		});
	}

	// Method for jumping to a given step
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		});
	}

	render() {
		// Use the most recent history entry to determine and display the game's status
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		
		// map our history of moves to React elements representing buttons on the screen, and siaply a list of buttons to "jump" to past moves
		const moves = history.map((step, move) => {
			const desc = move ? // 0 evaluates to false
				'Go to move #' + move :
				'Go to game start';
			return (
			/*
				list of buttons - need a key. key is a special and reserved property in React.
				When an element is created, React extracts the key property and stores the key directly on the returned element.
				Even though key may look like it belongs in props, key cannot be referenced using this.props.key.
				React automatically uses key to decide which components to update. A component cannot inquire about its key.
				Keys do not need to be globally unique, only unique between components and their siblings.
				
				In tic tac toe's game history, each past move has a unique ID associated with it: the sequential number of the move.
				Because the moves are never re-ordered, deleted, or inserted in the middle, it's safe to use the move index as the key:
			*/
			<li key={move}>
				<button onClick={() => this.jumpTo(move)}>{desc}</button>
			</li>
			);
		});

		// Set the status - check if someone's already won, and if not, state whose turn it is
		let status;
		if (winner) {
			status = winner + ' wins!!!';
		} else {
			status = (this.state.xIsNext ? 'X' : 'O') + "'s turn!";
		}
		return (
			<div className="game">
			<div className="game-board">
				<Board
				squares={current.squares}
				onClick={(i) => this.handleClick(i)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ol>{moves}</ol>
			</div>
			</div>
		);
	}
}
  
  // ========================================
  
  ReactDOM.render(
	<Game />,
	document.getElementById('root')
  );
  
  // Helper function for determining the winner of the game
  function calculateWinner(squares) {
	const lines = [
	  [0, 1, 2],
	  [3, 4, 5],
	  [6, 7, 8],
	  [0, 3, 6],
	  [1, 4, 7],
	  [2, 5, 8],
	  [0, 4, 8],
	  [2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
	  const [a, b, c] = lines[i];
	  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
		return squares[a];
	  }
	}
	return null;
  }