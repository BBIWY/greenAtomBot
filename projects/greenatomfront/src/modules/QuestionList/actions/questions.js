import { GET_ALL_QUESTIONS } from "../../../common/constants/actionTypes";

export const getAllQuestions = () => ({
    type: GET_ALL_QUESTIONS,
    payload: {
        request: {
            method: 'post',
            url: '/questions',
            data: {}
        }
    }
})