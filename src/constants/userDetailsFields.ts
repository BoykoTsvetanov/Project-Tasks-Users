import type { User } from "../types";

export const userDetailsFields: {
  label: string;
  getValue: (user: User) => string;
}[] = [
  {
    label: "Email",
    getValue: (user) => user.email,
  },
  {
    label: "Phone",
    getValue: (user) => user.phone,
  },
  {
    label: "Website",
    getValue: (user) => user.website,
  },
  {
    label: "Address",
    getValue: (user) =>
      `${user.address.street}, ${user.address.suite}, ${user.address.city}`,
  },
  {
    label: "Company",
    getValue: (user) => user.company.name,
  },
];
