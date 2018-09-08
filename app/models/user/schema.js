const mongoose = require('mongoose');
const { isEmail, doesContain } = require('../../utils/validation');

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
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

module.exports = schema;
