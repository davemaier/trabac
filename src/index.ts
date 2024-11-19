// Define the configuration object type
export type Config = {
  [K in string]: {
    [P in string]: readonly (keyof any)[];
  };
};

// Utility type to get all permission keys
type PermissionKeys<C extends Config> = {
  [K in keyof C]: keyof C[K];
}[keyof C];

// Utility type to get allowed fields based on permissions
type FieldsForPermissions<
  C extends Config,
  K extends keyof C,
  P extends readonly (keyof C[K])[],
> = C[K][P[number]][number];

// Utility type to get allowed fields based on roles
type FieldsForRole<
  C extends Config,
  K extends keyof C,
  Role extends keyof R,
  R extends { [role: string]: readonly PermissionKeys<C>[] },
> = C[K][Extract<keyof C[K], R[Role][number]>][number];

// Utility type to pick allowed fields from an object
type PickAllowed<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Define the Roles type using satisfies to ensure only valid permissions are used
export type Roles<C extends Config> = {
  [role: string]: readonly PermissionKeys<C>[];
};

// The PermissionFilter class
export class PermissionFilter<
  C extends Config,
  TM extends { [K in keyof C]: any },
  R extends { [role: string]: readonly PermissionKeys<C>[] },
> {
  constructor(
    private config: C,
    private roles: R,
  ) {}

  // Overloaded methods for filtering by permissions or role
  filter<K extends keyof C & keyof TM, P extends readonly (keyof C[K])[]>(
    key: K,
    source: TM[K],
    permissions: P,
  ): PickAllowed<TM[K], FieldsForPermissions<C, K, P>>;

  filter<K extends keyof C & keyof TM, Role extends keyof R>(
    key: K,
    source: TM[K],
    role: Role,
  ): PickAllowed<TM[K], FieldsForRole<C, K, Role, R>>;

  filter(key: any, source: any, permissionsOrRole: any): any {
    let permissions: readonly string[];
    if (typeof permissionsOrRole === "string") {
      const rolePermissions = this.roles[permissionsOrRole];
      permissions = rolePermissions.filter(
        (p: string) => p in this.config[key],
      );
    } else {
      permissions = permissionsOrRole;
    }

    const allowedFields = permissions.flatMap(
      (p: string) => this.config[key][p],
    ) as Array<string>;
    const result = {} as any;
    for (const field of allowedFields) {
      if (field in source) {
        result[field] = source[field];
      }
    }
    return result;
  }
}
