import axios from "axios";

class PteroClient {
  constructor(apiKey, panelUrl) {
    this.apiKey = apiKey;
    this.panelUrl = panelUrl;
  }

  async healthCheck() {
    try {
      const response = await axios.get(
        `${this.panelUrl}/api/application/servers`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
      return response.status === 200
        ? { message: "200 OK" }
        : { message: "500 Internal Server Error" };
    } catch (error) {
      return { message: "500 Internal Server Error" };
    }
  }
}

export { PteroClient };
