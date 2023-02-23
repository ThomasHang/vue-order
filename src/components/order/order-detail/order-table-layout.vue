<template>
  <div class="goods_info">
    <ul class="item_list">
      <li class="item_li">
        开工令:
        <el-input
          v-model="orderDetail.startsTo"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        公司名称:
        <el-input
          v-model="orderDetail.companyName"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        联系人:
        <el-input
          v-model="orderDetail.contractPerson"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        联系电话:
        <el-input
          v-model="orderDetail.contractPhone"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        开票资料:
        <el-input
          v-model="orderDetail.invoiceInfo"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        合同生效期:<el-date-picker
          v-model="orderDetail.validateDate"
          @keyup.enter.native="addOrder"
          placeholder="请输入合同生效期"
          :disabled="modifyVisible"
        ></el-date-picker>
      </li>
      <li class="item_li">
        合同金额:
        <el-input
          v-model="orderDetail.contractAmount"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        预付款:
        <el-input
          v-model="orderDetail.prepayAmount"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>
      <li class="item_li">
        提货款:
        <el-input
          v-model="orderDetail.pickupAmount"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
          clearable
        />
      </li>

      <li class="item_li">
        双方签约合同:
        <div class="el-img-list">
            <div class="el-img-list-item" v-for="img in orderDetail.contractImages" :key="img">
              <el-image class="el-img-list__item-thumbnail" :src="getUrl(img)">
              </el-image>
              <span class="el-img-list__item-actions">
                <span class="el-img-list__item-delete" @click="openDialog(img)">
                  <i class="el-icon-zoom-in" />
                </span>
              </span>
            <el-dialog
              title="图像预览"
              :visible.sync="tpDialogVisible"
              width="100%"
              height="100%"
              style="z-index: 0"
            >
              <viewer :images="urlList">
                <img
                  style="width: 100%; height: 100%"
                  v-for="item in urlList"
                  :key="item"
                  :src="getUrl(item)"
                  alt=""
                />
              </viewer>
            </el-dialog>
          </div>
        </div>
        <div>
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
                :style="{ display: saveDisplay }"
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
            </div>
      </li>

      <li class="item_li mt">
        交货日期:<el-date-picker
          v-model="orderDetail.deliverDate"
          @keyup.enter.native="addOrder"
          placeholder="请输入交货期"
          :disabled="modifyVisible"
        ></el-date-picker>
      </li>

      <!-- <li class = "el-img-list">
          发货图片:
          <div class="el-img-list-item" v-for="(img) in orderDetail.deliverImages" :key="img">
		               <el-image
                    class="el-img-list__item-thumbnail" 
                    :src="getUrl(img)"
                     >
                    </el-image>
                    <span class="el-img-list__item-actions">
                    <span
                      class="el-img-list__item-delete"
                      @click="openDialog(img)"
                    >
                    <i class="el-icon-zoom-in" />
                    </span>
                  </span>
	        </div>
       
          <el-dialog title="图像预览" :visible.sync="tpDialogVisible" width="100%" height="100%" style="z-index:0;"> 

          <viewer :images="urlList">
            <img  style="width: 100%; height: 100%" v-for="(item) in urlList" :key="item" :src="getUrl(item)" alt="">
          </viewer>
          </el-dialog>
        </li> -->

      <li class="item_li">
        备注:
        <el-input
          type="textarea"
          v-model="orderDetail.remark"
          :disabled="modifyVisible"
          style="width: 100px"
          class="filter-item"
        />
      </li>
    </ul>
    <div class="btn_area fr">
      <!-- <el-button class="edit_button" @click="editOtherGoods">修改</el-button>
        <el-button @click="deleteGoods" type="danger">删除</el-button> -->
      <el-button
        type="primary"
        @click="modify"
        :style="{ display: modifyDisplay }"
        >编辑</el-button
      >
      <el-button
        type="primary"
        @click="saveOrderDetail(orderDetail)"
        :style="{ display: saveDisplay }"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import { backgroundImage } from "common/js/mixins";
import { mapGetters, mapState } from "vuex";
import { fromJS } from "immutable";

export default {
  props: ["id", "contractImages"],
  data() {
    return {
      contractImagesUrlList: [],
      contractImagesFileList: [],
      modifyDisplay: "",
      saveDisplay: "none",
      modifyVisible: true,
      tpDialogVisible: false,
      dialogCommentForm: false,
      currentEditCommentIndex: 0,
      urlList: [],
    };
  },

  mixins: [backgroundImage],

  filters: {},

  computed: {
    ...mapState({
      orderDetail: (state) => state.orderDetail,
    }),
  },

  created() {},

  methods: {
    // 拼接图片的地址
    getUrl(item) {
      if (!item) {
        return require("../../../common/image/default.png");
      } else {
        return process.env.BASE_API + "new-order/IoReadImage/" + item;
      }
    },

    deleteOrder(sku) {
      const data = {
        sku,
        order_id: this.$route.params.order_id,
      };

      this.$http.post("order/delete_goods", data).then((res) => {
        if (res && res.success) {
          this.$message.success("删除商品成功！");
          this.$emit("deleteGoods");
        } else {
          this.$message.error("删除商品失败！");
        }
      });
    },

    // 修改编辑状态
    modify() {
      this.modifyVisible = false;
      this.saveDisplay = "";
      this.modifyDisplay = "none";
    },

    saveOrderDetail(orderDetail) {
      var urlStringList = "";
      this.contractImagesUrlList.map((item) => {
        urlStringList += item.url + ",";
      });

      const DATA = {
        id: orderDetail.id,
        startsTo: orderDetail.startsTo,
        companyName: orderDetail.companyName,
        contractPerson: orderDetail.contractPerson,
        contractPhone: orderDetail.contractPhone,
        invoiceInfo: orderDetail.invoiceInfo,
        validateDate: orderDetail.validateDate,
        contractAmount: orderDetail.contractAmount,
        prepayAmount: orderDetail.prepayAmount,
        pickupAmount: orderDetail.pickupAmount,
        contractImages: urlStringList.slice(0, -1),
        deliverDate: orderDetail.deliverDate,
        // deliverImages: orderDetail.deliverImages,
        remark: orderDetail.remark,
      };

      this.$http.post("/new-order/save", DATA).then((res) => {
        // 刷新当前页面
        location.reload();
        this.modifyVisible = true;
        this.saveDisplay = "none";
        this.modifyDisplay = "";
      });
    },

    openCommentDialog(index) {
      this.dialogCommentForm = true;
      this.currentEditCommentIndex = index;
    },

    openDialog(url) {
      this.urlList.length = 0;
      this.urlList.push(url);
      this.tpDialogVisible = true;
    },

    //通过onchanne触发方法获得文件列表
    handleChange(file) {
      this.contractImagesFileList.push(file);
      let fd = new FormData();
      //文件信息中raw才是真的文件
      fd.append("file", file.raw);
      this.$http.put("/common/file/upload", fd).then((res) => {
        this.contractImagesUrlList.push({ old: file.url, url: res });
        // this.contractImagesUrlList.push({ oldUrl: file.url, url: res });
      });
    },

    //通过onchanne触发方法获得文件列表
    handleRemove(file) {
      const index2 = this.contractImagesUrlList.indexOf(file.url);
      this.contractImagesUrlList.splice(index2 - 1, 1);
    },
    //   this.$store.commit(UPDATE_ORDER_DETAIL_INDEX_VALUE, params);
  },
};
</script>

<style lang="sass" scoped>
.goods_info
  border-top: 1px solid
  width: 100%
  height: 100%
  .item_list
    width: 100%
    height: 100%
    font-size: 18px
    list-style: none
    margin-left: -38px
    .item_li
      height: 50px
      width: 100%

    .el-img-list
      padding-top: 10px
      margin-left: 20px
      width: 100%
      height: 120px
      line-height: 100px
      display: inline-block
      .el-img-list-item
        position: relative
        width: 100px
        height: 100px
        display: inline-block
        .el-img-list__item-thumbnail
          height: 100px
          width: 100px
        .el-img-list__item-actions
          width: 60px
          height: 60px
          position: absolute
          right: 10px
          top: 10px
          .el-img-list__item-delete
            height: 100%
            width: 100%
            position: absolute
            right: -9px
            top: -2px

  .btn_area
    position: absolute
    right: 10px
    bottom: 10px
    margin: 20px
    .edit_button
      margin-right: 20px
.mt
  margin-top: 100px
</style>
