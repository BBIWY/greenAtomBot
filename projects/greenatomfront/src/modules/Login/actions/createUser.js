import { CREATE_USER } from "../../../common/constants/actionTypes";

export const createUser = (userData) => ({
    type: CREATE_USER,
    payload: {
        request: {
            url: '/reg',
            method: 'post',
            data: userData
        }
    }
});