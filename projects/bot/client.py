import random
import os
import sys
sys.path.append(os.path.abspath('..'))
from db.direct_access_database import DBConnectionForBot


user_data_for_client = {}

user_data = {}

class Client:
    def __init__(self, telegram_username, telegram_chat_id):
        self.telegram_username = telegram_username
        self.telegram_chat_id = telegram_chat_id
        db = DBConnectionForBot()
        if not db.isHaveUser(telegram_chat_id):
            db.AddTelegramUser(telegram_chat_id, telegram_username, 500)
    
    def get_random_question(self, question_category):
        if (self.telegram_username not in user_data_for_client) or (question_category not in user_data_for_client[self.telegram_username]):
            db = DBConnectionForBot()
            if self.telegram_username not in user_data_for_client:
                user_data_for_client[self.telegram_username] = {}
            user_data_for_client[self.telegram_username][question_category] = {}
            data = db.GetAllQuestionForCategory(question_category)
            for elem in data:
                id_question, question, answers = elem['id_question'], elem['question'], elem['answers']
                user_data_for_client[self.telegram_username][question_category][str(id_question)] = {'question' : question, 'answers' : answers, 'is_answered' : False}
        else:
            db = DBConnectionForBot()
            data = db.GetAllQuestionForCategory(question_category)
            for elem in data:
                if str(elem['id_question']) not in user_data_for_client[self.telegram_username][question_category]:
                    id_question, question, answers = elem['id_question'], elem['question'], elem['answers']
                    user_data_for_client[self.telegram_username][question_category][str(id_question)] = {'question' : question, 'answers' : answers, 'is_answered' : False}
        if (self.telegram_username in user_data_for_client) and (question_category in user_data_for_client[self.telegram_username]) and len(user_data_for_client[self.telegram_username][question_category]) == 0:
            return {'id_question' : -1}
            
        def get_one_question_and_delete_him():
            for (id_question, data) in user_data_for_client[self.telegram_username][question_category].items():
                random.shuffle(data['answers'])
                if not data['is_answered']:
                    user_data_for_client[self.telegram_username][question_category][str(id_question)]['is_answered'] = True
                    return {'id_question' : id_question, 'question' : data['question'], 'answers' : data['answers']}
            return {'id_question' : -1}
        
        return get_one_question_and_delete_him()
    
    def get_random_question_from_all_question(self):
        db = DBConnectionForBot()
        return random.choice(db.RandomQuestionFromAllQuestion())
    
    
    def right_answer(self, id_question):
        db = DBConnectionForBot()
        return db.RightAnswerForQuestion(id_question)[0][1]
        
    def get_my_rank(self):
        db = DBConnectionForBot()
        return db.GetTelegramUser(self.telegram_chat_id)[2]
    
    def update_rank_for_win_batl(self):
        db = DBConnectionForBot()
        return db.UpdateTelegramUserRaiting(self.telegram_chat_id, self.get_my_rank() + 25)
    
    def update_rank_for_lose_batl(self):
        db = DBConnectionForBot()
        return db.UpdateTelegramUserRaiting(self.telegram_chat_id, self.get_my_rank() - 25)
        
    def update_rank_for_right_answer(self, id_question):
        db = DBConnectionForBot()
        db.IncrementAnswerCounterForQuestion(id_question)
        return db.UpdateTelegramUserRaiting(self.telegram_chat_id, self.get_my_rank() + 10)
        
    def update_rank_for_not_right_answer(self, id_question):
        db = DBConnectionForBot()
        db.DecrimentAnswerCounterForQuestion(id_question)
        return db.UpdateTelegramUserRaiting(self.telegram_chat_id, self.get_my_rank() - 8)
		
    def top_user(self):
        db = DBConnectionForBot()
        return sorted(db.TopRaiting(), key = lambda lhs : -lhs['rating'])
		
    def get_question_category(self):
        database = DBConnectionForBot()
        return [categ for (id, categ) in database.GetAllCategory()]
        
class ClientForSendMessageFromDB:
    def have_question(self):
        db = DBConnectionForBot()
        self.data = db.GetMessagesForUsers()
        return len(self.data) != 0
		
    def get_message(self):
        return self.data