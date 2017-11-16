/* global firebase */
/* global $ */
var db = firebase.database();

var name = "";
var player = "";
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
	$(target).html('<p class="choice" data-choice="rock">ROCK</p>' + '<p class="choice" data-choice="paper">PAPER</p>' + '<p class="choice" data-choice="scissors">SCISSORS</p>')
	db.ref().update({
		turn: turn
	})
}

db.ref("players").on("value", function(snapshot) {
	if ((snapshot.hasChild("players/1")) && (turn === 0)) {
		var playerOne = snapshot.child("players/1/name").val()
		$("#player1name").text(playerOne)

		var wins = snapshot.child("players/1/wins").val()
		var losses = snapshot.child("players/1/losses").val()
		$("#player1score").text("Wins: " + wins + " Losses: " + losses)
	}
	if ((snapshot.hasChild("players/2")) && (turn === 0)) {
		var playerTwo = snapshot.child("players/2/name").val()
		$("#player2name").text(playerTwo)

		var wins = snapshot.child("players/2/wins").val()
		var losses = snapshot.child("players/2/losses").val()
		$("#player2score").text("Wins: " + wins + " Losses: " + losses)
	}
	if (((snapshot.hasChild("players/2")) && (snapshot.hasChild("players/1"))) && (turn === 0)) {
		gameStart();
		turn = 1
	}
})

$(document).on("click", ".choice", function() {
	playerChoice = ($(this).data("choice"))
	console.log($(this))
	console.log(playerChoice)
	var target = "players/" + player
	console.log(target)
	db.ref(target).update({
		choice: playerChoice
	})
	turn++;
	db.ref().update({
		turn: turn
	})
});
