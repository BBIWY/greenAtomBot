import {GET_USER_INFO} from "../constants/actionTypes";

export const requestUserInfo = (username) => ({
    type: GET_USER_INFO,
    payload: {
        request: {
            url: '/getUserInfo',
            method: 'post',
            data: {
                username: username
            }
        }
    }
});