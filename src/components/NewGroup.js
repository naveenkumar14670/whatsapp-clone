import React, { useState } from 'react';

/* Material Ui Imports */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/* Firebase Import */
import { db, auth, arrayUnion } from './Firebase';

function NewGroup({ newGroupModel, handleNewGroupModel }) {
	const [groupName, setGroupName] = useState('');

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

	/* function to create a new Group */
	const handleCreate = () => {
		let d = new Date();
		const date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
		const time = formatAMPM(d);
		db.collection('chatRooms')
			.add({
				name: groupName,
				description: 'Add Group Description',
				photoURL: '',
				members: [auth.currentUser.uid],
				createdTime: `created ${date} at ${time}`,
			})
			.then((newGroup) => {
				db.collection('users')
					.doc(auth.currentUser.uid)
					.update({
						groups: arrayUnion(newGroup.id),
					});
			});
		handleNewGroupModel();
	};

	return (
		<div>
			<Dialog
				open={newGroupModel}
				onClose={handleNewGroupModel}
				aria-labelledby='form-dialog-title'
			>
				<DialogTitle id='form-dialog-title'>Create New Group</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To create new group , please enter group name here.
					</DialogContentText>
					<TextField
						onChange={(e) => setGroupName(e.target.value)}
						autoFocus
						margin='dense'
						id='name'
						label='Enter Group Name'
						type='email'
						autoComplete='off'
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleNewGroupModel}
						variant='outlined'
						style={{ borderColor: '#07bc4c', color: '#07bc4c' }}
					>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						variant='contained'
						style={{ backgroundColor: '#07bc4c', color: 'white' }}
					>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default NewGroup;
