import { Server } from "./index";
import { ServerAttributes } from "../../../types/Servers";

export class Filter {
  private servers: Server[];
  private filteredServers: Server[];

  constructor(servers: Server[]) {
    this.servers = servers;
    this.filteredServers = [...servers];
  }

  public where(field: keyof ServerAttributes, value: any): Filter {
    this.filteredServers = this.filteredServers.filter(
      (server) => server.attributes[field] === value
    );
    return this;
  }

  public whereNot(field: keyof ServerAttributes, value: any): Filter {
    this.filteredServers = this.filteredServers.filter(
      (server) => server.attributes[field] !== value
    );
    return this;
  }

  public contains(field: keyof ServerAttributes, value: string): Filter {
    this.filteredServers = this.filteredServers.filter((server) => {
      const fieldValue = server.attributes[field];
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(value.toLowerCase());
      }
      return String(fieldValue).includes(value);
    });
    return this;
  }

  public sort(
    field: keyof ServerAttributes,
    order: "asc" | "desc" = "asc"
  ): Filter {
    this.filteredServers.sort((a, b) => {
      const valueA = a.attributes[field] ?? "";
      const valueB = b.attributes[field] ?? "";

      if (order === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    });
    return this;
  }

  public limit(count: number): Filter {
    this.filteredServers = this.filteredServers.slice(0, count);
    return this;
  }

  public offset(count: number): Filter {
    this.filteredServers = this.filteredServers.slice(count);
    return this;
  }

  public suspended(): Filter {
    return this.where("suspended", true);
  }

  public notSuspended(): Filter {
    return this.where("suspended", false);
  }

  public byUser(userId: number): Filter {
    return this.where("user", userId);
  }

  public byNode(nodeId: number): Filter {
    return this.where("node", nodeId);
  }

  public byNest(nestId: number): Filter {
    return this.where("nest", nestId);
  }

  public byEgg(eggId: number): Filter {
    return this.where("egg", eggId);
  }

  public createdBefore(date: Date): Filter {
    this.filteredServers = this.filteredServers.filter(
      (server) => new Date(server.attributes.created_at) < date
    );
    return this;
  }

  public createdAfter(date: Date): Filter {
    this.filteredServers = this.filteredServers.filter(
      (server) => new Date(server.attributes.created_at) > date
    );
    return this;
  }

  public get(): Server[] {
    return this.filteredServers;
  }

  public first(): Server | undefined {
    return this.filteredServers[0];
  }

  public last(): Server | undefined {
    return this.filteredServers[this.filteredServers.length - 1];
  }

  public count(): number {
    return this.filteredServers.length;
  }
}
