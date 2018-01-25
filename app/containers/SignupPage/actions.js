

import {
    USERNAME_IN,
    FULLNAME_IN,
    EMAIL_IN,
    CONTACT_IN,
    PASSWORD_IN,
    SIGN_UP
  } from './constants';
import { initialState } from './reducer';

export function CreateSignUp(username, fullname, email, contact, password){
    var signup = console.log('signup');
    console.log('username',username);
    return {
        type : SIGN_UP,
        payload : {username,
            fullname,
            email,
            contact,
            password
        }
    } 
}

export function GetState() {
    return{
        type : 'GET_STATE'
    }
}