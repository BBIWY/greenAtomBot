import {
    CREATE_MESSAGE_SUCCESS, CREATE_MESSAGE_FAIL
} from "../../../common/constants/actionTypes";

const initialState = '';

export default (state = initialState, { type }) => {
    switch (type) {
        case CREATE_MESSAGE_SUCCESS:
            return 'Message has been successfully sent';
        case CREATE_MESSAGE_FAIL:
            return 'FAIL';
        default:
            return state;
    }
};