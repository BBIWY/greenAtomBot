import {
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_FAIL,
    CLEAR_CATEGORY
} from "../../../common/constants/actionTypes";

const initialState = '';

export default (state = initialState, { type }) => {
    switch (type) {
        case ADD_CATEGORY_SUCCESS:
            return "Category successfully added";
        case ADD_CATEGORY_FAIL:
            return null;
        case CLEAR_CATEGORY:
            return null;
        default:
            return state;
    }
};