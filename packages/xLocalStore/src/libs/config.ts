export enum EnumStoreType {
  INDEXEDDB = 'indexedDB',
  LOCALSTORAGE = 'localstorage'
}

export interface IFConfig {
  dbName: string;
  tableName: string;
  useStores: EnumStoreType[];
}

export interface IFClass {
  isSupport: Function;
  createTable: Function;
  get: Function;
  getAll: Function;
  set: Function;
  add: Function;
  delete: Function;
  clear: Function;
}

export enum EnumOperateType {
  ReadOnly = 'readonly',
  ReadWrite = 'readwrite'
}

export interface IFIndexParam {
  name: string;
  keyPath: string;
  option?: {
    unique: boolean
  }
}

export interface IFSetParam {}
