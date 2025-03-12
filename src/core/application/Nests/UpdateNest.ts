import { PteroClient } from "../../PteroClient";
import { APIResponse } from "../../../types";
import { UpdateNestData, NestResponse } from "../../../types/Nests";

class UpdateNest {
  #client: PteroClient;
  #id: string | number;
  #data: UpdateNestData;

  constructor(client: PteroClient, id: string | number, data: UpdateNestData) {
    this.#client = client;
    this.#id = id;
    this.#data = data;
  }

  async execute(): Promise<APIResponse<NestResponse>> {
    const response = await this.#client.axios.patch(
      `/nests/${this.#id}`,
      this.#data
    );
    return {
      data: response.data.data,
      status: response.status,
    };
  }
}

export { UpdateNest };
