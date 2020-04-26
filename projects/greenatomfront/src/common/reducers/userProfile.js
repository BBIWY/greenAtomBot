import {
    GET_USER_INFO_FAIL, GET_USER_INFO_SUCCESS
} from "../constants/actionTypes";

const initialState = [];

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_USER_INFO_SUCCESS:
            return payload.data;
        case GET_USER_INFO_FAIL:
            return 'Error';
        default:
            return state;
    }
};