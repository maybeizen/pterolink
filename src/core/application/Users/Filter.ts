import { User } from "./index";
import { UserAttributes, UserQueryParams } from "../../../types/Users";

export class Filter {
  private users: User[];
  private filteredUsers: User[];

  constructor(users: User[]) {
    this.users = users;
    this.filteredUsers = [...users];
  }

  public where(field: keyof UserAttributes, value: any): User[] {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => user.attributes[field] === value
    );
    return this.filteredUsers;
  }

  public whereNot(field: keyof UserAttributes, value: any): User[] {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => user.attributes[field] !== value
    );
    return this.filteredUsers;
  }

  public contains(field: keyof UserAttributes, value: string): User[] {
    this.filteredUsers = this.filteredUsers.filter((user) =>
      String(user.attributes[field]).toLowerCase().includes(value.toLowerCase())
    );
    return this.filteredUsers;
  }

  public sort(
    field: keyof UserAttributes,
    order: "asc" | "desc" = "asc"
  ): User[] {
    this.filteredUsers.sort((a, b) => {
      const valueA = a.attributes[field] ?? "";
      const valueB = b.attributes[field] ?? "";

      if (order === "asc") {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      }
    });
    return this.filteredUsers;
  }

  public limit(count: number): User[] {
    this.filteredUsers = this.filteredUsers.slice(0, count);
    return this.filteredUsers;
  }

  public offset(count: number): User[] {
    this.filteredUsers = this.filteredUsers.slice(count);
    return this.filteredUsers;
  }

  public rootAdmins(): User[] {
    return this.where("root_admin", true);
  }

  public normalUsers(): User[] {
    return this.where("root_admin", false);
  }

  public with2FA(): User[] {
    return this.where("2fa", true);
  }

  public without2FA(): User[] {
    return this.where("2fa", false);
  }

  public createdBefore(date: Date): User[] {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => new Date(user.attributes.created_at) < date
    );
    return this.filteredUsers;
  }

  public createdAfter(date: Date): User[] {
    this.filteredUsers = this.filteredUsers.filter(
      (user) => new Date(user.attributes.created_at) > date
    );
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
