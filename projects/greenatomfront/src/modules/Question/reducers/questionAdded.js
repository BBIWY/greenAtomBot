import {
    ADD_QUESTION_FAIL, ADD_QUESTION_SUCCESS, CLEAR_IS_QUESTION_ADDED
} from "../../../common/constants/actionTypes";

const initialState = [];

export default (state = initialState, { type }) => {
    switch (type) {
        case ADD_QUESTION_SUCCESS:
            return "Question successfully added";
        case ADD_QUESTION_FAIL:
            return null;
        case CLEAR_IS_QUESTION_ADDED:
            return null;
        default:
            return state;
    }
};