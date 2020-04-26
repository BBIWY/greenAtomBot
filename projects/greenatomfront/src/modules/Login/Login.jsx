import React from 'react';
import styles from './Login.module.css';
import { Field, reduxForm } from "redux-form";

let Login = ({handleSubmit}) => {

    return (
        <div className={styles.Login}>
            <div className={styles.naming}>Login</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <Field className={styles.loginInput} name='login' component='input' type='text' placeholder='Login' />
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