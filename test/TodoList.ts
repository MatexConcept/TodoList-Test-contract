import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("TodoList Test", function () {

  async function deployTodoListFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const TodoList = await hre.ethers.getContractFactory("TodoList");
    const todolist = await TodoList.deploy();

    return { todolist, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("Should check if it deployed", async function () {
      const { todolist, owner } = await loadFixture(deployTodoListFixture);

      expect(await todolist.owner()).to.equal(owner);
    });

    it("Should be able to create todo list as the Owner", async function () {
      const { todolist, owner } = await loadFixture(deployTodoListFixture);
      const title = "Code 5hrs a day";
      const description =
        "i must always code 5hrs a day so i can improve my skill";

      await todolist.connect(owner).createTodo(title, description);

      expect(await todolist.getTodo(0)).to.deep.equal([title, description, 1]);
    });

    it("Should not be able to create todolist if not the owner", async function () {
      const { todolist, otherAccount } = await loadFixture(
        deployTodoListFixture
      );
      const title = "To check if you are not the owner";
      const description =
        "you should not be able to create if you are not the owner";

      await expect(
        todolist.connect(otherAccount).createTodo(title, description)
      ).to.be.revertedWith("You are not allowed");
    });

    it("Should be able to update todo list as the Owner", async function () {
      const { todolist, owner } = await loadFixture(deployTodoListFixture);

      const title1 = "Code 15hrs a day";
      const description1 =
        "I must always code 15hrs a day so I can improve my skill";

      await todolist.connect(owner).createTodo(title1, description1);

      const title = "Code 3hrs a day";
      const description =
        "i must always code 3hrs a day so i can improve my skill";

      await todolist.connect(owner).updateTodo(0, title, description);

      expect(await todolist.getTodo(0)).to.deep.equal([title, description, 2]);
    });

  

    it("Should not be able to update todolist if not the owner", async function () {
      const { todolist, otherAccount } = await loadFixture(
        deployTodoListFixture
      );
      const title = "Code 3hrs a day";
      const description =
        "i must always code 3hrs a day so i can improve my skill";

      await expect(
        todolist.connect(otherAccount).updateTodo(0, title, description)
      ).to.be.revertedWith("You are not allowed");
    });

    it("Should allow the owner to check if  todo is completed", async function () {
      const { todolist, owner } = await loadFixture(deployTodoListFixture);

      const title = "Play Football today";
      const description = "score 50 goals";

      await todolist.connect(owner).createTodo(title, description);
      await todolist.connect(owner).todoCompleted(0);

      expect(await todolist.getTodo(0)).to.deep.equal([title, description, 3]);
    });

    it("Should not allow other account to check if  todo is completed", async function () {
      const { todolist, owner, otherAccount } = await loadFixture(
        deployTodoListFixture
      );

      const title = "Play Football today";
      const description = "score 50 goals";

      await todolist.connect(owner).createTodo(title, description);

      await expect(
        todolist.connect(otherAccount).todoCompleted(0)
      ).to.be.revertedWith("You are not allowed");
    });

 
    it("Should be able to get all todo list", async function () {
      const { todolist, owner } = await loadFixture(deployTodoListFixture);
      const title1 = "Buy Lambo";
      const description1 =
        "i must buy atleast 10 lambo before the end of the year";
      const title2 = "Get a babe";
      const description2 =
        "before the need of the month i need to have a sexy bbe with tula";
      const title3 = "Buy my parent a house";
      const description3 =
        "i must build build my parent a mansion before the end of 2025";

      await todolist.connect(owner).createTodo(title1, description1);
      await todolist.connect(owner).createTodo(title2, description2);
      await todolist.connect(owner).createTodo(title3, description3);

      const todos = await todolist.getAllTodo();

      expect(todos.length).to.equal(3);
      expect(todos[0]).to.deep.equal([title1, description1, 1]);
      expect(todos[1]).to.deep.equal([title2, description2, 1]); 
      expect(todos[2]).to.deep.equal([title3, description3, 1]); 
    });

    it("Should be able to delete  todos as owner", async function () {
        const { todolist, owner } = await loadFixture(deployTodoListFixture);

        const title = "Delete Sapa";
        const description =
          "no more sapa in my life";

          await todolist.connect(owner).createTodo(title, description);
          await  todolist.connect(owner).deleteTodo(0);

          const todos = await todolist.getAllTodo();

          expect(todos.length).to.equal(0)
    })

    it("Should not allow other accounts to delete todos", async function () {
        const { todolist, owner, otherAccount } = await loadFixture(deployTodoListFixture);
    
        const title = "Delete Sapa";
        const description = "No more sapa in my life.";
    
        await todolist.connect(owner).createTodo(title, description);
    
     
        await expect(
            todolist.connect(otherAccount).deleteTodo(0)
        ).to.be.revertedWith("You are not allowed");
    });

 
  });
});
