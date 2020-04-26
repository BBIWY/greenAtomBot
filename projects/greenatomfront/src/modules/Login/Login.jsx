import React from 'react';
import { useDispatch } from "react-redux";
import styles from './Login.module.css';
import { Field, reduxForm } from "redux-form";
import {setSignUp} from "./actions/signUp";

let Login = ({ handleSubmit }) => {

    const dispatch = useDispatch()

    const toggleRegistration = () => {
        dispatch(setSignUp());
    };

    return (
        <div className={styles.Login}>
                <div className={styles.namingsBlock}>
                    <span className={styles.naming}>Login</span>
                    <span className={styles.naming}>or</span>
                    <span onClick={toggleRegistration} className={styles.activeButton}>Sign up</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Field className={styles.loginInput} name='username' component='input' type='text' placeholder='Login' />
                    </div>
                    <div>
                        <Field className={styles.passwordInput} name='password' component='input' type='password' placeholder='Password' />
                    </div>
                    <button className={styles.loginButton} type='submit'>LOGIN</button>
                </form>
        </div>
    )
};

Login = reduxForm({
    form: 'login'
})(Login)

export default Login;