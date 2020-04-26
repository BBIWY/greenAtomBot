import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Field, FieldArray, reduxForm } from "redux-form";
import { NavLink } from "react-router-dom";
import styles from '../Question/Question.module.css';
import {getCategoryAdd} from "./selectors/getCategoryAdd";
import {clearCategory} from './actions/categoryClear';
import {getCategories} from "../Question/actions/getCategories";
import {ReactComponent as Back} from "../../common/assets/svg/back.svg";
import {ReactComponent as Delete} from "../../common/assets/svg/delete.svg";
import {ReactComponent as Add} from "../../common/assets/svg/add_circle.svg";

const renderTextArea = ({ input, label, type, meta: { touched, error } }) => (
    <div className={styles.textArea}>
        <label className={styles.textAreaLabel}>{label}</label>
        <div className={styles.textAreaMain}>
            <input {...input} type={type} placeholder={label} />
            {touched && error && <span>{error}</span>}
        </div>
    </div>
);

const renderCategories = ({ fields }) => (
    <div className={styles.falseAnswersGroup}>
        <Add className={styles.addFalseAnswerButtonIco}  onClick={() => fields.push()} />
        {fields.map((category, index) => (
            <div className={styles.fieldWithLabel} key={index}>
                <label className={styles.labelText}>Category {index + 1}</label>
                <Field name={category} component={renderTextArea} type='text' placeholder='Category' />
                <Delete onClick={() => fields.remove(index)} className={styles.deleteButtonCategory} />
            </div>
        ))}
    </div>
)


let AddCategory = ({handleSubmit}) => {

    const dispatch = useDispatch();

    useEffect(()=> {
        dispatch(getCategories());

        return () => {
            dispatch(clearCategory());
        }
    }, [dispatch]);

    const categoryAdd = useSelector(state => getCategoryAdd(state));

    return (
        <div className={styles.questionsManagerWrapper}>
            <div className={styles.questionAdd}>
                <span className={styles.textQuestionsManager}>Add New Category(ies)<NavLink to='/category'><Back/></NavLink></span>
                <form className={styles.addQuestionForm} onSubmit={handleSubmit}>
                    <FieldArray name='categories' component={renderCategories} />
                    <button  className={styles.addQuestionButton} type='submit'>SUBMIT</button>
                    <h2>{categoryAdd}</h2>
                </form>
            </div>
        </div>
    )
};

AddCategory = reduxForm({
    form: 'newCategory'
})(AddCategory)

export default AddCategory;