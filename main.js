const numAnswers = 4

// Inclusive random number generator
function randomInt(start, end) {
	return Math.floor((Math.random() * (1 + end - start)) + start)
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
	constructor() {
		this.correctId = 0

		this.buttons = []
		for (let i = 0; i < numAnswers; ++i) {
			this.buttons.push(document.getElementById('button' + i))
		}
	}

	// Generates a random time
	generateAnswer() {
		let result = {}
		result.answer = [randomInt(1, 12), randomInt(1, 60), randomInt(1, 60)]
		result.text = result.answer.join(':')
		return result
	}

	// Generates random answers, returns the correct one
	/*
	Returns: {id: 1, answer: {
		answer: [6, 45, 27],
		text: "6:45:27"
	}}*/
	generate() {
		this.correctId = randomInt(0, numAnswers - 1)
		this.answers = []
		for (let i = 0; i < numAnswers; ++i) {
			let answer = this.generateAnswer()
			this.answers.push(answer)
			this.buttons[i].innerHTML = answer.text
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
}

// Main class to handle playing the game
class Game {
	constructor() {
		this.timer = new Timer(10, 'time')
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
		this.clock.setHands(...correct.answer.answer)
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

	}
}

var game = undefined

function init() {
	game = new Game()
	game.start("Anonymous")
}

window.onload = init
