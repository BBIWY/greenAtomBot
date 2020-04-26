import {CHOOSE_TELEGRAM_NAME} from "../../../common/constants/actionTypes";

export const chooseTGName = (payload) => ({
    type: CHOOSE_TELEGRAM_NAME,
    payload: payload
});