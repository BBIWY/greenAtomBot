import {
    GET_ALL_QUESTIONS_SUCCESS,
    GET_ALL_QUESTIONS_FAIL
} from "../../../common/constants/actionTypes";

const initialState = [];

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_ALL_QUESTIONS_SUCCESS:
            return payload.data
        case GET_ALL_QUESTIONS_FAIL:
            return {data: payload, error: true};
        default:
            return state;
    }
};