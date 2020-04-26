import telebot
import random
from telebot import apihelper
from telebot import types
from client import Client, ClientForSendMessageFromDB
from ast import literal_eval
import time 
import copy
import threading

helloS = ['CAACAgIAAxkBAAIB6V6kUs2rXSyT5yJu58akFWnjONs8AALqAgACtXHaBr_PemH5zBx1GQQ', 'CAACAgIAAxkBAAIB7V6kVKyzgl5PSCU1GG9gI6TK16byAALTAANWnb0K9TKPl9US-T0ZBA', 'CAACAgIAAxkBAAIB716kVZjDxXQPwasKn9Zx1zYpShtNAAKgAAOWn4wOZx7thjNWAAFVGQQ', 'CAACAgIAAxkBAAIB8V6kVbgFrGfGSSZ9WdvWAAEomGkOVQAC2AEAAladvQqY1H8pZ85AORkE', 'CAACAgIAAxkBAAIB816kVfaJIFPCKJoc0XURKdzTX12PAALkAQACygMGCwABXXwWKbEdMRkE', 'CAACAgIAAxkBAAIB9V6kVi_G7ugdMxiAMEXc4FcMjtOcAAJ4AgACufOXC9pN4y2L3AofGQQ']
rightanswS = ['CAACAgQAAxkBAAIB916kWYI18gFg9sDaT2b_dnUV8SD_AAJMAQACqCEhBmMqtFaxxhbIGQQ', 'CAACAgQAAxkBAAIB-V6kWZFBlX1yYKlxISi9lDpuu0YpAAJQAQACqCEhBrG98bXN6YSiGQQ', 'CAACAgIAAxkBAAIB-16kWbLli6BCJsKj0Qq6Lb3Fo2d0AALjAQACygMGC7zId-o8ErCFGQQ', 'CAACAgIAAxkBAAIB_V6kWcFmY93fg4AzqPu5nu6fncgPAALuAQACygMGC99XT5XsGZiGGQQ', 'CAACAgIAAxkBAAIB_16kWc-EViyU1xaZiTdcdjatN-22AAL5AQACygMGC77AxM_ztKG6GQQ', 'CAACAgIAAxkBAAICAV6kWhligTK2xWZKD5bzUbFY58wlAALJAQACVp29CnXYcMSIGS6NGQQ', 'CAACAgIAAxkBAAICGV6kbiwvQPRetuDt31mRLVMPVKD-AALGAANWnb0KbQmONokdLRcZBA']
startS = ['CAACAgIAAxkBAAICB16kaFZE98FEaWUAAbBPIvMdO5vV7AACHAADlp-MDpnUab5i8nnlGQQ', 'CAACAgIAAxkBAAICCV6kaGfPnqfCYW-Oq9h01HCyRkomAAIXAAOWn4wOVkwENSFGUSUZBA', 'CAACAgIAAxkBAAICC16kaHzEd5TzVNadaHbH52mznhQJAALhAANWnb0KW8GUi0D406AZBA', 'CAACAgIAAxkBAAICDV6kaKzqIpp98eCVb045KM0nxusCAAKKvQEAAWOLRgxDScvToqVyPhkE', 'CAACAgIAAxkBAAICD16kaNeam7rwWA6HWcELlmrEshdhAAIvCgACbjLYAAElop0T1-8O0hkE', 'CAACAgIAAxkBAAICEV6kaOeoVlF1hw3_LcrMGbgQufxJAAKDAgACufOXC0dZpKn5oKnZGQQ']



bot = telebot.TeleBot("939222585:AAH7iasRoO-Ms0Bmh_4Sdmcwm6zYJHEinAQ")



list_command = [['/help', 'Вывод всех команд чат-бота'],
                    ['/choose_category', 'Выбрать категорию для последующих вопросов'],
                    ['/start_test', 'Начать тестирование'],
                    ['/start_battle', 'Начать многопользовательское соревнование'],
                    ['/my_rating', 'Вывод рейтинга'],
                    ['/rating', 'Рейтинг всех пользователей'],
                    ['/category', 'Доступные категории вопросов']]

def string_help():
    answer = ''
    for elem in list_command:
        answer += '{} : {}\n'.format(elem[0], elem[1])
    return answer
    
def help_buttons(chat_id, username):
    user_name_and_last_question[username] = {}
    bot.send_message(chat_id, string_help(), reply_markup = types.ReplyKeyboardRemove())

user_id_and_category = {}
user_name_and_last_question = {}
data_for_batl = {}

def make_client(message):
    if (message.from_user.username == None):
        bot.send_message(message.chat.id, 'Для использования этого бота нужен username в telegram, установите его в настройках')
    else:
        return Client(message.from_user.username, message.chat.id)

@bot.message_handler(commands=['start'])
def send_welcome(message):
    client = make_client(message)
    bot.send_sticker(message.chat.id, random.choice(helloS))
    bot.send_message(message.chat.id, text = 'Привет, ' + message.from_user.first_name +  '! Здесь вы можете пройти тесты по различным направлениям программирования, начальный ранг = 100, правильный ответ дает +10, неправильный -8')
    help_buttons(message.chat.id, message.from_user.username)
    
@bot.message_handler(commands=['help'])
def send_help(message):
    client = make_client(message)
    help_buttons(message.chat.id, message.from_user.username)
    
@bot.message_handler(commands=['my_rating'])
def send_rank(message):
    client = make_client(message)
    rank = client.get_my_rank()
    bot.send_message(message.chat.id, 'Ваш рейтинг: ' + str(rank))

@bot.message_handler(commands=['rating'])
def send_top_rank(message):
    client = make_client(message)
    top_users = client.top_user()
    if len(top_users) > 10:
        top_users = top_users[:10]
    answer = 'Рейтинг:\n'
    for one_user in top_users:
        answer += '{}, rating = {}\n'.format(one_user['telegram_name'], one_user['rating'])
       
    bot.send_message(message.chat.id, text = answer)

@bot.message_handler(commands=['category'])
def send_category(message):
    client = make_client(message)
    categorys = client.get_question_category()
    answer = 'Категории вопросов:\n'
    for elem in sorted(categorys):
        answer += elem + '\n'
    bot.send_message(message.chat.id, answer)

@bot.message_handler(commands=['choose_category'])
def send_choose_category(message):
    client = make_client(message)
    lang = sorted(client.get_question_category())
    keyboard = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    user_name_and_last_question[message.from_user.username] = {}
    for i in range(len(lang)):
        keyboard.add(lang[i])
        user_name_and_last_question[message.from_user.username][lang[i]] = lambda msg: choose_category(msg)
    bot.send_message(message.chat.id, 'Выберите категорию вопросов:', reply_markup = keyboard)

@bot.message_handler(commands=['start_test'])
def send_random_question(message):
    client = make_client(message)
    
    if message.from_user.username not in user_id_and_category:
        user_name_and_last_question[message.from_user.username] = {}
        bot.send_message(message.chat.id, 'Вы не выбрали категорию вопроса, воспользуйтесь командой /choose_category')
        return None
    
    res = client.get_random_question(user_id_and_category[message.from_user.username])
    if res['id_question'] == -1:
        user_name_and_last_question[message.from_user.username] = {}
        bot.send_message(message.chat.id, 'Похоже вопросы по этой теме закончились, выберете другую категорию, /choose_category', reply_markup = types.ReplyKeyboardRemove())
        return None
    ques = res['question']
    answ = res['answers']
    keyboard = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    user_name_and_last_question[message.from_user.username] = {}
    for i in range(len(answ)):
        keyboard.add(answ[i])
        user_name_and_last_question[message.from_user.username][answ[i]] = lambda msg: choose_answer(msg, res['id_question'])
    keyboard.add('Ответить на этот вопрос и закончить тест')
    user_name_and_last_question[message.from_user.username]['Ответить на этот вопрос и закончить тест'] = lambda msg : last_question(message, ques, answ, res['id_question'])
                          
    bot.send_message(message.chat.id, ques, reply_markup = keyboard)
    

def last_question(message, ques, answ, id_question):
    client = make_client(message)

    keyboard = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    user_name_and_last_question[message.from_user.username] = {}
    for i in range(len(answ)):
        keyboard.add(answ[i])
        user_name_and_last_question[message.from_user.username][answ[i]] = lambda msg: choose_answer_and_help_buttons(msg, id_question)    
    bot.send_message(message.chat.id, ques, reply_markup = keyboard)

def choose_answer_and_help_buttons(message, id_question):
    client = make_client(message)
    logic_for_right_answer_or_not(client, message, id_question)
    
    help_buttons(message.chat.id, message.from_user.username)

def send_message_for_batl(client):
    if len(dict_for_start_batl[client.telegram_username]['question']) == 0:
        bot.send_message(client.telegram_chat_id, 'Батл окончен, вы правильно ответили на {} вопросов'.format(dict_for_start_batl[client.telegram_username]['count_of_right_answer']))
        dict_for_start_batl[client.telegram_username]['end_of_batl'] = True
        if dict_for_start_batl[dict_for_start_batl[client.telegram_username]['versus'].telegram_username]['end_of_batl'] == True:
            bot.send_message(client.telegram_chat_id, 'Ваш соперник правильно ответил на {} вопросов'.format(dict_for_start_batl[dict_for_start_batl[client.telegram_username]['versus'].telegram_username]['count_of_right_answer']))
            bot.send_message(dict_for_start_batl[client.telegram_username]['versus'].telegram_chat_id, 'Ваш соперник правильно ответил на {} вопросов'.format(dict_for_start_batl[client.telegram_username]['count_of_right_answer']))
            
            if dict_for_start_batl[client.telegram_username]['count_of_right_answer'] > dict_for_start_batl[dict_for_start_batl[client.telegram_username]['versus'].telegram_username]['count_of_right_answer']:
                client.update_rank_for_win_batl()
                dict_for_start_batl[client.telegram_username]['versus'].update_rank_for_lose_batl()
                
                bot.send_message(client.telegram_chat_id, 'Вы выграли')
                bot.send_message(dict_for_start_batl[client.telegram_username]['versus'].telegram_chat_id, 'Вы проиграли')
            elif dict_for_start_batl[client.telegram_username]['count_of_right_answer'] < dict_for_start_batl[dict_for_start_batl[client.telegram_username]['versus'].telegram_username]['count_of_right_answer']:
                client.update_rank_for_lose_batl()
                dict_for_start_batl[client.telegram_username]['versus'].update_rank_for_win_batl()
                
                bot.send_message(dict_for_start_batl[client.telegram_username]['versus'].telegram_chat_id, 'Вы выграли')
                bot.send_message(client.telegram_chat_id, 'Вы проиграли')
            else:
                bot.send_message(dict_for_start_batl[client.telegram_username]['versus'].telegram_chat_id, 'Ничья')
                bot.send_message(client.telegram_chat_id, 'Ничья')
        else:
            bot.send_message(client.telegram_chat_id, 'Результаты соперника будут написаны, когда он пройдет тест')
        help_buttons(client.telegram_chat_id, client.telegram_username)
        return None
    res = dict_for_start_batl[client.telegram_username]['question'].pop(0)
    ques = res['question']
    answ = res['answers']
    keyboard = types.ReplyKeyboardMarkup(row_width = 1, resize_keyboard = True)
    if client.telegram_username not in data_for_batl:
        data_for_batl[client.telegram_username] = {}
    data_for_batl[client.telegram_username]['batl'] = {}
    
    for i in range(len(answ)):
        keyboard.add(answ[i])
        data_for_batl[client.telegram_username]['batl'][answ[i]] = lambda msg: choose_answer_for_batl(msg, res['id_question'])
    
    data_for_batl[client.telegram_username]['batl']['time'] = time.time()    
    bot.send_message(client.telegram_chat_id, 'Категория: {}\n{}'.format(res['category'], ques), reply_markup = keyboard)

dict_for_start_batl = {}
@bot.message_handler(commands = ['start_battle'])
def strart_batl(message):
    client = make_client(message)
    dict_for_start_batl[client.telegram_username] =  {}
    dict_for_start_batl[client.telegram_username]['end_of_batl'] = False
    bot.send_message(message.chat.id, 'Правила батла:\nКолличество вопросов: 10. На ответ одного вопроса дается 15 секунд. За победу +25 к рейтингу, за поражение -25, иначе ничья, и никто ничего не получает.')
    if 'user_is_waiting_second_user' not in dict_for_start_batl:
        bot.send_message(client.telegram_chat_id, 'Поиск соперника...')
        dict_for_start_batl['user_is_waiting_second_user'] = client
        dict_for_start_batl[client.telegram_username]['question'] = [client.get_random_question_from_all_question() for i in range(10)]
    else:
        first_user_client = dict_for_start_batl['user_is_waiting_second_user']
        del dict_for_start_batl['user_is_waiting_second_user']
        second_user_client = client
        dict_for_start_batl[first_user_client.telegram_username]['versus'] = second_user_client
        dict_for_start_batl[second_user_client.telegram_username]['versus'] = first_user_client
        bot.send_message(first_user_client.telegram_chat_id, 
            'Ваш соперник найден, это {} с рейтингом {}'.format(second_user_client.telegram_username, second_user_client.get_my_rank()))
        bot.send_message(second_user_client.telegram_chat_id, 
            'Ваш соперник найден, это {} с рейтингом {}'.format(first_user_client.telegram_username, first_user_client.get_my_rank()))
        
        def send_the_same(telegram_chat_id):
            bot.send_message(telegram_chat_id, 'Батл начался.')
        send_the_same(first_user_client.telegram_chat_id)
        send_the_same(second_user_client.telegram_chat_id)
        dict_for_start_batl[second_user_client.telegram_username]['question'] = copy.deepcopy(dict_for_start_batl[first_user_client.telegram_username]['question'])
        
        dict_for_start_batl[first_user_client.telegram_username]['count_of_right_answer'] = 0
        dict_for_start_batl[second_user_client.telegram_username]['count_of_right_answer'] = 0
        
        send_message_for_batl(first_user_client)
        send_message_for_batl(second_user_client)
        
    return None

def logic_for_right_answer_or_not(client, message, id_question, f_win = None, f_lose = None):
    right_answer = client.right_answer(id_question)
    if(right_answer == message.text):
        if f_win:
            f_win()
        else:
            client.update_rank_for_right_answer(id_question)
        logic_for_sticker_for_right_answer(client.telegram_username, client.telegram_chat_id)
        return True
    else:
        if f_lose:
            f_lose()
        else:
            client.update_rank_for_not_right_answer(id_question)
            
        dict_for_right_answer_count[client.telegram_username] = 0
        bot.send_message(message.chat.id, 'Ошибка, правильный ответ: {}'.format(right_answer))
        return False
    
@bot.message_handler(func = lambda message: (message.from_user.username in data_for_batl and 'batl' in data_for_batl[message.from_user.username] and
            message.text in data_for_batl[message.from_user.username]['batl']))
def answer_for_question(message):
    data_for_batl[message.from_user.username]['batl'][message.text](message)

@bot.message_handler(func = lambda message: (message.from_user.username in user_name_and_last_question and
            message.text in user_name_and_last_question[message.from_user.username]))
def answer_for_question(message):
    user_name_and_last_question[message.from_user.username][message.text](message)
    
@bot.message_handler()
def just_send_help(message):
    bot.send_message(message.chat.id, string_help())

def choose_category(message):
    client = make_client(message)
    user_id_and_category[message.from_user.username] = message.text
    bot.send_message(message.chat.id, 'Категория вопроса установлена, для начала теста запустите /start_test', reply_markup = types.ReplyKeyboardRemove())
    
def choose_answer(message, id_question):
    client = make_client(message)
    logic_for_right_answer_or_not(client, message, id_question)
    send_random_question(message)

def choose_answer_for_batl(message, id_question):
    client = make_client(message)
    time_duration_answer_from_user = time.time() - data_for_batl[message.from_user.username]['batl']['time']
    right_answer = client.right_answer(id_question)
    if (time_duration_answer_from_user > 15):
        bot.send_message(message.chat.id, 'Время вышло, ответ не будет учитываться в результатах')
    else:
        if logic_for_right_answer_or_not(client, message, id_question, lambda : None, lambda : None):
            dict_for_start_batl[client.telegram_username]['count_of_right_answer'] += 1
    send_message_for_batl(client)

dict_for_right_answer_count = {}
def logic_for_sticker_for_right_answer(username, chat_id):
    if username not in dict_for_right_answer_count:
        dict_for_right_answer_count[username] = 0
    dict_for_right_answer_count[username] += 1
    if dict_for_right_answer_count[username] in [5, 10, 25, 50, 100]:
        bot.send_message(chat_id, 'Wow, у тебя уже {} правильных ответов подряд!'.format(dict_for_right_answer_count[username]))
        bot.send_sticker(chat_id, random.choice(rightanswS))

def process_send_message_from_site_to_users(e):
    while not e.isSet():
        db = ClientForSendMessageFromDB()
        if db.have_question():
            res = db.get_message()
            for one_message in res:
                bot.send_message(one_message['chat_id'], one_message['message'])
        time.sleep(60 * 10)
       

if __name__ == '__main__':
    e = threading.Event()
    process_send_message = threading.Thread(target = process_send_message_from_site_to_users, args = (e,))
    process_send_message.start()
    bot.polling()
    e.set()
    process_send_message.join()
    