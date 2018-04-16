import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import lottery from './lottery';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { manager: '' };
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();

    this.setState({ manager: manager });
  }

  render() {
    return (
      <div className="App">
        <h2> Lottery Contract </h2>
        <p> This contract is managed by {this.state.manager} </p>
      </div>
    );
  }
}

export default App;
