<template>
  <div class="login_box">
    <div class="login_container">
      <el-form :label-position="labelPosition" label-width="50px" :model="formLabelAlign">
        <el-form-item label="账号">
          <el-input v-model="formLabelAlign.userName" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="formLabelAlign.pwd" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item class="tc">
          <el-button class="submit_btn" size="large" type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

import { TOKEN } from "store/mutation-types";

  export default {
    data() {
      return {
        labelPosition: 'right',
        formLabelAlign: {
          userName: '',
          pwd: '',
        }
      };
    },
    methods: {
      onSubmit() {
        const { userName, pwd } = this.formLabelAlign
        if(!userName) {
          this.$message.error('请输入账号')
          return
        }

        if(!pwd) {
          this.$message.error('请输入密码')
          return
        }

        const data = {
         account: userName,
         password: pwd,
        }
        this.$http.post('api/common/login',data).then((res)=> {
          if(res) {
          localStorage.setItem('token',res.token)  
          this.$router.push('/order-list')
          }
        })
      }
    }
  }
</script>
<style scoped>
.login_box{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
  .login_container {
    /* padding-top: 30vh; */
    /* height: 70vh; */
    margin: auto;
    /* width: 250px; */
  }

  .submit_btn {
    display: inline-block;
    width: 200px;
  }
</style>
