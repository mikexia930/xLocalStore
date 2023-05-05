import UseIndexedDB from './libs/indexedDB';
import UseLocalStorage from './libs/localStorage';
import {
  EnumStoreType,
  type IFConfig,
  type IFIndexParam,
  type IFSetParam
} from './libs/config';

class xLocalStore {
  storeIns: any;

  version = 1;

  dbName = 'x_db';

  tableName = 'x_table';

  useStores = [ EnumStoreType.INDEXEDDB, EnumStoreType.LOCALSTORAGE ];

  constructor(config: Partial<IFConfig>) {
    try {
      if (config?.dbName) {
        this.dbName = config.dbName;
      }
      if (config?.tableName) {
        this.tableName = config.tableName;
      }
      if (config?.useStores) {
        this.useStores = config.useStores;
      }
      for (let i=0; i<this.useStores.length; i+=1) {
        switch (this.useStores[i]) {
          case EnumStoreType.INDEXEDDB:
            this.storeIns = new UseIndexedDB(this.dbName);
            break;
          case EnumStoreType.LOCALSTORAGE:
            this.storeIns = new UseLocalStorage(this.dbName);
            break;
        }
        if (this.storeIns.isSupport()) {
          break;
        }
      }
    } catch (e: any) {
      throw new Error(e);
    }
    if (!this.storeIns.isSupport()) {
      throw new Error('browser not support');
    }
  }

  getVersion() {
    return this.version;
  }

  createTable(keyPath: string, index: Partial<IFIndexParam>[] = []) {
    this.storeIns.createTable(this.version + 1, this.tableName, keyPath, index);
  }

  set(values: IFSetParam[]) {
    return this.storeIns.set(this.tableName, values);
  }

  add(values: IFSetParam[]) {
    return this.storeIns.add(this.tableName, values);
  }

  get(value: string, keyPathValue: string = '') {
    return this.storeIns.get(this.tableName, value, keyPathValue);
  }

  getAll() {
    return this.storeIns.getAll(this.tableName);
  }

  delete(values: string[]) {
    return this.storeIns.delete(this.tableName, values);
  }

  clear() {
    return this.storeIns.clear(this.tableName);
  }
}

export default xLocalStore;
