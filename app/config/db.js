const mysql = require('mysql');

const db = () => {
  let connection;
  const connect = () => {
    connection = mysql.createConnection({
      host:"localhost",
      user:"root",
      password:"",
      database : "shop"
    });
  };

  const query = (string) => {
    return new Promise((resolve, reject) => {
      connection.connect(function(err) {
        if(err){
          reject(err);
        }
        else{
          connection.query(string)
          .on('result', (result) => {
            resolve(result);
          })
          .on('error', (err) => {
            reject(err);
          });
        }
      });
    });
  }

  return {
    connect,
    query
  }
};
module.exports = db;