// === Constants ===
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

const cardValues = {
    'Ace': 11,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'Jack': 10,
    'Queen': 10,
    'King': 10
};

const cardCoinValues = {
    'Ace': 10,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'Jack': 20,
    'Queen': 30,
    'King': 40
};

// === Base Card Class ===
class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    getValue() {
        return cardValues[this.rank];
    }

    getCoinValue() {
        return cardCoinValues[this.rank];
    }

    getHTML() {
        return `
            <div class="card">
                <div class="rank">${this.rank}</div>
                <div class="suit">${this.suit}</div>
                <div class="coin-value">Coins: ${this.getCoinValue()}</div>
            </div>
        `;
    }

    isSpecial() {
        return false;
    }
}

// === Special Cards ===
class SpecialCard extends Card {
    constructor(rank, description, longDescription) {
        super('Special', rank);
        this.description = description;
        this.longDescription = longDescription;
    }

    getCoinValue() {
        return 0;
    }

    getHTML() {
        return `
            <div class="card special">
                <div class="rank">${this.rank}</div>
                <div class="suit">Special</div>
                <span class="tooltiptext">
                    ${this.description}
                    <br><br>
                    ${this.longDescription}
                </span>
            </div>
        `;
    }

    isSpecial() {
        return true;
    }
}

class HiddenCard extends SpecialCard {
    constructor() {
        super('?', 'Hidden Value', 'Acts as a normal valued card, but its value remains hidden until the end of the round.');
        this.hiddenValue = Math.floor(Math.random() * 10) + 1; // Assign a random value between 1 and 10
        this.revealed = false;
    }

    getValue() {
        return this.revealed ? this.hiddenValue : 0; // Return 0 until revealed
    }

    reveal() {
        this.revealed = true;
    }

    getHTML() {
        const displayRank = this.revealed ? this.hiddenValue : '?';
        return `
            <div class="card special">
                <div class="rank">${displayRank}</div>
                <div class="suit">Special</div>
                <span class="tooltiptext">
                    ${this.description}
                    <br><br>
                    ${this.longDescription}
                </span>
            </div>
        `;
    }
}

class AllUpCard extends SpecialCard {
    constructor() {
        super('All Up!', 'Value Boost', 'Increases the value of all cards played by the player so far this round by 2.');
    }

    getValue() {
        return 0; // This card doesn't have an inherent value.
    }
}

class StealCard extends SpecialCard {
    constructor() {
        super('Steal', 'Coin Steal', 'Steals coins from the dealer.');
    }

    getValue() {
        return 0;
    }
}

class WildCard extends SpecialCard {
    constructor() {
        super('Wild', 'Random Value', 'Adds a random value (1-10) to your total.');
        this.randomValue = Math.floor(Math.random() * 10) + 1;
    }

    getValue() {
        return this.randomValue;
    }
}

// === Deck ===
class Deck {
    constructor() {
        this.cards = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(suit, rank));
            }
        }
        this.specialCards = [
            new StealCard(), new WildCard(),
            new HiddenCard(), new AllUpCard()
        ];
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCard() {
        return this.cards.pop();
    }

    dealSpecialCard() {
        if (this.specialCards.length === 0) return null;
        return this.specialCards.pop();
    }
}

// === Hand ===
class Hand {
    constructor() {
        this.cards = [];
        this.allUpActive = false;
    }

    addCard(card) {
        this.cards.push(card);
        if (card instanceof AllUpCard) {
            this.allUpActive = true;
        }
    }

    getTotalValue() {
        let total = 0;
        let aces = 0;
        for (let card of this.cards) {
            let cardValue = card.getValue();
            if (this.allUpActive && !card.isSpecial()) {
                cardValue += 2;
            }
            total += cardValue;
            if (card.rank === 'Ace') aces++;
        }
        while (total > 21 && aces) {
            total -= 10;
            aces--;
        }
        return total;
    }

    getTotalCoinValue() {
        return this.cards.reduce((sum, card) => sum + card.getCoinValue(), 0);
    }

    getHTML() {
        return this.cards.map(card => card.getHTML()).join('');
    }

    clear() {
        this.cards = [];
        this.allUpActive = false;
    }

    revealHiddenCards() {
        this.cards.forEach(card => {
            if (card instanceof HiddenCard) {
                card.reveal();
            }
        });
    }
}

// === Player ===
class Player {
    constructor(name) {
        this.name = name;
        this.hand = new Hand();
        this.coinBalance = 0;
    }

    hit(deck) {
        const chance = Math.random();
        let card = chance < 0.3 ? deck.dealSpecialCard() : null;
        if (!card) card = deck.dealCard();
        this.hand.addCard(card);
    }

    getHandHTML() {
        return this.hand.getHTML();
    }

    getHandValue() {
        return this.hand.getTotalValue();
    }

    getHandCoinValue() {
        return this.hand.getTotalCoinValue();
    }

    updateCoinBalance(amount) {
        this.coinBalance += amount;
        document.getElementById('coin-balance').textContent = `Coin Balance: ${this.coinBalance}`;
    }
}

// === Dealer ===
class Dealer {
    constructor() {
        this.hand = new Hand();
    }

    hit(deck) {
        this.hand.addCard(deck.dealCard());
    }

    getHandHTML() {
        return this.hand.cards.map((card, index) => {
            if (index === 0) {
                return card.getHTML();
            } else {
                return `
                    <div class="card">
                        <div class="rank">?</div>
                        <div class="suit">?</div>
                        <div class="coin-value">Coins: ?</div>
                    </div>
                `;
            }
        }).join('');
    }

    getHandValue() {
        return this.hand.getTotalValue();
    }
}

// === Game ===
class Game {
    constructor() {
        this.deck = new Deck();
        this.deck.shuffle();
        this.player = new Player('Player');
        this.dealer = new Dealer();

        this.hitHandler = this.hitHandler.bind(this);
        this.standHandler = this.standHandler.bind(this);
        this.newGameHandler = this.newGameHandler.bind(this);

        this.setupEventListeners();
    }

    start() {
        document.getElementById('hit-button').disabled = false;
        document.getElementById('stand-button').disabled = false;
        document.getElementById('game-status-message').textContent = '';

        this.player.hand.clear();
        this.dealer.hand.clear();

        this.deck = new Deck();
        this.deck.shuffle();

        this.player.hit(this.deck);
        this.player.hit(this.deck);
        this.dealer.hit(this.deck);
        this.dealer.hit(this.deck);

        document.getElementById('player-hand-value').textContent = `Total: ${this.player.getHandValue()}`;
        document.getElementById('dealer-hand-value').textContent = `Total: ${this.dealer.hand.cards[0].getValue()}`;
        document.getElementById('player-cards').innerHTML = this.player.getHandHTML();
        document.getElementById('dealer-cards').innerHTML = this.dealer.getHandHTML();

        this.player.updateCoinBalance(100);
    }

    setupEventListeners() {
        const hitButton = document.getElementById('hit-button');
        const standButton = document.getElementById('stand-button');
        const newGameButton = document.getElementById('new-game-button');

        hitButton.removeEventListener('click', this.hitHandler);
        standButton.removeEventListener('click', this.standHandler);
        newGameButton.removeEventListener('click', this.newGameHandler);

        hitButton.addEventListener('click', this.hitHandler);
        standButton.addEventListener('click', this.standHandler);
        newGameButton.addEventListener('click', this.newGameHandler);
    }

    hitHandler() {
        this.player.hit(this.deck);
        document.getElementById('player-hand-value').textContent = `Total: ${this.player.getHandValue()}`;
        document.getElementById('player-cards').innerHTML = this.player.getHandHTML();
        if (this.player.getHandValue() > 21) {
            document.getElementById('game-status-message').textContent = 'Player busts! Dealer wins!';
            document.getElementById('hit-button').disabled = true;
            document.getElementById('stand-button').disabled = true;
        }
    }

    standHandler() {
        while (this.dealer.getHandValue() < 17) {
            this.dealer.hit(this.deck);
        }

        // Reveal hidden cards before determining the winner
        this.player.hand.revealHiddenCards();
        document.getElementById('player-cards').innerHTML = this.player.getHandHTML();
        document.getElementById('player-hand-value').textContent = `Total: ${this.player.getHandValue()}`;

        document.getElementById('dealer-hand-value').textContent = `Total: ${this.dealer.getHandValue()}`;
        document.getElementById('dealer-cards').innerHTML = this.dealer.hand.getHTML();
        const playerTotal = this.player.getHandValue();
        const dealerTotal = this.dealer.getHandValue();

        if (dealerTotal > 21) {
            document.getElementById('game-status-message').textContent = 'Dealer busts! Player wins!';
            this.player.updateCoinBalance(this.player.getHandCoinValue());
        } else if (dealerTotal < playerTotal) {
            document.getElementById('game-status-message').textContent = 'Player wins!';
            this.player.updateCoinBalance(this.player.getHandCoinValue());
        } else if (dealerTotal > playerTotal) {
            document.getElementById('game-status-message').textContent = 'Dealer wins!';
            this.player.updateCoinBalance(-this.player.getHandCoinValue());
        } else {
            document.getElementById('game-status-message').textContent = 'Push!';
        }

        document.getElementById('hit-button').disabled = true;
        document.getElementById('stand-button').disabled = true;
    }

    newGameHandler() {
        this.start();
    }
}

// Start the game
const game = new Game();
game.start();
