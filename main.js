function setHand(hand, degrees) {
	document.getElementById(hand).setAttribute('transform', 'rotate(' + degrees + ' 50 50)')
}

function setHands(hours, minutes, seconds) {
	setHand('second', 6 * seconds)
	setHand('minute', 6 * minutes)
	setHand('hour', 30 * (hours % 12) + minutes / 2)
}

function setHandsFromDate(date) {
	setHands(date.getHours(), date.getMinutes(), date.getSeconds())
}

class Timer {
	constructor(seconds = 15, element = 'time') {
		this.seconds = seconds
		this.timer = document.getElementById(element)

		this.initialTime = new Date().getTime()
	}

	update() {
		let now = new Date().getTime()
		let newTime = this.seconds - ((now - this.initialTime) / 1000)
		if (newTime <= 0) {
			// Quit game
			this.timer.innerHTML = 0
		} else if (newTime <= 3) {
			// Set to red and update
			this.timer.innerHTML = newTime
			this.timer.style.color = 'red'
		} else {
			// Update timer
			this.timer.innerHTML = newTime
			this.timer.style.color = 'green'
		}
	}
}

function init() {

// setInterval(function() {setHandsFromDate(new Date())}, 1000)

// setHands(6, 10, 32)

	let timer = new Timer(10, 'time')

	setInterval(function() {
		timer.update()
	}, 200)
}

window.onload = init
