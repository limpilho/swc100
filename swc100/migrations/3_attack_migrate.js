const HashForEther = artifacts.require("HashForEther");
//or const greet = artifacts.require("./greet.sol");

module.exports = function (deployer) {
  deployer.deploy(HashForEther);
  HashForEther.deployed().then(function(instance){test=instance})
};
