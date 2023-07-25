let gamesData = {
  leaderBoard: [],
};

const updateLeaderBoard = (data, id) => {
  const board = gamesData.leaderBoard;
  const score = data?.score;
  const attemps = data?.attempted;

  return {
    leaderBoard: [],
  };
};

module.exports = {
  updateLeaderBoard,
};
