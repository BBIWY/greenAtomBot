import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import axios from 'axios';
import axiosMiddleware from "redux-axios-middleware";
import { reducer as formReducer } from 'redux-form';
import userExists from "./modules/Login/reducers/userExists";
import isSigningUp from "./modules/Login/reducers/isSigningUp";
import categories from "./modules/Question/reducers/categories";
import questionAdded from "./modules/Question/reducers/questionAdded";
import questions from "./modules/QuestionList/reducers/questions";
import rating from "./modules/Rating/reducers/rating";
import categoryAdd from "./modules/Category/reducers/categoryAdd";
import deleteQuestion from "./modules/QuestionList/reducers/deleteQuestion";
import categoryDelete from "./modules/Category/reducers/categoryDelete";
import userProfile from "./common/reducers/userProfile";
import answers from "./modules/QuestionList/reducers/answers";
import message from "./modules/Message/reducers/message";
import telegramName from './modules/Message/reducers/telegramName';

const client = axios.create({
    baseURL: 'http://37.140.198.34:5000/api',
    responseType: "json"
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(combineReducers(
    {form: formReducer,
        userExists: userExists,
        isSigningUp: isSigningUp,
        categories: categories,
        isQuestionAdded: questionAdded,
        questions: questions,
        rating: rating,
        categoryAdd: categoryAdd,
        deleteQuestion: deleteQuestion,
        categoryDelete: categoryDelete,
        userProfile: userProfile,
        answers: answers,
        message: message,
        telegramName: telegramName}), composeEnhancers(applyMiddleware(axiosMiddleware(client))));
window.store = store;
export default store;