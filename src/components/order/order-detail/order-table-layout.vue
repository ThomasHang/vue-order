<template>
    <div class="goods_info">
      <ul class="item_list fl">
          <li class = "item_li">
          开工令:
            <el-input v-model="orderDetail.startsTo" :disabled="modifyVisible" style="width: 100px;" class="filter-item" clearable />
          </li>
          <li>
          公司名称: <el-input v-model="orderDetail.companyName" :disabled="modifyVisible" style="width: 100px;" class="filter-item"  clearable />
          </li>
          <li>
          联系人: <el-input v-model="orderDetail.contractPerson" :disabled="modifyVisible" style="width: 100px;" class="filter-item" clearable />
          </li>
          <li>
          联系电话: <el-input v-model="orderDetail.contractPhone" :disabled="modifyVisible" style="width: 100px;" class="filter-item" clearable />
          </li>
          <li>
          开票资料: <el-input v-model="orderDetail.invoiceInfo" :disabled="modifyVisible" style="width: 100px;" class="filter-item" clearable />
          </li>
          <li>
          合同生效期:<el-date-picker
                v-model="orderDetail.validateDate"
                @keyup.enter.native="addOrder"
                placeholder="请输入合同生效期"
                :disabled="modifyVisible"
              ></el-date-picker>
            </li>
          <li>
            合同金额: <el-input v-model="orderDetail.contractAmount" :disabled="modifyVisible" style="width: 100px;" class="filter-item"  clearable />
          </li>
          <li>
            预付款: <el-input v-model="orderDetail.prepayAmount" :disabled="modifyVisible" style="width: 100px;" class="filter-item" clearable />
          </li>
          <li>
            提货款: <el-input v-model="orderDetail.pickupAmount" :disabled="modifyVisible" style="width: 100px;" class="filter-item" clearable />
          </li>
   
        <li class = "el-img-list">
          双方签约合同:
          <div class="el-img-list-item">
                  <div v-for="(img) in orderDetail.contractImages" :key="img">
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


                <el-dialog title="图像预览" :visible.sync="tpDialogVisible" width="100%" height="100%" style="z-index:0;"> 
                    <viewer :images="urlList">
                      <img  style="width: 100%; height: 100%" v-for="(item) in urlList" :key="item" :src="getUrl(item)" alt="">
                    </viewer>
                </el-dialog>
          </div>

        </li>

        <li>
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

        <li>
        备注: <el-input v-model="orderDetail.remark" :disabled="modifyVisible" style="width: 100px;" class="filter-item" />
        </li>

      </ul>
      <div class="btn_area fr">
        <!-- <el-button class="edit_button" @click="editOtherGoods">修改</el-button>
        <el-button @click="deleteGoods" type="danger">删除</el-button> -->
        <el-button type="primary" @click="modify" 
            :style="{display: modifyDisplay}"
              >编辑</el-button>
              <el-button type="primary" @click="saveOrderDetail(orderDetail)"
              :style="{display:saveDisplay}"
              >保存</el-button>
      </div>

    </div>
</template>

<script>
import { backgroundImage } from "common/js/mixins";
import { mapGetters, mapState } from "vuex";
import { UPDATE_ORDER_DETAIL } from "store/mutation-types";
import { fromJS } from "immutable";
import orderDetailVue from "./order-detail.vue";


export default {
  props: ["id", "contractImages"],
  data() {
    return {
      contractImagesFileList: [],
      modifyDisplay: '',
      saveDisplay: 'none',
      modifyVisible: true,
      tpDialogVisible:false,
      dialogCommentForm: false,
      currentEditCommentIndex: 0,
      urlList:[],
    };
  },

  mixins: [backgroundImage],

  filters: {
    computedTotal(total, num, profit, price) {
      const newTotal = num * (profit / 100 + 1) * price;
      return Number(newTotal.toFixed(2));
    },
  },

  computed: {
    ...mapState({
      orderDetail: (state) => state.orderDetail,
    }),
  },

  created() {    
    console.log("---contractImages--" + contractImages)
  },

  methods: {

    // changeOrderDetail(value) {
    //   console.log("-------------"+value)
    //   this.$store.commit(UPDATE_ORDER_DETAIL, params);
    // },

    // 拼接图片的地址
    getUrl(item){
      // if (!item){
        return  require('../../../common/image/default.png')
      // }else{
      //   return process.env.BASE_API + "new-order/IoReadImage/" + item;
      // }
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
    modify(){
      this.modifyVisible = false;
      this.saveDisplay='';
      this.modifyDisplay='none';
    },

    saveOrderDetail(orderDetail) {
      orderDetail.contractImages = null;
      orderDetail.deliverImages = null;
      orderDetail.createDate = null;
      orderDetail.updateDate = null;
      this.$http.post("/new-order/save", orderDetail).then((res) => {
        this.modifyVisible = true;
        this.saveDisplay='none';
        this.modifyDisplay='';
      });
    },

    openCommentDialog(index) {
      this.dialogCommentForm = true;
      this.currentEditCommentIndex = index;
    },

    openDialog(url){
      this.urlList.length=0
      this.urlList.push(url)
      this.tpDialogVisible=true
    },

    // submitComment() {
    //   let comment = this.$refs.commentIpt.$refs.textarea.value.trim();

    //   // if (comment.length > 50) {
    //   //   return this.$message.error("最多不能超过 50字！");
    //   // }

    //   this.dialogCommentForm = false;
    //   const params = {
    //     value: comment,
    //     key: "comment",
    //     keyIndex: this.currentEditCommentIndex,
    //   };
    //   this.$store.commit(UPDATE_ORDER_DETAIL_INDEX_VALUE, params);
    //   const data = {
    //     order_id: this.$route.params.order_id,
    //     sku: this.orderDetail[this.currentEditCommentIndex].sku,
    //     comment,
    //   };
    //   this.$http.post("order/order_detail_comment", data).then((res) => {
    //     if (!res) return;
    //     if (res.success) {
    //       this.$message.success("添加备注成功！");
    //     } else {
    //       this.$message.error("添加备注失败！");
    //     }
    //   });
    // },
  },
};
</script>

<style lang="sass" scoped>
  .goods_info
    border-top: 1px solid
    width: auto
    height: auto
    margin-bottom: 200px

    .item_list
      width: 100%
      font-size: 18px
      list-style: none
      .item_li
        height: 50px
        width: 500px
        background-color: red
      
      .el-img-list
        height: 100px
        line-height: 100px
        .el-img-list-item
          position: relative
          width: 100px
          height: 100%
          display: inline-block
          margin-left: 20px
          .el-img-list__item-thumbnail
            height: 100px
            width:  100px
            vertical-align: middle
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
      margin: 20px

      .edit_button
        margin-right: 20px

</style>
