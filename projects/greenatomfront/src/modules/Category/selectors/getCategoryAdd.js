import { createSelector } from 'reselect';

const categoryAddSelector = ({categoryAdd}) => categoryAdd;

export const getCategoryAdd = createSelector(categoryAddSelector, categoryAdd => categoryAdd);