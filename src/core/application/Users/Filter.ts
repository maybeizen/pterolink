import { User } from "./index";
import { UserAttributes, UserQueryParams } from "../../../types/Users";

export class Filter {
  private users: User[];
  private filteredUsers: User[];

  constructor(users: User[]) {
    this.users = users;
    this.filteredUsers = [...users];
  }

  public where(field: keyof UserAttributes, value: any): Filter {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => user.attributes[field] === value
    );
    return this;
  }

  public whereNot(field: keyof UserAttributes, value: any): Filter {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => user.attributes[field] !== value
    );
    return this;
  }

  public contains(field: keyof UserAttributes, value: string): Filter {
    this.filteredUsers = this.filteredUsers.filter((user) =>
      String(user.attributes[field]).toLowerCase().includes(value.toLowerCase())
    );
    return this;
  }

  public sort(
    field: keyof UserAttributes,
    order: "asc" | "desc" = "asc"
  ): Filter {
    this.filteredUsers.sort((a, b) => {
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
    this.filteredUsers = this.filteredUsers.slice(0, count);
    return this;
  }

  public offset(count: number): Filter {
    this.filteredUsers = this.filteredUsers.slice(count);
    return this;
  }

  public rootAdmins(): Filter {
    return this.where("root_admin", true);
  }

  public normalUsers(): Filter {
    return this.where("root_admin", false);
  }

  public with2FA(): Filter {
    return this.where("2fa", true);
  }

  public without2FA(): Filter {
    return this.where("2fa", false);
  }

  public createdBefore(date: Date): Filter {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => new Date(user.attributes.created_at) < date
    );
    return this;
  }

  public createdAfter(date: Date): Filter {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => new Date(user.attributes.created_at) > date
    );
    return this;
  }

  public get(): User[] {
    return this.filteredUsers;
  }

  public first(): User | undefined {
    return this.filteredUsers[0];
  }

  public last(): User | undefined {
    return this.filteredUsers[this.filteredUsers.length - 1];
  }

  public count(): number {
    return this.filteredUsers.length;
  }
}
