import React, {Component} from 'react';
import {SquareTarget} from './square';
import DragSnapContext from '../../lib/drag-snap-context';
import {DraggablePiece} from './piece';
import './styles.css';

const ROWS = 8;
const SPRING_CONFIG = {stiffness: 600, damping: 30};

class ChessBoard extends Component {
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
				<DragSnapContext springConfig={SPRING_CONFIG}>
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
										{piece && <DraggablePiece piece={piece} dragData={{piece, position}} dragMode="clone"/>}
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