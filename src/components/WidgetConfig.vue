<template>
  <div v-if="show">
    <s-form label-position="top">
      <s-form-item label="标题" v-if="data.type!='grid'">
        <s-input v-model="data.name"></s-input>
      </s-form-item>
      <s-form-item label="宽度" v-if="Object.keys(data.options).indexOf('width')>=0">
        <s-input v-model="data.options.width"></s-input>
      </s-form-item>

      <s-form-item label="大小" v-if="Object.keys(data.options).indexOf('size')>=0">
        宽度：<s-input style="width: 90px;" type="number" v-model.number="data.options.size.width"></s-input>
        高度：<s-input style="width: 90px;" type="number" v-model.number="data.options.size.height"></s-input>
      </s-form-item>
      
      <s-form-item label="占位内容" v-if="Object.keys(data.options).indexOf('placeholder')>=0 && (data.type!='time' || data.type!='date')">
        <s-input v-model="data.options.placeholder"></s-input>
      </s-form-item>
      <s-form-item label="布局方式" v-if="Object.keys(data.options).indexOf('inline')>=0">
        <s-radio-group v-model="data.options.inline">
          <s-radio-button :label="false">块级</s-radio-button>
          <s-radio-button :label="true">行内</s-radio-button>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="显示输入框" v-if="Object.keys(data.options).indexOf('showInput')>=0">
        <s-switch v-model="data.options.showInput" ></s-switch>
      </s-form-item>
      <s-form-item label="最小值" v-if="Object.keys(data.options).indexOf('min')>=0">
        <s-input-number v-model="data.options.min" :min="0" :max="100" :step="1"></s-input-number>
      </s-form-item>
      <s-form-item label="最大值" v-if="Object.keys(data.options).indexOf('max')>=0">
        <s-input-number v-model="data.options.max" :min="0" :max="100" :step="1"></s-input-number>
      </s-form-item>
      <s-form-item label="步长" v-if="Object.keys(data.options).indexOf('step')>=0">
        <s-input-number v-model="data.options.step" :min="0" :max="100" :step="1"></s-input-number>
      </s-form-item>
      <s-form-item label="是否多选" v-if="data.type=='select'">
        <s-switch v-model="data.options.multiple" @change="handleSelectMuliple"></s-switch>
      </s-form-item>
      <s-form-item label="允许半选" v-if="Object.keys(data.options).indexOf('allowHalf')>=0">
        <s-switch
            v-model="data.options.allowHalf"
          >
          </s-switch>
      </s-form-item>
      <s-form-item label="支持透明度选择" v-if="Object.keys(data.options).indexOf('showAlpha')>=0">
        <s-switch
            v-model="data.options.showAlpha"
          >
          </s-switch>
      </s-form-item>
      <s-form-item label="是否显示标签" v-if="Object.keys(data.options).indexOf('showLabel')>=0">
        <s-switch
            v-model="data.options.showLabel"
          >
        </s-switch>
      </s-form-item>
      <s-form-item label="选项" v-if="Object.keys(data.options).indexOf('options')>=0">
        <s-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
          <s-radio-button :label="false">静态数据</s-radio-button>
          <s-radio-button :label="true">远端数据</s-radio-button>
        </s-radio-group>
        <template v-if="data.options.remote">
          <div>
            <s-input size="mini" style="" v-model="data.options.remoteFunc">
              <template slot="prepend">远端方法</template>
            </s-input>
            <s-input size="mini" style="" v-model="data.options.props.value">
              <template slot="prepend">值</template>
            </s-input>
            <s-input size="mini" style="" v-model="data.options.props.label">
              <template slot="prepend">标签</template>
            </s-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.type=='radio' || (data.type=='select'&&!data.options.multiple)">
            <s-radio-group v-model="data.options.defaultValue">
              <draggable element="ul" :list="data.options.options" 
                :options="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
              >
                <li v-for="(item, index) in data.options.options" :key="index" >
                  <s-radio
                    :label="item.value" 
                    style="margin-right: 5px;"
                  >
                    <s-input :style="{'width': data.options.showLabel? '90px': '190px' }" size="mini" v-model="item.value"></s-input>
                    <s-input style="width:100px;" size="mini" v-if="data.options.showLabel" v-model="item.label"></s-input>
                    <!-- <input v-model="item.value"/> -->
                  </s-radio>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><icon name="bars" ></icon></i>
                  <s-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="s-icon-minus" style="padding: 4px;margin-left: 5px;"></s-button>
                  
                </li>
              </draggable>
              
            </s-radio-group>
          </template>

          <template v-if="data.type=='checkbox' || (data.type=='select' && data.options.multiple)">
            <s-checkbox-group v-model="data.options.defaultValue">

              <draggable element="ul" :list="data.options.options" 
                :options="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
              >
                <li v-for="(item, index) in data.options.options" :key="index" >
                  <s-checkbox
                    :label="item.value"
                    style="margin-right: 5px;"
                  >
                    <s-input :style="{'width': data.options.showLabel? '90px': '190px' }" size="mini" v-model="item.value"></s-input>
                    <s-input style="width:100px;" size="mini" v-if="data.options.showLabel" v-model="item.label"></s-input>
                  </s-checkbox>
                  <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><icon name="bars" ></icon></i>
                  <s-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="s-icon-minus" style="padding: 4px;margin-left: 5px;"></s-button>
                  
                </li>
              </draggable>
            </s-checkbox-group>
          </template>
          <div style="margin-left: 22px;">
            <s-button type="text" @click="handleAddOption">添加选项</s-button>
          </div>
        </template>
        
      </s-form-item>

      <s-form-item label="默认值" v-if="Object.keys(data.options).indexOf('defaultValue')>=0 && (data.type == 'textarea' || data.type == 'input' || data.type=='rate' || data.type=='color' || data.type=='switch')">
        <s-input v-if="data.type=='textarea'" type="textarea" :rows="5" v-model="data.options.defaultValue"></s-input>
        <s-input v-if="data.type=='input'" v-model="data.options.defaultValue"></s-input>
        <s-rate v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;" :max="data.options.max" :allow-half="data.options.allowHalf" v-model="data.options.defaultValue"></s-rate>
        <s-button type="text" v-if="data.type == 'rate'" style="display:inline-block;vertical-align: middle;margin-left: 10px;" @click="data.options.defaultValue=0">清空</s-button>
        <s-switch v-if="data.type=='switch'" v-model="data.options.defaultValue"></s-switch>
      </s-form-item>

      <template v-if="data.type == 'time' || data.type == 'date'">
        <s-form-item label="显示类型" v-if="data.type == 'date'">
          <s-select v-model="data.options.type">
            <s-option value="year"></s-option>
            <s-option value="month"></s-option>
            <s-option value="date"></s-option>
            <s-option value="dates"></s-option>
            <!-- <s-option value="week"></s-option> -->
            <s-option value="datetime"></s-option>
            <s-option value="datetimerange"></s-option>
            <s-option value="daterange"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="是否为范围选择" v-if="data.type == 'time'">
          <s-switch
            v-model="data.options.isRange"
          >
          </s-switch>
        </s-form-item>
        <s-form-item label="是否获取时间戳" v-if="data.type == 'date'">
          <s-switch
            v-model="data.options.timestamp"
          >
          </s-switch>
        </s-form-item>
        <s-form-item label="占位内容" v-if="(!data.options.isRange && data.type == 'time') || (data.type != 'time' && data.options.type != 'datetimerange' && data.options.type != 'daterange')">
          <s-input v-model="data.options.placeholder"></s-input>
        </s-form-item>
        <s-form-item label="开始时间占位内容" v-if="(data.options.isRange) || data.options.type=='datetimerange' || data.options.type=='daterange'">
          <s-input v-model="data.options.startPlaceholder"></s-input>
        </s-form-item>
        <s-form-item label="结束时间占位内容" v-if="data.options.isRange || data.options.type=='datetimerange' || data.options.type=='daterange'">
          <s-input v-model="data.options.endPlaceholder"></s-input>
        </s-form-item>
        <s-form-item label="格式">
          <s-input v-model="data.options.format"></s-input>
        </s-form-item>
        <s-form-item label="默认值" v-if="data.type=='time' && Object.keys(data.options).indexOf('isRange')>=0">
          <s-time-picker 
            key="1"
            style="width: 100%;"
            v-if="!data.options.isRange"
            v-model="data.options.defaultValue"
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          >
          </s-time-picker>
          <s-time-picker 
            key="2"
            v-if="data.options.isRange"
            style="width: 100%;"
            v-model="data.options.defaultValue"
            is-range
            :arrowControl="data.options.arrowControl"
            :value-format="data.options.format"
          >
          </s-time-picker>
        </s-form-item>
      </template>

      <template v-if="data.type=='imgupload'">
        <s-form-item label="最大上传数">
          <s-input type="number" v-model.number="data.options.length"></s-input>
        </s-form-item>
        <s-form-item label="Domain" :required="true">
          <s-input v-model="data.options.domain"></s-input>
        </s-form-item>
        <s-form-item label="获取七牛Token方法" :required="true">
          <s-input v-model="data.options.tokenFunc"></s-input>
        </s-form-item>
      </template>

      <template v-if="data.type=='blank'">
        <s-form-item label="绑定数据类型">
          <s-select v-model="data.options.defaultType">
            <s-option value="String" label="字符"></s-option>
            <s-option value="Object" label="对象"></s-option>
            <s-option value="Array" label="数组"></s-option>
          </s-select>
        </s-form-item>
      </template>

      <template v-if="data.type == 'grid'">
        <s-form-item label="栅格间隔">
          <s-input type="number" v-model.number="data.options.gutter"></s-input>
        </s-form-item>
        <s-form-item label="列配置项">
          <draggable element="ul" :list="data.columns" 
            :options="{group:{ name:'options'}, ghostClass: 'ghost',handle: '.drag-item'}"
          >
            <li v-for="(item, index) in data.columns" :key="index" >
              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><icon name="bars" ></icon></i>
              <s-input placeholder="栅格值" size="mini" style="width: 100px;" type="number" v-model.number="item.span"></s-input>
              
              <s-button @click="handleOptionsRemove(index)" circle plain type="danger" size="mini" icon="s-icon-minus" style="padding: 4px;margin-left: 5px;"></s-button>
              
            </li>
          </draggable>
          <div style="margin-left: 22px;">
            <s-button type="text" @click="handleAddColumn">添加列</s-button>
          </div>
        </s-form-item>
        <s-form-item label="水平排列方式">
          <s-select v-model="data.options.justify">
            <s-option value="start" label="左对齐"></s-option>
            <s-option value="end" label="右对齐"></s-option>
            <s-option value="center" label="居中"></s-option>
            <s-option value="space-around" label="两侧间隔相等"></s-option>
            <s-option value="space-between" label="两端对齐"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="垂直排列方式">
          <s-select v-model="data.options.align">
            <s-option value="top" label="顶部对齐"></s-option>
            <s-option value="middle" label="居中"></s-option>
            <s-option value="bottom" label="底部对齐"></s-option>
          </s-select>
        </s-form-item>
      </template>
      

      <template v-if="data.type != 'grid'">
        
        <s-form-item label="数据绑定Key">
          <s-input v-model="data.model"></s-input>
        </s-form-item>
        <s-form-item label="操作属性">
          <s-checkbox v-model="data.options.readonly" v-if="Object.keys(data.options).indexOf('readonly')>=0">完全只读</s-checkbox>
          <s-checkbox v-model="data.options.disabled" v-if="Object.keys(data.options).indexOf('disabled')>=0">禁用	</s-checkbox>
          <s-checkbox v-model="data.options.editable" v-if="Object.keys(data.options).indexOf('editable')>=0">文本框可输入</s-checkbox>
          <s-checkbox v-model="data.options.clearable" v-if="Object.keys(data.options).indexOf('clearable')>=0">显示清除按钮</s-checkbox>
        </s-form-item>
        <s-form-item label="校验">
          <div>
            <s-checkbox v-model="data.options.required">必填</s-checkbox>
          </div>
          <s-select v-if="Object.keys(data.options).indexOf('dataType')>=0" v-model="data.options.dataType" size="mini" >
            <s-option value="string" label="字符串"></s-option>
            <s-option value="number" label="数字"></s-option>
            <s-option value="boolean" label="布尔值"></s-option>
            <s-option value="integer" label="整数"></s-option>
            <s-option value="float" label="浮点数"></s-option>
            <s-option value="url" label="URL地址"></s-option>
            <s-option value="email" label="邮箱地址"></s-option>
            <s-option value="hex" label="十六进制"></s-option>
          </s-select>
          
          <div v-if="Object.keys(data.options).indexOf('pattern')>=0">
            <s-input size="mini" v-model.lazy="data.options.pattern"  style=" width: 240px;" placeholder="填写正则表达式"></s-input>
          </div>
        </s-form-item>
      </template>
    </s-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable
  },
  props: ['data'],
  data () {
    return {
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null
      }
    }
  },
  computed: {
    show () {
      if (this.data && Object.keys(this.data).length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    handleOptionsRemove (index) {
      if (this.data.type === 'grid') {
        this.data.columns.splice(index, 1)
      } else {
        this.data.options.options.splice(index, 1)
      }
      
    },
    handleAddOption () {
      if (this.data.options.showLabel) {
        this.data.options.options.push({
          value: '新选项',
          label: '新选项'
        })
      } else {
        this.data.options.options.push({
          value: '新选项'
        })
      }
      
    },
    handleAddColumn () {
      this.data.columns.push({
        span: '',
        list: []
      })
    },
    generateRule () {
      this.data.rules = []
      Object.keys(this.validator).forEach(key => {
        if (this.validator[key]) {
          this.data.rules.push(this.validator[key])
        }
      })
    },
    handleSelectMuliple (value) {
      if (value) {
        if (this.data.options.defaultValue) {
          this.data.options.defaultValue = [this.data.options.defaultValue]
        } else {
          this.data.options.defaultValue = []
        }
        
      } else {
        if (this.data.options.defaultValue.length>0){
          this.data.options.defaultValue = this.data.options.defaultValue[0]
        } else {
          this.data.options.defaultValue = ''
        }
        
      }
    }
  },
  watch: {
    'data.options.isRange': function(val) {
      console.log('range,', val)
      if (typeof val !== 'undefined') {
        if (val) {
          this.data.options.defaultValue = null
        } else {
          if (Object.keys(this.data.options).indexOf('defaultValue')>=0) 
            this.data.options.defaultValue = ''
        }
      }
    },
    'data.options.required': function(val) {
      if (val) {
        this.validator.required = {required: true, message: `${this.data.name}必须填写`}
      } else {
        this.validator.required = null
      }

      this.$nextTick(() => {
        this.generateRule()
      })
    },
    'data.options.dataType': function (val) {
      if (!this.show) {
        return false
      }
      
      if (val) {
        this.validator.type = {type: val, message: this.data.name + '格式不正确'}
      } else {
        this.validator.type = null
      }

      this.generateRule()
    },
    'data.options.pattern': function (val) {
      if (!this.show) {
        return false
      }

      if (val) {
        this.validator.pattern = {pattern: eval(val), message: this.data.name + '格式不匹配'}
      } else {
        this.validator.pattern = null
      }

      this.generateRule()
    }
  }
}
</script>
