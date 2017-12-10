import React, {Component} from 'react';
import {DraggableAvatar} from './avatar';
import {AvatarContainer} from './avatar-container';
import {TrapTarget} from './trap';
import DragSnapContext from '../../lib/drag-snap-context';
import {max} from './utils/max';
import {extend} from './utils/extend';
import {getOrigo} from './utils/point-utils';
import {randomlyOneOf, randomInRange} from './utils/random-utils';
import {EdgeSnapTarget} from './edge-snap-target';
import {ScaleEntry} from '../shared/scale-entry';
import './styles.css';

//{stiffness: 180, damping: 12} (wobbly gives a pretty nice effect, although more wobbly that fb)
//{stiffness: 120, damping: 14} (gentle) is also alright...
const SPRING_CONFIG = {stiffness: 120, damping: 14};

class FloatingHeadsDemo extends Component {
	constructor(props) {
		super(props);

		this.state = {
			users: [{id: 0, x: -50, y: -25, z: 0}],
			trappedUser: null,
			trappedUserPosition: getOrigo(),
			isDragging: false
		};
	}

	getNextUserId() {
		return {id: (max(this.state.users.map((u) => u.id))) + 1};
	}

	getNextZIndex() {
		return {z: (max(this.state.users.map((u) => u.z))) + 1};
	}

	addUser() {
		const startPosition =  {
			x: randomlyOneOf(-50, 50),
			y: randomInRange(-50, 50)
		};

		this.setState({
			users: [
				...this.state.users,
				extend(this.getNextUserId(), this.getNextZIndex(), startPosition)
			]
		})
	}

	updateUser({dragData, transform, targetWidth, targetHeight}) {
		const {users} = this.state;
		const position = {
			x: (transform.x)/targetWidth * 100,
			y: (transform.y)/targetHeight * 100
		};

		this.setState({
			users: users.map((user) => (user.id === dragData.id) ? extend(user, position, this.getNextZIndex()) : user)
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
			<div className="app-container">
				<div className={`gradient ${isDragging ? 'show-gradient' : ''}`}/>
				<div className="margin-container">
					<DragSnapContext
						onDragStart={() => this.setState({isDragging: true, trappedUser: null})}
						onDragResume={() => this.setState({isDragging: true})}
						onDragEnding={() => this.setState({isDragging: false})}
						springConfig={SPRING_CONFIG}
					>
						<EdgeSnapTarget
							snapPriority={2}
							onDropComplete={this.updateUser.bind(this)}
						/>
						<ScaleEntry className="avatars" entries={users} idProp="id">
							{
								(user, scale) => (
									<AvatarContainer {...user} scale={scale} key={user.id}>
										<DraggableAvatar
											onClick={() =>alert('hej')}
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
								springConfig={SPRING_CONFIG}
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