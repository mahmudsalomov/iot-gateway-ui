export const BASE_PATH = "http://localhost:9339/api/gateway/protocol";

// ***********Modbus Clients**********
export const GET_ALL_MODBUS_CLIENT = BASE_PATH + "/modbus/client/all";
export const SAVE_MODBUS_CLIENT = BASE_PATH + "/modbus/client";
export const EDIT_MODBUS_CLIENT = BASE_PATH + "/modbus/client";
export const DELETE_MODBUS_CLIENT = BASE_PATH + "/modbus/client/";
export const GET_ID_MODBUS_CLIENT = BASE_PATH + "/modbus/client/";
export const IS_CONNECT_ID_MODBUS_CLIENT = BASE_PATH + "/modbus/client/isConnect/";

// ***********Modbus Items**********
export const GET_ALL_MODBUS_ITEM = BASE_PATH + "/modbus/item";
export const GET_BY_MC_ID_MODBUS_ITEM = BASE_PATH + "/modbus/item/get-by-modbusc/";
export const SAVE_MODBUS_ITEM = BASE_PATH + "/modbus/item";
export const DELETE_MODBUS_ITEM = BASE_PATH + "/modbus/item/";
export const EDIT_MODBUS_ITEM = BASE_PATH + "/modbus/item";

//**********Register Type **********
export const GET_ALL_REGISTER_TYPE = BASE_PATH+"/modbus/register-type/all";

//**********Register Var Type **********
export const GET_ALL_REGISTER_VAR_TYPE = BASE_PATH+"/modbus/registerVar-type/all";