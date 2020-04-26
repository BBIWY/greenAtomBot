import {GET_ANSWERS} from "../../../common/constants/actionTypes";

export const requestAnswers = (qId) => ({
   type: GET_ANSWERS,
   payload: {
       request: {
           url: "/getAnswersForQuestion",
           method: 'post',
           data: {
               questionId: qId
           }
       }
   }
});