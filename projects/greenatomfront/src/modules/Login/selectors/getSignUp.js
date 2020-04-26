import { createSelector } from 'reselect';

const formSelector = ({ isSigningUp }) => isSigningUp.signUp;

export const getSignUp =  createSelector(
    formSelector,
    signUp => signUp
);