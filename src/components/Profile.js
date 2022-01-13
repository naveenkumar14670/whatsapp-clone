import React, { useState, useContext } from 'react';

/* Material Ui Imports */
import { Avatar, IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

/* Firebase imports */
import { db } from './Firebase';

/* Importing useContext item form App.js */
import { userDetails } from '../App';

function Profile({ handleProfileDrawer }) {
	const userData = useContext(userDetails);
	const [editData, setEditData] = useState({ username: false, about: false });
	const [inputData, setInputData] = useState({
		username: userData.username,
		about: userData.about,
	});

	const handleEditData = (item) => {
		db.collection('users')
			.doc(userData.id)
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
				db.collection('users').doc(userData.id).update({
					photoURL: fileContent,
				});
			};
		}
	};

	const handleInputData = (item, value) => {
		setInputData({ ...inputData, [item]: value });
	};

	return (
		<div id='profileContainer'>
			{/* profileHeader part */}
			<div id='profileHeader'>
				<div id='profileHeaderContent'>
					<IconButton onClick={handleProfileDrawer}>
						<ArrowBackIcon style={{ color: 'white' }} />
					</IconButton>
					Profile
				</div>
			</div>

			{/* profilePhoto part */}
			<div id='profilePhoto'>
				<Avatar
					src={userData.photoURL}
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

			{/* userDetails part */}
			<div className='profileContent'>
				<p style={{ color: '#00bfa5', fontSize: '15px' }}>Your Name</p>
				<div className='profileContentInput'>
					{editData.username === false ? (
						<>
							<h5>{userData.username}</h5>
							<IconButton>
								<EditIcon onClick={() => handleEditData('username')} />
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
												<DoneIcon onClick={() => handleEditData('username')} />
											</IconButton>
										</InputAdornment>
									),
								}}
								value={inputData.username}
								onChange={(e) => handleInputData('username', e.target.value)}
								fullWidth
							/>
						</>
					)}
				</div>
			</div>

			{/* just a note about visible name */}
			<div id='profileNote'>
				This is not your username or pin. This name will be visible to your
				WhatsApp contacts
			</div>

			{/* User About Quote */}
			<div className='profileContent'>
				<p style={{ color: '#00bfa5', fontSize: '15px' }}>About</p>
				<div className='profileContentInput'>
					{editData.about === false ? (
						<>
							<h5>{userData.about}</h5>
							<IconButton>
								<EditIcon onClick={() => handleEditData('about')} />
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
												<DoneIcon onClick={() => handleEditData('about')} />
											</IconButton>
										</InputAdornment>
									),
								}}
								value={inputData.about}
								onChange={(e) => handleInputData('about', e.target.value)}
								fullWidth
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default Profile;
