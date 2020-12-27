import React, { Component } from "react";
import InstructContract from "./contracts/Instruct.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = InstructContract.networks[networkId];
      const instance = new web3.eth.Contract(
        InstructContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
        
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

      const instructor = await this.state.contract.methods.getInstructor().call();
      this.setState({fName : instructor[0], age:instructor[1]})

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  setInstructor = async () => {

  };
constructor(props) {
  super(props)
  this.state = { web3: null,
    accounts: null,
     contract: null,
    fName: null,
    age:  null
  };
  this.handleSubmit = this.handleSubmit.bind(this);
}

handleSubmit = async  (evt) => {
  evt.preventDefault();
  await this.state.contract.methods.setInstructor(this.state.fName,this.state.age).send({from: this.state.accounts[0]})

}

myChangeHandler = (event) => {
  let nam = event.target.name
  let val = event.target.value
  this.setState({[nam]: val} )
}

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="container">

        <h1>Class Instructor</h1>

        <h2 id="instructor">{this.state.fName} ( age {this.state.age} )</h2>
        <form onSubmit={this.handleSubmit}>
        <label  className="col-lg-2 control-label">Instructor Name</label>
        <input id="fName" name="fName" type="text"  placeholder="Name"
        onChange={this.myChangeHandler}
/*         onChange={(event) => {
          let newName = this.input.value
           this.setState({fName:newName})}
         }
         ref={(input) => { this.input = input }}
          */
         />

        <label className="col-lg-2 control-label" >Instructor Age</label>
        <input id="age" name="age" type="text"  placeholder="age"
         onChange={this.myChangeHandler}
         /*  onChange={(event) => {
            let newAge = this.input.value
            this.setState({age:newAge})
          }}
          ref={(input) => { this.input = input }} */
        
        />

        <button id="button" value="submit"  type="submit">Update Instructor</button>
        </form>


         </div>
      </div>
    );
  }
}

export default App;
