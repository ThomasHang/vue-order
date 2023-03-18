<template>
  <div class="imglist">
    {name} :
    <div
      class="el-img-list"
      v-if="
        orderDetail.contractImages !== undefined &&
        orderDetail.contractImages != null &&
        orderDetail.contractImages.length > 0
      "
    >
      <div
        class="el-img-list-item"
        v-for="img in orderDetail.contractImages"
        :key="img"
      >
        <el-image class="el-img-list__item-thumbnail" :src="getUrl(img)">
        </el-image>
        <span class="el-img-list__item-actions">
          <span class="el-img-list__item-see_l" @click="openDialog(img)">
            <i class="el-icon-zoom-in" />
          </span>
          <span
            class="el-img-list__item-see_r"
            @click="deleteImg(img, orderDetail, 1)"
            :style="{ display: saveDisplay }"
          >
            <i class="el-icon-delete" />
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

      <!--上传图片-->
      <div
        class="item_i"
        @click="uploadDialog()"
        :style="{ display: saveDisplay }"
      >
        <i slot="default" class="el-icon-plus" />
      </div>
    </div>

    <el-dialog
      class="dia"
      :visible.sync="uploadDialogVisible"
      style="z-index: 0"
    >
      <div slot="title" class="dia-title">选择需要上传的图片:</div>
      <el-form>
        <el-form-item prop="img" :rules="[]">
          <el-upload
            ref="my-upload"
            :class="{ 'upload-img': dealImagesFileList.length }"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :multiple="false"
            :file-list="dealImagesFileList"
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

      <el-button
        class="btn_area_upload fr"
        type="primary"
        @click="saveUploadFile(orderDetail, 1)"
        >确认上传</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import { backgroundImage } from "common/js/mixins";
import { fromJS } from "immutable";

export default {
  props: ["name"],
  data() {
    return {
      dealImagesFileList: [],
      dealImagesUrlList: [],
      modifyDisplay: "",
      saveDisplay: "none",
      modifyVisible: true,
      tpDialogVisible: false,
      tpDeliverVisible: false,
      uploadDialogVisible: false,
      uploadDeliverVisible: false,
      dialogCommentForm: false,
      currentEditCommentIndex: 0,
      urlList: [],
      deliverUrlList: [],
    };
  },

  mixins: [backgroundImage],

  filters: {},

  computed: {},

  beforeCreate() {},

  created() {},

  methods: {
    // 拼接图片的地址
    getUrl(item) {
      // if (!item) {
      //   return require("../../../common/image/default.png");
      // } else {
      //   return process.env.BASE_API + "/new-order/IoReadImage/" + item;
      // }

      // if (item) {
      //   return process.env.BASE_API + "/new-order/IoReadImage/" + item;
      // }

      if (item) {
        return "http://img.geweijian.top/" + item;
      }
    },
    // 上传合同照片
    uploadDialog() {
      this.uploadDialogVisible = true;
    },

    uploadDeliverDialog() {
      this.uploadDeliverVisible = true;
    },

    // 修改编辑状态
    modify() {
      this.modifyVisible = false;
      this.saveDisplay = "";
      this.modifyDisplay = "none";
    },

    // 修改编辑状态
    cancelModify() {
      this.modifyVisible = true;
      this.saveDisplay = "none";
      this.modifyDisplay = "";
    },

    openCommentDialog(index) {
      this.dialogCommentForm = true;
      this.currentEditCommentIndex = index;
    },

    deleteImg(img, orderDetail, type) {
      if (type == 1) {
        var list = orderDetail.contractImages;

        list.map((item, index) => {
          if (item == img) {
            orderDetail.contractImages.splice(index, 1);
          }
        });
      }

      if (type == 2) {
        var list = orderDetail.deliverImages;
        list.map((item, index) => {
          if (item == img) {
            orderDetail.deliverImages.splice(index, 1);
          }
        });
      }
    },

    //  查看图片预览
    openDialog(url) {
      this.urlList.length = 0;
      this.urlList.push(url);
      this.tpDialogVisible = true;
    },

    //  查看图片预览
    openDeliverDialog(url) {
      this.deliverUrlList.length = 0;
      this.deliverUrlList.push(url);
      this.tpDeliverVisible = true;
    },

    //添加文件
    handleChange(file) {
      this.dealImagesFileList.push(file);
      let fd = new FormData();
      //文件信息中raw才是真的文件
      fd.append("file", file.raw);
      this.$http.put("/common/file/upload/qiniu", fd).then((res) => {
        this.dealImagesUrlList.push({ old: file.url, url: res });
      });
    },

    //删除文件
    handleRemove(file) {
      const index2 = this.dealImagesUrlList.indexOf(file.url);
      this.dealImagesUrlList.splice(index2 - 1, 1);
      this.dealImagesFileList.splice(index2 - 1, 1);
    },

    // 保存压测的文件去修改展示
    saveUploadFile(orderDetail, type) {
      if (type == 1) {
        var list = orderDetail.contractImages ? [] : orderDetail.contractImages;
        this.dealImagesUrlList.map((item) => {
          list.push(item.url);
        });
        orderDetail.contractImages = list;
        this.uploadDialogVisible = false;
      }

      if (type == 2) {
        var list = orderDetail.deliverImages ? [] : orderDetail.deliverImages;
        this.dealImagesUrlList.map((item) => {
          list.push(item.url);
        });
        orderDetail.deliverImages = list;
        this.uploadDeliverVisible = false;
      }
      this.dealImagesUrlList = [];
      this.dealImagesFileList = [];
    },
  },
};
</script>

<style lang="sass" scoped>
.goods_info
  width: 100%
  height: 100%
  .item_list
    width: 90%
    height: 100%
    font-size: 20px
    list-style: none
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    .item_li
      height: 50px
      width: 45%
      margin: 10px
      padding-left: 80px
      display: flex
      justify-content: space-between
      line-height: 50px
      .filter-item
        width: 300px
    .el-img-list
      width: 100%
      height: 200px
      display: table
      flex-wrap: wrap
      margin-top: 20px
      .el-img-list-item
        position: relative
        width: 200px
        height: 200px
        display: inline-block
        margin-left: 10px
        .el-img-list__item-thumbnail
          border: 1px solid
          height: 200px
          width: 200px
          display: inline-block
        .el-img-list__item-actions
          width: 60px
          height: 60px
          position: absolute
          right: 10px
          top: 10px
          .el-img-list__item-see_l
            height: 100%
            width: 100%
            position: absolute
            right: 69px
            top: -4px
          .el-img-list__item-see_r
            height: 100%
            width: 100%
            position: absolute
            right: 30px
            top: -4px
.item_i
  height: 80px
  width: 80px
  border: 1px dotted
  margin: 10px
  border-radius: 10px
  display: inline-block
  justify-content: center
  margin-top: 20px
.el-icon-plus
  line-height: 80px
  width: 80px
  text-align: center
.imglist
  padding-left: 80px
  height: auto
  margin: 10px
  width: 1200px
.item_text
  padding-left: 80px
  width: 100%
  margin: 10px
  height: 200px

.btn_area
  position: fixed
  right: 10px
  bottom: 10px
  margin: 20px
  .edit_button
    margin-right: 20px

.btn_area_upload
  position: absolute
  right: 10px
  bottom: 10px
  margin: 20px
  .edit_button
    margin-right: 20px

.mt
  margin-top: auto

.el-img-list__item-thumbnail /deep/
  .el-upload-list__item-actions
    display: inline-block
  .el-upload--picture-card
    height: 200px
    width: 200px
    margin-top: -94px
    line-height: 200px
.el-upload-list-item
  height: 200px
  width: 200px
  border: 1px dotted

/deep/
.dia
  height: 100%
  width: 100%
  .dia-title
    height: 20px
    line-height: 20px
    margin-top: 10px
  .el-dialog__header
    height: 20px
    width: 100%
  .el-dialog__body
    margin-top: 10px
    padding: 20px
</style>
