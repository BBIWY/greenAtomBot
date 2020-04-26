import { GET_USER_EXIST } from "../../../common/constants/actionTypes";

export const getUserExists = (userData) => ({
    type: GET_USER_EXIST,
    payload: {
        request: {
            url: '/login',
            method: 'post',
            data: userData
        }
    }
});