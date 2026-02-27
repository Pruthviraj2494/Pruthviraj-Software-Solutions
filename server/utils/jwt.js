const jwt = require('jsonwebtoken');
const moment = require('moment');

const JWT_SECRET = process.env.JWT_SECRET || 'PruthvirajSoftwareSolutionsSecretKey123';

exports.generateToken = (data) => {
    const numberOfDays = 1;
    return {
        accessToken: jwt.sign(data, JWT_SECRET, { expiresIn: numberOfDays * 24 * 60 * 60 }),
        accessTokenExpiry: new Date(moment().add(numberOfDays, 'days'))
    };
};

exports.decoded = (token) => {
    return jwt.decode(token, JWT_SECRET);
};

exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        return null;
    }
};
