import './App.css';
import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from 'react-router-dom';

/* Importing Components */
import Main from './components/Main';

/* firebase Imports */
import { db, auth } from './components/Firebase';
import Login from './components/Login';

export const userDetails = React.createContext(null);

function App() {
	const [user, setUser] = useState(auth.currentUser);
	const [userData, setUserData] = useState({});

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) setUser(user);
			else setUser(null);
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		if (user) {
			const unsubscribe = db
				.collection('users')
				.doc(user.uid)
				.onSnapshot((snapshot) => {
					setUserData({ id: snapshot.id, ...snapshot.data() });
				});
			return unsubscribe;
		}
	}, [user]);

	return (
		<userDetails.Provider value={userData}>
			<div id='App'>
				<Router>
					{user ? (
						<Switch>
							<Route path='/' exact component={Main} />
							<Route path='/:id' exact component={Main} />
							<Redirect to='/' />
						</Switch>
					) : (
						<Switch>
							<Route path='/' exact component={Login} />
							<Redirect to='/' />
						</Switch>
					)}
				</Router>
			</div>
		</userDetails.Provider>
	);
}

export default App;
