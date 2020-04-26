import {
    DELETE_QUESTION_FAIL, DELETE_QUESTION_SUCCESS
} from "../../../common/constants/actionTypes";

const initialState = '';

export default (state = initialState, { type }) => {
    switch (type) {
        case DELETE_QUESTION_SUCCESS:
            return 'SUCCESS';
        case DELETE_QUESTION_FAIL:
            return 'FAIL';
        default:
            return state;
    }
};