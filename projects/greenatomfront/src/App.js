import React, {useEffect, useReducer} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import { Container } from 'reactstrap';
import { Route, Switch, NavLink } from 'react-router-dom';

import Login from "./modules/Login";
import QuestionList from "./modules/QuestionList/QuestionList";
import Rating from "./modules/Rating/Rating";
import styles from './App.module.css';
import { getUserExists } from "./modules/Login/actions/getUserExists";
import { createUser } from "./modules/Login/actions/createUser";
import { getSignUp } from "./modules/Login/selectors/getSignUp";
import { getUserExistsToken } from "./modules/Login/selectors/getUserExist";
import SignUp from "./modules/Login/SignUp";

import { ReactComponent as AddBoxIco } from "../src/common/assets/svg/add-box.svg";
import { ReactComponent as Star} from "../src/common/assets/svg/star.svg";
import { ReactComponent as CategoryIco} from "../src/common/assets/svg/category.svg";
import { ReactComponent as User} from '../src/common/assets/svg/user.svg';
import { ReactComponent as SignOut} from '../src/common/assets/svg/signout.svg';

import Question from "./modules/Question/Question";
import { QuestionWithAnswers } from "./modules/QuestionList/QuestionWithAnswers";
import { addQuestion } from "./modules/Question/actions/addQuestion";
import Category from "./modules/Category/Category";
import AddCategory from "./modules/Category/AddCategory";
import { clearSignUp } from "./modules/Login/actions/signUp";
import { addCategory } from "./modules/Category/actions/categoryAdd";
import {getUserInfo} from "./common/selectors/getUserInfo";
import {requestUserInfo} from "./common/actions/requestUserInfo";
import Message from "./modules/Message/Message";
import {createMessage} from "./modules/Message/actions/message";
import {getTelegramName} from "./modules/Message/selectors/telegramName";


const App = () => {
    const dispatch = useDispatch();

    const signUp = useSelector(state => getSignUp(state))

    const userToken = useSelector(state => getUserExistsToken(state));

    // eslint-disable-next-line no-unused-vars
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const handleSubmit = (values) => {
        dispatch(getUserExists(values));
        localStorage.setItem('username_greenAtom', values.username);
        forceUpdate();
    };

    const handleSubmitSignUp = (values) => {
        dispatch(createUser(values));
        dispatch(clearSignUp())
    };

    if (userToken) {
        localStorage.setItem('id_token_greenAtom',userToken);
    }

    const token = localStorage.getItem('id_token_greenAtom');

    return (
        <Container fluid className={styles.App}>
            {!token && (<div className={styles.wrapper}>
                {signUp ? <Login onSubmit={handleSubmit}/> : <SignUp onSubmit={handleSubmitSignUp}/>}
            </div>)}
            {token && (<AppBody/>)}
        </Container>
    )
};

const AppBody = () => {

    const dispatch = useDispatch();

    const userName = localStorage.getItem('username_greenAtom');

    const telegram = useSelector(state => getTelegramName(state));

    useEffect(() => {
        dispatch(requestUserInfo(userName));
    }, [dispatch, userName])

    const handleSubmit = (values) => {
            values.userAuthor = userName ;
            const array = {questions: [values]};
            // window.alert(`You submitted:\n\n${JSON.stringify(array, null, 2)}`);
            dispatch(addQuestion(array));
    };

    const handleSubmitCategory = (values) => {
        dispatch(addCategory(values));
    };

    const handleSubmitMessage = (values) => {
        values.telegramId = telegram.telegramId;
        dispatch(createMessage(values));
    };

    const signOut = () => {
        localStorage.removeItem('id_token_greenAtom');
        localStorage.removeItem('username_greenAtom');
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    };

    const {firstName, lastName, userGroups, username} = useSelector(state => getUserInfo(state));

    return (
        <div className={styles.appBody}>
            <div className={styles.header}>
                <NavLink exact to='/' className={styles.title}>Test manager</NavLink>
                <div onClick={signOut} className={styles.signOutBlock}>
                    <span className={styles.signOut}>Sign out</span>
                    <SignOut />
                </div>
            </div>
            <div className={styles.main}>
                <div className={styles.managementPanel}>
                    <div className={styles.userWelcomeBlock}>
                        <User className={styles.Icon} />
                        <span className={styles.welcomeSpan}>Welcome, {firstName} {lastName}!</span>
                        <span className={styles.welcomeSpan}>Username: {username}</span>
                        <span className={styles.welcomeSpan}>Usergroup: {userGroups}</span>
                    </div>
                    <div className={styles.menu}>
                        <NavLink to='/questions' activeClassName={styles.menuNavLinkActive} className={styles.menuNavLink}>
                            <AddBoxIco className={styles.Icon} />
                            <span className={styles.linkText}>Question management</span>
                        </NavLink>
                        <NavLink to='/rating' activeClassName={styles.menuNavLinkActive} className={styles.menuNavLink}>
                            <Star className={styles.Icon} />
                            <span className={styles.linkText}>User rating</span>
                        </NavLink>
                        <NavLink to='category' activeClassName={styles.menuNavLinkActive} className={styles.menuNavLink}>
                            <CategoryIco className={styles.Icon} />
                            <span className={styles.linkText}>Category</span>
                        </NavLink>
                    </div>
                </div>
                <div className={styles.mainWindow}>
                    <Switch>
                        <Route exact path='/'>
                            <div className={styles.welcome}>
                                <span className={styles.welcomeText}>Welcome to Test Manager!</span>
                            </div>
                        </Route>
                        <Route exact path='/questions'>
                            <QuestionList />
                        </Route>
                        <Route exact path='/questions-add'>
                            <Question onSubmit={handleSubmit} />
                        </Route>
                        <Route exact path='/question-info'>
                            <QuestionWithAnswers />
                        </Route>
                        <Route exact path='/rating'>
                            <Rating />
                        </Route>
                        <Route exact path='/category'>
                            <Category />
                        </Route>
                        <Route exact path='/category-add'>
                            <AddCategory onSubmit={handleSubmitCategory} />
                        </Route>
                        <Route exact path='/message'>
                            <Message onSubmit={handleSubmitMessage} telegramName={telegram}/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    )
};

export default App;
