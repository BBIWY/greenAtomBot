import React, {useEffect} from "react";
import styles from "./Rating.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useInterval} from "../../common/utils/useInterval";
import {requestRating} from "./actions/rating";
import {getRating} from "./selectors/rating";
import {ReactComponent as Telegram} from '../../common/assets/svg/telegram.svg'
import {NavLink} from "react-router-dom";
import {chooseTGName} from "../Message/actions/telegramName";

const Rating = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(requestRating());
    }, [dispatch]);

    useInterval(() => dispatch(requestRating()), 5000);

    const rating = useSelector(state => getRating(state));

    const setTelegramName = (telegramName, telegramId) => {
      dispatch(chooseTGName({telegramName:telegramName, telegramId: telegramId}));
    };

    return (
        <div className={styles.ManagerWrapper}>
            <div className={styles.ratingManager}>
                <span className={styles.textRatingManager}>Users rating</span>
                <div className={styles.ratingTable}>
                    <div className={styles.ratingTableHeader}>
                        <span className={styles.tableSpan}>Telegram Name</span>
                        <span className={styles.tableSpan}>Rating</span>
                        <span className={styles.tableSpan}>Action</span>
                    </div>
                    <div className={styles.ratingTableBody}>
                        {rating?.map(({telegramName, rating, telegramId}, index) => (
                            <div key={`tableRow-${index}`} className={styles.ratingTableRow}>
                                <span className={styles.tableSpan}>{telegramName}</span>
                                <span className={styles.tableSpan}>{rating}</span>
                                <span className={styles.tableSpan}>
                                    <NavLink onClick={() => setTelegramName(telegramName, telegramId)} to='/message'>
                                        <Telegram className={styles.telegram}/>
                                    </NavLink>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Rating;