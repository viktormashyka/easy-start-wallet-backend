const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleSchemaValidationErrors } = require('../helpers');

const bcrypt = require('bcryptjs');

//-----------------------------------------------------------------------------
const emailRegexp = /^[\w.]+@[\w]+.[\w]+$/;

const userSchema = Schema(
  {
    name: {
      type: String,
      // required: [true, 'Name is required'],
      default: 'User',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    balance: {
      type: Number,
      default: 0,
    },
    isNotNewUser: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      // required: [true, 'Avatar is required'],
    },
    verify: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
      // required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

//!  Хеширование и засока password с помошью bcryptjs
userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

//!  Сравнение паролей
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

//! Правильный код ошибки contactSchema
userSchema.post('save', handleSchemaValidationErrors);

//* ++++++++++++++++++++++ Схемы ВАЛИДАЦИИ Joi +++++++++++++++++++++++++
const subscriptionList = ['starter', 'pro', 'business'];

const registerJoiSchema = Joi.object({
  name: Joi.string().min(2),
  // .required(),
  email: Joi.string()
    .pattern(emailRegexp)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'org'] },
    })
    .required(),
  password: Joi.string().min(3).required(),
  subscription: Joi.string()
    .valueOf(...subscriptionList)
    .optional(),
});
//--------------------------------------------------------------------
const loginJoiSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'org'] },
    })
    .required(),
  password: Joi.string().min(3).required(),
});
//--------------------------------------------------------------------
const changeSubscriptionJoiSchema = Joi.object({
  subscription: Joi.string()
    .valueOf(...subscriptionList)
    .required(),
});
//--------------------------------------------------------------------
const verifyEmailJoiSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'org'] },
    })
    .required(),
});
//* _______________________ Схемы ВАЛИДАЦИИ Joi _______________________

//? Создаем МОДЕЛЬ:
const User = model('user', userSchema);

module.exports = {
  User,
  registerJoiSchema,
  loginJoiSchema,
  changeSubscriptionJoiSchema,
  verifyEmailJoiSchema,
};
