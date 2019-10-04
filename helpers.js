
const getUserByEmail = function(email, database) {
  for (let user in database) {
    const currentUser = database[user]
    if (email === currentUser.email) {
    return currentUser;
    }
  }
};

function generateRandomString() {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = { generateRandomString, getUserByEmail }