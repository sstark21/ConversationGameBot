const TelegramBot = require('node-telegram-bot-api');
// const sequelize = require('./db')
const UserQuestionsModel = require('./models')
const { funnyQuestions } = require('./questions/funnyQuestions')
const { acquaintanceQuestions } = require('./questions/acquaintanceQuestions')
const { forCouplesQuestions } = require('./questions/forCouplesQuestions')
const { philosophicalQuestions } = require('./questions/philosophicalQuestions')

require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true });
let LAST_CATEGORY = 'funny';
const questions = {
    funny: {
        data: funnyQuestions,
        emoji: '🕺',
        title: '🕺 Забавные',
    },
    forCouples: {
        data: forCouplesQuestions,
        emoji: '👩‍❤️‍💋‍👨',
        title: '👩‍❤️‍💋‍👨 Для парочек',
    },
    acquaintance: {
        data: acquaintanceQuestions,
        emoji: '🙋',
        title: '🙋 Для знакомства',
    },
    philosophical: {
        data: philosophicalQuestions,
        emoji: '🗣',
        title: '🗣 Философские',
    },
}

const getKeyboardElement = (type) => ({ text: questions[type].title, callback_data: type })

const questionTypeOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                getKeyboardElement('funny'),
                getKeyboardElement('philosophical'),

            ],
            [
                getKeyboardElement('acquaintance'),
                getKeyboardElement('forCouples'),
            ],
            [
                { text: '🎲', callback_data: 'random' },
            ]
        ]
    })
}

const afterQuestionOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                { text: 'Сменить категорию', callback_data: 'change_category' },
                { text: 'Еще', callback_data: 'more' }
            
            ],
            [
                { text: '🎲', callback_data: 'random' },
            ]
        ]
    })
}

const randomFunc = (data) => {
    return Math.floor(Math.random() * data.length)
}

const randomCategory = () =>  Object.keys(questions)[randomFunc(Object.keys(questions))]

const chooseQuestion = (type) => {
    const data = questions[type].data
    return `${questions[type].emoji} ${data[randomFunc(data)].ru}`
}

const checkToValidCategory = (dataForCheck) => {
    return Object.keys(questions).includes(dataForCheck);
}

const start = async () => {

    // try {
    //     await sequelize.authenticate()
    //     await sequelize.sync()
    // } catch (error) {
    //     console.log(error)
    // }

    bot.setMyCommands([
        { command: '/start', description: 'Поехали' },
        { command: '/question', description: 'Хочу вопрос' },
        // { command: '/add', description: 'Добавить свой вопрос' },
    ])

    bot.onText(/\/start/, async msg => {
        await bot.sendMessage(msg.chat.id, "Привет 👋, я бот для интересных посиделок с друзьями, выбери категорию вопроса 👇", questionTypeOptions);
    })
    bot.onText(/\/question/, async msg => {
        await bot.sendMessage(msg.chat.id, "Выберите категорию вопроса 👇", questionTypeOptions);
    })
    bot.onText(/\/add/, async msg => {
        const chatId = msg.chat.id;
        await UserQuestionsModel.create({ chatId }); // подумать, залупа какая-то (создавать по айди чата)
        await bot.sendMessage(chatId, "Пожалуйста, напишите свой собественный вопрос, он будет во вкладке 'Вопросы пользователей'");
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (checkToValidCategory(data)) {
            LAST_CATEGORY = data;
            return bot.sendMessage(chatId, chooseQuestion(data), afterQuestionOptions)
        }
        if (data === 'more') {
            if (LAST_CATEGORY === 'random') LAST_CATEGORY = randomCategory()
            return bot.sendMessage(chatId, chooseQuestion(LAST_CATEGORY), afterQuestionOptions)
        }
        if (data === 'change_category') {
            return bot.sendMessage(chatId, "Выберите категорию вопроса", questionTypeOptions);
        }
        if (data === 'random') {
            LAST_CATEGORY = 'random';
            return bot.sendMessage(chatId, chooseQuestion(randomCategory()), afterQuestionOptions)
        }
    })
}

start();
