function showScores() {
	let table = document.getElementById('scores')

	// Deserialize scores from html5 local storage
	let scores = JSON.parse(localStorage.getItem('highScores')) || {}

	// Build table from names and scores
	for (let name in scores) {
		let score = scores[name]
		let row = table.insertRow(-1)
		let nameCell = row.insertCell(0)
		let scoreCell = row.insertCell(1)
		nameCell.innerHTML = name
		scoreCell.innerHTML = score
	}
}

window.onload = showScores
