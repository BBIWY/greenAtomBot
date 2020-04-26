import {
    CHOOSE_TELEGRAM_NAME
} from "../../../common/constants/actionTypes";

const initialState = '';

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHOOSE_TELEGRAM_NAME:
            return payload;
        default:
            return state;
    }
};