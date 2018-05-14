import React from 'react';
import {DraggableAvatar} from './avatar';
import {AvatarContainer} from './avatar-container';
import {TrapTarget} from './trap';
import {DragSnapContext} from '../lib-proxy';
import {max} from './utils/max';
import {extend} from './utils/extend';
import {getOrigo} from './utils/point-utils';
import {randomlyOneOf, randomInRange} from './utils/random-utils';
import {EdgeSnapTarget} from './edge-snap-target';
import {ScaleEntry} from '../shared/scale-entry';
import {EDGES} from './utils/edge-utils';
import './styles.css';

const AVATAR_DIAMETER = 64;
const MARGIN = 24;

class FloatingHeadsDemo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: [],
			trappedUser: null,
			trappedUserPosition: getOrigo(),
			isDragging: false
		};

		this.boundUpdateSizeMeasurement = this.updateSizeMeasurement.bind(this);
	}

	componentDidMount() {
		this.updateSizeMeasurement();
		window.addEventListener('resize', this.boundUpdateSizeMeasurement);

		this.setState({users: [{id: 0, x: 0, y: this.size.height/2 - MARGIN, z: 0, rotation: 90}]});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.boundUpdateSizeMeasurement);
	}

	updateSizeMeasurement() {
		this.size = {
			width: this.container.clientWidth,
			height: this.container.clientHeight
		};	
	}

	getRotation({x, y}) {
		let rotation = EDGES.right.rotation;
		rotation = (x === 0) ?  EDGES.left.rotation : rotation;
		rotation = (y === this.size.height - 2 * MARGIN) ? EDGES.bottom.rotation : rotation;
		rotation = (y === 0) ? EDGES.top.rotation: rotation;
		return rotation;	
	}

	getNextUserId() {
		return {id: (max(this.state.users.map((u) => u.id))) + 1};
	}

	getNextZIndex() {
		return {z: (max(this.state.users.map((u) => u.z))) + 1};
	}

	addUser() {
		const startPosition = {
			x: randomlyOneOf(0, this.size.width - 2 * MARGIN),
			y: randomInRange(0, this.size.height - 2 * MARGIN),
		};

		this.setState({
			users: [
				...this.state.users,
				extend(this.getNextUserId(), this.getNextZIndex(), startPosition, {rotation: this.getRotation(startPosition)})
			]
		})
	}

	updateUser({dragData, transform}, {width, height}) {
		const {users} = this.state;
		//Convert center based coordinates to coordinate system with origo in upper left corner
		const position = {
			x: transform.x + this.size.width/2 - MARGIN,
			y: transform.y + this.size.height/2 - MARGIN
		};

		this.setState({
			users: users.map((user) => (user.id === dragData.id) 
				? extend(user, position, this.getNextZIndex(), {rotation: this.getRotation(position)}) 
				: user)
		});
	}

	trapUser({dragData, transform}) {
		this.setState({
			users: this.state.users.filter((user) => user.id !== dragData.id),
			trappedUser: this.state.users.find((user) => user.id === dragData.id),
			trappedUserPosition: {x: transform.x, y: transform.y}
		});
	}

	killUser() {
		this.setState({trappedUser: null, trappedUserPosition: getOrigo()});
	}

	render() {
		const {isDragging, trappedUser, trappedUserPosition, users} = this.state;

		return (
			<div className="app-container" ref={(container) => this.container = container}>
				<div className={`gradient ${isDragging ? 'show-gradient' : ''}`}/>
				<div className="margin-container">
					<DragSnapContext
						onChange={({grabbedCount, draggedCount}) => {
							if (grabbedCount || draggedCount) {
								this.setState({isDragging: true});
							} else {
								this.setState({isDragging: false, trappedUser: null});
							}
						}}
					>
						<EdgeSnapTarget
							snapPriority={2}
							onDropComplete={this.updateUser.bind(this)}
						/>
						<ScaleEntry className="avatars" entries={users} idProp="id">
							{
								(user, scale) => (
									<AvatarContainer {...user} diameter={AVATAR_DIAMETER} scale={scale} key={user.id}>
										<DraggableAvatar
											dragData={user}
											id={user.id}
										/>
									</AvatarContainer>
								)
							}
						</ScaleEntry>
						<div className="trap-container">
							<TrapTarget
								snapPriority={1}
								show={isDragging && !trappedUser}
								onDropStart={this.trapUser.bind(this)}
								onKillUser={() => this.killUser()}
								trappedUser={trappedUser}
								trappedUserPosition={trappedUserPosition}
							/>
						</div>
						<button onClick={() => this.addUser()} className="add-button"/>
					</DragSnapContext>
				</div>
			</div>
		);
	}
}

export {FloatingHeadsDemo};