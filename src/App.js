import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import styled from 'styled-components'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,

} from "react-router-dom";
import Home from './Components/Home';
import { AppBar, Box, Button, makeStyles, Toolbar, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	}
}));

function App() {
	const classes = useStyles();
	return (
		<Router>
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" className={classes.title}>
							<Button color="inherit" component={Link} to="/">Miners</Button>
						</Typography>
					</Toolbar>
				</AppBar>
			</div>
			<Box m={2} p={2} >
				<Switch>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Box  >
		</Router>
	);
}

export default App;
