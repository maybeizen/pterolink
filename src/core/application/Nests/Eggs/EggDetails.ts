import { PteroClient } from "../../../PteroClient";
import { APIResponse } from "../../../../types";

class EggDetails {
  #client: PteroClient;
  #nestId: string | number;
  #eggId: string | number;
  #include: string[];

  constructor(
    client: PteroClient,
    nestId: string | number,
    eggId: string | number,
    include: string[] = []
  ) {
    this.#client = client;
    this.#nestId = nestId;
    this.#eggId = eggId;
    this.#include = include;
  }

  async execute(): Promise<APIResponse<any>> {
    const params: Record<string, any> = {};

    if (this.#include.length > 0) {
      params.include = this.#include.join(",");
    }

    const response = await this.#client.axios.get(
      `/nests/${this.#nestId}/eggs/${this.#eggId}`,
      { params }
    );
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export { EggDetails };
