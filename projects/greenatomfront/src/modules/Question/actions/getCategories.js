import { GET_CATEGORIES } from "../../../common/constants/actionTypes";

export const getCategories = () => ({
    type: GET_CATEGORIES,
    payload: {
        request: {
            url: '/category',
            method: 'post',
            data: {}
        }
    }
});