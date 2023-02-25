<template>
  <div class="container">
    <keep-alive>
      <goods-menu @click="onMenuChange" class="goods_menu"></goods-menu>
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
        </div>

        <order-table-layout/>
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
    width: 10%

  .order_container
      flex: 1

  .nav_container
    padding: 0 20px
    width: 100%
    height: 40px
    background: #eee

  .content_box
    padding: 10px
    width: 100%
    height: auto
    text-align: center
    border-bottom: 1px solid silver
    .header
      margin-bottom: 10px
      width: 100%
      height: auto
      .subtitle
        font-size: 30px
        font-weight: 900    
</style>
