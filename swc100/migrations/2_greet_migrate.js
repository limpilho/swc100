const greet = artifacts.require("greet");
//or const greet = artifacts.require("./greet.sol");

module.exports = function (deployer) {
  deployer.deploy(greet);
};
