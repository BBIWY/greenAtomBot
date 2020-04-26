import { GET_RATING_FAIL, GET_RATING_SUCCESS } from "../../../common/constants/actionTypes";

const initialState = [];

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_RATING_SUCCESS:
            return payload.data.telegramUsers
        case GET_RATING_FAIL:
            return ['error'];
        default:
            return state;
    }
};