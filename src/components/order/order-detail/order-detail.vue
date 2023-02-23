<template>
  <div class="container">
    <keep-alive>
      <goods-menu @="onMenuChange" class="goods_menu"></goods-menu>
    </keep-alive>
    <div class="order_container" v-loading.body="loading">
      <section class="order_detail">
        <nav class="nav_container">
          <div class="box">
            <el-button @click="$router.push('/order-list')" type="text" icon="arrow-left"
              >返回订单列表</el-button
            >
            <!-- <el-button @click="printPdf" class="pdf fr">导出订单</el-button> -->
          </div>
        </nav>

        <div class="content_box">
          <header class="header">
            <span class="subtitle">订单序号：{{ id }}</span>
          </header>
          <order-table-layout/>
        </div>

        <el-dialog title="备注" :visible.sync="dialogCommentForm">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10 }"
            placeholder="请输入备注"
            v-model="remark"
            @keyup.enter.native="updateRemark"
          >
          </el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCommentForm = false">取 消</el-button>
            <el-button type="primary" @click="submitComment">确 定</el-button>
          </div>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script>
import GoodsMenu from "base/goods-menu/goods-menu";
import OrderTableLayout from "./order-table-layout";
import { UPDATE_ORDER_DETAIL } from "store/mutation-types";
import { mapState, mapGetters } from "vuex";
import { fromJS } from "immutable";

export default {
  components: {
    GoodsMenu,
    OrderTableLayout,
  },

  data() {
    const { order_id } = this.$route.params;
    return {
      id: order_id,
      loading: false,
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
      dialogCommentForm: false,
      dialogSaveForm: false,
    };
  },

  created() {
    this._fetchOrderDetail();
  },

  computed: {
    // ...mapGetters(["orderAmount", "orderSpList"]),

    ...mapState({
      orderDetail: (state) => state.orderDetail,
    }),
  },

  methods: {
    _fetchOrderDetail() {
      this.loading = true;

      this.$http
        .get("new-order/order_detail/" + this.id)
        .then((res) => {
          if (!res) return;
          this.$store.commit(UPDATE_ORDER_DETAIL, res);
          this.loading = false;
          this.remark = res.remark;
        })
        .catch((error) => (this.loading = false));
    },

    onMenuChange(query) {
      this.$router.push({ path: "/goods-list/" + this.order_id, query });
    },

    printPdf() {
      window.open(
        process.env.BASE_API +
          "order/order_excel?order_id=" +
          this.$route.params.order_id
      );
    },

    saveRemark() {
      this.dialogCommentForm = true;
    },

    submitComment() {
      const DATA = {
        id: this.id,
        remark: this.remark,
      };

      this.$http.put("/new-order/saveRemark", DATA).then((res) => {
        this.remarkDialogFormVisible = false;
        this.$router.go(`/order-list`);
      });
    },

  
    // addOtherGoods() {
    //   this.isShowEditGooods = true;
    //   this.goodsModelTitle = "添加第三方商品";
    // },

    // openEditOtherGoodsDialog(data) {
    //   this.goodsModelTitle = "修改第三方商品";
    //   this.isShowEditGooods = true;
    //   this.$nextTick(() => {
    //     this.$refs.editGoodsComponent._initGoodsData(data);
    //   });
    // },

    // 关闭 Dialog 时清空 子组件里的数据
    closeEditGoodsDialog(done) {
      if (this.$refs.editGoodsComponent.isEditedGoods) {
        this._fetchOrderDetail();
      }
      this.$refs.editGoodsComponent._clearGoodsData();
      done();
    },
  },
};
</script>

<style lang="sass" scoped>
.container
  width: 100%
  min-height: 100vh
  display: flex
  position: relative
  .goods_menu
    width: 20%

  .order_container
      flex: 1

  .nav_container
    padding: 0 20px
    width: 100%
    height: 50px
    background: #eee

    .order_name
      margin-left: 30px
      margin-right: 20px
      line-height: 50px
      font-size: 16px

    .order_comment
      width: 500px
      overflow: hidden
      display: inline-block
      vertical-align: top
      line-height: 50px
      font-size: 16px
      color: #20a0ff
      cursor: pointer

      .small
        font-size: 14px
        color: #3a3a3a

    .pdf
      margin-top: 5px

  .content_box
    padding: 20px
    width: 100%
    height: auto
    .header
      margin-bottom: 10px
      width: 100%
      height: 36px
      line-height: 36px
      .subtitle
        font-size: 20px
        font-weight: 900
    .order_table
      width: 100%
      height: 100%

.fr 
  margin-left: 10px      
</style>
