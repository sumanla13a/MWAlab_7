'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');

const db = require(path.join(global.appRoot, './model'));
const homework6 = db.homework6;
/* GET home page. */
const controllers = {
	getMessage: function(req, res, next) {
		homework6.findOne({}, function(err, rest) {
			if(err) {
				return next(err);
			}
			req.data = rest;
			next();
		});
	},
	decipherMessage: function(req, res, next) {
		const decipher = crypto.createDecipher('aes256', 'asaadsaad');
		req.decipheredMessage = '';
		decipher.on('readable', () => {
			var data = decipher.read();
			if(data) {
				req.decipheredMessage += data.toString('utf8');
			}
		});
		decipher.on('end', next);
		decipher.write(req.data.message, 'hex');
		decipher.end();
	},
	renderView: function(req, res) {
		return res.render('index', { title: req.decipheredMessage });
	}
};
router.get('/', controllers.getMessage, controllers.decipherMessage, controllers.renderView);

module.exports = router;
