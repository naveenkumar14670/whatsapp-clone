import React from 'react';

/* Material Ui imports */
import Button from '@material-ui/core/Button';

/* Firebase imports */
import { db, auth, googleProvider } from './Firebase';

function Login() {
	const signInWithGoogle = () => {
		auth
			.signInWithPopup(googleProvider)
			.then((res) => {
				db.collection('users')
					.doc(res.user.uid)
					.get()
					.then((userData) => {
						if (!userData.exists) {
							db.collection('users').doc(res.user.uid).set({
								username: res.user.displayName,
								email: res.user.email,
								photoURL: res.user.photoURL,
								about: 'Available',
								groups: [],
							});
						}
					})
					.catch((err) => console.log(err.message));
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	return (
		<div id='loginContainer'>
			<img src='Images/whatsappLogo.png' alt='Login Logo' />
			<h2>Sign In To WhatsApp</h2>
			<Button variant='contained' onClick={signInWithGoogle}>
				Sign In With Google
			</Button>
		</div>
	);
}

export default Login;
