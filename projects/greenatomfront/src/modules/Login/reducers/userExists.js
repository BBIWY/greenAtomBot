import { GET_USER_EXIST_SUCCESS, GET_USER_EXIST_FAIL, CREATE_USER_SUCCESS, CREATE_USER_FAIL } from "../../../common/constants/actionTypes";

const initialState = {
    userExists: undefined
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_USER_EXIST_SUCCESS:
            return payload.data;
        case GET_USER_EXIST_FAIL:
            return {
                userExists: undefined,
                error: 'Login failed'
            };
        case CREATE_USER_SUCCESS:
            return payload.data;
        case CREATE_USER_FAIL:
            return {
                error: 'Registration failed'
            }
        default:
            return state;
    }
}