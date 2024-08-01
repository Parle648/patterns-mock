const CardEvent = {
  CREATE: "card:create", 
  REORDER: "card:reorder",
  DELETE: "card:delete",
  RENAME: "card:rename", 
  CHANGE_DESCRIPTION: "card:change-description",
  CREATE_COPY: "card:copy",
} as const;

export { CardEvent };
