const users = [];

const addUser = (id, playerName, gameCode) => {
  const pName = playerName?.trim()?.toLowerCase();
  const gCode = gameCode?.trim()?.toLowerCase();

  const userExist = users.find(
    (user) => user.playerName === pName && user.gameCode === gCode
  );

  if (userExist) {
    return { error: "Username is taken" };
  }
  let user;
  if (id && pName && gCode) {
    user = { id, playerName: pName, gameCode: gCode };
    users.push(user);
  }

  return { user, userArr: users };
};

const removeUser = ({ id }) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) =>
  users.find((user) => {
    if (user.id === id) {
      return user;
    }
  });

const getUsersInRoom = (gameCode) => {
  return users.filter((user) => user.gameCode === gameCode);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
