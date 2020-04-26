import {DELETE_QUESTION} from "../../../common/constants/actionTypes";

export const deleteQuestion = (qId) => ({
    type: DELETE_QUESTION,
    payload: {
        request: {
            url: '/deleteQuestion',
            method: 'post',
            data: {
                questionId: qId
            }
        }
    }
});