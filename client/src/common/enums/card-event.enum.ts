const CardEvent = {
  CREATE: "card:create",
  REORDER: "card:reorder",
  RENAME: "card:rename", 
  CHANGE_DESCRIPTION: "card:change-description",
  DELETE: "card:delete",
  CREATE_COPY: "card:copy",
} as const;

export { CardEvent };
