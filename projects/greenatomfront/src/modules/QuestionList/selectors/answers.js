import { createSelector } from 'reselect';

const answersSelector = ({answers}) => answers;

export const getAnswers = createSelector(
    answersSelector,
    answers => answers
);