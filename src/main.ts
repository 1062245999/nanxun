import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Swipe, SwipeItem } from 'vant';
import "vant/es/swipe/style";
import "vant/es/swipe-item/style";
import { Loading } from 'element-ui';
import $ from "jquery";
import sha1 from "sha1";
const wx: any = window["wx" as any] || require("weixin-js-sdk");
function getUrl() {
  const url = window.location.href;
  //正常的，如果后续调用微信jssdk传值时官方手册原有的window.location.href.split("#")[0]提示url报错的话，使用encodeURIComponent()函数处理下就好，下面附上相关代码截图
  // let locationurl = encodeURIComponent(url.split('#')[0]);
  const locationurl = url.split("#")[0];
  // let locationurl = url;
  console.log(locationurl);
  return locationurl;
}
const api_list = [
  "getLocation",
  "onMenuShareTimeline",
  "updateAppMessageShareData",
  "updateTimelineShareData",
  "startRecord",
  "stopRecord",
  "onVoiceRecordEnd",
  "playVoice",
  "pauseVoice",
  "stopVoice",
  "onVoicePlayEnd",
  "uploadVoice",
  "downloadVoice",
  "chooseImage",
  "previewImage",
  "uploadImage",
  "getLocalImgData",
  "downloadImage",
  "translateVoice",
  "getNetworkType",
  "openLocation",
  "getLocation",
  "hideOptionMenu",
  "showOptionMenu",
  "hideMenuItems",
  "showMenuItems",
  "hideAllNonBaseMenuItem",
  "showAllNonBaseMenuItem",
  "closeWindow",
  "scanQRCode",
  "chooseWXPay",
  "openProductSpecificView",
  "addCard",
  "chooseCard",
  "openCard",
  "miniProgram",
];
$.ajax({
  url: "https://t.worldmaipu.com/api/v1/wx!FindJsApiTicjet.action?appid=wxfc93a7b56a54e5c0",
  dataType: "jsonp",
  data: {},
}).then(async (res: any) => {
  const ret = {
    appId: "wxfc93a7b56a54e5c0",
    timestamp: parseInt((new Date().getTime() / 1000) as any),
    nonceStr: Math.random().toString(36).substr(2),
    jsapi_ticket: res.data.ticket,
    signature: "",
    url: getUrl(),
  };
  const string =
    "jsapi_ticket=" +
    ret.jsapi_ticket +
    "&noncestr=" +
    ret.nonceStr +
    "&timestamp=" +
    ret.timestamp +
    "&url=" +
    ret.url;
  ret.signature = sha1(string);
  wx.config({
    debug: false,
    appId: ret.appId,
    timestamp: ret.timestamp,
    nonceStr: ret.nonceStr,
    jsapi_ticket: ret.jsapi_ticket,
    signature: ret.signature,
    url: ret.url,
    jsApiList: api_list,
  });
});
wx.ready(function () {
  console.log("ready");
  wx.checkJsApi({
    jsApiList: api_list,
    success(res: any) {
      console.log("checkJsApi成功=====", res);
    },
  });
  wx.getLocation({
    type: "gcj02", // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
    success: function (res: any) {
      // success
      console.log("获取微信定位成功！");
      console.log(res);
      // let lat = res.latitude;
      // let lng = res.longitude;
      sessionStorage.setItem("lat", res.latitude);
      sessionStorage.setItem("lng", res.longitude);
      console.log(sessionStorage.setItem("lat", res.latitude));
    },
  });
});
Vue.prototype.openLocation = function (name: any) {
  console.log("Vue.prototype", Vue.prototype);
  console.log("wx", wx);
  wx.openLocation({
    latitude: Number(name.latitude), // 纬度，范围为-90~90，负数表示南纬
    longitude: Number(name.longitude), // 经度，范围为-180~180，负数表示西经
    scale: 28, // 缩放比例
    name: name.name, // 位置名
    address: name.address, // 地址的详细说明
    success: function (res: any) {
      // success
      console.log("res", res);
    },
    fail: function (err: any) {
      console.log("err", err);
      // fail
    },
    complete: function () {
      // complete
    },
  });
};
Vue.prototype.wxGetLocation = function () {
  wx.getLocation({
    type: "wgs84",
    success(res: any) {
      console.log("在微信,调用了微信的定位success");
      console.log("wxres", res);
    },
    fail(err: any) {
      console.log("在微信,调用了微信的定位error");
      console.log("wxerr", err);
    },
  });
};
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Loading)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


