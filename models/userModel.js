const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleSchemaValidationErrors } = require('../helpers');
const bcrypt = require('bcryptjs');
const emailRegexp = /^[\w.]+@[\w]+.[\w]+$/;

const userSchema = Schema(
  {
    name: {
      type: String,
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
    },
    verify: {
      type: Boolean,
      default: true,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.post('save', handleSchemaValidationErrors);

const registerJoiSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string()
    .pattern(emailRegexp)
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'org'] },
    })
    .required(),
  password: Joi.string().min(3).required(),
});

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

const User = model('user', userSchema);

module.exports = {
  User,
  registerJoiSchema,
  loginJoiSchema,
};
