<template>
  <div>
    <div id="top-bar">
      <div id="top-bar-msg">
        <div class="notice-view">{{ topMsg }}</div>
      </div>

      <div id="top-bar-body">
        <el-tooltip
            class="box-item noDrag"
            effect="dark"
            content="关闭此应用"
            placement="bottom"
        >
          <el-icon class="noDrag" @click="windowsClose"><i class="ri-close-line" /></el-icon>
        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="最大化"
            placement="bottom"
        >
          <el-icon class="noDrag" @click="windowsMax"><i class="ri-arrow-up-s-fill" /></el-icon>
        </el-tooltip>
        <el-tooltip
            class="box-item"
            effect="dark"
            content="最小化"
            placement="bottom"
        >
          <el-icon class="noDrag" @click="windowsMin"><i class="ri-arrow-down-s-fill"/></el-icon>
        </el-tooltip>

      </div>
    </div>
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
import {ipcRenderer} from "electron";
import {useDark, useToggle} from "@vueuse/core";
// 处理放大缩小
const isFullScreen = ref(false)

const windowsMin = () => {
  ipcRenderer.send('windows-min');
}

const windowsMax = () => {
  ipcRenderer.send('windows-max');
}

const windowsClose = () => {
  ipcRenderer.send("windows-close")
}

const windowsFullScreen = () => {
  isFullScreen.value = !isFullScreen.value
  ipcRenderer.send("windows-full-screen")
}

const isDark = useDark()
const toggleDark = useToggle(isDark)
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

    ViewTopMsg(`输入数据类型: ${toStruct.getStrTypeName()}`)

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

// enum topMsgMode {
//   Success,
//   Error,
//   Waning
// }

const topMsg = ref<string>()

const ViewTopMsg = (msg: string) => {
  topMsg.value = msg
  setTimeout(() => {
    topMsg.value = ""
  }, 3 * 1000)
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
    height: calc(100vh - 24px - 6px);
    display: flex;
  }

  .view-box-item {
    padding: 2px 5px 5px 5px;
    flex: 1;
  }

  .view-to > textarea {
    box-shadow: none;
  }

  .notice-view {
    width: 100%;
    padding: 0 5px;
    border-radius: 5px;
    white-space: nowrap; /* 防止文字换行 */
  }

  #top-bar {
    -webkit-app-region: drag;
    display: flex;
    height: 24px;
  }

  #top-bar-msg {
    padding: 0 5px;
    width: 50%;
    overflow: hidden;
    transition: .4s all!important;
  }

  #top-bar-body {
    width: 50%;
    direction: rtl;
    padding-right: 5px;
  }

  #top-bar-body .el-icon{
    -webkit-app-region: no-drag;
    cursor: pointer;
    margin: 0 0 0 10px;
  }

  #top-bar-icon .el-icon {
    -webkit-app-region: no-drag;
    cursor: pointer;
    margin: 0 10px 0 0;
  }
</style>
