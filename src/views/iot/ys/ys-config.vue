<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="160px">
      <el-form-item label="萤石云AppKey" prop="appKey">
        <el-input :disabled="product.status==2" v-model="form.appKey" placeholder="请输入萤石云AppKey" />
      </el-form-item>
      <el-form-item  label="萤石云Secret" prop="secret">
        <el-input :disabled="product.status==2" v-model="form.secret" placeholder="请输入萤石云Secret" />
      </el-form-item>
      <div style="text-align:center;margin-top:20px;">
        <el-button  type="primary" @click="submitForm" v-show="product.status!=2">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getYs, addYs, updateYs } from '@/api/iot/ys';

export default {
  name: 'config-ys',
  mixins: [],
  components: {},
  props: {
    product: Object
  },
  data() {
    return {
      // 表单参数
      form: {
          appKey:'',
          secret:''
      },
      // 表单校验
      rules: {
        appKey: [
          { required: true, message: '萤石云AppKey不能为空', trigger: 'blur' },
        ],
        secret: [
          { required: true, message: '萤石云Secret不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  computed: {},
  watch: {
    product: {
      handler: function (n,o) {
        if (n && n.productId) {
          this.getConfig();
        }
      },
      immediate:true
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    /** 获取配置信息 */
    async getConfig() {
      const { data } = await getYs(this.product.productId);
      if(data){
          console.log(data)
        this.form = data;
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateYs(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功');
            });
          } else {
            this.form.productId = this.product.productId;
            addYs(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功');
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
