import { createStore, applyMiddleware, combineReducers } from "redux";
import axios from 'axios';
import axiosMiddleware from "redux-axios-middleware";
import { reducer as formReducer } from 'redux-form';
import userExists from "./modules/Login/reducers/userExists";


// import reducers from 'common/reducers';
// redux-axios-middleware

// const store = createStore(reducers, compose(applyMiddleware(axiosMiddleware));

// const initialState = {
//     userExists: undefined
// }
//
// const reducers = (state = initialState, { type }) => {
//     switch (type) {
//         case "LOGGED_IN":
//             return {
//                 userExists: true
//             };
//         default:
//             return state;
//     }
// }

const client = axios.create({
    baseURL: 'http://localhost:4000/api',
    responseType: "json"
})

const store = createStore(combineReducers({form: formReducer, userExists: userExists}), applyMiddleware(axiosMiddleware(client)));
window.store = store;
export default store;