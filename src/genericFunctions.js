/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/www.marxanweb.org
 * (see https://github.com/marxanweb/www.marxanweb.org).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
module.exports = {
	// returns a boolean if it is a valid number
	isNumber: function (str) {
		var pattern = /^\d+$/;
		return pattern.test(str); 
	}
};