var userModel = require('../models/user');

const userController = () => {
  const index = async(req, res) => {
    let status = 'error';
    let message;
    let data;
    const model = userModel();
    
    try {
      const result = await model.getUsers();
      status = 'success';
      data = result;
    } catch (error) {
      message = error;
    };

    res.send({ status, message, data });
  };

  return {
    index
  }
}

module.exports = userController
