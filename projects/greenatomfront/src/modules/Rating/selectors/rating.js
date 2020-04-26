import { createSelector } from 'reselect';

const ratingSelector = ({rating}) => rating;

export const getRating = createSelector(ratingSelector, rating => rating);