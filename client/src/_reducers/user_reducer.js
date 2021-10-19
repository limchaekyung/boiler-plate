import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';
 

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        default:
            return state;
    }
}