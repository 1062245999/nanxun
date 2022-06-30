<template>
  <div class="scenic-detail component">
    <div class="img-box">
      <img src="../../static/images/icon_back@2x.png" alt="" @click="back" />
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in scenic_detail.img" :key="index">
          <img :src="base_url + item.pic" alt="" class="scenic-img" />
        </van-swipe-item>
      </van-swipe>
      <i></i>
    </div>
    <div class="title">
      <div>
        <p>{{ scenic_detail.name }}</p>
        <p>{{ scenic_detail.address }}</p>
      </div>
      <img
        @click="
          jumpMap(
            scenic_detail.longitude,
            scenic_detail.latitude,
            scenic_detail.name
          )
        "
        src="../../static/images/icon_daohang@2x.png"
        alt=""
      />
    </div>
    <div class="info">
      <p>景区介绍</p>
      <p class="detail-text" v-html="scenic_detail.pointInfo"></p>
      <img
        :src="base_url + (scenic_detail.img[0] ? scenic_detail.img[0].pic : '')"
        alt=""
        class="scenic-img"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getScenicDetail } from "@/api/index";
import { ScenicDetailData, initScenicDetail } from "@/views/Index/Index";
@Component
export default class ScenicDetail extends Vue {
  scenic_detail: ScenicDetailData = initScenicDetail();
  base_url: string = process.env.VUE_APP_BASE_URL;
  async created() {
    const id: number = +this.$route.query.id;
    const res = await getScenicDetail(id);
    this.scenic_detail = initScenicDetail(res.data);
  }
  // 跳转到高德地图页面
  jumpMap(target_lng: number, target_lat: number, name: string) {
    const lng: any = sessionStorage.getItem("lng");
    const lat: any = sessionStorage.getItem("lat");
    let url =
      "http://uri.amap.com/navigation?from=" +
      lng +
      "," +
      lat +
      ",我的位置&to=" +
      target_lng +
      "," +
      target_lat +
      "," +
      name +
      "&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0";
    window.location.href = url;
  }
  back() {
    this.$router.back();
  }
}
</script>
<style lang="less" scoped>
.scenic-detail {
  position: relative;
  .img-box {
    position: relative;
    width: 375px;
    height: 225px;
    .my-swipe {
      width: 100%;
      height: 100%;
      img {
        width: 375px;
        height: 225px;
      }
    }
    > img:first-child {
      width: 24px;
      height: 24px;
      position: absolute;
      left: 22px;
      top: 22px;
      z-index: 1;
    }
    i:last-child {
      width: 375px;
      height: 75px;
      opacity: 0.98;
      background: linear-gradient(180deg, rgba(250, 250, 250, 0), #fafafa 100%);
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .title {
    position: absolute;
    top: 206px;
    left: 50%;
    transform: translateX(-50%);
    width: 350px;
    height: 88px;
    background: white;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    > div {
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      p:first-child {
        font-size: 18px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: LEFT;
        color: #333333;
        line-height: 18px;
      }
      p:last-child {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: LEFT;
        color: #666666;
        line-height: 14px;
      }
    }
    img {
      width: 28px;
      align-self: flex-end;
      height: 28px;
    }
  }
  .info {
    overflow-y: scroll;
    margin-top: 77px;
    width: 350px;
    height: 350px;
    background: #ffffff;
    border-radius: 8px;
    padding: 12px;
    margin: 77px auto 0;
    p:first-child {
      font-size: 16px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: LEFT;
      color: #333333;
      line-height: 16px;
      margin-bottom: 8px;
    }
    .detail-text {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: LEFT;
      color: #666666;
      line-height: 26px;
      letter-spacing: -0.03px;
      margin-bottom: 8px;
    }
    img {
      width: 325px;
      height: 195px;
      border-radius: 4px;
    }
  }
  .info::-webkit-scrollbar {
    display: none;
    width: 0;
  }
}
</style>