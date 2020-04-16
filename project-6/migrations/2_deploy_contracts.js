// migrating the appropriate contracts
var AuthorRole = artifacts.require("./AuthorRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var DesignerRole = artifacts.require("./DesignerRole.sol");
var EditorRole = artifacts.require("./EditorRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(AuthorRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(DesignerRole);
  deployer.deploy(EditorRole);
  deployer.deploy(SupplyChain);
};
