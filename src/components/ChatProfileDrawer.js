import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

/* Material Ui Imports */
import { Avatar, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import DoneIcon from '@material-ui/icons/Done';

/* Firebase imports */
import { db, arrayRemove, auth } from './Firebase';

function ChatProfileDrawer({ handleChatProfileDrawer, chatId, chatData }) {
	const history = useHistory();
	const [editData, setEditData] = useState({ name: false, description: false });
	const [inputData, setInputData] = useState({
		name: chatData.name,
		description: chatData.description,
	});

	const handleEditData = (item) => {
		db.collection('chatRooms')
			.doc(chatId)
			.update({
				[item]: inputData[item],
			});
		setEditData({ ...editData, [item]: !editData[item] });
	};

	const handleImageInput = (e) => {
		const n = e.target.files.length;
		if (n !== 0) {
			let reader = new FileReader();
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = () => {
				var fileContent = reader.result;
				db.collection('chatRooms').doc(chatId).update({
					photoURL: fileContent,
				});
			};
		}
	};

	const handleInputData = (item, value) => {
		setInputData({ ...inputData, [item]: value });
	};

	const handleExit = () => {
		db.collection('chatRooms')
			.doc(chatId)
			.update({
				members: arrayRemove(auth.currentUser.uid),
			});
		db.collection('users')
			.doc(auth.currentUser.uid)
			.update({
				groups: arrayRemove(chatId),
			});
		db.collection('chatRooms')
			.doc(chatId)
			.get()
			.then((query) => {
				if (query.data().members.length === 0)
					db.collection('chatRooms').doc(chatId).delete();
			})
			.catch((err) => console.log(err.message));
		history.replace('/');
	};

	return (
		<div id='chatProfileDrawer'>
			<div id='chatProfileDrawerHeader'>
				<div id='chatProfileDrawerHeaderContent'>
					<IconButton onClick={handleChatProfileDrawer}>
						<CloseIcon />
					</IconButton>
					Group Info
				</div>
			</div>

			<div id='chatProfileDrawerPhoto'>
				<Avatar
					src={chatData.photoURL}
					style={{ height: '200px', width: '200px', margin: '0 50%' }}
				/>
				<div id='profilePhotoContent'>
					<input
						type='file'
						id='profilePhotoInput'
						accept='image/*'
						onChange={handleImageInput}
					/>
					<CameraAltIcon style={{ marginBottom: '10px' }} />
					<p>CHANGE</p>
					<p>PROFILE PIC</p>
				</div>
			</div>
			<div
				id='chatProfileDrawerPhotoDetails'
				style={{ backgroundColor: 'white' }}
			>
				{editData.name === false ? (
					<>
						<div>
							<p style={{ color: 'black', fontSize: '20px' }}>
								{chatData.name}
							</p>
							<p>{chatData.createdTime}</p>
						</div>
						<IconButton onClick={() => handleEditData('name')}>
							<EditIcon />
						</IconButton>
					</>
				) : (
					<>
						<TextField
							id='input-with-icon-adornment'
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton>
											<DoneIcon onClick={() => handleEditData('name')} />
										</IconButton>
									</InputAdornment>
								),
							}}
							value={inputData.name}
							onChange={(e) => handleInputData('name', e.target.value)}
							fullWidth
						/>
					</>
				)}
			</div>
			<div className='chatProfileDrawerContent'>
				{editData.description === false ? (
					<>
						<p style={{ color: '#00bfa5', fontSize: '15px' }}>Description</p>
						<div className='chatProfileDrawerContentInput'>
							<p>{chatData.description}</p>
							<IconButton onClick={() => handleEditData('description')}>
								<EditIcon />
							</IconButton>
						</div>
					</>
				) : (
					<>
						<p style={{ color: '#00bfa5', fontSize: '15px' }}>Description</p>
						<div
							className='chatProfileDrawerContentInput'
							style={{ padding: '5px' }}
						>
							<TextField
								id='input-with-icon-adornment'
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton>
												<DoneIcon
													onClick={() => handleEditData('description')}
												/>
											</IconButton>
										</InputAdornment>
									),
								}}
								value={inputData.description}
								onChange={(e) => handleInputData('description', e.target.value)}
								fullWidth
							/>
						</div>
					</>
				)}
			</div>
			<div className='chatProfileDrawerReports'>
				<IconButton onClick={handleExit}>
					<ExitToAppIcon style={{ color: 'red' }} />
				</IconButton>
				<p style={{ marginLeft: '30px' }}>Exit Group</p>
			</div>
			<div className='chatProfileDrawerReports'>
				<IconButton>
					<ThumbDownIcon style={{ color: 'red' }} />
				</IconButton>
				<p style={{ marginLeft: '30px' }}>Report Group</p>
			</div>
		</div>
	);
}

export default ChatProfileDrawer;
