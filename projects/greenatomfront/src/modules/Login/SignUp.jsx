import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import styles from './Login.module.css';
import { Field, reduxForm } from "redux-form";
import { getForm } from "./selectors/getForm";
import {clearSignUp} from "./actions/signUp";

let SignUp = ({ handleSubmit }) => {

    const dispatch = useDispatch()

    const formData = useSelector(state => getForm(state));

    const { password = '', passwordRepeat = ''} = (formData.signup !== undefined && formData.signup.values !== undefined) ? formData.signup.values : {};
    const { registeredFields = 'random', fields = 'random1'} = formData.signup !== undefined  ? formData.signup : {};
    const { anyTouched = false } = formData.signup || {};

    const toggleLogin = () => {
        dispatch(clearSignUp());
    };

    return (
        <div className={styles.Login}>
                    <div className={styles.namingsBlock}>
                        <span className={styles.naming}>Sign up</span>
                        <span className={styles.naming}>or</span>
                        <span onClick={() => toggleLogin()} className={styles.activeButton}>back to login</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <Field className={styles.passwordInput} name='firstName' component='input' type='text' placeholder='First Name' />
                        </div>
                        <div>
                            <Field className={styles.passwordInput} name='lastName' component='input' type='text' placeholder='Last Name' />
                        </div>
                        <div>
                            <Field className={styles.passwordInput} name='email' component='input' type='text' placeholder='Email' />
                        </div>
                        <div>
                            <Field className={styles.loginInput} name='username' component='input' type='text' placeholder='Username' />
                        </div>
                        <div>
                            <Field className={styles.passwordInput} name='password' component='input' type='password' placeholder='Password' />
                        </div>
                        <div>
                            <Field className={styles.passwordInput} name='passwordRepeat' component='input' type='password' placeholder='Repeat password' />
                        </div>
                        <button disabled={(password !== passwordRepeat) ||
                        !(Object.keys(registeredFields).length === Object.keys(fields).length)} className={styles.loginButton} type='submit'>SIGN UP</button>
                        {anyTouched && (password !== passwordRepeat) && (<span className={styles.errorText}>Passwords don`t match</span>)}
                    </form>
        </div>
    )
};

SignUp = reduxForm({
    form: 'signup'
})(SignUp)

export default SignUp;