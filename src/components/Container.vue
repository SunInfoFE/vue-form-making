<template>
  <section class="s-container">
        <aside class="s-aside" style="width: 300px;">
          <div class="components-list">
            <div class="widget-cate">基础字段</div>
            <draggable element="ul" :list="basicComponents" 
              :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
              @end="handleMoveEnd"
              @start="handleMoveStart"
              :move="handleMove"
            >
              <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index">
                <a>
                  <icon class="icon" :name="item.icon"></icon>
                  <span>{{item.name}}</span>
                </a>
              </li>
            </draggable>

            <div class="widget-cate">高级字段</div>
            <draggable element="ul" :list="advanceComponents" 
              :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
              @end="handleMoveEnd"
              @start="handleMoveStart"
              :move="handleMove"
            >
              
              <li class="form-edit-widget-label" v-for="(item, index) in advanceComponents" :key="index">
                <a>
                  <icon class="icon" :name="item.icon"></icon>
                  <span>{{item.name}}</span>
                </a>
              </li>
            </draggable>
            
            <div class="widget-cate">布局字段</div>
            <draggable element="ul" :list="layoutComponents" 
              :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
              @end="handleMoveEnd"
              @start="handleMoveStart"
              :move="handleMove"
            >
              
              <li class="form-edit-widget-label data-grid" v-for="(item, index) in layoutComponents" :key="index">
                <a>
                  <icon class="icon" :name="item.icon"></icon>
                  <span>{{item.name}}</span>
                </a>
              </li>
            </draggable>
          </div>
        </aside>
        <section class="s-container center-container is-vertical">
            <header class="s-header btn-bar" style="height: 45px;">
              <s-button type="cancel" @click="handleGoGithub">GitHub</s-button>
              <s-button type="cancel" icon="eye" @click="handlePreview">预览</s-button>
              <s-button type="cancel" icon="info" @click="handleGenerateJson">生成JSON</s-button>
              <s-button type="cancel" icon="order-track" @click="handleGenerateCode">生成代码</s-button>
            </header>
            <main class="s-main">
              <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
            </main>
        </section>
        <aside class="s-aside widget-config-container" style="width: 300px;">
            <section class="s-container is-vertical">
            <header class="s-header" style="height:45px">
              <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
              <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
            </header>
            <main class="s-main config-content">
              <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
              <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
            </main>
          </section>
        </aside>
        <cus-dialog
          :visible="previewVisible"
          @on-close="previewVisible = false"
          ref="widgetPreview"
          @on-submit="handleTest"
          width="1000px"
        >
          <generate-form :data="widgetForm" :remote="remoteFuncs" :value="widgetModels" ref="generateForm">

            <template slot="blank" slot-scope="scope">
              宽度：<s-input v-model="scope.model.blank.width" style="width: 100px"></s-input>
              高度：<s-input v-model="scope.model.blank.height" style="width: 100px"></s-input>
            </template>
          </generate-form>
        </cus-dialog>

        <cus-dialog
          :visible="jsonVisible"
          @on-close="jsonVisible = false"
          ref="jsonPreview"
          width="800px"
          form
        >
          <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>
          
          <template slot="action">
            <s-button id="copybtn" data-clipboard-target=".ace_text-input">双击复制</s-button>
          </template>
        </cus-dialog>

        <cus-dialog
          :visible="codeVisible"
          @on-close="codeVisible = false"
          ref="codePreview"
          width="800px"
          form
          :action="false"
        >
          <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
        </cus-dialog>
  </section>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
// import JSONEditor from 'jsoneditor'
// import 'jsoneditor/dist/jsoneditor.min.css'
import Clipboard from 'clipboard'
import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js'
import {loadJs, loadCss} from '../util/index.js'
import request from '../util/request.js'
import generateCode from './generateCode.js'

export default {
  name: 'fm-making-form',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'left'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      remoteFuncs: {
        func_test (resolve) {
          setTimeout(() => {
            const options = [
              {id: '1', name: '1111'},
              {id: '2', name: '2222'},
              {id: '3', name: '3333'}
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken (resolve) {
          request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
            resolve(res.uptoken)
          })
        }
      },
      widgetModels: {
        key1: '啦啦啦啦啦',
        key2: '选项2'
      },
      blank: '',
      htmlTemplate: '',
      jsonTemplate: ''
    }
  },
  mounted () {
    // loadCss('https://unpkg.com/jsoneditor/dist/jsoneditor.min.css')
    // loadJs('https://unpkg.com/jsoneditor/dist/jsoneditor.min.js')
    loadJs('lib/ace/src/ace.js')
  },
  methods: {
    handleGoGithub () {
      window.location.href = 'https://github.com/GavinZhuLei/vue-form-making'
    },
    handleConfigSelect (value) {
      this.configTab = value;
    },
    handleMoveEnd (evt) {
      console.log('end', evt)
    },
    handleMoveStart ({oldIndex}) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove () {
      return true
    },
    handlePreview () {
      this.previewVisible = true;
    },
    handleTest () {
      this.$refs.generateForm.getData().then(data => {
        console.log('form', data)
        this.$alert(data, '').catch(e=>{})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        console.log(e)
        this.$refs.widgetPreview.end()
      })
    },
    handleGenerateJson () {
      console.log(JSON.stringify(this.widgetForm))
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {

        const editor = ace.edit('jsoneditor')
        editor.session.setMode("ace/mode/json")

        const btnCopy = new Clipboard('#copybtn')
      })
    },
    handleGenerateCode () {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode("ace/mode/html")
      })
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function (val) {
        console.log('######', val)
        console.log(this.$refs.widgetForm)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/cover.scss';
@import '../styles/index.scss';

</style>
