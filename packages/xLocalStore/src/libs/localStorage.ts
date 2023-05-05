import { IFClass, IFSetParam} from './config';

export default class UseLocalStorage implements IFClass {

  dbName: string;

  tableKeyPath = {};

  constructor(dbName) {
    this.dbName = dbName;
    if (!this.isSupport) {
      throw Error('Browser not support LocalStorage.');
    }
  }

  isSupport() {
    return !!window.localStorage;
  }

  createTable(version, tableName: string, keyPath: string) {
    return new Promise((resolve) => {
      this.tableKeyPath[tableName] = keyPath;
      resolve(true);
    })
  }

  _get(key: string) {
    return localStorage.getItem(key);
  }

  _set(key: string, value: string) {
    return localStorage.setItem(key, value);
  }

  _getDBData() {
    return new Promise((resolve, reject) => {
      try {
        let useData = {};
        const storageData = this._get(this.dbName);
        if (storageData) {
          try {
            useData = JSON.parse(storageData);
          } catch (e) {
            useData = {}
          }
        }
        resolve(useData);
      } catch (e) {
        reject(e);
      }
    })
  }

  _setDBData(data) {
    return new Promise((resolve, reject) => {
      try {
        this._set(this.dbName, JSON.stringify(data));
        resolve('');
      } catch (e) {
        reject(e);
      }
    })
  }

  get(tableName: string, value: string, keyPath = '') {
    return new Promise((resolve, reject) => {
      this._getDBData().then((result) => {
        const useData = result;
        const useTableData = useData[tableName] || [];
        const useKeyPath = keyPath || this.tableKeyPath[tableName];
        let getValue;
        useTableData.forEach((item) => {
          if (item[useKeyPath] === value) {
            getValue = item;
          }
        });
        resolve(getValue);
      }).catch((e) => {
        reject(e);
      })
    });
  }

  getAll(tableName: string) {
    return new Promise((resolve, reject) => {
      this._getDBData().then((result) => {
        resolve(result?.[tableName] || '');
      }).catch((e) => {
        reject(e);
      })
    });
  }

  set(tableName: string, values: IFSetParam[]) {
    return new Promise((resolve, reject) => {
      this._getDBData().then((result) => {
        const useData = result;
        const useTableData = useData[tableName] || [];
        const useKeyPath = this.tableKeyPath[tableName];
        const existsKeyPathValues = [];
        useTableData.forEach((item) => {
          existsKeyPathValues.push(item[useKeyPath]);
        });
        values.forEach((item) => {
          const existsIndex = existsKeyPathValues.indexOf(item[useKeyPath]);
          if (existsIndex > -1) {
            useTableData[existsIndex] = item;
          } else {
            useTableData.push(item);
          }
        })
        useData[tableName] = useTableData;
        this._setDBData(useData).then(() => {
          resolve(true)
        }).catch((e) => {
          reject(e);
        })
      }).catch((e) => {
        reject(e);
      })
    })
  }

  add(tableName: string, values: IFSetParam[]) {
    return new Promise((resolve, reject) => {
      this._getDBData().then((result) => {
        const useData = result;
        const useTableData = useData[tableName] || [];
        const existsKeyPathValues = [];
        const keyPath = this.tableKeyPath[tableName];
        useTableData.forEach((item) => {
          existsKeyPathValues.push(item[keyPath]);
        });
        values.forEach((item) => {
          if (!existsKeyPathValues.includes(item[keyPath])) {
            useTableData.push(item);
          }
        })
        useData[tableName] = useTableData;
        this._setDBData(useData).then(() => {
          resolve(true)
        }).catch((e) => {
          reject(e);
        })
      }).catch((e) => {
        reject(e);
      })
    })
  }

  delete(tableName: string, keys: string[]) {
    return new Promise((resolve, reject) => {
      this._getDBData().then((storeData) => {
        const useData = [];
        const useTableData = storeData[tableName] || [];
        const useKeyPath = this.tableKeyPath[tableName];
        useTableData.forEach((item) => {
          if (!keys.includes(item[useKeyPath])) {
            useData.push(item);
          }
        });
        storeData[tableName] = useData;
        this._setDBData(storeData).then(() => {
          resolve('');
        }).catch((e) => {
          reject(e);
        })
      }).catch((e) => {
        reject(e);
      })
    })
  }

  clear(tableName: string) {
    return new Promise((resolve, reject) => {
      this._getDBData().then((result) => {
        const useDBData = { ...result };
        delete useDBData[tableName];
        this._setDBData(useDBData).then(() => {
          resolve('');
        }).catch((e) => {
          reject(e);
        })
      }).catch((e) => {
        reject(e);
      })
    })
  }
}
