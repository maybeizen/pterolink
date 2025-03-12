import { PteroClient } from "../../../PteroClient";
import { APIResponse } from "../../../../types";
import { CreateEggData } from "../../../../types/Nests";

class CreateEgg {
  #client: PteroClient;
  #nestId: string | number;
  #data: CreateEggData;

  constructor(
    client: PteroClient,
    nestId: string | number,
    data: CreateEggData
  ) {
    this.#client = client;
    this.#nestId = nestId;
    this.#data = data;
  }

  async execute(): Promise<APIResponse<any>> {
    const response = await this.#client.axios.post(
      `/nests/${this.#nestId}/eggs`,
      this.#data
    );
    return {
      data: response.data.data,
      status: response.status,
    };
  }
}

export { CreateEgg };
