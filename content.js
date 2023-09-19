var x = document.cookie;
var f = x.indexOf("^Token*");
var e = x.indexOf("^UserName");
var token = x.substr(f + 7, e - f - 7);
document.addEventListener("keydown", addEv, false);
async function addEv(e) {
	if (e.keyCode == 32) getAns(); //Space
	//Z
}

let itemList = [];

// Auto next page if i fill all the answer
async function getAns() {
	chrome.runtime.sendMessage(
		{
			type: "ansUrl",
			request: "none",
		},
		async function(data) {
			console.clear();
			console.log(data);

			let res = await fetch(data, {
				headers: {
					Authorization: "Bearer " + token,
				},
			});
			await res.json().then(async function(dat) {
				let qs = dat["i"]["q"];
				var sw = "";
				for (var i = 0; i < qs.length; i++) {
					let ch = qs[i]["al"];
					for (var j = 0; j < ch.length; j++) {
						aAns = ch[j]["a"];
						for (var k = 0; k < aAns.length; k++) {
							let op = aAns[k];

							if (!op["c"] || op["c"] == "1") {
								console.log(j + 1 + " " + op["txt"]);
								sw += op["txt"] + "<br>";
							}
						}
					}
				}
				ansShow.innerHTML = sw;
			});
		},
	);
}

document.body.addEventListener("click", getAns);

function nextPage(e) {
	if (typeof e === "object") {
		if (e.button == 4) {
			document.getElementById("learning__nextItem").click();
		}
	}
}
var sumElement = document.createElement("div");
document.body.appendChild(sumElement);
sumElement.classList = "carry";

var btn0 = document.createElement("button");
btn0.innerHTML = "";
btn0.classList = "buttonX";
sumElement.appendChild(btn0);
btn0.onclick = function() {
	getAns();
};

var ansShow = document.createElement("div");
sumElement.appendChild(ansShow);
ansShow.classList = "ansShow";
