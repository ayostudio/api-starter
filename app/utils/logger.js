/**
 * Log info to the console
 * @param {string} message The message you want to log
 * @param {string} type The type of error log (default), info, warn or error
 * @param {object} data An optional error object to give back
 * @returns {console} Returns a console message
 */
module.exports = (message, type = 'log', data = null) => (data ? console[type](message, data) : console[type](message));
