export const FILE_CONSTANTS = {
  LIMIT_PER_COLLECTION: 200,

  GIPHY_PER_REQUEST: 10,
  LINKS_PER_REQUEST: 10,

  // 20 mb
  FILE_MAX_SIZE: 20 * 1024 * 1024,

  PRESIGN_PUT_EXPIRES_IN: 60,
  PRESIGN_GET_EXPIRES_IN: 12 * 3600,

  LINK_REGEX:
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,512}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/,
  FILE_REGEX:
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,512}\.[a-zA-Z0-9()]{1,6}(\/[-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)*\/[^\/]+\.gif\b/,
};
