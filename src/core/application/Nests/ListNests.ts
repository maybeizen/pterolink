import { PteroClient } from "../../PteroClient";
import { NestsResponse } from "../../../types/Nests";

interface ListNestsOptions {
  include?: string;
  page?: number;
}

class ListNests {
  #client: PteroClient;
  #options: ListNestsOptions;

  constructor(client: PteroClient, options: ListNestsOptions = {}) {
    this.#client = client;
    this.#options = options;
  }

  async execute(): Promise<NestsResponse> {
    const params: Record<string, any> = {};

    if (this.#options.include) {
      params.include = this.#options.include;
    }

    if (this.#options.page) {
      params.page = this.#options.page;
    }

    const response = await this.#client.axios.get("/nests", { params });
    return response.data;
  }
}

export { ListNests };
