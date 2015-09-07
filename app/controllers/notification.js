// Keep track of timer to close and if the window is open
var timerId, isOpen = false;

// Expose the method to close the Window
$.close = close;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	$.message.text = args.message;

	// Show the optional image or remove the ImageView
	if (args.image) {
		$.image.image = args.image;

	} else {
		$.wrap.remove($.imageWrap);
	}

	$.win.open();
	isOpen = true;

	// Close after 5 seconds
	timerId = setTimeout(close, 5000);

})(arguments[0] || {});

/**
 * Closes the Window and cancels timer to do so automatically.
 */
function close() {

	// Clear timer set to close it autmatically
	if (timerId) {
		clearTimeout(timerId);
		timerId = null;
	}

	// Don't close if it's not open
	if (!isOpen) {
		return;
	}

	$.win.close();
	isOpen = false;
}
