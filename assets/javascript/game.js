/* global firebase */
/* global $ */
var db = firebase.database();

var name = "";
var player = "";
var notPlayer = "";
var wins = 0;
var losses = 0;
var player1 = false
var player2 = false
var playerChoice = ""
var turn = 0
$("#hello").hide();

//debug
db.ref().on("value", function(snapshot) {
	console.log(snapshot.val())
	if (!snapshot.hasChild("players/1")) {
		console.log("yes")
		player1 = true
		console.log(player1)
	}
	else {
		console.log("no")
	}
});
console.log("----------------------")

//game setup
$("#add-player").on("click", function(event) {
	event.preventDefault();
	db.ref().once("value", function(snapshot) {
		if ((snapshot.hasChild("players/1")) && (snapshot.hasChild("players/2"))) {
			alert("Too many players!")
		}
		else if (!snapshot.hasChild("players/1")) {
			name = $("#name-input").val().trim();
			wins = 0;
			losses = 0;
			player = 1;
			notPlayer = 2;
			player1 = true;
			db.ref("players/1").set({
				name: name,
				wins: wins,
				losses: losses
			})
			$("#name-input, #add-player").hide();
			$("#hello").text("Hello " + name + "! You are player " + player)
			$("#hello").show();
			$("#player1name").text(name)
		}
		else {
			name = $("#name-input").val().trim();
			wins = 0;
			losses = 0;
			player = 2;
			notPlayer = 1;
			player2 = true;
			db.ref("players/2").set({
				name: name,
				wins: wins,
				losses: losses
			})
			$("#name-input, #add-player").hide();
			$("#hello").text("Hello " + name + "! You are player " + player)
			$("#hello").show();
			$("#player2name")
		}
	})
});

function gameStart() {
	var target = ".player" + player + "choices"
	console.log(target)
	console.log("*********")
	$(target).html('<p class="choice" data-choice="ROCK">ROCK</p>' + '<p class="choice" data-choice="PAPER">PAPER</p>' + '<p class="choice" data-choice="SCISSORS">SCISSORS</p>')
	db.ref().update({
		turn: turn
	})
	// stateCheck()
}

function battle() {
	// stateCheck()
	db.ref().once("value", function(snapshot) {
		// var dataTarget = "players/" + notPlayer + "/choice"
		var currentUser = "players/" + player
		var otherUser = "players/" + notPlayer
		var dataTargetVal = snapshot.child(otherUser + "/choice").val()
		console.log("other player final choice is " + dataTargetVal)
		var otherUserName = snapshot.child(otherUser + "/name").val()
		var currentUserName = snapshot.child(currentUser + "/name").val()
		var otherUserWins = snapshot.child(otherUser + "/wins").val()
		var currentUserWins = snapshot.child(currentUser + "/wins").val()
		var otherUserLosses = snapshot.child(otherUser + "/losses").val()
		var currentUserLosses = snapshot.child(currentUser + "/losses").val()

		if ((dataTargetVal === "ROCK") && (playerChoice === "PAPER")) {
			wins++;
			$("#winner").text(currentUserName + " WINS!!")
		}
		if ((dataTargetVal === "ROCK") && (playerChoice === "SCISSORS")) {
			losses++
			$("#winner").text(otherUserName + " WINS!!")
		}
		if ((dataTargetVal === "PAPER") && (playerChoice === "ROCK")) {
			losses++
			$("#winner").text(otherUserName + " WINS!!")
		}
		if ((dataTargetVal === "PAPER") && (playerChoice === "SCISSORS")) {
			wins++
			$("#winner").text(currentUserName + " WINS!!")
		}
		if ((dataTargetVal === "SCISSORS") && (playerChoice === "ROCK")) {
			wins++
			$("#winner").text(currentUserName + " WINS!!")
		}
		if ((dataTargetVal === "SCISSORS") && (playerChoice === "PAPER")) {
			losses++
			$("#winner").text(otherUserName + " WINS!!")
		}
		if (dataTargetVal === playerChoice) {
			$("#winner").text("TIE!!")
		}
		db.ref(currentUser).update({
			wins: wins,
			losses: losses
		})
	})
}

// function stateCheck() {
// 	db.ref().once("value", function(snapshot) {
// 		var tmpTurn = snapshot.child("turn").val()
// 		turn = tmpTurn;
// 	})
// 	if (turn === 1) {
// 		$("#player1").css("border", "solid yellow")
// 		$(".player2choices").data("clickable", "off")
// 	}
// 	if (turn === 2) {
// 		$("#player1").css("border", "solid black")
// 		$("#player2").css("border", "solid yellow")
// 		$(".player2choices").data("clickable", "on")
// 		$(".player1choices").data("clickable", "off")
// 	}
// 	if (turn === 3) {
// 		$(".player2choices").data("clickable", "off")
// 		$(".player1choices").data("clickable", "off")
// 		db.ref().once("value", function(snapshot) {
// 			var dataTarget = "players/" + notPlayer + "/choice"
// 			var dataVal = snapshot.child(dataTarget).val()
// 			console.log("other player chose" + dataVal)
// 			var displayTarget = "#player" + notPlayer + "choice"
// 			console.log("display target is " + displayTarget)
// 			$(displayTarget).text(dataVal)
// 		})
// 		turn = 4
// 		battle()
// 	}
// 	else {
// 		return
// 	}
// }

db.ref().on("value", function(snapshot) {
	if ((snapshot.hasChild("players/1")) && (turn === 0)) {
		var playerOne = snapshot.child("players/1/name").val()
		$("#player1name").text(playerOne)

		var wins = snapshot.child("players/1/wins").val()
		var losses = snapshot.child("players/1/losses").val()
		$("#player1score").text("Wins: " + wins + " Losses: " + losses)
	}
	if (((snapshot.hasChild("players/2")) && (snapshot.hasChild("players/1"))) && (turn === 0)) {
		var playerTwo = snapshot.child("players/2/name").val()
		$("#player2name").text(playerTwo)

		var wins = snapshot.child("players/2/wins").val()
		var losses = snapshot.child("players/2/losses").val()
		$("#player2score").text("Wins: " + wins + " Losses: " + losses)
		turn = 1
		gameStart();
	}
	db.ref().once("value", function(snapshot) {
		var tmpTurn = snapshot.child("turn").val()

		if (tmpTurn === 1) {
			$("#player1").css("border", "solid yellow")
			$(".player2choices").data("clickable", "off")
		}
		if (tmpTurn === 2) {
			$("#player1").css("border", "solid black")
			$("#player2").css("border", "solid yellow")
			$(".player2choices").data("clickable", "on")
			$(".player1choices").data("clickable", "off")
		}
		if (tmpTurn === 3) {
			$(".player2choices").data("clickable", "off")
			$(".player1choices").data("clickable", "off")
			db.ref().once("value", function(snapshot) {
				var dataTarget = "players/" + notPlayer + "/choice"
				var dataVal = snapshot.child(dataTarget).val()
				console.log("other player chose" + dataVal)
				var displayTarget = "#player" + notPlayer + "choice"
				console.log("display target is " + displayTarget)
				$(displayTarget).text(dataVal)
			})
			tmpTurn = 4
			db.ref().update({
				turn: tmpTurn
			})
			battle()
		}
		else {
			return
		}
	})
	// if ((turn === 1) || (turn === 2)) {
	// 	stateCheck()
	// 	console.log("non 0 state check")
	// }

})

$(document).on("click", ".choice", function() {
	var target = ".player" + player + "choices"
	if ($(target).data("clickable") === "off") {
		console.log("data-clickable is off")
		return
	}
	else {
		playerChoice = ($(this).data("choice"))
		console.log($(this))
		console.log(playerChoice)
		var dataTarget = "players/" + player
		console.log(dataTarget)
		db.ref(dataTarget).update({
			choice: playerChoice
		})
		var displayTarget = "#player" + player + "choice"
		// Hide choices
		$(target).hide()
		// Display choice
		$(displayTarget).text(playerChoice)
		db.ref().once("value", function(snapshot) {
			var tmpTurn = snapshot.child("turn").val()
			turn = tmpTurn;
			turn++;
			db.ref().update({
				turn: turn
			})
		})
	}
	// stateCheck()


});
// console.log(target)
// console.log("***___***")
// console.log($(target).data("clickable"))
