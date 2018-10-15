const mongoose = require('mongoose');
const {
  isEmail, doesContain, isValidCountryCode, isIn,
} = require('../../utils/validation');

const { Schema } = mongoose;
const schema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, 'Email is required'],
      validate: { validator: isEmail, message: 'Email is not valid' },
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
      validate: {
        validator: v => doesContain(' ', v),
        message: 'You must add your first and last name',
      },
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: v => isIn(['individual', 'company'], v),
        message: 'The account type is not supported',
      },
    },
    country: {
      type: String,
      required: true,
      validate: {
        validator: isValidCountryCode,
        message: 'Your country is not yet supported',
      },
    },
    stripe_id: {
      type: String,
      required: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    termsSignedAt: {
      type: Date,
      required: [true, 'You must accept the terms and conditions'],
    },
    salt: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

module.exports = schema;
