// SPDX-License-Identifier: MIT
 pragma solidity ^0.8.27;

 contract TodoList {
    address public owner;

    enum Status {None, Created, Edited, Done}

    struct Todo{
        string title;
        string description;
        Status status;
    }

    Todo[] public todos;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not allowed");

        _;
    }

    modifier  validAdddress() {
        require(msg.sender !=address(0), "Zero address not allowed");
        _;
    }

    event TodoCreated(string title, Status status);

    function createTodo (string memory _title, string memory _description) external onlyOwner validAdddress returns (bool) {
        // todos.push(Todo(_title, _description,Status.Created ));
        // return  true;
        Todo memory mytodo;
        mytodo.title = _title;
        mytodo.description = _description;
        mytodo.status = Status.Created;

        todos.push(mytodo);

        emit TodoCreated(_title, Status.Created);

        return true;
    }

    event TodoUpdated(string title, Status status);

    function updateTodo(uint8 _index, string memory _title, string memory _description) external onlyOwner validAdddress {
        require(_index < todos.length, "Index is out of-bound");

        Todo storage mytodo = todos[_index];
        mytodo.title = _title;
        mytodo.description = _description;
        mytodo.status = Status.Edited;

        emit TodoUpdated(_title, Status.Edited);
    }

    function getTodo(uint8 _index) external view validAdddress returns (string memory, string memory, Status){
           require(_index < todos.length, "Index is out of-bound");
           Todo memory mytodo = todos[_index];
           return (mytodo.title, mytodo.description, mytodo.status);
    }

    function getAllTodo() external view validAdddress returns (Todo[] memory){
         return todos;
    }

    function todoCompleted(uint8 _index) external onlyOwner validAdddress returns(bool){
         require(_index < todos.length, "Index is out of-bound");
         Todo storage mytodo = todos[_index];
         mytodo.status = Status.Done;

         return true;
    }

    function deleteTodo(uint8 _index) external  onlyOwner validAdddress {
        require(_index < todos.length, "Index is out of-bound");
         todos[_index] = todos[todos.length - 1];    
         todos.pop();

    }
 } 