pragma solidity >=0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DesignerRole' to manage this role - add, remove, check
contract DesignerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event DesignerAdded(address indexed account);
  event DesignerRemoved(address indexed account);

  // Define a struct 'designers' by inheriting from 'Roles' library, struct Role
  Roles.Role private designers;

  // In the constructor make the address that deploys this contract the 1st designer
  constructor() public {
    _addDesigner(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDesigner() {
    require(isDesigner(msg.sender));
    _;
  }

  // Define a function 'isDesigner' to check this role
  function isDesigner(address account) public view returns (bool) {
    return designers.has(account);
  }

  // Define a function 'addDesigner' that adds this role
  function addDesigner(address account) public onlyDesigner {
    _addDesigner(account);
  }

  // Define a function 'renounceDesigner' to renounce this role
  function renounceDesigner() public {
    _removeDesigner(msg.sender);
  }

  // Define an internal function '_addDesigner' to add this role, called by 'addDesigner'
  function _addDesigner(address account) internal {
    designers.add(account);
    emit DesignerAdded(account);
  }

  // Define an internal function '_removeDesigner' to remove this role, called by 'removeDesigner'
  function _removeDesigner(address account) internal {
    designers.remove(account);
    emit DesignerRemoved(account);
  }
}
