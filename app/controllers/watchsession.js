var log = require('log');

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// Required to be able to receive events from the watch
	// The session will also automatically activate when you
	// call methods or properties on Ti.WatchSession (except
	// for addEventListener that is)
	Ti.WatchSession.activateSession();

	setupListeners();

	showProperties();

})(arguments[0] || {});

/**
 * Add listeners to all Ti.WatchSession events
 */
function setupListeners() {

	['receivemessage', 'receiveuserinfo', 'receivefile', 'receiveapplicationcontext', 'watchstatechanged', 'reachabilitychanged', 'finishfiletransfer', 'finishuserinfotransfer'].forEach(function (event) {

		Ti.WatchSession.addEventListener(event, function (e) {

			// If the event is receivefile log with the image
			if (e.type === 'receivefile') {
				log.argsWithImage('Ti.WatchSession:' + e.type, e, e.data);

			} else {

				log.args('Ti.WatchSession:' + e.type, e);

				// If it's a change-event show the updates property values
				if (event.indexOf('Changed') !== -1) {
					showProperties();
				}
			}

		});

	});
}

/**
 * Show the value of all Ti.WatchSession properties
 */
function showProperties() {

	['isSupported', 'isPaired', 'isWatchAppInstalled', 'isComplicationEnabled', 'isReachable', 'recentApplicationContext'].forEach(function (property) {
		showProperty(property);
	});
}

/**
 * Shows the value of a Ti.WatchSession property in a labe by its name
 */
function showProperty(property) {

	// If this method is called from the UI 'property' is an event and the
	// source's text-value is the name of the property
	if (_.isObject(property)) {
		property = property.source.text;
	}

	// Get the value and make it a string if it isn't
	var valStr = JSON.stringify(Ti.WatchSession[property]);

	// Log without showing the notification window
	log.argsSilent('Ti.WatchSession.' + property, valStr);

	// Fade out the Label
	$[property].animate({
		opacity: 0

	}, function () {

		// Update the Label's text with the property value
		$[property].text = valStr;

		// Fade the Label in
		$[property].animate({
			opacity: 1
		});
	});
}

/**
 * Sends a message to the installed watchapp on the apple watch in the foreground.
 */
function sendMessage(e) {
	Ti.WatchSession.sendMessage(createSamplePayload());
}

/**
 * Transfers complication data to the installed watch app. This is only for
 * watch apps with complications enabled, which our sample is not.
 */
function transferCurrentComplication(e) {
	Ti.WatchSession.transferCurrentComplication(createSamplePayload());
}

/**
 * Transfers a file to the installed watchapp on the apple watch in the
 * background. Subsequent transfers are queued.
 */
function transferFile(e) {
	Ti.WatchSession.transferFile({
		fileURL: '/images/logo.png',
		metaData: createSamplePayload()
	});
}

/**
 * Transfers an user info object to the installed watchapp on the apple
 * watch in the background. Subsequent transfers are queued.
 */
function transferUserInfo(e) {
	Ti.WatchSession.transferUserInfo(createSamplePayload());
}

/**
 * Sends an app context update to the apple watch. If watchapp is in
 * background during transfer, watchapp's delegate will receive the app
 * context immediately when it becomes active. Only 1 app context is
 * stored at any one time, subsequent updates will simply replace the
 * earlier one sent.
 */
function updateApplicationContext(e) {
	Ti.WatchSession.updateApplicationContext(createSamplePayload());

	// Ti.WatchSession.recentAppContext should now have the last sent context
	showProperty('recentApplicationContext');
}

/**
 * The cancel*() methods are difficult to demonstrate since it will only cancel
 * if you transfer lots of data, the iPhone can't connect to the Watch or for
 * some other reason the transfer is still pending.
 */

function cancelAllFileTransfers() {
	Ti.WatchSession.cancelAllFileTransfers();
}

function cancelAllTransfers() {
	Ti.WatchSession.cancelAllTransfers();
}

function cancelAllUserInfoTransfers() {
	Ti.WatchSession.cancelAllUserInfoTransfers();
}

/**
 * Helper to create a sample payload with timestamp.
 */
function createSamplePayload() {
	return {
		foo: 'bar',
		time: (new Date()).toString()
	};
}
