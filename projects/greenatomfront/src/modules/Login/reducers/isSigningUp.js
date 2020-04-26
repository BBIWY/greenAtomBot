import {
    SET_SIGN_UP,
    CLEAR_SIGN_UP
} from "../../../common/constants/actionTypes";

const initialState = {
    signUp: true
};

export default (state = initialState, { type }) => {
    switch (type) {
        case SET_SIGN_UP:
            return {
                signUp: false
            };
        case CLEAR_SIGN_UP:
            return {signUp: true};
        default:
            return state;
    }
};