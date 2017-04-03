const numAnswers = 4

// Inclusive random number generator
function randomInt(start, end) {
	return Math.floor((Math.random() * (1 + end - start)) + start)
}

// Returns a number with a fixed number of digits
function randomPadded(start, end, padding = 0) {
	// Create padded string
	let randomStr = ("0".repeat(padding)) + randomInt(start, end)

	// Truncate to only include correct number of characters
	return randomStr.substr(-padding, padding)
}

// Used to update the clock state and hands
class Clock {
	setHand(hand, degrees) {
		document.getElementById(hand).setAttribute('transform', 'rotate(' + degrees + ' 50 50)')
	}

	setHands(hours, minutes, seconds) {
		this.setHand('second', 6 * seconds)
		this.setHand('minute', 6 * minutes)
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
	// Returns: {id: 1, answer: "6:45:27"}
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
		// Deserialize html5 local storage, save score, and serialize back
		let scores = JSON.parse(localStorage.getItem("highScores")) || {}
		scores[name] = this.score
		localStorage.setItem("highScores", JSON.stringify(scores))
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
		setInterval(() => {
			this.timer.update()
		}, 100)
		this.next()
	}

	next() {
		let correct = this.answers.generate()
		this.clock.setHands(...correct.answer.split(':'))
		this.timer.reset(10)
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
		window.location.replace("index.html")
	}
}

var game = undefined

function init() {
	game = new Game()
	game.start("Anonymous")
}

window.onload = init
