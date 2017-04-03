// Used to update the clock state and hands
class Clock {
	setHand(hand, degrees) {
		document.getElementById(hand).setAttribute('transform', 'rotate(' + degrees + ' 50 50)')
	}

	setHands(hours, minutes, seconds) {
		setHand('second', 6 * seconds)
		setHand('minute', 6 * minutes)
		setHand('hour', 30 * (hours % 12) + minutes / 2)
	}

	setHandsFromDate(date) {
		setHands(date.getHours(), date.getMinutes(), date.getSeconds())
	}
}

// Used to update the timer display
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
			newTime = 0
		} else if (newTime <= 3) {
			// Set to red
			this.timer.style.color = 'red'
		} else {
			// Set to green
			this.timer.style.color = 'green'
		}
		// Update timer
		this.timer.innerHTML = newTime.toFixed(1)
	}
}

// Used to update the buttons displaying the answers
class Answers {

}

// Main class to handle playing the game
class Game {
	constructor() {
		this.timer = new Timer(10, 'time')
		this.clock = new Clock()
		this.answers = new Answers()
	}

	start(name) {
		this.name = name

		setInterval(() => {
			this.timer.update()
		}, 100)
	}

	answer(id) {

	}

	end() {

	}
}

var game = undefined

function init() {
	game = new Game()
	game.start("Anonymous")
}

window.onload = init
