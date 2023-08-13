<template>
  <div>
    <div class="view-box">
      <div class="view-box-item">
        <Codemirror
            :options="fromEditOption"
            border
            @change="fromChangeEvent"
            class="edit-view view-from"
        >
        </Codemirror>
      </div>
      <div class="view-box-item">
        <Codemirror
            v-model:value="toStr"
            :options="{ mode: 'text/x-go', theme: 'default' }"
            border
            class="edit-view view-to"
        >
        </Codemirror>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {ToStruct} from "./viewLib/toStruct";
import {ElNotification} from "element-plus";
import "codemirror/mode/javascript/javascript.js"
import "codemirror/mode/go/go.js"
import "codemirror/mode/sql/sql.js"
import Codemirror from "codemirror-editor-vue3"
import {StrType} from "./viewLib/strType";
// 定义输入框内容变量
// const fromStr = ref()
const fromEditOption = ref()
const toStr = ref()
// 调用转换
const fromChangeEvent = function (val: string) {
  let text = val
  if (text == "" || text == "null" || !text) {
    toStr.value = ""
    return
  }
  try {
    let toStruct = new ToStruct(text)

    switch (toStruct.getStrType()) {
      case StrType.TableSql:
        fromEditOption.value = { mode: 'text/x-sql', theme: 'default' }
        break
      case StrType.Json:
        fromEditOption.value = { mode: 'text/javascript', theme: 'default' }
    }

    toStr.value = toStruct.getTo()
  } catch (e) {
    if (e instanceof Error) {
      ElNotification({
        title: "ERROR!!!",
        message: e.message,
        position: 'bottom-right',
        duration: 0,
      })
    }
  }
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
