import React from 'react';
import {SquareTarget} from './square';
import {DragSnapContext} from '../lib-proxy';
import {DraggablePiece} from './piece';
import './styles.css';

const ROWS = 8;
class ChessBoard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			knightPosition: [0, 0]
		};
	}

	getPieceAtPosition([x, y]) {
		const [kx, ky] = this.state.knightPosition;
		return (x === kx && y === ky) ? 'knight' : null;
	}

	render() {
		return (
			<div className="chess-demo">
				<DragSnapContext>
					<div className="chess-board">
						{
							Array(Math.pow(ROWS, 2)).fill().map((_, i) => {
								const position = [i % ROWS, Math.floor(i/ROWS)];
								const piece = this.getPieceAtPosition(position);

								return (
									<SquareTarget
										onDropComplete={() => this.setState({knightPosition: position})}
										width={`${100/ROWS}%`}
										height={`${100/ROWS}%`}
										position={position}
										key={i}
									>
										{piece && <DraggablePiece piece={piece} dragData={{piece, position}}/>}
									</SquareTarget>
								);
							})
						}
					</div>
				</DragSnapContext>
			</div>
		);
	}
}

export {ChessBoard};