import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

/* Material Ui Imports */
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/* Firebase Import */
import { db, arrayUnion } from './Firebase';

function NewParticipant({
	handleNewParticipantModel,
	newParticipantModel,
	chatId,
}) {
	const history = useHistory();
	const [participantName, setParticipantName] = useState('');

	/* function to create a new Group */
	const handleCreate = () => {
		console.log(participantName);
		db.collection('users')
			.where('email', '==', participantName)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((user) => {
					db.collection('chatRooms')
						.doc(chatId)
						.get()
						.then((doc) => {
							if (doc.data().members.includes(user.id) === false) {
								db.collection('chatRooms')
									.doc(chatId)
									.update({
										members: arrayUnion(user.id),
									});
							}
						});
					db.collection('users')
						.doc(user.id)
						.get()
						.then((doc) => {
							if (doc.data().groups.includes(chatId) === false) {
								db.collection('users')
									.doc(user.id)
									.update({
										groups: arrayUnion(chatId),
									});
							}
						});
				});
			});
		handleNewParticipantModel();
		history.replace('/' + chatId);
	};

	return (
		<div>
			<Dialog
				open={newParticipantModel}
				onClose={handleNewParticipantModel}
				aria-labelledby='form-dialog-title'
			>
				<DialogTitle id='form-dialog-title'>Add New Participant</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To add new participant, please enter participant email here.
					</DialogContentText>
					<TextField
						onChange={(e) => setParticipantName(e.target.value)}
						autoFocus
						margin='dense'
						id='name'
						label='Enter Participant Email'
						type='email'
						autoComplete='off'
						fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleNewParticipantModel}
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
						ADD
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default NewParticipant;
