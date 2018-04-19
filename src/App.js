import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3'
import lottery from './lottery';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manager: '',
      players: [],
      balance: '',
      value: '',
      message: '',
      winner: ''
    };
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting for transaction to process...'});

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'congratulations, you have successfully entered the lottery.'});
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Picking a Winner, please wait...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ winner: await lottery.methods.winner().call() })
    this.setState({ message: "We have a winner. the winner is " });
  }

  render() {
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p>
          This contract is managed by {this.state.manager}
        </p>
        <p>
          There are currently {this.state.players.length} people entered this lottery
          to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4> Want to try your luck ? </h4>
          <div>
            <label> Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={ event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr/>
        <label> Time to pick a winner </label>
        <button onClick={this.onClick}> Pick a winner</button>
        <hr/>
        <h4> {this.state.message} {this.state.winner}</h4>
      </div>
    );
  }
}

export default App;
