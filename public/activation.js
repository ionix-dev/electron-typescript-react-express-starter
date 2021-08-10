const { ipcRenderer } = window.require("electron");
const diskSerial = ipcRenderer.sendSync("get-disk-serial");
document.getElementById("disk-serial").innerHTML = diskSerial;
const activateButton = document.getElementById("activate-button");
const quitButton = document.getElementById("quit-button");

activateButton.addEventListener("click", () => {
	const activationKey = document.getElementById("activation-key").value;
	if (activationKey) {
		const response = ipcRenderer.sendSync(
			"post-activation-key",
			activationKey
		);
		document.getElementById("activation-result").style.display = "block";
		if (response) {
			document.getElementById("activation-result").style.color = "green";
			document.getElementById("activation-result").innerHTML =
				"ACTIVÉ AVEC SUCCÈS.";
		} else {
			document.getElementById("activation-result").style.color = "red";
			document.getElementById("activation-result").innerHTML =
				"CLÉ INVALIDE.";
		}
	}
});
quitButton.addEventListener("click", () => {
	ipcRenderer.send("quit");
});
