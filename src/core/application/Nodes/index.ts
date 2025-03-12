import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
import {
  NodeAttributes,
  CreateNodeData,
  UpdateNodeData,
} from "../../../types/Nodes";
import { ListNodes } from "./ListNodes";
import { NodeDetails } from "./NodeDetails";
import { CreateNode } from "./CreateNode";
import { UpdateNode } from "./UpdateNode";
import { DeleteNode } from "./DeleteNode";

class Nodes {
  #client: PteroClient;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;
  private rateLimit = 5; // Lower rate limit for node operations

  constructor(client: PteroClient) {
    this.#client = client;
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        await request();
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 / this.rateLimit)
        );
      }
    }

    this.isProcessing = false;
  }

  public async list(include: string[] = []) {
    const response = await new ListNodes(this.#client, {
      include: include.join(","),
    }).execute();
    const nodes = response.data.map(
      (node) => new Node(this.#client, node.attributes)
    );
    return nodes;
  }

  public async get(id: string | number, include: string[] = []) {
    const node = new Node(this.#client);
    return node.get(id, include);
  }

  public async create(data: CreateNodeData): Promise<Node> {
    return new Promise<Node>((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await new CreateNode(this.#client, data).execute();
          resolve(new Node(this.#client, response.data.attributes));
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  public async delete(id: string | number) {
    await new DeleteNode(this.#client, id).execute();
  }

  public async bulkCreate(nodes: CreateNodeData[]) {
    const createdNodes = await Promise.all(
      nodes.map((nodeData) => this.create(nodeData))
    );
    return createdNodes;
  }

  public async bulkDelete(ids: (string | number)[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}

class Node {
  #client: PteroClient;
  public attributes!: NodeAttributes;

  constructor(client: PteroClient, attributes?: NodeAttributes) {
    this.#client = client;
    if (attributes) {
      this.attributes = attributes;
    }
  }

  public async get(id: string | number, include: string[] = []) {
    const response = await new NodeDetails(this.#client, id, include).execute();
    this.attributes = response.data.attributes;
    return this;
  }

  public async update(data: UpdateNodeData) {
    if (!this.attributes?.id) {
      throw new NotFoundError("Node", "unknown");
    }

    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    const response = await new UpdateNode(
      this.#client,
      this.attributes.id,
      data
    ).execute();

    this.attributes = response.data.attributes;
    return this;
  }

  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Node", "unknown");
    }
    await new DeleteNode(this.#client, this.attributes.id).execute();
  }

  public isPublic(): boolean {
    return this.attributes?.public || false;
  }

  public isInMaintenanceMode(): boolean {
    return this.attributes?.maintenance_mode || false;
  }

  public isBehindProxy(): boolean {
    return this.attributes?.behind_proxy || false;
  }

  public getName(): string {
    return this.attributes?.name || "";
  }

  public getDescription(): string {
    return this.attributes?.description || "";
  }

  public getFQDN(): string {
    return this.attributes?.fqdn || "";
  }

  public getScheme(): string {
    return this.attributes?.scheme || "https";
  }

  public getLocationId(): number {
    return this.attributes?.location_id || 0;
  }

  public getMemory(): number {
    return this.attributes?.memory || 0;
  }

  public getDisk(): number {
    return this.attributes?.disk || 0;
  }

  public getAllocatedResources() {
    return this.attributes?.allocated_resources || { memory: 0, disk: 0 };
  }
}

export { Nodes, Node };
