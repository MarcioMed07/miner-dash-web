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

function App() {
  
  return (
    <Router>
					<header>
						<Link to="/">Miners</Link>
					</header>
					<div>
						<Switch>
							<Route path="/">
								<Home />
							</Route>
						</Switch>
					</div>
			</Router>
  );
}

function getMiners(){

}

async function getProfit(){
  const headers= {
    
  }
  fetch(process.env.REACT_APP_API_URL, headers)
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(console.error);
  return {}
}

export default App;
