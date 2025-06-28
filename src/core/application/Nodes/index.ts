import { PteroClient } from "../../PteroClient";
import { handleApiError, ValidationError } from "../../../errors";
import {
  NodeAttributes,
  NodeDetailsResponse,
  CreateNodeData,
  UpdateNodeData,
  NodeQueryParams,
  NodeListResponse,
  PaginatedResult,
  NodeFilterOptions,
  NodeRelationships,
} from "../../../types/Nodes";

export class Nodes {
  #client: PteroClient;

  constructor(client: PteroClient) {
    this.#client = client;
  }

  async all(options: NodeFilterOptions = {}): Promise<Node[]> {
    try {
      const { limit, ...params } = options;

      const countResponse = await this.#client.axios.get("/nodes", {
        params: { ...params, per_page: 1 },
      });

      const totalNodes = countResponse.data.meta.pagination.total;

      const response = await this.#client.axios.get("/nodes", {
        params: { ...params, per_page: totalNodes },
      });

      let nodes = response.data.data.map(
        (nodeData: NodeListResponse) =>
          new Node(this.#client, nodeData.attributes)
      );

      if (limit && limit > 0) {
        nodes = nodes.slice(0, limit);
      }

      return nodes;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nodes",
        context: "getting all nodes",
      });
    }
  }

  async paginate(
    options: NodeFilterOptions = {}
  ): Promise<PaginatedResult<Node>> {
    try {
      const { limit, ...params } = options;
      const page = params.page || 1;
      const perPage = params.per_page || 50;

      const response = await this.#client.axios.get("/nodes", {
        params: { ...params, page, per_page: perPage },
      });

      let nodes = response.data.data.map(
        (nodeData: NodeListResponse) =>
          new Node(this.#client, nodeData.attributes)
      );

      const pagination = {
        total: response.data.meta.pagination.total,
        count: response.data.meta.pagination.count,
        perPage: response.data.meta.pagination.per_page,
        currentPage: response.data.meta.pagination.current_page,
        totalPages: response.data.meta.pagination.total_pages,
        links: {
          next: response.data.meta.pagination.links.next || null,
          previous: response.data.meta.pagination.links.prev || null,
        },
      };

      const hasNextPage = pagination.currentPage < pagination.totalPages;
      const hasPreviousPage = pagination.currentPage > 1;

      const result: PaginatedResult<Node> = {
        data: nodes,
        pagination,
        hasNextPage,
        hasPreviousPage,
      };

      if (hasNextPage) {
        result.fetchNextPage = () =>
          this.paginate({
            ...options,
            page: pagination.currentPage + 1,
            per_page: pagination.perPage,
          });
      }

      if (hasPreviousPage) {
        result.fetchPreviousPage = () =>
          this.paginate({
            ...options,
            page: pagination.currentPage - 1,
            per_page: pagination.perPage,
          });
      }

      return result;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Nodes",
        context: "paginating nodes",
      });
    }
  }

  async get(id: number | string): Promise<Node> {
    try {
      const response = await this.#client.axios.get(`/nodes/${id}`);
      return new Node(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: id,
        context: "getting node",
      });
    }
  }

  async create(data: CreateNodeData): Promise<Node> {
    try {
      const response = await this.#client.axios.post("/nodes", data);
      return new Node(this.#client, response.data.attributes);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: data.name,
        context: "creating node",
      });
    }
  }

  async delete(id: number | string): Promise<void> {
    try {
      await this.#client.axios.delete(`/nodes/${id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: id,
        context: "deleting node",
      });
    }
  }

  async bulkCreate(nodes: CreateNodeData[]): Promise<Node[]> {
    return Promise.all(nodes.map((nodeData) => this.create(nodeData)));
  }

  async bulkDelete(ids: (number | string)[]): Promise<void> {
    await Promise.all(ids.map((id) => this.delete(id)));
  }
}

export class Node {
  #client: PteroClient;
  attributes: NodeAttributes;

  constructor(client: PteroClient, attributes: NodeAttributes) {
    this.#client = client;
    this.attributes = attributes;
  }

  get getAttributes(): NodeAttributes {
    return this.attributes;
  }

  get id(): number {
    return this.attributes.id;
  }

  get uuid(): string {
    return this.attributes.uuid;
  }

  get public(): boolean {
    return this.attributes.public;
  }

  get name(): string {
    return this.attributes.name;
  }

  get description(): string | null {
    return this.attributes.description;
  }

  get locationId(): number {
    return this.attributes.location_id;
  }

  get fqdn(): string {
    return this.attributes.fqdn;
  }

  get scheme(): string {
    return this.attributes.scheme;
  }

  get behindProxy(): boolean {
    return this.attributes.behind_proxy;
  }

  get maintenanceMode(): boolean {
    return this.attributes.maintenance_mode;
  }

  get memory(): number {
    return this.attributes.memory;
  }

  get memoryOverallocate(): number {
    return this.attributes.memory_overallocate;
  }

  get disk(): number {
    return this.attributes.disk;
  }

  get diskOverallocate(): number {
    return this.attributes.disk_overallocate;
  }

  get uploadSize(): number {
    return this.attributes.upload_size;
  }

  get daemonListen(): number {
    return this.attributes.daemon_listen;
  }

  get daemonSftp(): number {
    return this.attributes.daemon_sftp;
  }

  get daemonBase(): string {
    return this.attributes.daemon_base;
  }

  get createdAt(): Date {
    return new Date(this.attributes.created_at);
  }

  get updatedAt(): Date {
    return new Date(this.attributes.updated_at);
  }

  get allocatedResources() {
    return (
      this.attributes.allocated_resources || {
        memory: 0,
        disk: 0,
      }
    );
  }

  get relationships(): NodeRelationships | null {
    return this.attributes.relationships || null;
  }

  get allocations() {
    return this.attributes.relationships?.allocations?.data || [];
  }

  get location() {
    return this.attributes.relationships?.location?.attributes || null;
  }

  get servers() {
    return this.attributes.relationships?.servers?.data || [];
  }

  async getDetails(include: string[] = []): Promise<Node> {
    try {
      const params = include.length ? { include: include.join(",") } : {};
      const response = await this.#client.axios.get(`/nodes/${this.id}`, {
        params,
      });
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.id,
        context: "getting node details",
      });
    }
  }

  async update(data: UpdateNodeData): Promise<Node> {
    if (!Object.keys(data).length) {
      throw new ValidationError("No update fields provided");
    }

    try {
      const response = await this.#client.axios.patch(
        `/nodes/${this.id}`,
        data
      );
      this.attributes = response.data.attributes;
      return this;
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.id,
        context: "updating node",
      });
    }
  }

  async delete(): Promise<void> {
    try {
      await this.#client.axios.delete(`/nodes/${this.id}`);
    } catch (error) {
      throw handleApiError(error, {
        resource: "Node",
        identifier: this.id,
        context: "deleting node",
      });
    }
  }

  public toJSON() {
    return {
      id: this.id,
      uuid: this.uuid,
      public: this.public,
      name: this.name,
      description: this.description,
      locationId: this.locationId,
      fqdn: this.fqdn,
      scheme: this.scheme,
      behindProxy: this.behindProxy,
      maintenanceMode: this.maintenanceMode,
      memory: this.memory,
      memoryOverallocate: this.memoryOverallocate,
      disk: this.disk,
      diskOverallocate: this.diskOverallocate,
      uploadSize: this.uploadSize,
      daemonListen: this.daemonListen,
      daemonSftp: this.daemonSftp,
      daemonBase: this.daemonBase,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      allocatedResources: this.allocatedResources,
      relationships: this.relationships,
    };
  }

  public toString(): string {
    return `Node(${this.id}: ${this.name})`;
  }
}
