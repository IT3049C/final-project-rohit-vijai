// Pure game logic
const BEATS = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock'
};

const MOVES = ['rock', 'paper', 'scissors'];

export function decideWinner(player, cpu) {
  if (player === cpu) return 'tie';
  if (BEATS[player] === cpu) return 'player';
  return 'cpu';
}

export function getCpuMove({ difficulty, lastPlayerMove }) {
  if (difficulty === 'hard' && lastPlayerMove) {
    if (Math.random() < 0.6) {
      const counterMove = Object.keys(BEATS).find(move => BEATS[move] === lastPlayerMove);
      return counterMove;
    }
  }
  
  const randomIndex = Math.floor(Math.random() * MOVES.length);
  return MOVES[randomIndex];
}

export function nextScore(prev, outcome) {
  const newScore = { ...prev };
  if (outcome === 'player') {
    newScore.player++;
  } else if (outcome === 'cpu') {
    newScore.cpu++;
  } else {
    newScore.ties++;
  }
  return newScore;
}