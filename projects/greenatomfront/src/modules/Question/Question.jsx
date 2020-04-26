import React, {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Field, FieldArray, reduxForm } from "redux-form";
import styles from './Question.module.css';
import { getCategories } from "./actions/getCategories";
import {selectCategories} from "./selectors/categories";
import {getIsQuestionAdded} from "./selectors/getIsQuestionAdded";
import {clearIsQuestionAdded} from "./actions/clearIsQuestionAdded";

import {ReactComponent as Delete} from "../../common/assets/svg/delete.svg";
import {ReactComponent as Back} from '../../common/assets/svg/back.svg'
import {ReactComponent as Bait} from '../../common/assets/svg/bait.svg'
import {NavLink} from "react-router-dom";

const renderTextArea = ({ input, label, type, meta: { touched, error } }) => (
    <div className={styles.textArea}>
        <label className={styles.textAreaLabel}>{label}</label>
        <div className={styles.textAreaMain}>
            <input {...input} type={type} placeholder={label} />
            {touched && error && <span>{error}</span>}
        </div>
    </div>
);

const renderFalseQuestions = ({ fields }) => (
    <div className={styles.falseAnswersGroup}>
        <Bait className={styles.baitButton} onClick={() => fields.push()} />
        {fields.map((answer, index) => (
            <div className={styles.fieldWithLabel} key={index}>
                <label className={styles.labelText}>False answer {index + 1}</label>
                <Field name={answer} component={renderTextArea} type='text' placeholder='False answer' />
                <Delete className={styles.deleteButton} onClick={() => fields.remove(index)} />
            </div>
        ))}
    </div>
)


let Question = ({handleSubmit}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => () => {
            dispatch(clearIsQuestionAdded());
        }, [dispatch]);

    const categories = useSelector(state => selectCategories(state));

    const isQuestionAdded = useSelector(state => getIsQuestionAdded(state));

    return (
        <div className={styles.questionsManagerWrapper}>
            <div className={styles.questionAdd}>
                <span className={styles.textQuestionsManager}>Add New Question
                    <NavLink to='/questions'><Back/></NavLink>
                </span>
                <form className={styles.addQuestionForm} onSubmit={handleSubmit}>
                    <div className={styles.fieldWithLabel}>
                        <label className={styles.labelText}>Category</label>
                        <Field name='questionType' component='select'>
                            <option />
                            {categories?.map((value, idx) =>
                                <option key={`${value}-${idx}`} value={`${value}`}>{value}</option>
                            )}
                        </Field>
                    </div>
                    <div className={styles.fieldWithLabel}>
                        <label className={styles.labelText}>Question text</label>
                        <Field  name='question' component={renderTextArea} type='text' placeholder='Question text' />
                    </div>
                    <div className={styles.fieldWithLabel}>
                        <label className={styles.labelText}>Right answer</label>
                        <Field name='rightAnswer' component={renderTextArea} type='text' placeholder='Right answer' />
                    </div>
                    <FieldArray name='otherAnswers' component={renderFalseQuestions} />
                    <button className={styles.addQuestionButton} type='submit'>SUBMIT</button>
                    <h2>{isQuestionAdded}</h2>
                </form>
            </div>
        </div>
    )
};

Question = reduxForm({
    form: 'newQuestion'
})(Question)

export default Question;