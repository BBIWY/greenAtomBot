import {CREATE_MESSAGE} from "../../../common/constants/actionTypes";

export const createMessage = (message) => ({
    type: CREATE_MESSAGE,
    payload: {
        request: {
            url: 'addMessage',
            method: 'post',
            data: message
        }
    }
})