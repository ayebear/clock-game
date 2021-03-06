const numAnswers = 4

// Inclusive random number generator
function randomInt(start, end) {
	return Math.floor((Math.random() * (1 + end - start)) + start)
}

// Returns a number with a fixed number of digits
function randomPadded(start, end, padding = 0) {
	// Create padded string
	let randomStr = ('0'.repeat(padding)) + randomInt(start, end)

	// Truncate to only include correct number of characters
	return randomStr.substr(-padding, padding)
}

// Used to update the clock state and hands
class Clock {
	// Rotate SVG hand a certain number of degrees
	setHand(hand, degrees) {
		document.getElementById(hand).setAttribute('transform', 'rotate(' + degrees + ' 50 50)')
	}

	// Rotate hands based on time
	setHands(hours, minutes, seconds) {
		// Source: http://thenewcode.com/943/An-SVG-Analog-Clock-In-6-Lines-of-JavaScript
		// 360 / 60 = 6
		this.setHand('second', 6 * seconds)
		// 360 / 60 = 6
		this.setHand('minute', 6 * minutes)
		// 360 / 12 = 30, 60 / 30 = 2
		this.setHand('hour', 30 * (hours % 12) + minutes / 2)
	}

	setHandsFromDate(date) {
		this.setHands(date.getHours(), date.getMinutes(), date.getSeconds())
	}
}

// Used to update the timer display
class Timer {
	constructor(element = 'time') {
		this.timer = document.getElementById(element)

		this.reset()
	}

	reset(seconds = 15) {
		this.seconds = seconds
		this.initialTime = new Date().getTime()
	}

	// Updates timer and returns remaining time
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

		return newTime
	}
}

// Used to update the buttons displaying the answers
class Answers {
	constructor() {
		this.correctId = 0

		this.buttons = []
		for (let i = 0; i < numAnswers; ++i) {
			this.buttons.push(document.getElementById('button' + i))
		}
	}

	// Generates a random time
	generateAnswer() {
		return [randomInt(1, 12), randomPadded(0, 59, 2), randomPadded(0, 59, 2)].join(':')
	}

	// Generates random answers, returns the correct one
	// Returns: {id: 1, answer: '6:45:27'}
	generate() {
		this.correctId = randomInt(0, numAnswers - 1)
		this.answers = []
		for (let i = 0; i < numAnswers; ++i) {
			let answer = this.generateAnswer()
			this.answers.push(answer)
			this.buttons[i].innerHTML = answer
		}
		return {id: this.correctId, answer: this.answers[this.correctId]}
	}

	// Returns true if the answer is correct
	isCorrect(id) {
		return id === this.correctId
	}
}

// Keeps track of the score and updates the score on the page
class Score {
	constructor(element) {
		this.scoreElement = document.getElementById(element)
		this.score = 0
		this.display()
	}

	add() {
		this.score++
		this.display()
	}

	display() {
		this.scoreElement.innerHTML = this.score
	}

	save(name) {
		// Deserialize html5 local storage
		let scores = JSON.parse(localStorage.getItem('highScores')) || {}

		// Save score if this was better than the last
		if (!(name in scores) || this.score > scores[name]) {
			scores[name] = this.score
		}

		// Save back to html5 local storage
		localStorage.setItem('highScores', JSON.stringify(scores))
	}

	current() {
		return this.score
	}
}

// Main class to handle playing the game
class Game {
	constructor() {
		this.timer = new Timer('time')
		this.clock = new Clock()
		this.answers = new Answers()
		this.score = new Score('score')
	}

	start(name) {
		this.name = name
		document.getElementById('playerName').innerHTML = name

		// Update timer every 100ms
		// When time runs out, end the game
		setInterval(() => {
			let remaining = this.timer.update()
			if (remaining <= 0) {
				this.end()
			}
		}, 100)

		this.next()
	}

	// Generate a new clock
	next() {
		// Generate random answers
		let correct = this.answers.generate()

		// Set clock to correct answer
		this.clock.setHands(...correct.answer.split(':'))

		// Decrease and reset timer
		let newTime = Math.max(5, 20 - this.score.current())
		this.timer.reset(newTime)
	}

	answer(id) {
		if (this.answers.isCorrect(id)) {
			// Correct, update score and move on
			this.score.add()
			this.next()
		} else {
			// Incorrect, end game
			this.end()
		}
	}

	end() {
		// Save score
		this.score.save(this.name)

		// Go back to home
		window.location.replace('finished.html?' + this.name + "," + this.score.current())
	}
}

var game = undefined

function init() {
	// Get player's name from URL parameters
	let items = decodeURIComponent(location.search).substr(1).split('=')
	if (items.length >= 2) {
		let name = items[1]

		// Start game
		game = new Game()
		game.start(name)
	}

}

window.onload = init
