<!--
后端 : https://github.com/milvus-io/bootcamp/tree/master/solutions/image/reverse_image_search/quick_deploy
-->

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
              action="#"
              v-loading="avatarLoading"
              element-loading-text="图片上传中"
              element-loading-spinner="el-icon-loading"
              :show-file-list="false"
              :http-request="handleAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <div class="batch-box">
          <el-input
              v-model="batchInput"
              placeholder="输入路径"
              clearable
              size="small"
              prefix-icon="el-icon-paperclip"
          />
          <el-button
              :disabled="batchInput.length === 0"
              plain
              size="small"
              type="primary"
              @click="handleBatchBtn">
            入库
          </el-button>
        </div>


        <!-- 清除 -->
        <el-popconfirm title="确定删除吗？">
          <el-button
              slot="reference"
              class="clear-btn"
              plain
              type="danger"
              size="small"
              @confirm="handleClear">
            清除
          </el-button>
        </el-popconfirm>
        <div class="img-list-count">
          图片库总数 : {{ listCount }}
        </div>
      </div>
      <div
          class="right-box"
          v-loading="imgLoading"
          element-loading-text="图片识别中"
          element-loading-spinner="el-icon-loading"
      >
        <div class="image-list" v-if="fitList.length > 0">
          <div class="image-item"
               v-for="(fit,index) in fitList"
               :key="index">
            <el-image
                lazy
                :preview-src-list="srcList"
                class="image-img"
                :src="fit.url"
                fit="contain"/>
            <span class="image-floating-window">
              {{ fit.similarity.toFixed(2) }}
            </span>
          </div>
        </div>
        <el-empty class="no-data" v-else description="请先上传需要识别的图片"></el-empty>
        <div class="count-box">
          识别图片总数 : {{ fitList.length }}
        </div>
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
      imageUrl: '', // 上传单张的图片
      avatarLoading: null,  // 上传单张图片 loading
      // 图片列表
      fitList: [],
      listCount: 0, // 列表总数
      imgLoading: null,  // 列表 loading
      srcList: [], // 图片放大预览
      batchInput:'' // 路径
    }
  },

  created() {
    this.getCount()
  },

  methods: {
    // 识别图片上传
    async handleAvatarUpload(param) {
      this.avatarLoading = true
      const formData = new FormData()
      formData.append('image', param.file)
      let res = await this.$request.post('img/upload',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
      )
      if (res) {
        // 上传成功 , 更改上传的图片的回显
        this.imageUrl = URL.createObjectURL(param.file);
        this.avatarLoading = false
        this.$message({type: 'success', message: '图片上传成功'})

        // 搜索图片
        await this.getSearchImg(formData)
      }
    },

    // 搜索所上传的图片
    async getSearchImg(formData) {
      let res = await this.$request.post('img/search',
          formData,
          {headers: {'Content-Type': 'multipart/form-data'}}
      )
      if (res.length > 0) {
        // 处理数据 (二维数组转一维)
        let tempArr = []
        res.forEach(item => {
          tempArr.push({
            url: item[0],
            similarity: item[1]
          })
        })
        this.$message({type: 'success', message: '图片搜索成功'})
        await this.getImgList(tempArr)
      }
    },

    // 获取图片列表数据
    async getImgList(arr) {
      this.imgLoading = true
      this.fitList = []
      this.srcList = []

      for (const item of arr) {
        let res = await this.$request.get('data', {
          image_path: item.url
        }, {
          responseType: 'arraybuffer', // 用于处理流转图片
        })

        let binary = "";
        let bytes = new Uint8Array(res);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let imgUrl = "data:img/png;base64," + window.btoa(binary);
        this.fitList.push({
          url: imgUrl,
          similarity: item.similarity
        })

        // 排序
        this.fitList = this.fitList.sort((a, b) => a.similarity - b.similarity)
        this.srcList.push(imgUrl)
        this.imgLoading = false
      }

      await this.getCount()
      this.$message({type: 'success', message: '图片识别完毕'})
    },

    // 获取总数
    async getCount() {
      this.listCount = await this.$request.post('img/count') || 0
    },

    // 清除按钮
    async handleClear() {
      let res = await this.$request.post('img/drop')
      console.log(res);
      await this.getCount()
      // todo 请求数据
    },

    async handleBatchBtn() {
      let res = await this.$request.post('/img/load', {
        Table: 'string',
        File: this.batchInput
      })
      console.log(res);
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

      .batch-box {
        width: 180px;

        .el-input {
          width: 100%;
          margin: 20px 0;
        }

        .el-button {
          width: 100%;
          margin-bottom: 20px;
        }
      }

      .clear-btn {
        width: 180px;
      }

      .img-list-count {
        text-align: center;
        margin-top: 20px;
        color: #333333;
        font-size: 16px;
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
          width: 170px;
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

          .image-img {
            width: 100%;
            height: 100%;
            border-radius: 5px;
            border: 1px dashed #ccc;
            padding: 10px;
            box-sizing: border-box;
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
