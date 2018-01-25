import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SignupLink from './signuplink';
import reducer from './reducer';
import Form from './form';
import injectReducer from 'utils/injectReducer';
import { CreateSignUp, GetState} from './actions';
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

class SignupPage extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      username : '',
      fullname : '',
      email : '',
      contact : '',
      password : '',
    }
    //this.onChange = this.onChange.bind(this);
  }

  onChange = (evt) => {
    this.setState({
      [evt.target.name] : evt.target.value
    });
  }

  getStateInfo = () => {
    const enumarr = Object.entries(this.state);
    const newarr = [];
    for(let i = 0; i<=enumarr.length - 1 ;i++){
      newarr.push(enumarr[i][1]);
    }
    newarr.every((key) =>  key.length > 2) ? console.log(newarr) : console.log('isError');
  }

  sendData = () => {
    this.props.dispatch(CreateSignUp(this.state.username,this.state.fullname,
    this.state.email,this.state.contact,this.state.password));
  }

  getStateData = () => {
    this.props.dispatch(GetState());
  }

  componentDidMount(){
    
  }

  render(){
    // const {username,fullname,email,contact,password} = this.state;
    const {
      fetching,
      user,
      error,
      username,
      fullname,
      email,
      contact,
      password
    } = this.props;
    return(
      <div>
        <h1> Signup </h1>
        <Form>
        <div className="form-group">
       
          <label htmlFor="exampleInputEmail1">Username</label>
          <input type="text" 
          className="form-control" 
          name="username"
          id="exampleInputUsername" 
          placeholder="Enter UserName" 
          value={this.state.username}
          onChange={this.onChange}
          />
        
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Full Name</label>

          <input type="text" 
          name="fullname"
          className="form-control" 
          id="exampleInputFullname" 
          placeholder="Enter Full Name" 
          value={this.state.fullname}
          onChange={this.onChange}
          />

        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email</label>

          <input type="text" 
          name="email"
          className="form-control" 
          id="exampleInputEmail" 
          placeholder="Enter Email" 
          value={this.state.email}
          onChange={this.onChange}
          />

        </div>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Contact</label>

          <input type="text" 
          name="contact"
          className="form-control" 
          id="exampleInputContact" 
          placeholder="Enter Contact" 
          value={this.state.contact}
          onChange={this.onChange}
          />

        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>

          <input type="password" 
          name="password"
          className="form-control" 
          id="exampleInputPassword" 
          placeholder="Enter Password" 
          value={this.state.password}
          onChange={this.onChange}
          />

        </div>
          <button type="" className="btn btn-default" onClick={this.getStateInfo}>Create</button>
        </Form>
        <button type="" className="btn btn-default" onClick={this.getStateInfo}> 1. Get</button>
        <button type="" className="btn btn-primary" onClick={this.sendData}> 2. Push to redux  </button>
        <button type="" className="btn btn-primary" onClick={this.getStateData}> 3. Get Final State </button>
      </div>
    );
  }
}

SignupPage.PropTypes = {
  username : PropTypes.string,
  fullname : PropTypes.string,
  email : PropTypes.string,
  contact : PropTypes.string,
  password : PropTypes.string,
  onSubmitForm: PropTypes.func,
  onChangeUsername: PropTypes.func,
  onChangeFullname: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangeContact: PropTypes.func,
  onChangePassword: PropTypes.func,
  CreateSignUp: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    fetching : state.fetching,
    user : state.user,
    error : state.error,
  }
}

// export function mapDispatchToProps(dispatch) {
//   return {

//     },
//   };

const withConnect =  connect(mapStateToProps);
const withReducer = injectReducer({key: 'signup',reducer})

export default compose(withReducer,withConnect)(SignupPage);

