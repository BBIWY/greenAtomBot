import { ADD_QUESTION } from "../../../common/constants/actionTypes";

export const addQuestion = (data) => ({
    type: ADD_QUESTION,
    payload: {
        request: {
            url: '/addQuestion',
            method: 'post',
            data: data
        }
    }
});