<template>
  <div class="home">
    <div class="header-box">
      <div class="logo">logo</div>
    </div>

    <div class="content-box">
      <div class="left-box">
        <!-- 图片上传 -->
        <div class="avatar-uploader">
          <p class="avatar-uploader-title">上传需要识别的图片</p>
          <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleImgSuccess"
              :before-upload="beforeImgUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <!-- 图片上传入库 -->
        <el-upload
            class="batch-upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :file-list="batchFileList">
          <el-button plain size="small" type="primary">批量上传入库</el-button>
        </el-upload>
        <!-- 清除 -->
        <el-button class="clear-btn" plain type="danger" size="small">清除</el-button>
      </div>
      <div class="right-box">
        <div class="image-list" v-if="fitList.length > 0">
          <div class="image-item"
               v-for="(fit,index) in fitList"
               :key="index">
            <el-image
                style="width: 100%; height: 100%"
                :src="fit.url"
                fit="contain"/>
            <span class="image-floating-window">相识度 : {{ fit.similarity }}%</span>
          </div>
        </div>
        <el-empty class="no-data" v-else description="请先上传需要识别的图片"></el-empty>
        <div class="count-box">总数 : {{ listCount }}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      batchFileList: [], // 批量上传
      imageUrl: '', // 上传的图片
      // 图片列表
      fitList: [
        // {
        //   id: 1,
        //   url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        //   similarity: '123'
        // },
      ],
      listCount: 12412, // 列表总数
    }
  },

  created() {
    // this.fitList = new Array(20).fill(this.fitList[0])
  },


  methods: {
    handleImgSuccess() {
    },
    beforeImgUpload() {
    },
  }
}
</script>

<style>
body, html {
  background: #f5f5f5;
}
</style>

<style lang="scss" scoped>

.home {
  width: 1200px;
  border: 1px solid #ccc;
  height: 600px;
  margin: 0 auto;
  padding: 0 20px 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;

  .header-box {
    width: 100%;
    border-bottom: 1px solid #ccc;
    padding: 10px;
    box-sizing: border-box;

    .logo {
      font-size: 20px;
    }
  }

  .content-box {
    flex: 1;
    display: flex;

    .left-box {
      height: 100%;
      width: 200px;
      border-right: 1px solid #ccc;
      padding-right: 20px;

      .avatar-uploader {
        ::v-deep .el-upload {
          border: 1px dashed #ccc;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          &:hover {
            border-color: #409EFF;
          }
        }

        .avatar-uploader-title {
          margin-left: 20px;
          color: #333;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }

        .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
      }

      .batch-upload {
        .el-button {
          width: 180px;
          margin: 20px 0;
        }
      }

      .clear-btn {
        width: 180px;
      }
    }

    .right-box {
      width: 100%;

      .no-data {
        height: 500px;
      }

      .image-list {
        height: 500px;
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;

        .image-item {
          max-width: 300px;
          height: 150px;
          position: relative;
          cursor: pointer;
          margin-left: 20px;
          margin-top: 20px;

          &:hover {
            .image-floating-window {
              display: block;
            }
          }

          .image-floating-window {
            display: none;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            text-align: center;
            font-size: 14px;
            padding: 5px 0;
          }
        }
      }

      .count-box {
        font-size: 20px;
        display: flex;
        justify-content: end;
        align-items: center;
        padding-right: 40px;
        padding-top: 10px;
        color: #333;
      }
    }
  }
}
</style>
