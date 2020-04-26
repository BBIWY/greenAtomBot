import {createSelector} from 'reselect';

const userExistSelector = ({userExists}) => userExists;

export const getUserExistsToken = createSelector(userExistSelector, ({token}) => token);