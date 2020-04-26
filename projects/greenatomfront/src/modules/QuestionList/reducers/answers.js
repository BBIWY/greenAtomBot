import {
    GET_ANSWERS_SUCCESS,
    GET_ANSWERS_FAIL
} from "../../../common/constants/actionTypes";

const initialState = [];

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_ANSWERS_SUCCESS:
            return payload.data
        case GET_ANSWERS_FAIL:
            return ['error'];
        default:
            return state;
    }
};