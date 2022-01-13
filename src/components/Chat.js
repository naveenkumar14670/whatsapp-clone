import React, { useState, useEffect, useRef, useContext } from 'react';

/* Material Ui Imports */
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

/* Firebase Import */
import { db, auth } from './Firebase';
import firebase from 'firebase/app';

/* Importing useContext item form App.js */
import { userDetails } from '../App';

/* Importing required components */
import ChatProfileDrawer from './ChatProfileDrawer';
import NewParticipant from './NewParticipant';

function Chat({ chatId }) {
	const userData = useContext(userDetails);
	const messagesEndRef = useRef(null);
	const [chatData, setChatData] = useState({});
	const [messages, setMessages] = useState([]);
	const [rawMessages, setRawMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [chatProfileDrawer, setChatProfileDrawer] = useState(false);
	const [groupMembers, setGroupMembers] = useState('');
	const [newParticipantModel, setNewParticipantModel] = useState(false);

	/* useState Hook for MoreVertIcon */
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	/* State handling functions for MoreVertIcon */
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNewParticipantModel = () => {
		handleClose();
		setNewParticipantModel(!newParticipantModel);
	};

	/* function to handle detailed info of chat group */
	const handleChatProfileDrawer = () => {
		handleClose();
		setChatProfileDrawer(!chatProfileDrawer);
	};

	/* function to scroll to the bottom of the chat group */
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	/* useEffect to call scrollToBottom function upon having change in messages */
	useEffect(() => {
		scrollToBottom();
	}, [groupMembers]);

	/* useEffect to load chatGroup data */
	useEffect(() => {
		const unsubscribe = db
			.collection('chatRooms')
			.doc(chatId)
			.onSnapshot((snapshot) => {
				setChatData(snapshot.data());
			});
		return unsubscribe;
	}, [chatId]);

	/* useEffect to load messages of chatGroup */
	useEffect(() => {
		const unsubscribe = db
			.collection('chatRooms')
			.doc(chatId)
			.collection('messages')
			.orderBy('timestamp', 'asc')
			.onSnapshot((snapshot) => {
				setRawMessages([]);
				snapshot.docs.forEach((message) =>
					setRawMessages((prev) => [
						...prev,
						{ id: message.id, chatId: chatId, ...message.data() },
					])
				);
			});
		return unsubscribe;
	}, [chatId]);

	/* useEffect to load members of the group */
	useEffect(() => {
		db.collection('users')
			.where('groups', 'array-contains', chatId)
			.onSnapshot((querySnapshot) => {
				setGroupMembers('');
				querySnapshot.forEach((doc) => {
					let groupNames = '';
					groupNames += doc.data().username + ',';
					setGroupMembers((prev) => prev + groupNames);
				});
			});
	}, [chatId]);

	/* function to format the firestore timestamp to required format */
	function formatAMPM(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return strTime;
	}

	/* useEffect to format chat messages in required format */
	useEffect(() => {
		setMessages([]);
		if (rawMessages !== []) {
			let n = rawMessages.length;
			for (let i = 0; i < n; i++) {
				let newMessage;
				let d = new Date(rawMessages[i].timestamp?.toDate());
				let time = formatAMPM(d);
				const forwardConsecutive =
					i + 1 < n && rawMessages[i + 1].username === rawMessages[i].username;
				const backwardConsecutive =
					i - 1 >= 0 && rawMessages[i - 1].username === rawMessages[i].username;

				if (rawMessages[i].email === auth.currentUser.email) {
					newMessage = (
						<div
							className={`messageContainer sender ${
								forwardConsecutive ? 'mb-2' : 'mb-9'
							}`}
							key={i + 1}
						>
							<p
								className={`messagedBy ${backwardConsecutive && 'hide'}`}
								style={{ color: 'green' }}
							>
								{rawMessages[i].username}
							</p>
							{rawMessages[i].photoURL === '' ? (
								<p className='message'>{rawMessages[i].message}</p>
							) : (
								<img
									src={rawMessages[i].photoURL}
									alt='uploaded data'
									width='200px'
								/>
							)}
							<div id='deleteMessage'>
								<p className='time' style={{ color: 'gray' }}>
									{time}
								</p>
								<span>
									<DeleteForeverIcon
										onClick={() => {
											db.collection('chatRooms')
												.doc(rawMessages[i].chatId)
												.collection('messages')
												.doc(rawMessages[i].id)
												.delete();
										}}
									/>
								</span>
							</div>
						</div>
					);
				} else {
					newMessage = (
						<div
							className={`messageContainer receiver ${
								forwardConsecutive ? 'mb-2' : 'mb-9'
							}`}
							key={i + 1}
						>
							<p
								className={`messagedBy ${backwardConsecutive && 'hide'}`}
								style={{ color: 'blue' }}
							>
								{rawMessages[i].username}
							</p>
							{rawMessages[i].photoURL === '' ? (
								<p className='message'>{rawMessages[i].message}</p>
							) : (
								<img
									src={rawMessages[i].photoURL}
									alt='uploaded data'
									width='200px'
								/>
							)}
							<p className='time'>{time}</p>
						</div>
					);
				}
				setMessages((prev) => [...prev, newMessage]);
			}
		}
	}, [rawMessages]);

	/* function to submit new message by user */
	const handleSubmit = (e) => {
		e.preventDefault();
		db.collection('chatRooms').doc(chatId).collection('messages').add({
			message: inputMessage,
			username: userData.username,
			email: auth.currentUser.email,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			photoURL: '',
		});
		setInputMessage('');
	};

	const uploadImage = (e) => {
		const n = e.target.files.length;
		if (n !== 0) {
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = () => {
				var fileContent = reader.result;
				db.collection('chatRooms').doc(chatId).collection('messages').add({
					message: '',
					username: userData.username,
					email: auth.currentUser.email,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					photoURL: fileContent,
				});
			};
		}
	};

	return (
		<div id='chatContainer'>
			<div id='chat'>
				<div id='chatHeader'>
					<div id='chatHeaderLeft'>
						<IconButton onClick={handleChatProfileDrawer}>
							<Avatar src={chatData.photoURL} />
						</IconButton>
						<div style={{ marginLeft: '15px', overflowX: 'hidden' }}>
							<h4>{chatData.name}</h4>
							<p>{groupMembers}</p>
						</div>
					</div>
					<div id='chatHeaderRight'>
						<IconButton>
							<SearchIcon style={{ color: '#919191' }} />
						</IconButton>
						<IconButton
							aria-label='more'
							aria-controls='long-menu'
							aria-haspopup='true'
							onClick={handleClick}
						>
							<MoreVertIcon style={{ color: '#919191' }} />
						</IconButton>
						<Menu
							id='long-menu'
							anchorEl={anchorEl}
							keepMounted
							open={open}
							onClose={handleClose}
							getContentAnchorEl={null}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						>
							<MenuItem onClick={handleChatProfileDrawer}>Group Info</MenuItem>
							<MenuItem onClick={handleNewParticipantModel}>
								Add Participant
							</MenuItem>
						</Menu>
					</div>
				</div>

				<div id='chatBody'>
					{messages}
					<div ref={messagesEndRef} />
				</div>

				<div id='chatFooter'>
					<div id='chatFooterLeft'>
						<IconButton>
							<InsertEmoticonIcon style={{ color: '#919191' }} />
						</IconButton>
						<label for='file'>
							<AttachFileIcon style={{ color: '#919191' }} />
							<input
								type='file'
								id='file'
								style={{ display: 'none' }}
								name='image'
								accept='image/*'
								onChange={uploadImage}
							/>
						</label>
					</div>
					<div id='chatFooterSearch'>
						<form onSubmit={handleSubmit}>
							<input
								type='text'
								placeholder=' Type a message'
								autoComplete='false'
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								autoFocus
							/>
							<button style={{ display: 'none' }}>Submit</button>
						</form>
					</div>
					<div id='chatFooterRight'>
						<MicIcon style={{ color: '#919191' }} />
					</div>
				</div>
			</div>
			{chatProfileDrawer && (
				<ChatProfileDrawer
					handleChatProfileDrawer={handleChatProfileDrawer}
					chatId={chatId}
					chatData={chatData}
				/>
			)}

			<NewParticipant
				handleNewParticipantModel={handleNewParticipantModel}
				newParticipantModel={newParticipantModel}
				chatId={chatId}
			/>
		</div>
	);
}

export default Chat;
