<template>
  <div class="form-config-container">
    <s-form label-position="top">
      <s-form-item label="标签对齐方式">
        <s-radio-group v-model="data.labelPosition">
          <s-radio-button label="left">左对齐</s-radio-button>
          <s-radio-button label="right">右对齐</s-radio-button>
          <s-radio-button label="top">顶部对齐</s-radio-button>
        </s-radio-group>
      </s-form-item>

      <s-form-item label="表单字段宽度">
        <s-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></s-input-number>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>
