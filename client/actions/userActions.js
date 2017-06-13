import axios from 'axios';
import jwt from 'jsonwebtoken';
import setAccessToken from '../utils/setAccessToken';
import * as actionTypes from './actionTypes';

export function signupSuccess(message) {
  return {
    type: actionTypes.SIGNUP_SUCCESS,
    message
  };
}

export function login(token, type) {
  setAccessToken(token);
  const decoded = jwt.decode(token);
  const user = {
    id: decoded.data.id,
    roleId: decoded.data.roleId,
    username: decoded.data.username
  };
  console.log('User', user);
  return {
    type,
    user
  };
}

export function signup(signupDetails) {
  return (dispatch) => {
    return axios.post('/users', signupDetails)
      .then((res) => {
        const token = res.data.token;
        const tokenStorage = JSON.stringify({
          jwt: token
        });
        localStorage.setItem('docman-pro', tokenStorage);
        // dispatch(signupSuccess(res.data.message)); TODO - Create Reducer
        dispatch(login(token, actionTypes.LOGIN_SUCCESS));
      });
  };
}

export function signin(signinDetails) {
  return (dispatch) => {
    return axios.post('/users/login', signinDetails)
      .then((res) => {
        const token = res.data.token;
        const tokenStorage = JSON.stringify({
          jwt: token
        });
        localStorage.setItem('docman-pro', tokenStorage);

        dispatch(login(token, actionTypes.LOGIN_SUCCESS));
      });
  };
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('docman-pro');
    setAccessToken(null);
    dispatch({ type: actionTypes.LOGOUT });
    // return axios.post('/users/logout')
    //   .then((res) => {
    //     const message = res.data.message;
    //     dispatch({ type: actionTypes.LOGOUT, message });
    //   })
    //   .catch(err => console.log(err));
  };
}
