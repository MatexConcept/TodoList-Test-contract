// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const TodoList = buildModule("TodoListModule", (m) => {

  const todolist = m.contract("TodoList");

  return { todolist };


});

export default TodoList;