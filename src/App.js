import React, { Component } from 'react';
import { Clicker } from './Components/Clicker';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <header className="App-header">
            Clicker Compo 2018
        </header>

        <Clicker />
      </div>
    );
  }
}

export default App;