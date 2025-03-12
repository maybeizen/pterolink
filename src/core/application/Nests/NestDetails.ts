import { PteroClient } from "../../PteroClient";
import { APIResponse } from "../../../types";
import { NestResponse } from "../../../types/Nests";

class NestDetails {
  #client: PteroClient;
  #id: string | number;
  #include: string[];

  constructor(
    client: PteroClient,
    id: string | number,
    include: string[] = []
  ) {
    this.#client = client;
    this.#id = id;
    this.#include = include;
  }

  async execute(): Promise<APIResponse<NestResponse>> {
    const params: Record<string, any> = {};

    if (this.#include.length > 0) {
      params.include = this.#include.join(",");
    }

    const response = await this.#client.axios.get(`/nests/${this.#id}`, {
      params,
    });
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export { NestDetails };
