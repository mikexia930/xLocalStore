<template>
  <div class="main">
    <div class="input_area">
      <h3>录入内容</h3>
      <div class="input_content">
        <a-input v-model:value="data.cur.input"/>
        <span style="margin-left: 8px">
          <a-button @click="handleInput">录入</a-button>
        </span>
      </div>
    </div>
    <div class="show_area">
      <div class="show_area_title">
        <h3>数据展示</h3>
        <a-button size="small" @click="handleClear">清空</a-button>
      </div>
      <ul>
        <li v-for="(text) in data.list">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div>{{ text.index }}</div>
            <div>{{ text.title }}</div>
            <div>{{ text.time }}</div>
          </div>
          <div style="display: flex; justify-content: space-between">
            <a-button size="small" @click="handleEdit(text.index)">修改</a-button>
            <a-button size="small" @click="handleDel(text.index)">删除</a-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import xLocalStore from '../packages/xLocalStore/src/index';
import {
  type IFConfig as XLocalStoreIFConfig,
  EnumStoreType as XLocalStoreEnumStoreType,
} from '../packages/xLocalStore/src/libs/config';

const data = reactive<any>({
  cur: {
    input: '',
    index: '',
    time: ''
  },
  list: []
});

const storeConfig: Partial<XLocalStoreIFConfig> = {
  dbName: 'testStore',
  tableName: 'testStoreTable',
  useStores: [ XLocalStoreEnumStoreType.INDEXEDDB, XLocalStoreEnumStoreType.LOCALSTORAGE ]
}
const storeIns = new xLocalStore(storeConfig);

storeIns.createTable('index', [
  {
    name: 'index',
    keyPath: 'index'
  },
  {
    name: 'title',
    keyPath: 'title'
  },
  {
    name: 'time',
    keyPath: 'time'
  }
]);

function getStoreData() {
  storeIns.getAll().then((result: any) => {
    data.list = result;
  })
}

getStoreData();

function handleInput() {
  if (data.cur.input.trim()) {
    const date = new Date();
    let storeResult;
    if (data.cur.index) {
      storeResult = storeIns.set([
        {
          index: data.cur.index,
          title: data.cur.input,
          time: data.cur.time
        }
      ]);
    } else {
      storeResult = storeIns.add([
        {
          index: date.getTime(),
          title: data.cur.input,
          time: `${ date.getFullYear() }-${ date.getMonth() + 1 }-${ date.getDate() }`
        }
      ]);
    }
    storeResult.then(() => {
      data.cur.input = '';
      data.cur.time = '';
      data.cur.index = '';
      getStoreData();
    })
  }
}

function handleEdit(index: string) {
  storeIns.get(index).then((result: any) => {
    data.cur.index = index;
    data.cur.input = result.title;
    data.cur.time = result.time;
  });
}

function handleDel(index: string) {
  storeIns.delete([index]).then(() => {
    getStoreData();
  });
}

function handleClear() {
  storeIns.clear().then(() => {
    getStoreData();
  });
}
</script>

<style scoped>
.main {
  margin: 100px auto;
  width: 1000px;
}
.input_area {
  margin-bottom: 32px;
  border-bottom: 1px solid #e1e1e1;
}
.input_content {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-bottom: 16px;
}
.show_area_title {
  display: flex;
  justify-content: space-between;
}
.show_area > ul {
  padding: 0;
  list-style: circle;
}
.show_area > ul > li {
  list-style: circle;
  height: 36px;
  line-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px dashed #f1f1f1;
}
.show_area > ul > li > div:nth-child(1) {
  width: 930px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.show_area > ul > li > div:nth-child(2) {
  width: 50px;
}
</style>
