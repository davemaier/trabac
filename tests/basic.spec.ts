import { expect, test } from "bun:test";
import { Config, PermissionFilter, Roles } from "../src/";

test("Filter with role", () => {
  const config = {
    User: {
      viewName: ["firstName", "lastName"] as const,
      viewEmail: ["email"] as const,
    },
    Product: {
      viewPrice: ["price"] as const,
      viewDescription: ["description"] as const,
    },
  } as const satisfies Config;

  const roles = {
    admin: ["viewName", "viewEmail", "viewPrice", "viewDescription"],
    user: ["viewName", "viewEmail", "viewPrice"],
  } as const satisfies Roles<typeof config>;

  const permissionFilter = new PermissionFilter(config, roles);

  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    age: 30,
  };

  const filteredUser = permissionFilter.filter("User", user, "admin");

  expect(filteredUser).toEqual({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  });
});

test("Filter with permissions", () => {
  const config = {
    User: {
      viewName: ["firstName", "lastName"] as const,
      viewEmail: ["email"] as const,
    },
    Product: {
      viewPrice: ["price"] as const,
      viewDescription: ["description"] as const,
    },
  } as const satisfies Config;

  const permissionFilter = new PermissionFilter(config, {});

  const product = {
    name: "Smartphone",
    price: 599.99,
    description: "Latest model with advanced features",
    sku: "SM-12345",
    stock: 50,
  };

  const filteredProduct = permissionFilter.filter("Product", product, [
    "viewPrice",
    "viewDescription",
  ]);

  expect(filteredProduct).toEqual({
    price: 599.99,
    description: "Latest model with advanced features",
  });
});
