import { createSelector } from 'reselect';

const questionsSelector = ({questions}) => questions;

export const getQuestions = createSelector(
    questionsSelector,
    questions => questions.questions
);