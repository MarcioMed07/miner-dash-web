import logo from './logo.svg';
import './App.css';
import { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components'
import mdPath from './Changelog.md'
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,

} from "react-router-dom";
import Home from './Components/Home';
import { AppBar, Box, Button, Checkbox, makeStyles, Modal, Toolbar, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles((theme) => ({
	
    '@global': {
        "*::-webkit-scrollbar": {
            width: "5px",
            height: "5px"
        },        
        "*::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 2px grey",
            borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb": {
            background: "rgba(0,0,0,0.2)",
            borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
            background: "rgba(0,0,0,0.6)",
        },
      },
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	toolbar: {
		display: "flex"
	}
}));

function App() {
	const classes = useStyles();
	const [forceChangelog, setFC] = useState(false)
	return (
		<Router>
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar className={classes.toolbar}>
						<Typography className={classes.title}>
							<Button color="inherit" component={Link} to="/">Miners</Button>
						</Typography>

						<Button color="inherit" onClick={() => {
							localStorage.setItem("changelog", null)
							localStorage.setItem("skip_changelog", false)
							setFC(true)
						}}>Ver Changelog</Button>

					</Toolbar>
				</AppBar>
			</div>
			<ChangelogModalHandler openInitial={forceChangelog} setFC={setFC} />
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

function ChangelogModalHandler({ openInitial, setFC } = { openInitial: false, setFC: () => { } }) {
	const modalStyles = makeStyles((theme) => ({
		modal: {
			position: 'absolute',
			height: '90%',
			width: '80%',
			maxWidth: "600px",
			display: 'block',
			backgroundColor: theme.palette.background.paper,
			borderRadius: "5px",
			border: "none",
			padding: theme.spacing(2, 4, 3),
			display: "grid",
			gridTemplateColumns: "1fr",
			gridTemplateRows: "auto 1fr auto",
			gridTemplateAreas: "'header''main''footer'",
		},

		"#app > header": {
			gridArea: "'header'",
		},

		"#app > main": {
			gridArea: "'main'",
			padding: "15px 5px 10px 5px",
		},

		"#app > footer": {
			gridArea: "'footer'",
		},
		footer: {
			display: "flex",
			alignItems: "center",
		}
	}))
	function getModalStyle() {
		const top = 50
		const left = 50

		return {
			border: "none",
			top: `${top}%`,
			left: `${left}%`,
			transform: `translate(-${top}%, -${left}%)`,
		};
	}
	const classes = modalStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = useState(getModalStyle);
	const [open, setOpen] = useState(openInitial);
	const [md, setMd] = useState('');
	const [checked, setChecked] = useState(true);

	const handleChange = (event) => {
		setChecked(event.target.checked);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		localStorage.setItem("skip_changelog", !checked)
		setOpen(false);
	};

	useState((() => {
		let skip = JSON.parse(localStorage.getItem("skip_changelog"))
		setFC(false)
		if (!skip) {
			fetch(mdPath).then((response) => response.text()).then((text) => {
				setMd(text)
				let oldChangelog = localStorage.getItem("changelog")
				let newChangelog = btoa(unescape(encodeURIComponent(text)))
				if (oldChangelog !== newChangelog) {
					setOpen(true)
					localStorage.setItem("changelog", newChangelog)
				}
			})
		}

	})())

	const body = (
		<div style={modalStyle} className={classes.modal}>
			<h1 id="changelog-modal">Changelog</h1>
			<div style={{ overflowY: 'scroll', height: "85%" }}>
				<ReactMarkdown >{md}</ReactMarkdown>
			</div>
			<div className={classes.footer}>
				<Checkbox
					checked={checked}
					onChange={handleChange}
					inputProps={{ 'aria-label': 'primary checkbox' }}
				/>
				Continuar Recebendo Atualizações de Changelog
				<div>
					<Button
						variant="contained"
						color="primary"
						disableElevation
						onClick={handleClose}>Fechar</Button>
				</div>
			</div>
		</div>
	);

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				{body}
			</Modal>
		</div>
	);
}

export default App;
