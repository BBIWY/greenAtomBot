import { createSelector } from 'reselect';

const categoriesSelector = ({categories}) => categories;

export const selectCategories = createSelector(
    categoriesSelector,
    categories => categories
    );