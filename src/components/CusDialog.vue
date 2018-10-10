<template>
  <s-dialog
    class="cus-dialog-container"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    center
    :width="width"
    ref="elDialog"
    :id="id"
    >
    <span v-if="show">
      <slot></slot>
    </span>

    <span v-if="action" slot="footer" class="dialog-footer" v-loading="loading"
      :element-loading-text="loadingText">
      <slot name="action">
        <s-button @click="close">取消</s-button>
        <s-button type="primary" @click="submit" >确 定</s-button>
      </slot>
    </span>
  </s-dialog>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    loadingText: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '600px'
    },
    form: {
      type: Boolean,
      default: true
    },
    action: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    show () {
      if (this.form) {
        return this.showForm
      } else {
        return true
      }
    }
  },
  data () {
    return {
      loading: false,
      dialogVisible: this.visible,
      id: 'dialog_' + new Date().getTime(),
      showForm: false
    }
  },
  methods: {
    close () {
      this.dialogVisible = false
    },
    submit () {
      this.loading = true

      this.$emit('on-submit')
    },
    end () {
      this.loading = false
    }
  },
  mounted () {
    console.log(this.$refs.elDialog)
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.loading = false
        this.$emit('on-close')
        setTimeout(() => {
          this.showForm = false
        }, 300)
      } else {
        this.showForm = true
      }
    },
    visible (val) {
      this.dialogVisible = val
    }
  }
}
</script>

<style lang="scss">
.cus-dialog-container{
  .s-dialog__footer{
    margin: 0 20px;
    // border-top: 1px dashed #ccc;
    padding: 15px 0 16px;
    text-align: center;
    position: relative;

    .dialog-footer{
      display: block;

      .circular{
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }

      .s-loading-text{
        display: inline-block;
        vertical-align: middle;
      }

      .s-loading-spinner{
        margin-top: -12px;
      }
    }
  }
}
</style>
