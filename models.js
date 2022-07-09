const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const UserQuestions = sequelize.define('user_questions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chatId: { type: DataTypes.STRING, unique: true },
    // questionRu: {type: DataTypes.TEXT},
    // questionEn: {type: DataTypes.TEXT},
    question: { type: DataTypes.TEXT },
    userName: { type: DataTypes.STRING }
})

module.export = UserQuestions;