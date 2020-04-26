import { createSelector } from 'reselect';

export const formSelector = ({ form }) => form;

export const getForm =  createSelector(
    formSelector,
    form => form
);