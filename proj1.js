// Redirect to game page
function play() {
	let name = document.getElementById('name').value
	if (name) {
		window.location.replace('data/game.html?name=' + name)
	}
}

// Redirect to scores page
function scores() {
	let password = document.getElementById('password').value
	if (password === 'ClockGame123') {
		window.location.replace('data/scores.html')
	}
}
