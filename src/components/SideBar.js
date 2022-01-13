import React, { useState, useEffect, useContext } from 'react';

/* Importing Material UI Components & Icons */
import { Avatar, IconButton } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SidebarChatTile from './SidebarChatTile';

/* Firebase Import */
import { db, auth } from './Firebase';

/* Importing useContext item form App.js */
import { userDetails } from '../App';

/* Importing required Components */
import NewGroup from './NewGroup';
import Profile from './Profile';

function SideBar() {
	const userData = useContext(userDetails);
	const [chatRooms, setChatRooms] = useState([]);
	const [profileDrawer, setProfileDrawer] = useState(false);
	const [newGroupModel, setNewGroupModel] = useState(false);

	/* useState Hook for MoreVertIcon */
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	/* State handling functions for MoreVertIcon  */
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProfileDrawer = () => {
		setProfileDrawer(!profileDrawer);
	};

	const handleNewGroupModel = () => {
		handleClose();
		setNewGroupModel(!newGroupModel);
	};

	/* useEffect to retrieve chat rooms belongs to user */
	useEffect(() => {
		db.collection('chatRooms')
			.where('members', 'array-contains', auth.currentUser.uid)
			.onSnapshot((querySnapshot) => {
				setChatRooms([]);
				querySnapshot.forEach((doc) => {
					setChatRooms((prev) => [...prev, { id: doc.id, ...doc.data() }]);
				});
			});
	}, []);

	const logOut = async () => {
		await auth.signOut();
	};

	return (
		<div id='sidebar'>
			{profileDrawer === false ? (
				<>
					<div id='sidebarHeader'>
						<IconButton onClick={handleProfileDrawer}>
							<Avatar src={userData.photoURL} />
						</IconButton>
						<div id='sidebarHeaderIcons'>
							<IconButton>
								<DonutLargeIcon style={{ color: '#919191' }} />
							</IconButton>

							<IconButton>
								<ChatIcon style={{ color: '#919191' }} />
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
								<MenuItem onClick={handleNewGroupModel}>
									Create New Group
								</MenuItem>
								<MenuItem onClick={logOut}>Logout</MenuItem>
							</Menu>
						</div>
					</div>
					<div id='sidebarSearch'>
						<div id='sidebarSearchBox'>
							<SearchIcon style={{ color: '#919191', height: '20px' }} />
							<input type='text' placeholder=' Search or start new chat' />
						</div>
					</div>
					<div id='sidebarContent'>
						{chatRooms.map((chatRoom) => (
							<SidebarChatTile chatRoom={chatRoom} key={chatRoom.id} />
						))}
					</div>

					{/* Modal for taking input to create new group */}
					<NewGroup
						newGroupModel={newGroupModel}
						handleNewGroupModel={handleNewGroupModel}
					/>
				</>
			) : (
				<Profile handleProfileDrawer={handleProfileDrawer} />
			)}
		</div>
	);
}

export default SideBar;
