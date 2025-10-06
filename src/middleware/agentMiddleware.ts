// Middleware to handle post-processing actions after agent execution

export type AgentResponse = Record<string, any>;
export type PostProcessingHandler = (response: AgentResponse) => void;

interface MiddlewareRegistry {
  [key: string]: PostProcessingHandler[];
}

class AgentMiddleware {
  private registry: MiddlewareRegistry = {};

  /**
   * Register a handler for a specific agent
   * @param agentName - The name of the agent
   * @param handler - The handler function to execute
   */
  registerHandler(agentName: string, handler: PostProcessingHandler): void {
    if (!this.registry[agentName]) {
      this.registry[agentName] = [];
    }
    this.registry[agentName].push(handler);
  }

  /**
   * Validate the response format before executing handlers
   * @param response - The response from the agent
   */
  private validateResponse(response: AgentResponse): boolean {
    // Example validation logic
    return response && typeof response === "object" && Object.keys(response).length > 0;
  }

  /**
   * Execute all handlers for a specific agent
   * @param agentName - The name of the agent
   * @param response - The response from the agent
   */
  async executeHandlers(agentName: string, response: AgentResponse): Promise<void> {
    console.log(`Executing handlers for agent: ${agentName}`);
    console.log(`Response received:`, response);

    if (!this.validateResponse(response)) {
      console.error(`Invalid response format for agent ${agentName}:`, response);
      return;
    }

    const handlers = this.registry[agentName] || [];
    for (const handler of handlers) {
      try {
        await handler(response);
      } catch (error) {
        console.error(`Error executing handler for agent ${agentName}:`, error);
      }
    }
  }

  /**
   * List all registered handlers for debugging or introspection
   */
  listHandlers(): MiddlewareRegistry {
    return this.registry;
  }
}

export const agentMiddleware = new AgentMiddleware();