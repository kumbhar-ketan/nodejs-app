const db = require('../config/db');
const userModal = () => {
  const dbObject = db();
  const getUsers = () => {
    return new Promise((resolve, reject) => {
      dbObject.connect();
      try {
        const result = dbObject.query('select * from users');
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };

  return {
    getUsers
  }
}
module.exports = userModal;
