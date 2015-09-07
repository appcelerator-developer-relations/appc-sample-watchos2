var log = require('log');

/**
 * Self-executing function containing all code that is executed when an instance
 * of this controller is created, apart from dependencies and variables declared
 * above. Just for readability, much like a class constructor.
 */
(function constructor(args) {

	// Show logs we have until now
	showHistory();

	// Listen for new logs
	log.on('change', showHistory);

})(arguments[0] || {});

/**
 * Shows the log history in the TextArea
 */
function showHistory() {
	$.log.value = log.history;
}

/**
 * Clear the history
 */
function clearHistory() {
	log.history = '';

	showHistory();
}
