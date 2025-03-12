import { PteroClient } from "../../../PteroClient";
import { APIResponse } from "../../../../types";
import { UpdateEggData } from "../../../../types/Nests";

class UpdateEgg {
  #client: PteroClient;
  #nestId: string | number;
  #eggId: string | number;
  #data: UpdateEggData;

  constructor(
    client: PteroClient,
    nestId: string | number,
    eggId: string | number,
    data: UpdateEggData
  ) {
    this.#client = client;
    this.#nestId = nestId;
    this.#eggId = eggId;
    this.#data = data;
  }

  async execute(): Promise<APIResponse<any>> {
    const response = await this.#client.axios.patch(
      `/nests/${this.#nestId}/eggs/${this.#eggId}`,
      this.#data
    );
    return {
      data: response.data.data,
      status: response.status,
    };
  }
}

export { UpdateEgg };
