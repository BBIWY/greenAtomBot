import {createSelector} from 'reselect';

const telegramNameSelector = ({telegramName}) => telegramName;

export const getTelegramName = createSelector(telegramNameSelector, telegramName => telegramName);