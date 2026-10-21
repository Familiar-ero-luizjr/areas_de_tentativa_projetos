export const authFixtures = {
  client: { uid: "client-001", email: "mariana.souza@example.com", displayName: "Mariana Souza", roles: ["cliente"] },
  lawyer: { uid: "lawyer-001", email: "ana.silva@example.com", displayName: "Ana Silva", roles: ["advogado"] },
  admin: { uid: "admin-001", email: "patricia.admin@example.com", displayName: "Patrícia Admin", roles: ["admin"] },
} as const;
