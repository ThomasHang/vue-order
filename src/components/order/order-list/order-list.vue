<template>
  <div class="home_page" v-loading.body="loading">
    <header class="header_nav">
      <div class="container">
        <router-link to="/"
          ><img src="~common/image/logo.png" class="logo"
        /></router-link>
        <el-button class="fr logout" @click="logout">注销登录</el-button>
        <el-input
          class="search_input fr"
          placeholder="请输入订单名称"
          icon="search"
          v-model="search_key"
          @keyup.enter.native="searchOrder"
          :on-icon-click="searchOrder"
        >
        </el-input>
        <el-button
          class="add_order fr"
          @click="dialogFormVisible = true"
          type="primary"
          >新建订单</el-button
        >

        <el-button class="add_order fr" @click="download" type="primary"
          >下载订单</el-button
        >

        <el-dialog title="请输入订单信息" :visible.sync="dialogFormVisible">
          序号:<el-input
            v-model="id"
            @keyup.enter.native="addOrder"
            placeholder="请输入序号"
          ></el-input>
          开工令:<el-input
            v-model="startsTo"
            @keyup.enter.native="addOrder"
            placeholder="请输入开工令"
          ></el-input>
          企业名称:<el-input
            v-model="companyName"
            @keyup.enter.native="addOrder"
            placeholder="请输入企业名称"
          ></el-input>

          联系人:<el-input
            v-model="contractPerson"
            @keyup.enter.native="addOrder"
            placeholder="请输入联系人"
          ></el-input>

          联系电话:<el-input
            v-model="contractPhone"
            @keyup.enter.native="addOrder"
            placeholder="请输入联系电话"
          ></el-input>

          开票资料:<el-input
            v-model="invoiceInfo"
            @keyup.enter.native="addOrder"
            placeholder="请输入开票资料"
          ></el-input>

          合同生效期:<el-date-picker
            v-model="validateDate"
            @keyup.enter.native="addOrder"
            placeholder="请输入合同生效期"
          ></el-date-picker>

          合同金额:<el-input-number
            v-model="contractAmount"
            @keyup.enter.native="addOrder"
            placeholder="请输入合同金额"
          ></el-input-number>

          预付款:<el-input-number
            v-model="prepayAmount"
            @keyup.enter.native="addOrder"
            placeholder="请输入预付款"
          ></el-input-number>

          提货款:<el-input-number
            v-model="pickupAmount"
            @keyup.enter.native="addOrder"
            placeholder="请输入提货款"
          ></el-input-number>

          <el-form>
            <el-form-item label="双方盖章合同:" prop="img" :rules="[]">
              <el-upload
                ref="my-upload"
                :class="{ 'upload-img': contractImagesFileList.length }"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :multiple="false"
                :file-list="contractImagesFileList"
                :limit="5"
                accept=".png, .jpg, .JPG, .JPEG, .jpeg, .PNG .GIF, .gif"
              >
                <i slot="default" class="el-icon-plus" />
                <div
                  style="width: 100%; height: 100%"
                  slot="file"
                  slot-scope="{ file }"
                >
                  <img
                    style="width: 100%; height: 100%"
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
          </el-form>

          交货日期:<el-date-picker
            v-model="deliverDate"
            @keyup.enter.native="addOrder"
            placeholder="请输入交货日期"
          ></el-date-picker>

          <el-form>
            <el-form-item label="发货照片:" prop="img" :rules="[]">
              <el-upload
                ref="my-upload"
                :class="{ 'upload-img': deliverImagesFileList.length }"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleDeliverChange"
                :on-remove="handleRemove"
                :multiple="false"
                :file-list="deliverImagesFileList"
                :limit="1"
                accept=".png, .jpg, .JPG, .JPEG, .jpeg, .PNG .GIF, .gif"
              >
                <i slot="default" class="el-icon-plus" />
                <div
                  style="width: 100%; height: 100%"
                  slot="file"
                  slot-scope="{ file }"
                >
                  <img
                    style="width: 100%; height: 100%"
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleDeliversRemove(file)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
          </el-form>

          备注:<el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="remark"
            @keyup.enter.native="addOrder"
            placeholder="请输入备注"
          ></el-input>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrder">确 定</el-button>
          </div>
        </el-dialog>

        <!--发货的弹窗-->
        <el-dialog
          title="请输入发货信息"
          :visible.sync="deliverDialogFormVisible"
        >
          快递单号:<el-input
            v-model="deliverCode"
            @keyup.enter.native="updateDeliver"
            placeholder="请输入快递单号"
          ></el-input>

          交货日期:<el-date-picker
            v-model="deliverDate"
            @keyup.enter.native="updateDeliver"
            placeholder="请输入交货日期"
          ></el-date-picker>

          <el-form>
            <el-form-item label="发货照片:" prop="img" :rules="[]">
              <el-upload
                ref="my-upload"
                :class="{ 'upload-img': deliverImagesFileList.length }"
                action="#"
                list-type="picture-card"
                :auto-upload="false"
                :on-change="handleDeliverChange"
                :on-remove="handleRemove"
                :multiple="false"
                :file-list="deliverImagesFileList"
                :limit="1"
                accept=".png, .jpg, .JPG, .JPEG, .jpeg, .PNG .GIF, .gif"
              >
                <i slot="default" class="el-icon-plus" />
                <div
                  style="width: 100%; height: 100%"
                  slot="file"
                  slot-scope="{ file }"
                >
                  <img
                    style="width: 100%; height: 100%"
                    class="el-upload-list__item-thumbnail"
                    :src="file.url"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleDeliversRemove(file)"
                    >
                      <i class="el-icon-delete" />
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="deliverDialogFormVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="updateDeliver">确 定</el-button>
          </div>
        </el-dialog>

        <!--备注的弹窗-->
        <el-dialog title="请输入备注" :visible.sync="remarkDialogFormVisible">
          备注:<el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="remark"
            @keyup.enter.native="updateRemark"
            placeholder="请输入备注"
          ></el-input>

          <div slot="footer" class="dialog-footer">
            <el-button @click="remarkDialogFormVisible = false"
              >取 消</el-button
            >
            <el-button type="primary" @click="updateRemark">确 定</el-button>
          </div>
        </el-dialog>

        <!--快递信息-->
        <el-dialog title="物流信息" :visible.sync="kuaidiDialogFormVisible">
          <el-table :data="wuliu_list">
            <el-table-column label="时间" prop="time"></el-table-column>
            <el-table-column label="结束时间" prop="ftime"></el-table-column>
            <el-table-column label="内容" prop="context"></el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </header>

    <div class="order_list_container">
      <el-table :data="order_list">
        <el-table-column fixed="left" label="序号" prop="id"></el-table-column>
        <el-table-column
          fixed="left"
          label="开工令"
          prop="startsTo"
          width="90px"
        ></el-table-column>

        <el-table-column
          fixed="left"
          label="企业名称"
          prop="companyName"
          width="120px"
        ></el-table-column>
        <el-table-column
          fixed="left"
          label="联系人"
          prop="contractPerson"
          width="90px"
        ></el-table-column>

        <el-table-column
          label="联系方式"
          prop="contractPhone"
          width="90px"
        ></el-table-column>

        <el-table-column
          label="开票信息"
          prop="invoiceInfo"
          width="200px"
        ></el-table-column>
        <el-table-column label="合同生效期" prop="validateDate" width="100px">
          <template slot-scope="scope">
            {{ scope.row.validateDate | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="合同金额"
          prop="contractAmount"
          width="90px"
        ></el-table-column>
        <el-table-column
          label="预付款"
          prop="prepayAmount"
          width="90px"
        ></el-table-column>
        <el-table-column
          label="提货款"
          prop="pickupAmount"
          width="90px"
        ></el-table-column>
        <el-table-column label="发货日期" prop="deliverDate" width="100px">
          <template slot-scope="scope">
            {{ scope.row.deliverDate | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="发货提醒" prop="checkDeliverDate" width="100px">
          <!-- 思路通过模板插槽，获取对应的数据，不同的数据展示不同的颜色，当然只能让显示一个（通过v-if控制） -->

          <template scope="scope">
            <div
              v-if="scope.row.checkDeliverDate == '今天发货'"
              style="color: red; font-weight: bold"
            >
              {{ scope.row.checkDeliverDate }}
            </div>

            <div
              v-if="scope.row.checkDeliverDate == '已过发货期'"
              style="color: gray; font-weight: bold"
            >
              {{ scope.row.checkDeliverDate }}
            </div>

            <div
              v-if="
                scope.row.checkDeliverDate &&
                scope.row.checkDeliverDate.indexOf('天内需发货') != -1
              "
              style="color: green; font-weight: bold"
            >
              {{ scope.row.checkDeliverDate }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="快递单号" prop="deliverCode" width="200px">
          <template slot-scope="scope">
            <!-- 注意：这个地方要传参数进去才能进行操作  函数名称(scope.row) -->
            <div @click="queryKuaidi(scope.row.deliverCode)">
              {{ scope.row.deliverCode }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="备注"
          prop="remark"
          width="200px"
        ></el-table-column>

        <el-table-column fixed="right" label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="orderDetail(scope.row)"
              >查看</el-button
            >

            <el-button
              size="mini"
              type="primary"
              @click="clickDeliver(scope.row)"
              v-show="scope.row.deliverDate == null"
              >发货</el-button
            >

            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit"
              @click="clickRemark(scope.row)"
              >备注</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <h1 v-if="!order_list.length">暂无数据</h1>

      <el-pagination
        v-if="order_list.length"
        class="page_list"
        layout="prev, pager, next"
        @current-change="onPageChange"
        :current-page="page_index"
        :page-count="page_count"
      >
      </el-pagination>
    </div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn/" target="_blank">您的备案号</a>
      <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2023006188号-1</a>
    </div>
  </div>
</template>

<script>
import { fromJS } from "immutable";
import { backgroundImage } from "common/js/mixins";
import { CLEAR_FETCH_GOODS_LIST_PARAMS } from "store/mutation-types";
export default {
  data() {
    return {
      loading: false,
      order_name: "",
      contractImagesFileList: [],
      contractImagesUrlList: [],
      id: "",
      needDeliverId: "",
      needRemarkId: "",
      startsTo: "",
      companyName: "",
      contractPerson: "",
      contractPhone: "",
      invoiceInfo: "",
      validateDate: "",
      contractAmount: "",
      prepayAmount: "",
      pickupAmount: "",
      contractImages: "",
      deliverDate: "",
      deliverImages: "",
      remark: "",
      deliverImages: "",
      deliverImagesFileList: [],
      deliverImagesUrlList: [],

      checkDeliverDate: "",
      deliverCode: "",
      search_key: "",
      page_index: 1,
      page_size: 10,
      page_count: 1,
      dialogFormVisible: false,
      deliverDialogFormVisible: false,
      kuaidiDialogFormVisible: false,
      remarkDialogFormVisible: false,
      order_list: [],
      wuliu_list: [],
    };
  },

  mixins: [backgroundImage],

  created() {
    // page_index 一旦改变就触发 onPageChange 事件有点不妥，故加了这个变量做限制
    this.onPageChangeLock = false;
    this._fetchOrderList();
  },

  filters: {
    getLocalTime(timestamp) {
      const date = new Date(timestamp);
      let Y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        H = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
      if (m < 10) {
        m = "0" + m;
      }
      if (d < 10) {
        d = "0" + d;
      }
      if (H < 10) {
        H = "0" + H;
      }
      if (i < 10) {
        i = "0" + i;
      }
      if (s < 10) {
        s = "0" + s;
      }
      return Y + "-" + m + "-" + d + " " + H + ":" + i + ":" + s;
    },
  },

  methods: {
    addOrder() {
      // if (!this.id) {
      //   this.$message.error("请输入序号！", "error");
      //   return;
      // }
      // if (!this.startsTo) {
      //   this.$message.error("请输入开工令！", "error");
      //   return;
      // }
      // if (!this.companyName) {
      //   this.$message.error("请输入企业名称！", "error");
      //   return;
      // }
      // if (!this.contractPerson) {
      //   this.$message.error("请输联系人！", "error");
      //   return;
      // }

      // if (!this.contractPhone) {
      //   this.$message.error("请输联系电话！", "error");
      //   return;
      // }

      this.contractImagesUrlList.forEach((item) => {
        if (!this.contractImages) {
          this.contractImages = item.url;
        } else {
          this.contractImages = this.contractImages + "," + item.url;
        }
      });

      this.deliverImagesUrlList.forEach((item) => {
        if (!this.deliverImages) {
          this.deliverImages = item.url;
        } else {
          this.deliverImages = this.deliverImages + "," + item.url;
        }
      });

      const DATA = {
        id: this.id,
        startsTo: this.startsTo,
        companyName: this.companyName,
        contractPerson: this.contractPerson,
        contractPhone: this.contractPhone,
        invoiceInfo: this.invoiceInfo,
        validateDate: this.validateDate,
        contractAmount: this.contractAmount,
        prepayAmount: this.prepayAmount,
        pickupAmount: this.pickupAmount,
        contractImages: this.contractImages,
        deliverDate: this.deliverDate,
        deliverImages: this.deliverImages,
        remark: this.remark,
      };

      this.$http.post("/new-order/save", DATA).then((res) => {
        this.dialogFormVisible = false;
        this.$router.go(`/order-list`);

        // if (!res || !res.data) return;
        // const order_id = res.data;
        // if (order_id) {
        //   this.$store.commit(CLEAR_FETCH_GOODS_LIST_PARAMS);
        //   this.$router.push(`/goods-list/${order_id}`);
        // } else {
        //   this.$message.error("创建订单失败！", "error");
        // }
      });
    },

    clickDeliver(order) {
      this.needDeliverId = order.id;
      this.deliverDialogFormVisible = true;
    },

    clickRemark(order) {
      this.needRemarkId = order.id;
      this.remarkDialogFormVisible = true;
      this.remark = order.remark;
    },

    updateRemark() {
      const DATA = {
        id: this.needRemarkId,
        remark: this.remark,
      };

      this.$http.put("/new-order/saveRemark", DATA).then((res) => {
        this.remarkDialogFormVisible = false;
        this.$router.go(`/order-list`);
      });
    },

    updateDeliver() {
      this.deliverImagesUrlList.forEach((item) => {
        if (!this.deliverImages) {
          this.deliverImages = item.url;
        } else {
          this.deliverImages = this.deliverImages + "," + item.url;
        }
      });

      const DATA = {
        id: this.needDeliverId,
        deliverDate: this.deliverDate,
        deliverImages: this.deliverImages,
        deliverCode: this.deliverCode,
      };

      this.$http.put("/new-order/saveDeliver", DATA).then((res) => {
        this.deliverDialogFormVisible = false;
        this.$router.go(`/order-list`);
      });
    },

    download() {
      window.open(process.env.BASE_API + "/new-order/export");
    },

    orderDetail(order) {
      this.$router.push("/order-detail/" + order.id);
    },

    queryKuaidi(deliverCode) {
      this.kuaidiDialogFormVisible = true;

      this.$http
        .get("new-order/query/logisticNo/" + deliverCode)
        .then((res) => {
          this.wuliu_list = res.dataList;
        });
    },

    logout() {
      const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
        for (let i = keys.length; i--; )
          document.cookie = keys[i] + "=0;expires=" + new Date(0).toUTCString();
      }
      localStorage.removeItem("token");
      this.$router.push("/login");
    },

    _fetchOrderList() {
      const params = {
        pageNum: this.page_index - 1,
        pageSize: this.page_size,
        // search_key: this.search_key,
      };
      this.loading = true;

      this.$http
        .post("new-order/page", params)
        .then((res) => {
          if (res) {
            const { content = [], totalPages = 1 } =
              res.newOrderResponseMicroServicePage;
            this.order_list = content;
            this.page_count = totalPages;
            this.loading = false;
          }
        })
        .catch((error) => (this.loading = false));
    },

    // 搜索
    searchOrder() {
      // 只要搜索传值了，后端会把所有的条件置空去搜索，尽管这样前端还是得把一些条件给清空
      // 改变 pageIndex 时会自动触发 onPageChange 事件，故需要设置 onPageChangeLock
      if (this.pageIndex !== 1) {
        this.onPageChangeLock = true;
        this.pageIndex = 1;
      }
      this._fetchOrderList();
    },

    // 选择页码
    onPageChange(page) {
      if (this.onPageChangeLock) {
        this.onPageChangeLock = false;
        return;
      }
      this.page_index = page;
      this._fetchOrderList();
    },

    // // 批量上传上传信息
    // uploadContractImages() {
    //   let fd = new FormData();
    //   fd.append("name", this.name);
    //   this.contractImagesFileList.forEach((item) => {
    //     //文件信息中raw才是真的文件
    //     fd.append("files", item.raw);
    //   });
    //   this.$http.put("/common/file/upload/batch", fd).then((res) => {
    //     this.$message("上传成功");
    //   });
    // },

    //通过onchanne触发方法获得文件列表
    handleChange(file) {
      this.contractImagesFileList.push(file);
      let fd = new FormData();
      //文件信息中raw才是真的文件
      fd.append("file", file.raw);
      this.$http.put("/common/file/upload/qiniu", fd).then((res) => {
        this.contractImagesUrlList.push({ old: file.url, url: res });
      });
    },

    //通过onchanne触发方法获得文件列表
    handleRemove(file) {
      this.contractImagesFileList.removeItem(file);
      const index2 = this.contractImagesUrlList.indexOf(file.url);
      this.contractImagesUrlList.splice(index2 - 1, 1);
    },

    //通过onchanne触发方法获得文件列表
    handleDeliverChange(file) {
      this.deliverImagesFileList.push(file);
      let fd = new FormData();
      //文件信息中raw才是真的文件
      fd.append("file", file.raw);
      this.$http.put("/common/file/upload/qiniu", fd).then((res) => {
        this.deliverImagesUrlList.push({ oldUrl: file.url, url: res });
      });
    },

    //通过onchanne触发方法获得文件列表
    handleDeliverRemove(file) {
      const index2 = this.deliverImagesFileList.indexOf(file.url);
      this.deliverImagesUrlList.splice(index2 - 1, 1);
    },
  },
};
</script>

<style lang="scss" scoped>

.home_page{
  height: 100%;
  width: 100%;
}
.header_nav {
  padding: 0 30px;
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #eee;

  .add_order {
    margin-top: 12px;
    margin-right: 60px;
    width: 150px;
  }

  .logo {
    width: 150px;
    height: 50px;
    vertical-align: middle;
  }

  .logout {
    margin-top: 10px;
    margin-left: 20px;
  }

  .search_input {
    width: 200px;
  }
}

.order_list_container {
  margin-top: 30px;
  margin-left: 20px;
  margin-right: 20px;
  height: 650px;

  .order_box {
    margin-bottom: 10px;
    display: block;
    background: #fff;

    &:hover {
      background: rgba(227, 232, 238, 0.33);
    }
  }

  .thead {
    color: #3a3a3a;
    height: 36px;
    line-height: 36px;
    padding: 0 50px;
    border-bottom: 1px #e3e8ee solid;
    font-size: 14px;

    .export_order_btn {
      margin-top: 4px;
      margin-left: 30px;
    }

    .fr {
      margin-left: 20px;
    }

    .i-edit {
      margin-top: 2px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      color: #0142a1;
      border-radius: 50%;
      text-align: center;
      border: 1px #0142a1 solid;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .order_note {
    margin-top: 10px;
    padding-left: 2%;
    width: 98%;
    color: #666;
    font-size: 14px;
    line-height: 18px;
  }

  .img_list {
    margin: 0;
    width: 100%;
    height: 100px;
    cursor: pointer;

    li {
      display: inline-block;
      width: 130px;
      height: 100px;
      margin-right: 10px;
      background-size: contain;
      overflow: hidden;
    }
  }
}

.page_list {
  text-align: center;
  margin: 20px auto;
}

.dangerous {
  color: red;
}

.not-dangerous {
  color: gray;
}

.need-notice {
  color: yellow;
}

.footer {
            height: 60px;
            line-height: 60px;
            text-align: center;
            background-color: #eee;
            z-index: 9999;
            clear: both;
        }
</style>
