"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json")[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
  })
  .forEach(function (file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

//dynamic associate, uses file code
Object.keys(db).forEach(function (modelName) {
  // console.log(modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
  // if (db[modelName].realSync) {
  //   db[modelName].realSync();
  // }
});


const syncDB = async () => {
  await db['Benefactor'].realSync();
  await db['Category'].realSync();
  await db['User'].realSync();
  await db['Project'].realSync();
  await db['UserProject'].realSync();
}

syncDB();


// db['Project'].count({
//   distinct: true,
//   col: 'id'
// })
// .then(function(count) {
// if (count < 1) {
// syncDB();
// }
// });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.Project.belongsTo(db.Category);
// db.Category.hasMany(db.Project);


module.exports = db;

