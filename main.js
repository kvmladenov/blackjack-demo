/**
 * BlackJack Demo
 * Main logic of the game
 */

class BlackJack {
	constructor() {
		this.deckData;

		// API - https://deckofcardsapi.com/
		// Get information about the deck:
		fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
			.then((response) => {
				return response.json();
			})
			.then((deck) => {
				this.deckData = deck;
				this.init();
			});
	}

	init() {
		// Start Game - Intro
		this.gameIntro();

		// Just in case we disable the button:
		$('.hit-btn').prop('disabled', true);

		// Add event listener on button
		$('body').on('click', '.hit-btn', () => {
			this.drawNewTwoCards();
		});
	}

	gameIntro() {
		let firstCardDeal = [
			$('.dealers-cards .place-1'),
			$('.dealers-cards .place-2'),
			$('.dealers-cards .place-3'),
			$('.players-cards .place-a'),
			$('.players-cards .place-b')
		];

		// Iteration step:
		this.introStep = 0;

		// Draw 5 cards:
		fetch(`https://deckofcardsapi.com/api/deck/${this.deckData.deck_id}/draw/?count=5`)
			.then((response) => {
				return response.json();
			})
			.then((myJson) => {
				this.cardsHolder = myJson;

				// Loop for every card:
				this.intervalOfSteps = setInterval(() => {
					this.iterateSteps(firstCardDeal, 'introStep')
				}, 1100);
			});
	}

	iterateSteps(elementsArray, typeStep) {
		// Note: i know what i do with 'typeStep' is like a hack and
		// it shouldn't be like that, but i don't think of another option.
		// the basic idea is that function can be reused.

		if (this[typeStep] == elementsArray.length-1) {
			clearInterval(this.intervalOfSteps);

			// Enable button when animation is completed:
			setTimeout(() => {
				$('.hit-btn').prop('disabled', false);
			}, 1000);
	}

		// Get the place from array where we should put card:
		let $place = elementsArray[this[typeStep]];

		// 1. Copy deck card:
		let $copyCard = $('.deck .card').clone().appendTo('.deck');

		// 2. Fill card data in both places:
		$copyCard.find('.card__face--front').css('background-image', `url("${this.cardsHolder.cards[this[typeStep]].image}"`);
		$place.find('.card__face--front').css('background-image', `url("${this.cardsHolder.cards[this[typeStep]].image}"`);

		// 3. Move and resize the clone card:
		let params = {
			width: $place.css('width'),
			height: $place.css('height'),
			left: $place.css('left'),
			top: $place.css('top'),
		}
		$copyCard.css(params);

		// 4. Make it to flip:
		$copyCard.addClass('is-flipped');

		// 5. When the animation is over we remove the cloned object and manipulate the real one:
		setTimeout(() => {
			$place.addClass('is-flipped');
			$place.show();
			$copyCard.remove();
		}, 1000);

		this[typeStep]++;
	}

	drawNewTwoCards() {
		$('.hit-btn').prop('disabled', true);
		$('.players-cards .card').hide()

		let firstCardDeal = [
			$('.players-cards .place-a'),
			$('.players-cards .place-b')
		];

		// Iteration step:
		this.playerCards = 0;

		// Draw 5 cards:
		fetch(`https://deckofcardsapi.com/api/deck/${this.deckData.deck_id}/draw/?count=2`)
			.then((response) => {
				return response.json();
			})
			.then((deckData) => {
				this.cardsHolder = deckData;

				if(deckData.remaining == 3)
					alert('Last chance! :(');
				else if (deckData.remaining <= 1) {
					this.buildEndScreen();
					return;
				}

				// Loop for every card:
				this.intervalOfSteps = setInterval(() => {
					this.iterateSteps(firstCardDeal, 'playerCards')
				}, 1100);
			});
	}

	buildEndScreen() {
		let html = `<div id="welcome">
						<h2>Game Over! :)</h2>
					</div>`;

		$('body').append(html);
	}
}

// Onload prepare the page:
$(function() {
	$('.start-game').on('click', function() {
		$('#welcome').remove();
		let initBlackJackGame = new BlackJack;
	});
})
