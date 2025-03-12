import { PteroClient } from "../../PteroClient";
import { APIResponse } from "../../../types";
import { CreateNestData, NestResponse } from "../../../types/Nests";

class CreateNest {
  #client: PteroClient;
  #data: CreateNestData;

  constructor(client: PteroClient, data: CreateNestData) {
    this.#client = client;
    this.#data = data;
  }

  async execute(): Promise<APIResponse<NestResponse>> {
    const response = await this.#client.axios.post("/nests", this.#data);
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export { CreateNest };
