import React, {useEffect} from "react";
import styles from "../QuestionList/QuestionList.module.css";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useInterval} from "../../common/utils/useInterval";
import {ReactComponent as Delete} from "../../common/assets/svg/delete.svg";
import {ReactComponent as Edit} from "../../common/assets/svg/edit.svg";
import {getCategories} from "../Question/actions/getCategories";
import {selectCategories} from "../Question/selectors/categories";
import { categoryDelete } from "./actions/categoryDelete";

const Category = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useInterval(() => dispatch(getCategories()), 5000);

    const categories = useSelector(state => selectCategories(state));

    const deleteCategory = (category) => {
      dispatch(categoryDelete(category));
      dispatch(getCategories());
    };

    return (
        <div className={styles.questionsManagerWrapper}>
            <div className={styles.questionsManager}>
                <span className={styles.textQuestionsManager}>Manage categories</span>
                <div className={styles.appQuestionBlock}>
                    <NavLink to='/category-add'>
                        <button className={styles.addQuestionsButton}>Add new categories</button>
                    </NavLink>
                </div>
                <div className={styles.questionsTable}>
                    <div className={styles.questionsTableHeader}>
                        <span className={styles.tableSpan}>Type</span>
                        <span className={styles.tableSpan}>Action</span>
                    </div>
                    <div className={styles.questionsTableBody}>
                        {categories?.map((item, index) => (
                            <div key={`tableRow-${index}`} className={styles.questionsTableRow}>
                                <span className={styles.tableSpan}>{item}</span>
                                <span className={styles.tableSpan}>
                                    <Delete onClick={() => deleteCategory(item)} className={styles.Ico} />
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

export default Category;