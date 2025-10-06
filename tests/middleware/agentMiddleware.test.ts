import { agentMiddleware } from "../../src/middleware/agentMiddleware";
import { jest } from "@jest/globals";

describe("AgentMiddleware", () => {
  it("should register and execute handlers for an agent", async () => {
    const mockHandler = jest.fn();
    const agentName = "testAgent";
    const response = { key: "value" };

    agentMiddleware.registerHandler(agentName, mockHandler);
    await agentMiddleware.executeHandlers(agentName, response);

    expect(mockHandler).toHaveBeenCalledWith(response);
  });

  it("should handle errors in handlers gracefully", async () => {
    const errorHandler = jest.fn(() => {
      throw new Error("Handler error");
    });
    const agentName = "errorAgent";
    const response = { key: "value" };

    agentMiddleware.registerHandler(agentName, errorHandler);

    await expect(agentMiddleware.executeHandlers(agentName, response)).resolves.not.toThrow();
  });

  it("should not execute handlers for unregistered agents", async () => {
    const mockHandler = jest.fn();
    const agentName = "unregisteredAgent";
    const response = { key: "value" };

    await agentMiddleware.executeHandlers(agentName, response);

    expect(mockHandler).not.toHaveBeenCalled();
  });
});

describe("Product Registration Handler", () => {
  it("should call cadastrarProduto when response contains product data", async () => {
    const mockCadastrarProduto = jest.fn();
    jest.mock("../handlers/productRegistrationHandler", () => ({
      cadastrarProduto: mockCadastrarProduto,
    }));

    const { productRegistrationHandler } = await import("../../src/handlers/productRegistrationHandler");
    const response = { produto: { nome: "Notebook", preco: 3000 } };

    await productRegistrationHandler(response);

    expect(mockCadastrarProduto).toHaveBeenCalledWith(response.produto);
  });

  it("should warn when no product data is found", async () => {
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { productRegistrationHandler } = await import("../../src/handlers/productRegistrationHandler");

    const response = { key: "value" };
    await productRegistrationHandler(response);

    expect(consoleWarnSpy).toHaveBeenCalledWith("No product data found in agent response.");
    consoleWarnSpy.mockRestore();
  });
});