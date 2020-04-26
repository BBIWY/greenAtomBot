import React from 'react';
import { useDispatch } from 'react-redux'
import { Container } from 'reactstrap';

import Login from "./modules/Login";
import styles from './App.module.css';
import { getUserExists } from "./modules/Login/actions/getUserExists";

const App = () => {

    const dispatch = useDispatch();

    const handleSubmit = (values) => {
        dispatch(getUserExists(values))
    }

    return (
        <Container fluid className={styles.App}>
            <div className={styles.wrapper}>
                <Login onSubmit={handleSubmit} />
            </div>
        </Container>
    )
};

export default App;
