import {
    DELETE_CATEGORIES_SUCCESS, DELETE_CATEGORIES_FAIL
} from "../../../common/constants/actionTypes";

const initialState = '';

export default (state = initialState, { type }) => {
    switch (type) {
        case DELETE_CATEGORIES_SUCCESS:
            return 'SUCCESS';
        case  DELETE_CATEGORIES_FAIL:
            return 'FAIL';
        default:
            return state;
    }
};