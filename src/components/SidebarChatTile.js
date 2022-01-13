import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* Importing Material Icons */
import { Avatar } from '@material-ui/core';

/* firebase import */
import { db } from './Firebase';

function SidebarChatTile({ chatRoom }) {
	const [lastMessage, setLastMessage] = useState('');

	/* useEffect to retrieve lastMessage for a chatRoom */
	useEffect(() => {
		const unsubscribe = db
			.collection('chatRooms')
			.doc(chatRoom.id)
			.collection('messages')
			.orderBy('timestamp', 'asc')
			.onSnapshot((snapshot) => {
				const n = snapshot.docs.length;
				if (n > 0) setLastMessage(snapshot.docs[n - 1].data().message);
			});
		return unsubscribe;
	}, [chatRoom]);

	/* function to compress the last message of a chatRoom */
	const compress = (s) => {
		if (s.length <= 45) return s;
		return s.slice(0, 45) + '...';
	};

	return (
		<Link to={`/${chatRoom.id}`}>
			<div className='sidebarChatTile'>
				<Avatar
					src={chatRoom.photoURL}
					style={{ height: '50px', width: '50px' }}
				/>
				<div className='sidebarChatTileData'>
					<h4>{chatRoom.name}</h4>
					<p style={{ fontSize: '15px' }}>{compress(lastMessage)}</p>
				</div>
			</div>
		</Link>
	);
}

export default SidebarChatTile;
