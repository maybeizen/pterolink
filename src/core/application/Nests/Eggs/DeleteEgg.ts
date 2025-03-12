import { PteroClient } from "../../../PteroClient";
import { APIResponse } from "../../../../types";

class DeleteEgg {
  #client: PteroClient;
  #nestId: string | number;
  #eggId: string | number;

  constructor(
    client: PteroClient,
    nestId: string | number,
    eggId: string | number
  ) {
    this.#client = client;
    this.#nestId = nestId;
    this.#eggId = eggId;
  }

  async execute(): Promise<APIResponse<null>> {
    const response = await this.#client.axios.delete(
      `/nests/${this.#nestId}/eggs/${this.#eggId}`
    );
    return {
      data: null,
      status: response.status,
    };
  }
}

export { DeleteEgg };
