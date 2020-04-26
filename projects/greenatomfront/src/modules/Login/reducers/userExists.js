import { GET_USER_EXIST_SUCCESS, GET_USER_EXIST_FAIL } from "../../../common/constants/actionTypes";

const initialState = {
    userExists: undefined
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_USER_EXIST_SUCCESS:
            return payload.data
        case GET_USER_EXIST_FAIL:
            return {
                userExists: undefined,
                error: true
            };
        default:
            return initialState
    }
}