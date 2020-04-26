import React, {useEffect} from "react";
import styles from "./QuestionList.module.css";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useInterval} from "../../common/utils/useInterval";
import {getAllQuestions} from "./actions/questions";
import {getQuestions} from "./selectors/questions";
import {ReactComponent as Delete} from "../../common/assets/svg/delete.svg";
import {ReactComponent as Edit} from "../../common/assets/svg/edit.svg";
import {deleteQuestion} from "./actions/deleteQuestion";
import {requestAnswers} from "./actions/answers";

const QuestionList = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllQuestions());
    }, [dispatch]);

    useInterval(() => dispatch(getAllQuestions()), 5000);

    const questions = useSelector(state => getQuestions(state));

    const deleteQuestionFromDB = (qId) => {
        dispatch(deleteQuestion(qId));
        dispatch(getAllQuestions());
    };

    const getAnswersForQuestion = (qId) => {
        dispatch(requestAnswers(qId));
    };

    return (
        <div className={styles.questionsManagerWrapper}>
            <div className={styles.questionsManager}>
                <span className={styles.textQuestionsManager}>List property</span>
                <div className={styles.appQuestionBlock}>
                    <NavLink to='/questions-add'>
                        <button className={styles.addQuestionsButton}>Add new questions</button>
                    </NavLink>
                </div>
                <div className={styles.questionsTableMain}>
                    <div className={styles.questionsTableHeader}>
                        <span className={styles.tableSpan}>Author</span>
                        <span className={styles.tableSpan}>Type</span>
                        <span className={styles.tableSpan}>Question</span>
                        <span className={styles.tableSpan}>Answers</span>
                        <span className={styles.tableSpan}>Right answers</span>
                        <span className={styles.tableSpan}>Action</span>
                    </div>
                    <div className={styles.questionsTableBody}>
                        {questions?.map((item, index) => (
                            <div key={`tableRow-${index}`} className={styles.questionsTableRow}>
                                <span className={styles.tableSpan}>{item.user_author}</span>
                                <span className={styles.tableSpan}>{item.questionType}</span>
                                <NavLink to='question-info' onClick={() => getAnswersForQuestion(item.question_id)}
                                         className={styles.tableSpan}>
                                    {item["question"].slice(0,20) + "..."}
                                </NavLink>
                                <span className={styles.tableSpan}>{item.countAnsers}</span>
                                <span className={styles.tableSpan}>{item.countRightAnswers}</span>
                                <span className={styles.tableSpan}>
                                    <Delete onClick={() => deleteQuestionFromDB(item.question_id)} className={styles.Ico} />
                                    <Edit className={styles.Ico}/>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default QuestionList;