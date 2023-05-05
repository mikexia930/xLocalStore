# xLocalStore
>
>客户端数据存储封装，默认如果不支持 IndexedDB 会使用 LocalStorage，也可以自动移设置存储引擎。
>
>
[Demo](https://mikexia930.github.io/xLocalStore/)
## 版本
- v1.0.0

## 基于
- IndexedDB
- LocalStorage

## 安装
```
npm install x-localstore
```
或者
```
github下载源码
```

## 使用
**直接用script引入**
```
<script src="xLocalstore/dist/xlocalstore.umd.js"></script>
```
#### Vue示例

```
import xLocalStore from 'x-localstore';
```

**初始化**
```
const storeConfig = {
  dbName: '', // 可选，库名称
  tableName: '', // 可选，表名称
  useStores: [ 'indexedDB', 'localstorage' ], // 可选，选择存储引擎的顺序。不设置默认为 indexedDB/localstorage
}
const storeIns = new xLocalStore(storeConfig);
```

**创建数据表**
```
storeIns.createTable(keyPath, [
  {
    name: 'id',  // 字段名称
    keyPath: 'id' // 用于查询时候使用的字段名
  },
  {
    name: 'title',  // 字段名称
    keyPath: 'title' // 用于查询时候使用的字段名
  },
  {
    name: 'time',  // 字段名称
    keyPath: 'time' // 用于查询时候使用的字段名
  }
]);

说明：
keyPath: 当前表不重复值的字段名称，用于查询/更新/删除
```

**获取全量数据**
```
storeIns.getAll().then((result) => {
   console.log(result);
})
```

**获取指定数据**
```
storeIns.get(value, keyPath).then((result) => {
    console.log(result);
});

说明： 
value: 必填。查询的值
keyPath: 可选，查询的字段名，不填使用默认的字段
```

**添加数据**
```
如果和 createTable keyPath 重复的数据将不会被加入

storeIns.add([
    {
      id: '',
      title: '',
      time: ''
    }
]).then((result) => {
    console.log(result);
})

说明： 
result： 返回值，格式为 {
    success: [], // 成功的条目
    failed: [], // 失败的条目
}
```

**添加并更新数据**
```
storeIns.set([
    {
      id: '',
      title: '',
      time: ''
    }
]).then((result) => {
    console.log(result);
})

说明： 
result： 返回值，格式为 {
    success: [], // 成功的条目
    failed: [], // 失败的条目
}
```

**删除条目**
```
storeIns.delete([ value1, value2]).then((result) => {
    console.log(result);
})

说明： 
value: createTable keyPath 对应的条目值
```

**清空数据表**
```
storeIns.clear().then((result) => {
    console.log(result);
})
```

