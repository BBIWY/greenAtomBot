import {DELETE_CATEGORIES} from "../../../common/constants/actionTypes";

export const categoryDelete = (category) => ({
    type: DELETE_CATEGORIES,
    payload: {
        request: {
            url: '/deleteCategory',
            method: 'post',
            data: {
                category: category
            }
        }
    }
})