const { white, red } = require('chalk');

module.exports = async (client, info) => {
    console.log(`Rate limit triggered: ${info.route}`);
    console.log(`Limit: ${info.limit}`);
    console.log(`Time until reset (in ms): ${info.timeDifference}`);
}