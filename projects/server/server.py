from flask import Flask, request
from flask_restful import Resource,  Api
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token, jwt_required
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

import os
import sys
sys.path.append(os.path.abspath('..'))
from db.direct_access_database import DBConnection

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'my_cool_secret'
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'json']
jwt = JWTManager(app)
CORS(app)
api = Api(app)

def QuestionArray(result):
    ans = []
    for item in result:
        ans.append({"question_id":item[0],
                    "question":item[1],
                    "countAnsers":item[2],
                    "countRightAnswers":item[3],
                    "user_author":item[4],
                    "questionType":item[5]})
    return ans

def error(str):
    return {'result':'error','error': str}

class UserLogin(Resource):
    def post(self):
        try:
            username = request.get_json()['username']
            password = request.get_json()['password']
            
            db = DBConnection()
            res = db.GetUserByUserName(username)
            if res :
                if username in res[0]:
                    if check_password_hash(res[0][4],password):
                        userGroup = db.GetUserGroup(username)
                        access_token = create_access_token(identity={
                            'group': userGroup[0][0],
                        }, expires_delta=False)
                        result = {'token': access_token, 'result': 'ok'}
                        return result
                return error('Invalid pass or login')
            return error('Not user in db')
        except:
           return error('Invalid json or maybe something else wrong')

class UserReg(Resource):
    def post(self):
        userName = request.get_json()['username']
        password = request.get_json()['password']
        repeatPassword = request.get_json()['passwordRepeat']
        firstName = request.get_json()['firstName']
        lastName = request.get_json()['lastName']
        email = request.get_json()['email']
        if userName == '':
            return error('Invalid user name')
        
        if password == '':
            return error('Invalid password')

        if firstName == '':
            return error('Invalid first name')

        if lastName == '':
            return error('Invalid last name')

        if email == '':
            return error('Invalid email')

        if password != repeatPassword:
            return error('password != repeat password')
        
        db = DBConnection()
        user = db.GetUserByUserName(userName)

        if len(user) != 0:
            return error('This username alredy exsist')

        db.AddUser(userName = userName,firstName = firstName,lastName = lastName,passHash = generate_password_hash(password), userGroup = 1)
        
        return {"result":"ok"}

class GetQuestion(Resource):
    #@jwt_required
    def post(self):
        db = DBConnection()
        result = db.GetQuestion()
        ans = QuestionArray(result)
        return {"result":"ok","questions":ans}
        

class GetQuestionByUsername(Resource):
    def post(self):
        userName = request.get_json()['username']
        db = DBConnection()
        result = db.GetQuestionByUsername(userName)
        ans = QuestionArray(result)
        return {"result":"ok","questions":ans}
        
class GetUserCategory(Resource):
    #@jwt_required
    def post (self):
        result = DBConnection().GetAllQuestionCategory()
        category = []
        for item in result:
            category.append(item[1])
        ans = {"questionCategory":category}
        return ans

class GetTelegramUsers(Resource):
    #@jwt_required
    def get(self):
        print("kek")
        result = DBConnection().GetTelegramUsers()
        ans = []
        for item in result:
            ans.append({"userId":item[0],
                        "telegramName":item[1],"telegramId":item[2],
                        "rating":item[3]})
        return {"telegramUsers":ans}

class Test(Resource):
    #@jwt_required
    def post(self):
        return DBConnection().Test()        

class AddQuestions(Resource):
    #@jwt_required
    def post(self):
        questions = request.get_json()['questions']
        db = DBConnection()
        for item in questions:
            lastInsertId = db.AddQuestion(item['userAuthor'],item['question'],item['questionType'])
            self.AddAnswers(lastInsertId,item['rightAnswer'],item['otherAnswers'])
        return questions
    
    def AddAnswers(self,lastInsertId,rightAnswer,otherAnswers):
        db = DBConnection()
        db.AddAnswer(lastInsertId[0][0],rightAnswer,1)
        for item in otherAnswers:
            db.AddAnswer(lastInsertId[0][0],item,0)
        return ''
        

class GetUserInfo(Resource):
    #@jwt_required
    def post(self):
        username = request.get_json()['username']
        db = DBConnection()
        userInfo = db.GetUserByUserName(username)[0]
        return {"result":"ok","userId":userInfo[0],"username":userInfo[1],"firstName":userInfo[2],"lastName":userInfo[3],"userGroups":userInfo[5]}

class GetAswersForQuestion(Resource):
    def post(self):
        questionId = request.get_json()['questionId']
        db = DBConnection()
        question = db.GetQuestionById(questionId)[0][0]
        print(question)
        result = db.GetAnswersForQuestionId(questionId)
        ans = []
        for item in result:
            if item[1] == 1:
                rightAnswer = item[0]   
            else:
                ans.append(item[0])
        return {"question":question,"rightAsnwer":rightAnswer,"otherAnswers":ans}

class AddCategory(Resource):
    def post(self):
        questionCategories = request.get_json()['categories']
        db = DBConnection()
        for item in questionCategories:
            db.AddCategory(item)
        return ''

class DeleteQuestion(Resource):
    def post(self):
        questionId = request.get_json()['questionId']
        db = DBConnection()
        db.DeleteQuestion(questionId)
        return ''

class DeleteCategory(Resource):
    def post(self):
        category = request.get_json()['category']
        db = DBConnection()
        db.DeleteCategory(category)
        return ''

class AddMessage(Resource):
    def post(self):
        message = request.get_json()['message']
        telegramId = request.get_json()['telegramId']
        db = DBConnection()
        db.AddMessage(message,telegramId)
        return ''



api.add_resource(UserLogin, '/api/login')
api.add_resource(UserReg, '/api/reg')
api.add_resource(GetUserCategory,'/api/category')
api.add_resource(GetQuestionByUsername,'/api/questionsByUsername')
api.add_resource(GetQuestion,'/api/questions')
api.add_resource(GetTelegramUsers,'/api/rating')
api.add_resource(AddQuestions,'/api/addQuestion')
api.add_resource(GetUserInfo,'/api/getUserInfo')
api.add_resource(GetAswersForQuestion,'/api/getAnswersForQuestion')
api.add_resource(AddCategory,'/api/addCategory')
api.add_resource(DeleteQuestion,'/api/deleteQuestion')
api.add_resource(DeleteCategory,'/api/deleteCategory')
api.add_resource(AddMessage,'/api/addMessage')

if __name__ == '__main__':
    app.run(debug=True, host='37.140.198.34')
