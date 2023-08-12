<template>
  <div>
    <div class="view-box">
      <div class="view-box-item">
        <el-input v-model="fromStr" class="edit-view view-from" type="textarea" resize="none" @change="fromChangeEvent"/>
      </div>
      <div class="view-box-item">
        <el-input v-model="toStr" class="edit-view view-to" type="textarea" resize="none" readonly/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {ToStruct} from "./viewLib/toStruct";
// 定义输入框内容变量
const fromStr = ref()
const toStr = ref()
// 调用转换
const fromChangeEvent = function () {
  toStr.value = new ToStruct(fromStr.value).getTo()
}
</script>

<style>
  .edit-view {
    height: 100%;
  }
  .edit-view > textarea {
    height: 100%;
  }

  .view-box {
    height: 100vh;
    display: flex;
  }

  .view-box-item {
    padding: 5px;
    flex: 1;
  }

  .view-to > textarea {
    box-shadow: none;
  }
</style>
