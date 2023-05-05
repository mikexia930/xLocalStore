import {
  EnumOperateType,
  IFSetParam,
  IFIndexParam,
  IFClass
} from './config';

export default class UseIndexedDB implements IFClass {

  version = 0;

  dbName: string;

  constructor(dbName) {
    this.dbName = dbName;
    if (!this.isSupport) {
      throw Error('Browser not support indexDB.');
    }
  }

  isSupport() {
    return !!window.indexedDB;
  }

  connect(version = 0) {
    return new Promise((resolve, reject) => {
      if (this.isSupport()) {
        if (version) {
          this.version = version;
        }
        const request = window.indexedDB.open(this.dbName, this.version);
        request.onblocked = () => {
          alert('Close other Tab for change version');
        }
        request.onerror = (e: any) => {
          console.log('e', e);
          reject(e);
        }
        if (version) {
          request.onupgradeneeded = (e: any) => {
            resolve(e.target.result);
          }
        } else {
          request.onsuccess = () => {
            resolve(request.result);
          }
        }
      }
    })
  }

  checkTableIsExists(tableName: string, version: number) {
    return new Promise((resolve, reject) => {
      this.connect(version).then((db: any) => {
        let isContain = false;
        if (db.objectStoreNames.contains(tableName)) {
          isContain =  true;
        }
        resolve({db , isContain});
      }).catch((e) => {
        reject(e);
      })
    })
  }

  createTable(version: number, tableName: string, keyPath: string, index: IFIndexParam[] = []) {
    return new Promise((resolve, reject) => {
      this.checkTableIsExists(tableName, version).then((result: any) => {
        const { db, isContain } = result;
        if (!isContain) {
          let useKeyPath;
          if (keyPath === 'autoIncrement') {
            useKeyPath = { autoIncrement: true };
          } else {
            useKeyPath = { keyPath }
          }
          const objectStore = db.createObjectStore(tableName, useKeyPath);
          if (index.length > 0) {
            index.forEach((indexItem) => {
              objectStore.createIndex(indexItem.name, indexItem.keyPath, indexItem.option || {})
            })
          }
        }
        resolve(true);
      }).catch((e) => {
        reject(e);
      })
    })
  }

  /**
   * 获取事务
   * @param tableNames
   * @param operate
   */
  getTransaction(tableName: string, operate: EnumOperateType) {
    return new Promise((resolve, reject) => {
      this.connect().then((db: any) => {
        const trans = db.transaction([tableName], operate);
        trans.onerror = (e) => {
          reject(e);
        }
        resolve(trans.objectStore(tableName));
      })
    })
  }

  /**
   * 获取条目数据
   * @param tableName
   * @param value 需要查询的值
   * @param keyPath
   */
  get(tableName: string, value: string, keyPath = '') {
    return new Promise((resolve, reject) => {
      this.getTransaction(tableName, EnumOperateType.ReadOnly).then((objectStore: any) => {
        let request;
        if (keyPath) {
          const index = objectStore.index(keyPath);
          request = index.get(value);
        } else {
          request = objectStore.get(value);
        }
        request.onsuccess = (e) => {
          resolve(e.target.result)
        };
        request.onerror = (e) => {
          reject(e)
        };
      })
    })
  }

  /**
   * 存在则更新，不存在则新增
   * @param tableName
   * @param values
   */
  set(tableName, values: IFSetParam[]) {
    return new Promise((resolve) => {
      this.getTransaction(tableName, EnumOperateType.ReadWrite).then((objectStore: any) => {
        const result = {
          success: [],
          failed: []
        }
        values.forEach((value) => {
          const request = objectStore.put(value);
          request.onsuccess = () => {
            result.success.push(value);
          };
          request.onerror = () => {
            result.failed.push(value);
          };
        })
        resolve(result);
      })
    })
  }

  /**
   * 新增条目
   * @param tableName
   * @param keys
   */
  add(tableName, values: IFSetParam[]) {
    return new Promise((resolve) => {
      this.getTransaction(tableName, EnumOperateType.ReadWrite).then((objectStore: any) => {
        const result = {
          success: [],
          failed: []
        }
        values.forEach((value) => {
          const request = objectStore.add(value);
          request.onsuccess = () => {
            result.success.push(value);
          };
          request.onerror = () => {
            result.failed.push(value);
          };
        })
        resolve(result);
      })
    })
  }

  /**
   * 删除条目
   * @param tableName
   * @param keys
   */
  delete(tableName, keys: string[]) {
    return new Promise((resolve) => {
      this.getTransaction(tableName, EnumOperateType.ReadWrite).then((objectStore: any) => {
        const result = {
          success: [],
          failed: []
        }
        keys.forEach((key) => {
          const request = objectStore.delete(key);
          request.onsuccess = () => {
            result.success.push(key);
          };
          request.onerror = () => {
            result.failed.push(key);
          };
        })
        resolve(result);
      })
    })
  }

  /**
   * 清空 objectStore
   * @param tableName
   */
  clear(tableName) {
    return new Promise((resolve, reject) => {
      this.getTransaction(tableName, EnumOperateType.ReadWrite).then((objectStore: any) => {
        const request = objectStore.clear();
        request.onsuccess = () => {
          resolve(true);
        };
        request.onerror = () => {
          reject(false);
        };
      })
    })
  }

  /**
   * 读取全部 objectStore
   * @param tableName
   */
  getAll(tableName: string) {
    return new Promise((resolve, reject) => {
      this.getTransaction(tableName, EnumOperateType.ReadOnly).then((objectStore: any) => {
        let result = [];
        let request;
        if (objectStore.getAll) {
          request = objectStore.getAll()
          request.onsuccess = e => {
            result = e.target.result;
            resolve(result);
          };
          request.onerror = e => {
            reject(e);
          };
        } else {
          request = objectStore.openCursor()
          request.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
              result.push(cursor.value);
              cursor.continue();
            } else {
              resolve(result);
            }
          };
          request.onerror = e => {
            reject(e);
          };
        }
      })
    })
  }
}
