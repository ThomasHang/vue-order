<template>
  <section class="other_goods_container">
    <div class="goods_info">
      <ul class="item_list fl">
        <li>序号:{{ orderDetail.id }}</li>
        <li>开工令:{{ orderDetail.startsTo }}</li>
        <li>公司名称:{{ orderDetail.companyName }}</li>
        <li>联系人:{{ orderDetail.contractPerson }}</li>
        <li>联系电话:{{ orderDetail.contractPhone }}</li>
        <li>开票资料:{{ orderDetail.invoiceInfo }}</li>
        <li>
          合同生效期:
          {{ orderDetail.validateDate | dateFormat }}
        </li>
        <li>合同金额:{{ orderDetail.contractAmount }}</li>
        <li>预付款:{{ orderDetail.prepayAmount }}</li>
        <li>提货款:{{ orderDetail.pickupAmount }}</li>

        <!-- <li>
          签约合同:
          <div v-for="(img) in orderDetail.contractImages" :key="img">
		          <img  style="width: 150px; height: 150px"
                    class="el-upload-list__item-thumbnail" :src="'http://localhost:8010/new-order/IoReadImage/'+img"/>

                    <i class="el-icon-delete" />

	        </div>
        </li> -->

        <li class = "el-img-list">
          双方签约合同:
          <div class="el-img-list-item" v-for="(img) in orderDetail.contractImages" :key="img">
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
        </li>


        <li>交货日期:
          {{ orderDetail.deliverDate | dateFormat }}</li>


        <!-- <li>
          发货照片:
          <div v-for="(img) in orderDetail.deliverImages" :key="img">
		          <img  style="width: 150px; height: 150px"
                    class="el-upload-list__item-thumbnail" :src="'http://localhost:8010/new-order/IoReadImage/'+img"/>
	        </div>
        </li> -->

        <li class = "el-img-list">
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

        </li>


  

      </ul>

      <!-- <div class="btn_area fr">
        <el-button class="edit_button" @click="editOtherGoods">修改</el-button>
        <el-button @click="deleteGoods" type="danger">删除</el-button>
      </div> -->
    </div>

    <!-- <ul class="img_list">
      <li v-for="(img, index) in goods.extendGoodsImgVOs" :key="index" :style="backgroundImage(img.imgPath)"></li>
    </ul> -->
  </section>
</template>

<script>
import { backgroundImage } from "common/js/mixins";
import { mapGetters, mapState } from "vuex";
import { UPDATE_ORDER_DETAIL_INDEX_VALUE } from "store/mutation-types";
import { fromJS } from "immutable";
import orderDetailVue from "./order-detail.vue";


export default {
  props: ["id", "contractImages"],
  data() {
    return {
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
    },

  methods: {
    changeOrderDetail(value, key, keyIndex) {
      const params = { value, key, keyIndex };
      this.$store.commit(UPDATE_ORDER_DETAIL_INDEX_VALUE, params);
    },

    getUrl(item){

      if (!item){
        console.log("--------为空不执行呀--------------")
        return  "~common/image/default.png"
      }else{
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

    openCommentDialog(index) {
      this.dialogCommentForm = true;
      this.currentEditCommentIndex = index;
    },

    openDialog(url){
      this.urlList.length=0
      this.urlList.push(url)
      this.tpDialogVisible=true
    },

    submitComment() {
      let comment = this.$refs.commentIpt.$refs.textarea.value.trim();

      // if (comment.length > 50) {
      //   return this.$message.error("最多不能超过 50字！");
      // }

      this.dialogCommentForm = false;
      const params = {
        value: comment,
        key: "comment",
        keyIndex: this.currentEditCommentIndex,
      };
      this.$store.commit(UPDATE_ORDER_DETAIL_INDEX_VALUE, params);
      const data = {
        order_id: this.$route.params.order_id,
        sku: this.orderDetail[this.currentEditCommentIndex].sku,
        comment,
      };
      this.$http.post("order/order_detail_comment", data).then((res) => {
        if (!res) return;
        if (res.success) {
          this.$message.success("添加备注成功！");
        } else {
          this.$message.error("添加备注失败！");
        }
      });
    },
  },
};
</script>

<style lang="sass" scoped>
.other_goods_container
  margin-bottom: 20px
  width: auto
  height: auto
  border: 1px #ddd solid

  .goods_info
    height: 1000px

    .item_list
      width: 100%
      font-size: 14px
      line-height: 40px
      list-style: none
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

  .img_list
    li
      display: inline-block
      margin-right: 10px
      margin-bottom: 10px
      width: 250px
      height: 250px
  
</style>
