import { PteroClient } from "../../PteroClient";
import { NotFoundError } from "../../../errors";
import { ValidationError } from "../../../errors/ValidationError";
import { ListNodes } from "./ListNodes";
import { NodeDetails } from "./NodeDetails";
import { CreateNode } from "./CreateNode";
import { UpdateNode } from "./UpdateNode";
import { DeleteNode } from "./DeleteNode";
import {
  NodeAttributes,
  NodeDetailsResponse,
  CreateNodeData,
  UpdateNodeData,
  NodeQueryParams,
} from "../../../types/Nodes";

/**
 * Manages node operations in the Pterodactyl panel
 */
class Nodes {
  #client: PteroClient;

  /**
   * Create a new Nodes instance
   *
   * @param client PteroClient instance
   */
  constructor(client: PteroClient) {
    this.#client = client;
  }

  /**
   * List all nodes in the panel
   *
   * @param params Optional query parameters
   * @returns Promise resolving to an array of Node instances
   *
   * @example
   * // Get all nodes
   * const nodes = await client.nodes.list();
   */
  async list(params: NodeQueryParams = {}) {
    const response = await new ListNodes(this.#client, params).execute();

    return response.data.map((nodeData) => {
      const node = new Node(this.#client);
      node.attributes = nodeData.attributes;
      return node;
    });
  }

  /**
   * Get a node by ID
   *
   * @param id Node ID
   * @param include Optional relationships to include
   * @returns Promise resolving to a Node instance
   *
   * @example
   * // Get node with ID 1
   * const node = await client.nodes.get(1);
   */
  async get(id: number | string, include: string[] = []) {
    const response = await new NodeDetails(this.#client, id, include).execute();
    const node = new Node(this.#client);
    node.attributes = response.attributes;
    return node;
  }

  /**
   * Create a new node
   *
   * @param data Node creation data
   * @returns Promise resolving to the created Node instance
   *
   * @example
   * // Create a new node
   * const newNode = await client.nodes.create({
   *   name: "New Node",
   *   location_id: 1,
   *   fqdn: "node.example.com",
   *   scheme: "https",
   *   memory: 4096,
   *   disk: 50000,
   *   // ... other required fields
   * });
   */
  async create(data: CreateNodeData) {
    const response = await new CreateNode(this.#client, data).execute();
    const node = new Node(this.#client);
    node.attributes = response.attributes;
    return node;
  }
}

/**
 * Represents a single node in the Pterodactyl panel
 */
class Node {
  #client: PteroClient;
  attributes?: NodeAttributes;

  /**
   * Create a new Node instance
   *
   * @param client PteroClient instance
   */
  constructor(client: PteroClient) {
    this.#client = client;
  }

  /**
   * Get node ID
   *
   * @returns Node ID
   */
  public getId(): number {
    return this.attributes?.id || 0;
  }

  /**
   * Get node UUID
   *
   * @returns Node UUID
   */
  public getUuid(): string {
    return this.attributes?.uuid || "";
  }

  /**
   * Get node name
   *
   * @returns Node name
   */
  public getName(): string {
    return this.attributes?.name || "";
  }

  /**
   * Get node description
   *
   * @returns Node description
   */
  public getDescription(): string | null {
    return this.attributes?.description || null;
  }

  /**
   * Get node location ID
   *
   * @returns Location ID
   */
  public getLocationId(): number {
    return this.attributes?.location_id || 0;
  }

  /**
   * Get node FQDN (Fully Qualified Domain Name)
   *
   * @returns Node FQDN
   */
  public getFqdn(): string {
    return this.attributes?.fqdn || "";
  }

  /**
   * Get node scheme (http/https)
   *
   * @returns Node scheme
   */
  public getScheme(): string {
    return this.attributes?.scheme || "https";
  }

  /**
   * Get node behind proxy status
   *
   * @returns True if node is behind proxy
   */
  public isBehindProxy(): boolean {
    return this.attributes?.behind_proxy || false;
  }

  /**
   * Get node maintenance mode status
   *
   * @returns True if node is in maintenance mode
   */
  public isInMaintenance(): boolean {
    return this.attributes?.maintenance_mode || false;
  }

  /**
   * Get node memory allocation
   *
   * @returns Memory in MB
   */
  public getMemory(): number {
    return this.attributes?.memory || 0;
  }

  /**
   * Get node memory overallocation
   *
   * @returns Memory overallocation percentage
   */
  public getMemoryOverallocation(): number {
    return this.attributes?.memory_overallocate || 0;
  }

  /**
   * Get node disk space
   *
   * @returns Disk space in MB
   */
  public getDisk(): number {
    return this.attributes?.disk || 0;
  }

  /**
   * Get node disk overallocation
   *
   * @returns Disk overallocation percentage
   */
  public getDiskOverallocation(): number {
    return this.attributes?.disk_overallocate || 0;
  }

  /**
   * Get node daemon port
   *
   * @returns Daemon port
   */
  public getDaemonPort(): number {
    return this.attributes?.daemon_listen || 8080;
  }

  /**
   * Get node daemon SFTP port
   *
   * @returns SFTP port
   */
  public getDaemonSftpPort(): number {
    return this.attributes?.daemon_sftp || 2022;
  }

  /**
   * Get node creation date
   *
   * @returns Creation date string
   */
  public getCreatedAt(): string {
    return this.attributes?.created_at || "";
  }

  /**
   * Get node last update date
   *
   * @returns Last update date string
   */
  public getUpdatedAt(): string {
    return this.attributes?.updated_at || "";
  }

  /**
   * Update node details
   *
   * @param data Node update data
   * @returns Promise resolving to the updated Node instance
   *
   * @example
   * // Update node name
   * await node.update({ name: "Updated Node Name" });
   */
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

    this.attributes = response.attributes;
    return this;
  }

  /**
   * Delete the node
   *
   * @returns Promise resolving when the node is deleted
   *
   * @example
   * // Delete the node
   * await node.delete();
   */
  public async delete() {
    if (!this.attributes?.id) {
      throw new NotFoundError("Node", "unknown");
    }
    await new DeleteNode(this.#client, this.attributes.id).execute();
  }

  /**
   * Convert node to a simple object representation
   *
   * @returns Simple object with key node properties
   */
  public toJSON() {
    return {
      id: this.getId(),
      uuid: this.getUuid(),
      name: this.getName(),
      description: this.getDescription(),
      locationId: this.getLocationId(),
      fqdn: this.getFqdn(),
      scheme: this.getScheme(),
      memory: this.getMemory(),
      disk: this.getDisk(),
      isInMaintenance: this.isInMaintenance(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
    };
  }

  /**
   * String representation of the node
   *
   * @returns String representation
   */
  public toString(): string {
    return `Node(${this.getId()}: ${this.getName()})`;
  }
}

export { Nodes, Node };
