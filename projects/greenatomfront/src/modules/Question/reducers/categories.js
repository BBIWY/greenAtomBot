import {
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAIL
} from "../../../common/constants/actionTypes";

const initialState = [];

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_CATEGORIES_SUCCESS:
            return payload.data.questionCategory
        case GET_CATEGORIES_FAIL:
            return ['error'];
        default:
            return state;
    }
};