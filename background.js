let aRequest = "";
let courseId = "";
let req = "";
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		if (details.url.includes("api/practiceManager/GetItem")) {
			var rUrl = details.url;
			var tmp = rUrl.indexOf("?_=");
			rUrl =
				rUrl.substring(0, tmp - 2) + "5" + rUrl.substring(tmp - 1, rUrl.length);
			aRequest = rUrl;
		}
		if (
			details.url.includes(
				"edservices.engdis.com/api/CourseTree/GetUserNodeProgress",
			)
		) {
			courseId = details.url.substring(
				details.url.lastIndexOf("/") + 1,
				details.url.length,
			);
			console.log(courseId);
			var tmp = decodeURIComponent(
				String.fromCharCode.apply(
					null,
					new Uint8Array(details.requestBody.raw[0].bytes),
				),
			);
			req = tmp;
		}
	},
	{ urls: ["<all_urls>"] },
	["blocking", "requestBody"],
);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message && message.type == "ansUrl") {
		sendResponse(aRequest);
	}
	if (message && message.type == "done") {
		rep = [courseId, req];
		sendResponse(rep);
	}
});
