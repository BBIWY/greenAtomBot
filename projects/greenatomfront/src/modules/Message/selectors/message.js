import {createSelector} from 'reselect';

const messageSelector = ({message}) => message;

export const getMessage = createSelector(messageSelector, message => message);