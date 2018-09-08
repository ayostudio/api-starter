# Node API Starter ⚙️

## Introduction

This is a great starter kit for any node.js API.

## Getting Started

### Requirements

- node.js version > 8
- mongodb running locally for the development server, or change the url for a remote server

### Environment

The app configuration can be found in `/app/config/index.js`. 

These environment variables have a default development configuration. They can be configured manually for production environments.

- `NODE_ENV` - environment: _development, staging, production_
- `MONGODB_URI` - mongodb connection uri: _mongodb://{your-url}:27017/{db-name}_
- `SECRET` - used for authentication salts: _{random-secure-string}_
- `PORT` - port the server will be run on: _e.g. 2000_

### Usage

- install dependencies: `yarn`
- start development server: `yarn start:dev`
- start production server: `yarn start`
- run unit tests: `yarn test:unit`
- run integration tests: `yarn test:integration`
- run full test suite with coverage: `yarn test`

## Features

- Authentication with passport
- Login and Signup endpoints
- User model with one endpoint
- Health check endpoint
- Full test coverage using mocha, sinon and chai 
- Logger utility
- Global error utility
- Custom validation utility
- Docblock comments


![Coverage](https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_100.png)
