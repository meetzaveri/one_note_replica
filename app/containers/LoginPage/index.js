import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import SignupLink from './signuplink';
import firebasconfig, { auth, provider } from '../../utils/firebaseconf';

const CreateAccountBtn = styled.button`
  padding: 5px;
  border : 1px solid #000;
  margin : 0 0 10px 0;

  &:hover {
    background : #999999;
  }
`;

const IndicatingMessage = styled.div`
  padding : 10px 0px;
`;


class LoginPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      currentItem: '',
      username: '',
      items: [],
      user: null // <-- add this line
    }
    
    this.loginWithGoogle = this.loginWithGoogle.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
  }
  handleChange(e) {
    /* ... */
  }
  logout() {
    // we will add the code for this in a moment, but need to add the method now or the bind will throw an error
  }

  loginWithGoogle() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }

  render(){
    return(
      <div>
        <h1> Login </h1>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Username</label>
          <input type="text" className="form-control" id="exampleInputUsername" placeholder="UserName" />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        {this.state.user ?
            <button className="btn btn-default" onClick={this.logout}>Log Out</button>                
            :
            <button className="btn btn-default" onClick={this.login}>Log In</button>              
          }
          <br></br>
          <br></br>
          <br></br>
          <CreateAccountBtn onClick={this.loginWithGoogle}> Login with Google </CreateAccountBtn> <hr/>
          {/* <CreateAccountBtn> Login with Twitter </CreateAccountBtn> <hr/>
          <CreateAccountBtn> Login with Github </CreateAccountBtn> */}

          <IndicatingMessage>
            Not have an Account ?
          </IndicatingMessage>
          <SignupLink to="/signup" >
            Sign Up
          </SignupLink>
      </div>
    );
  }
}

export default LoginPage;
