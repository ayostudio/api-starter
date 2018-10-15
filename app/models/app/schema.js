const mongoose = require('mongoose');

const { Schema } = mongoose;
const schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, 'App name is required'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is required'],
      validate: {
        validator: v => v.length <= 200,
        message: 'You description can exceed 200 characters',
      },
    },
    testPublic: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    testSecret: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    livePublic: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    liveSecret: {
      type: String,
      trim: true,
      required: true,
      unique: true,
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
