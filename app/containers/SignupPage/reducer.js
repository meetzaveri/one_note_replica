import { fromJS } from 'immutable';

import {
  SIGN_UP
} from './constants';

// The initial state of the App
export const initialState = fromJS({
    fetching : false,
    user : [],
    error : false,
});

export default function signupReducer(state = initialState, action){
    switch(action.type){
        case SIGN_UP : 
            console.log('payload ' + action.payload + action.payload);
            return state.concat(action.payload) + console.log('it is done');
        case 'GET_STATE' :
            console.log(state);    
        default :
            return state;
    }
}

