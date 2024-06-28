from flask import Flask, request, jsonify
from flask_cors import CORS
from treys import Card, Evaluator
from eth_account.messages import encode_defunct
from web3 import Web3
import random

app = Flask(__name__)
CORS(app)

numbers = [
    {"number": 0, "color": "green"},
    {"number": 32, "color": "red"}, {"number": 15, "color": "black"}, {"number": 4, "color": "red"},
    {"number": 21, "color": "red"}, {"number": 2, "color": "black"}, {"number": 25, "color": "black"},
    {"number": 17, "color": "black"}, {"number": 34, "color": "red"}, {"number": 6, "color": "black"},
    {"number": 27, "color": "red"}, {"number": 13, "color": "black"}, {"number": 36, "color": "red"},
    {"number": 11, "color": "black"}, {"number": 30, "color": "red"}, {"number": 8, "color": "black"},
    {"number": 23, "color": "red"}, {"number": 10, "color": "black"}, {"number": 5, "color": "red"},
    {"number": 24, "color": "black"}, {"number": 16, "color": "red"}, {"number": 33, "color": "black"},
    {"number": 1, "color": "red"}, {"number": 20, "color": "black"}, {"number": 14, "color": "red"},
    {"number": 31, "color": "black"}, {"number": 9, "color": "red"}, {"number": 22, "color": "black"},
    {"number": 18, "color": "red"}, {"number": 29, "color": "black"}, {"number": 7, "color": "red"},
    {"number": 28, "color": "black"}, {"number": 12, "color": "red"}, {"number": 35, "color": "black"},
    {"number": 3, "color": "red"}, {"number": 26, "color": "black"}, {"number": 19, "color": "red"}
]

@app.route('/api/authenticate', methods=['POST'])
def authenticate():
    data = request.json
    address = data.get('address')
    signature = data.get('signature')
    message = data.get('message')

    # Use web3 to recover the address from the signature
    web3 = Web3()
    message_encoded = encode_defunct(text=message)
    recovered_address = web3.eth.account.recover_message(message_encoded, signature=signature)

    if recovered_address.lower() == address.lower():
        # Authentication successful
        # You can generate a session token or store the address in your database here
        return jsonify({"status": "success", "address": address})
    else:
        return jsonify({"status": "error", "message": "Authentication failed"}), 401
    
@app.route('/spin', methods=['POST'])
def spin():
    data = request.json
    bets = data['bets']
    balance = data['balance']

    winning_number = random.choice(numbers)
    new_balance = balance
    win_amount = 0

    for bet, amount in bets.items():
        if bet == 'even' and winning_number['number'] % 2 == 0:
            new_balance += amount * 2
            win_amount += amount
        elif bet == 'odd' and winning_number['number'] % 2 != 0:
            new_balance += amount * 2
            win_amount += amount
        elif bet == 'red' and winning_number['color'] == 'red':
            new_balance += amount * 2
            win_amount += amount
        elif bet == 'black' and winning_number['color'] == 'black':
            new_balance += amount * 2
            win_amount += amount
        elif bet == str(winning_number['number']):
            new_balance += amount * 36
            win_amount += amount * 35

    return jsonify({
        'winningNumber': winning_number['number'],
        'winningColor': winning_number['color'],
        'newBalance': new_balance,
        'winAmount': win_amount
    })

@app.route('/slot', methods=['POST'])
def slot():
    emojis = ['🍉', '🍊', '🍇', '🍎', '🥝', '🍓', '🥭', '🍑', '🍒', '🍈']
    win_percentage = 0.05  # 5% chance of winning
    data = request.json
    balance = data['balance']

    if balance < 1:
        return jsonify({'error': 'Insufficient balance'}), 400

    balance -= 1
    has_won = random.random() < win_percentage

    if has_won:
        winning_emoji = random.choice(emojis)
        slot1 = slot2 = slot3 = winning_emoji
        balance += 1000
    else:
        slot1 = random.choice(emojis)
        slot2 = random.choice(emojis)
        while True:
            slot3 = random.choice(emojis)
            if slot3 != slot1 and slot3 != slot2:
                break

    top_slots = [random.choice(emojis) for _ in range(3)]
    bottom_slots = [random.choice(emojis) for _ in range(3)]

    return jsonify({
        'slot1': slot1,
        'slot2': slot2,
        'slot3': slot3,
        'topSlot1': top_slots[0],
        'topSlot2': top_slots[1],
        'topSlot3': top_slots[2],
        'bottomSlot1': bottom_slots[0],
        'bottomSlot2': bottom_slots[1],
        'bottomSlot3': bottom_slots[2],
        'newBalance': balance,
        'hasWon': has_won
    })

@app.route('/minesweeper/start', methods=['POST'])
def start_minesweeper():
    data = request.json
    balance = data['balance']

    if balance < 5:
        return jsonify({'error': 'Insufficient balance'}), 400

    balance -= 5
    grid = [{'clicked': False, 'value': ''} for _ in range(9)]
    
    # Place bombs
    bomb_indexes = random.sample(range(9), 2)
    for index in bomb_indexes:
        grid[index]['value'] = 'bomb'

    # Place money
    money_indexes = random.sample([i for i in range(9) if i not in bomb_indexes], 5)
    for index in money_indexes:
        grid[index]['value'] = 'money'

    return jsonify({
        'grid': grid,
        'newBalance': balance,
        'clicks': 3
    })

@app.route('/minesweeper/click', methods=['POST'])
def click_minesweeper():
    data = request.json
    balance = data['balance']
    grid = data['grid']
    clicks = data['clicks']
    index = data['index']

    if grid[index]['clicked']:
        return jsonify({'error': 'Cell already clicked'}), 400

    grid[index]['clicked'] = True
    clicks -= 1

    if grid[index]['value'] == 'money':
        balance += 10
    elif grid[index]['value'] == 'bomb':
        balance -= 20
        clicks = 0  # Game over

    game_over = clicks == 0

    return jsonify({
        'grid': grid,
        'newBalance': balance,
        'clicks': clicks,
        'gameOver': game_over
    })


# Global variables to store game state
game_state = None
evaluator = Evaluator()

def create_deck():
    suits = 'hdcs'  # Hearts, Diamonds, Clubs, Spades
    ranks = '23456789TJQKA'
    deck = [Card.new(f"{rank}{suit}") for rank in ranks for suit in suits]
    return deck

def card_to_string(card):
    return Card.int_to_str(card)

def initialize_game_state():
    global game_state
    deck = create_deck()
    random.shuffle(deck)
    game_state = {
        'deck': deck,
        'dealer_cards': deck[:2],
        'player_cards': deck[2:4],
        'board_cards': deck[4:9],
        'show_dealer_cards': False,
        'flop_shown': False,
        'turn_shown': False,
        'result': '',
        'current_pot': 40,
        'balance': 1000,
        'can_bet_60': True,
        'can_bet_40': False,
        'can_bet_20': False
    }

@app.route('/api/game_state')
def get_game_state():
    global game_state
    if game_state is None:
        initialize_game_state()
    return jsonify({
        'player_cards': [card_to_string(card) for card in game_state['player_cards']],
        'board_cards': ['hidden' if not game_state['flop_shown'] else card_to_string(card) for card in game_state['board_cards'][:3]] + 
                       ['hidden' if not game_state['turn_shown'] else card_to_string(game_state['board_cards'][3])] + 
                       ['hidden'],
        'current_pot': game_state['current_pot'],
        'balance': game_state['balance'],
        'can_bet_60': game_state['can_bet_60'],
        'can_bet_40': game_state['can_bet_40'],
        'can_bet_20': game_state['can_bet_20'],
        'result': game_state['result'],
        'show_dealer_cards': game_state['show_dealer_cards'],
        'dealer_cards': ['hidden', 'hidden'] if not game_state['show_dealer_cards'] else [card_to_string(card) for card in game_state['dealer_cards']],
    })

@app.route('/api/new_game', methods=['POST'])
def new_game():
    initialize_game_state()
    return get_game_state()

@app.route('/api/action', methods=['POST'])
def perform_action():
    global game_state
    action = request.json['action']
    amount = request.json.get('amount')

    if action == 'pass':
        if not game_state['flop_shown']:
            game_state['flop_shown'] = True
            game_state['can_bet_60'] = False
            game_state['can_bet_40'] = True
        elif not game_state['turn_shown']:
            game_state['turn_shown'] = True
            game_state['can_bet_40'] = False
            game_state['can_bet_20'] = True
        else:
            game_state['result'] = 'You folded. Dealer wins!'
            game_state['show_dealer_cards'] = True
            game_state['can_bet_20'] = False
    elif action == 'bet':
        game_state['balance'] -= amount
        game_state['current_pot'] += amount * 2
        if amount == 60:
            game_state['can_bet_60'] = False
        elif amount == 40:
            game_state['can_bet_40'] = False
        elif amount == 20:
            game_state['can_bet_20'] = False
        determine_winner()

    return get_game_state()

def determine_winner():
    global game_state
    board = game_state['board_cards'][:5]
    dealer_score = evaluator.evaluate(board, game_state['dealer_cards'])
    player_score = evaluator.evaluate(board, game_state['player_cards'])
    dealer_class = evaluator.get_rank_class(dealer_score)
    player_class = evaluator.get_rank_class(player_score)

    game_state['result'] = f"Dealer's hand: {evaluator.class_to_string(dealer_class)}\n"
    game_state['result'] += f"Player's hand: {evaluator.class_to_string(player_class)}\n"
    if dealer_score < player_score:
        game_state['result'] += "Dealer wins!"
    elif player_score < dealer_score:
        game_state['result'] += "Player wins!"
        game_state['balance'] += game_state['current_pot']
    else:
        game_state['result'] += "It's a tie!"
        game_state['balance'] += game_state['current_pot'] // 2

    game_state['show_dealer_cards'] = True
    game_state['can_bet_60'] = False
    game_state['can_bet_40'] = False
    game_state['can_bet_20'] = False

if __name__ == '__main__':
    app.run(debug=True)