import React from "react";
import {useSelector} from "react-redux";
import styles from "../Question/Question.module.css";
import {NavLink} from "react-router-dom";

import {ReactComponent as Back} from "../../common/assets/svg/back.svg";
import {ReactComponent as SendMessage} from "../../common/assets/svg/sendMessage.svg";
import {Field, reduxForm} from "redux-form";
import {getMessage} from "./selectors/message";
import {getTelegramName} from "./selectors/telegramName";

const renderTextArea = ({ input, label, type, meta: { touched, error } }) => (
    <div className={styles.textArea}>
        <label className={styles.textAreaLabel}>{label}</label>
        <div className={styles.textAreaMain}>
            <input {...input} type={type} placeholder={label} />
            {touched && error && <span>{error}</span>}
        </div>
    </div>
);

let Message = ({handleSubmit}) => {

    const message = useSelector(state => getMessage(state));

    const telegram = useSelector(state => getTelegramName(state));

    return (
        <div className={styles.questionsManagerWrapper}>
            <div className={styles.questionAdd}>
                <span className={styles.textQuestionsManager}>Send Message to {telegram.telegramName}<NavLink to='/rating'><Back/></NavLink></span>
                <form className={styles.addQuestionForm} onSubmit={handleSubmit}>
                    <div className={styles.fieldWithLabel}>
                        <label className={styles.labelTextMessage}>Message</label>
                        <Field name='message' component={renderTextArea} />
                        <button className={styles.sendButtonTelegram} type='submit'><SendMessage /></button>
                    </div>
                    <h2>{message}</h2>
                </form>
            </div>
        </div>
    )
};

Message = reduxForm({
    form: 'message'
})(Message)

export default Message;