function play() {
	let name = document.getElementById('name').value
	if (name) {
		window.location.replace('game.html?name=' + name)
	}
}

function scores() {
	let password = document.getElementById('password').value
	if (password === 'ClockGame123') {
		window.location.replace('scores.html')
	}
}
