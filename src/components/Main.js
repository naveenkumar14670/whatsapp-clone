import React from 'react';
import { useParams } from 'react-router-dom';

/* Importing Components */
import Chat from './Chat';
import Sidebar from './SideBar';
import Sample from './Sample';

function Main() {
	const { id } = useParams();
	return (
		<div id='main'>
			<Sidebar />
			{id === undefined ? <Sample /> : <Chat chatId={id} />}
			{/* {id === undefined ? <Sample /> : <Sample />} */}
		</div>
	);
}

export default Main;
