import sqlite3
import random
import threading


class DBConnection():
    def __init__(self):
        self.Create()

    def __del__(self):
        self.Close()

    def Create(self):
        self.conn = sqlite3.connect('../db/database.db')
        self.conn('PRAGMA foreign_keys = 1')
        self.cursor = self.conn.cursor()
               
    def GetGroups(self, id = 0):
        if id == 0:
            self.cursor.execute('SELECT group_name FROM users_groups')
        else:
            self.cursor.execute('SELECT group_name FROM users_groups WHERE groups_id = :id',{"id":id})  
        result = self.cursor.fetchall()
        return result

    def GetUserGroup(self,username):
        self.cursor.execute('SELECT user_group FROM users WHERE user_name = :username',{"username":username} )
        result = self.cursor.fetchall()
        return self.GetGroups(result[0][0])

    def GetUserHash(self,username):
        self.cursor.execute('SELECT pass_hash FROM users WHERE user_name = :username',{"username":username})
        return self.cursor.fetchall()
    
    def GetUsersInfo(self):
        self.cursor.execute('SELECT * FROM users')  
        result = self.cursor.fetchall()
        return result

    def GetQuestion(self):
        self.cursor.execute('''SELECT question_id, question, count_users_answers, count_right_users_answers,
                                (SELECT user_name FROM users WHERE user_id = questions.user_author),
                                (SELECT type FROM questions_type WHERE question_type_id = questions.question_type)
                                FROM questions''')
        result = self.cursor.fetchall()
        return result

    def GetQuestionById(self,questionId):
        self.cursor.execute('SELECT question FROM questions WHERE question_id = :questionId',{"questionId":questionId})
        return self.cursor.fetchall()
        
    def GetQuestionByUsername(self,userName):
        self.cursor.execute('SELECT user_id FROM users WHERE user_name = :userName',{"userName":userName})
        user_id = self.cursor.fetchall()[0]
        self.cursor.execute('''SELECT question_id, question, count_users_answers, count_right_users_answers,
                                (SELECT user_name FROM users WHERE user_id = questions.user_author),
                                (SELECT type FROM questions_type WHERE question_type_id = questions.question_type)
                                FROM questions WHERE user_author = :userId''',{"userId":user_id[0]})
        result = self.cursor.fetchall()
        print(result)
        return result
    
    def GetUserIdByUsername(self,userName):
        result = self.cursor.execute('SELECT user_id FROM users WHERE user_name = :userName',{"userName":userName})
        return result
		
    def GetUserByUserName(self, userName):
        self.cursor.execute('SELECT user_id, user_name,first_name,last_name,pass_hash,user_group FROM users WHERE user_name = :userName',{"userName":userName})
        result = self.cursor.fetchall()
        return result

    def GetAllQuestionCategory(self):
        self.cursor.execute('SELECT * FROM questions_type')
        result = self.cursor.fetchall()
        return result

    def AddCategory(self,categoryName):
        self.cursor.execute('INSERT INTO questions_type (type) VALUES (:categoryName)',{"categoryName":categoryName})
        self.conn.commit()
        return ''

    
    def DeleteCategory(self,categoryName):
        self.cursor.execute('DELETE FROM questions_type WHERE type = :categoryName',{"categoryName":categoryName})
        self.conn.commit()
        return ''

    def AddUser(self,userName, firstName, lastName, passHash, userGroup = 1):
        self.cursor.execute(
            'INSERT INTO users (user_name,first_name,last_name,pass_hash, user_group) VALUES (:userName,:firstName,:lastName,:passHash,:userGroup)',{"userName":userName,"firstName":firstName,"lastName":lastName,"passHash":passHash,"userGroup":userGroup})
        self.conn.commit()
        return ''

    def AddAnswer(self,lastInsertId,answer,rightAnswer ):
        self.cursor.execute('''INSERT INTO questions_answers (question_id,answer,right_answer)
                                VALUES(:questionId,:answer,:rightAnswer)''',
                            {"questionId":lastInsertId,"answer":answer,"rightAnswer":rightAnswer})
        self.conn.commit()
        return ''

    def DeleteQuestion(self,questionId):
        self.cursor.execute('DELETE FROM questions WHERE question_id = :questionId',{"questionId":questionId})
        self.conn.commit()
        return ''


    def GetAnswersForQuestionId(self,questionId):
        self.cursor.execute('SELECT answer, right_answer FROM questions_answers WHERE question_id = :questionId',{"questionId":questionId})
        result = self.cursor.fetchall()
        print(result)
        return result
    
    def AddQuestion(self,userName, question, questionType ):
        #self.cursor.execute('SELECT user_id FROM users WHERE user_name = :userName',{"userName":userName})
        #self.cursor.fetchall()
        self.cursor.execute(
            '''INSERT INTO questions (question,user_author,question_type)
                VALUES (:question,
                        (SELECT user_id FROM users WHERE user_name = :userName),
                        (SELECT question_type_id FROM questions_type WHERE type = :questionType))'''
            ,{"question":question,"userName":userName,"questionType":questionType})
        self.conn.commit()
        self.cursor.execute('SELECT last_insert_rowid()')
        result = self.cursor.fetchall()
        return result

    def GetTelegramUsers(self):
        self.cursor.execute('SELECT user_id,telegram_name,telegram_id,rating FROM telegram_users')
        result = self.cursor.fetchall()
        return result

    def AddMessage(self,message,telegramId):
        self.cursor.execute('''INSERT INTO messages (message,telegram_id)
                            VALUES (:message,:telegramId)''',{"message":message,"telegramId":telegramId})
        self.conn.commit()
        return ''
        
    
    def Close(self):
        self.cursor.close()

class DBConnectionForBot():
    def __init__(self):
        self.conn = sqlite3.connect('../db/database.db')
        self.cursor = self.conn.cursor()

    def __del__(self):
        self.cursor.close()
        
    def GetRandomQuestion(self, question_category):
        all_category = self.GetAllCategory()
        category_id = -1
        for pair in all_category:
            if pair[1] == question_category:
                category_id = pair[0]
                break

        if category_id == -1:
            return {'id_question' : -1, 'question' : 'error',
                'answers' : 'error'}
            
        self.cursor.execute('SELECT * FROM questions WHERE question_type = :category_type', {"category_type" : category_id})
        res = self.cursor.fetchall()
        if len(res) == 0:
            return {'id_question' : -1, 'question' : 'error',
                'answers' : 'error'}
        result_from_bd = random.choice(res)
        self.cursor.execute('SELECT * FROM questions_answers WHERE question_id = :question_id', {"question_id" : result_from_bd[0]})
        answers = [ans for (id, ans, is_right_ans) in self.cursor.fetchall()]
        random.shuffle(answers)
        return {'id_question' : result_from_bd[0], 'question' : result_from_bd[1],
            'answers' : answers}
            
    def GetAllQuestionForCategory(self, question_category):
        all_category = self.GetAllCategory()
        category_id = -1
        for pair in all_category:
            if pair[1] == question_category:
                category_id = pair[0]
                break

        if category_id == -1:
            return {'id_question' : -1, 'question' : 'error',
                'answers' : 'error'}
            
        self.cursor.execute('SELECT * FROM questions WHERE question_type = :category_type', {"category_type" : category_id})
        res = self.cursor.fetchall()
        if len(res) == 0:
            return {'id_question' : -1, 'question' : 'error',
                'answers' : 'error'}
        list_ans = []
        for elem in res:
            self.cursor.execute('SELECT * FROM questions_answers WHERE question_id = :question_id', {"question_id" : elem[0]})
            answers = [ans for (id, ans, is_right_ans) in self.cursor.fetchall()]
            list_ans.append({'id_question' : elem[0], 'question' : elem[1], 'answers' : answers})
        return list_ans
        
    def GetAllCategory(self):
        self.cursor.execute('SELECT * FROM questions_type')
        return self.cursor.fetchall()
        
    def RightAnswerForQuestion(self, id_question):
        self.cursor.execute('SELECT * FROM questions_answers WHERE question_id = :question_id AND right_answer = 1', {"question_id" : id_question})
        return self.cursor.fetchall()
    
    def FromIdCategoryGetCategory(self, category_id):
        all_category = self.GetAllCategory()
        for pair in all_category:
            if pair[0] == category_id:
                return pair[1]
        return ''
        
    def RandomQuestionFromAllQuestion(self):
        self.cursor.execute('SELECT * FROM questions')
        res = self.cursor.fetchall()
        if len(res) == 0:
            return {'id_question' : -1, 'question' : 'error',
                'answers' : 'error'}
        list_ans = []
        for elem in res:
            self.cursor.execute('SELECT * FROM questions_answers WHERE question_id = :question_id', {"question_id" : elem[0]})
            answers = [ans for (id, ans, is_right_ans) in self.cursor.fetchall()]
            list_ans.append({'id_question' : elem[0], 'question' : elem[1], 'answers' : answers, 'category' : self.FromIdCategoryGetCategory(elem[5])})
        return list_ans
        
    def GetTelegramUsers(self):
        self.cursor.execute('SELECT telegram_id, telegram_name, rating FROM telegram_users')
        result = self.cursor.fetchall()
        return result
        
    def AddTelegramUser(self, char_id, telegram_name, rating):
        self.cursor.execute(
            'INSERT INTO telegram_users (telegram_id, telegram_name, rating) VALUES (:telegram_id, :telegram_name, :rating)',
            {"telegram_id" : char_id, "telegram_name" : telegram_name, "rating" : rating})
        self.conn.commit()
        
    def isHaveUser(self, chat_id):
        self.cursor.execute('SELECT telegram_id FROM telegram_users WHERE telegram_id = :chat_id', {'chat_id' : chat_id})
        return len(self.cursor.fetchall()) != 0
        
    def GetTelegramUser(self, chat_id):
        if self.isHaveUser(chat_id):
            self.cursor.execute('SELECT telegram_id, telegram_name, rating FROM telegram_users WHERE telegram_id = :chat_id', {'chat_id' : chat_id})
            return self.cursor.fetchall()[0]
            
    def UpdateTelegramUserRaiting(self, chat_id, new_rating):
        self.cursor.execute('UPDATE telegram_users SET rating=:new_rating WHERE telegram_id=:chat_id', {'new_rating' : new_rating, 'chat_id' : chat_id})
        self.conn.commit()
        
    def TopRaiting(self):
        self.cursor.execute('SELECT telegram_name, rating FROM telegram_users')
        result = self.cursor.fetchall()
        answer = []
        for (telegram_name, rating) in result:
            answer.append({'telegram_name' : telegram_name, 'rating' : rating})
        return answer;
        
    def GetMessagesForUsers(self):
        self.cursor.execute('SELECT * FROM messages')
        res = self.cursor.fetchall()
        self.cursor.execute('DELETE FROM messages')
        self.conn.commit()
        answer = []
        for (msg, chat_id) in res:
            answer.append({'chat_id' : chat_id, 'message' : msg})
        return answer
        
    def IncrementAnswerCounterForQuestion(self, id_question):
        self.cursor.execute('SELECT count_users_answers, count_right_users_answers FROM questions WHERE question_id = :id_question', {'id_question' : id_question})
        old_data = self.cursor.fetchall()[0]
        self.cursor.execute('UPDATE questions SET count_users_answers=:count_users_answers, count_right_users_answers=:count_right_users_answers WHERE question_id=:id_question', {'count_users_answers' : old_data[0] + 1, 'count_right_users_answers' : old_data[1] + 1, 'id_question' : id_question})
        self.conn.commit()
        
    def DecrimentAnswerCounterForQuestion(self, id_question):
        self.cursor.execute('SELECT count_users_answers, count_right_users_answers FROM questions WHERE question_id = :id_question', {'id_question' : id_question})
        old_data = self.cursor.fetchall()[0]
        self.cursor.execute('UPDATE questions SET count_users_answers=:count_users_answers, count_right_users_answers=:count_right_users_answers WHERE question_id=:id_question', {'count_users_answers' : old_data[0] + 1, 'count_right_users_answers' : old_data[1], 'id_question' : id_question})
        self.conn.commit()

