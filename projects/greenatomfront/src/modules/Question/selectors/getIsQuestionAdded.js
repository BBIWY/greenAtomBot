import { createSelector } from 'reselect';

const isQuestionAddedSelector = ({isQuestionAdded}) => isQuestionAdded;

export const getIsQuestionAdded = createSelector(
    isQuestionAddedSelector,
    isQuestionAdded => isQuestionAdded
);