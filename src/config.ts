const {
  VITE_CHAIN_ID,
  VITE_CHAIN_NAME,
  VITE_CHAIN_WS_RPC,
  VITE_CHAIN_JSON_RPC,
  VITE_REALM_PATH,
  VITE_REALM_JSON_PATH
} = import.meta.env;

if (!VITE_CHAIN_ID) {
  throw new Error('VITE_CHAIN_ID property not found in .env');
}

if (!VITE_CHAIN_NAME) {
  throw new Error('VITE_CHAIN_NAME property not found in .env');
}

if (!VITE_CHAIN_WS_RPC) {
  throw new Error('VITE_CHAIN_WS_RPC property not found in .env');
}

if (!VITE_CHAIN_JSON_RPC) {
  throw new Error('VITE_CHAIN_JSON_RPC property not found in .env');
}

if (!VITE_REALM_PATH) {
  throw new Error('VITE_REALM_PATH property not found in .env');
}

if (!VITE_REALM_JSON_PATH) {
  throw new Error('VITE_REALM_JSON_PATH property not found in .env');
}

export default {
  CHAIN_ID: VITE_CHAIN_ID,
  CHAIN_NAME: VITE_CHAIN_NAME,
  CHAIN_WS_RPC: VITE_CHAIN_WS_RPC,
  CHAIN_JSON_RPC: VITE_CHAIN_JSON_RPC,
  REALM_PATH: VITE_REALM_PATH,
  REALM_JSON_PATH: VITE_REALM_JSON_PATH
};
