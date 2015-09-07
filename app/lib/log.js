/* global ENV_PROD */

var moment = require('alloy/moment');

// Current instance of the notification controller
var notification;

// Make our CommonJS module a Backbone Event dispatcher
var Log = module.exports = _.extend({}, Backbone.Events);

// History of all log messages
Log.history = '';

// Log any number of arguments
Log.args = function () {
	log({
		args: Array.prototype.slice.call(arguments)
	});
};

// Log any number of arguments, without showing a notification
Log.argsSilent = function () {
	log({
		args: Array.prototype.slice.call(arguments),
		silent: true
	});
};

// Log any number of arguments of which the last is an image
Log.argsWithImage = function () {
	var args = Array.prototype.slice.call(arguments);
	var image = args.pop();

	log({
		args: args,
		image: image
	});
};

// The actual log method
function log(opts) {
	var args = opts.args,
		image = opts.image,
		silent = !!opts.silent;

	// Stringify non-strings
	args = args.map(function (arg) {
		return (typeof arg === 'string') ? arg : JSON.stringify(arg, null, 2);
	});

	var message = args.join(' ');

	// Use error-level for production or they will not show in Xcode console
	console[ENV_PROD ? 'error' : 'info'](message);

	// Show the notification
	if (!silent) {
		notification && notification.close();

		notification = Alloy.createController('notification', {
			message: message,
			image: image
		});
	}

	// Keep track of all received log messages
	Log.history = (Log.history || '') + '[' + moment().format('HH:mm:ss.SS') + '] ' + message + '\n\n';

	// Trigger an event so listeners know we have new logs to show
	Log.trigger('change');
}
