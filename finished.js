let items = decodeURIComponent(location.search).substr(1).split(',')
if (items.length >= 2) {
	document.getElementById('name').innerHTML = items[0]
	document.getElementById('score').innerHTML = items[1]
}

function tryAgain() {
	if (items.length >= 2) {
		window.location.replace('game.html?name=' + items[0])
	}
}
