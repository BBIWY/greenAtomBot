import { GET_RATING } from "../../../common/constants/actionTypes";

export const requestRating = () => ({
   type: GET_RATING,
   payload: {
       request: {
           url: '/rating',
           method: 'get'
       }
   }
});