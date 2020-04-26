import { ADD_CATEGORY } from "../../../common/constants/actionTypes";

export const addCategory = (category) => ({
    type: ADD_CATEGORY,
    payload: {
        request: {
            url: "/addCategory",
            method: "post",
            data: category
        }
    }
});