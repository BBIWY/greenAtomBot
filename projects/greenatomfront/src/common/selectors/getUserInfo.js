import {createSelector} from 'reselect';

const userInfoSelector = ({userProfile}) => userProfile;

export const getUserInfo = createSelector(userInfoSelector, userProfile => userProfile);