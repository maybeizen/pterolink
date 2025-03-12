import { PteroClient } from "../../PteroClient";
import { APIResponse } from "../../../types";

class DeleteNest {
  #client: PteroClient;
  #id: string | number;

  constructor(client: PteroClient, id: string | number) {
    this.#client = client;
    this.#id = id;
  }

  async execute(): Promise<APIResponse<null>> {
    const response = await this.#client.axios.delete(`/nests/${this.#id}`);
    return {
      data: null,
      status: response.status,
    };
  }
}

export { DeleteNest };
