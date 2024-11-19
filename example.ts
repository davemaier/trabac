import { Config, PermissionFilter, Roles } from ".";

// Usage example:
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

// Define roles using 'satisfies' to ensure only valid permissions are used
const roles = {
  admin: ["viewName", "viewEmail", "viewPrice", "viewDescription"],
  user: ["viewName", "viewEmail", "viewPrice"],
} as const satisfies Roles<typeof config>;

// Instantiate the PermissionFilter with your config and roles
const permissionFilter = new PermissionFilter(config, roles);

// Create a User object
const user = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  age: 30,
};

// Filter the user object based on the 'admin' role
const filteredUser = permissionFilter.filter("User", user, "admin");

// Create a Product object
const product = {
  name: "Smartphone",
  price: 599.99,
  description: "Latest model with advanced features",
  sku: "SM-12345",
  stock: 50,
};

// Filter the product object based on permissions
const filteredProduct = permissionFilter.filter("Product", product, [
  "viewPrice",
  "viewDescription",
]);

// Output the filtered user and product
console.log(filteredUser);
// Output: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }

console.log(filteredProduct);
// Output: { price: 599.99, description: 'Latest model with advanced features' }
