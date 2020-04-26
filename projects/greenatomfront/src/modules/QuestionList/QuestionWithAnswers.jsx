import React from "react";
import styles from "../Rating/Rating.module.css";
import {useSelector} from "react-redux";
import {getAnswers} from "./selectors/answers";
import {ReactComponent as Back} from "../../common/assets/svg/back.svg";
import {NavLink} from "react-router-dom";

export const QuestionWithAnswers = () => {

    const { question, otherAnswers, rightAsnwer } = useSelector(state => getAnswers(state));

    console.log(otherAnswers);

    return (
        <div className={styles.ManagerWrapper}>
            <div className={styles.ratingManager}>
                <span className={styles.textRatingManagerQuestion}>{question}<NavLink to='/questions'><Back/></NavLink></span>
                <div className={styles.ratingTable}>
                    <div className={styles.ratingTableHeader}>
                        <span className={styles.tableSpan}>Right answer</span>
                        {otherAnswers?.map((item, idx) => <span className={styles.tableSpan}>False answer {idx + 1}</span>)}
                    </div>
                    <div className={styles.ratingTableBody}>
                        <div key={`tableRow`} className={styles.ratingTableRow}>
                            <span className={styles.tableSpan}>{rightAsnwer}</span>
                            {otherAnswers?.map((item, index) => (
                                <>
                                <span key={`false-${index}`} className={styles.tableSpan}>{item}</span>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};