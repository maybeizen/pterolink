import { PteroClient } from "../../../PteroClient";
import { APIResponse } from "../../../../types";

interface ListEggsOptions {
  include?: string;
  page?: number;
}

class ListEggs {
  #client: PteroClient;
  #nestId: string | number;
  #options: ListEggsOptions;

  constructor(
    client: PteroClient,
    nestId: string | number,
    options: ListEggsOptions = {}
  ) {
    this.#client = client;
    this.#nestId = nestId;
    this.#options = options;
  }

  async execute(): Promise<APIResponse<any>> {
    const params: Record<string, any> = {};

    if (this.#options.include) {
      params.include = this.#options.include;
    }

    if (this.#options.page) {
      params.page = this.#options.page;
    }

    const response = await this.#client.axios.get(
      `/nests/${this.#nestId}/eggs`,
      { params }
    );
    return {
      data: response.data,
      status: response.status,
    };
  }
}

export { ListEggs };
