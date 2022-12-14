<template>
  <div class="component" id="index">
    <div :class="['bottom-menu', line_detail_modal_class_name]">
      <div @touchstart="touchstart" @touchmove="touchmove">
        <div v-for="(item, index) in init_data.pointTypeBOS" :key="index" @click="clickMenuItem(index)" :class="{
          'menu-item': true,
          'active-menu-item': active_menu === index,
        }">
          <i>
            <img :src="base_url + (active_menu === index ? item.picIn : item.pic)" alt="" v-if="index !== 0" />
            <img v-else :src="active_menu === index ? item.picIn : item.pic" alt="" />
          </i>
          <span>{{ item.name }}</span>
        </div>
      </div>
      <div>
        <div class="left">
          <div v-for="(item, index) in street_data" :key="index"
            :class="{ town: true, 'town-active': active_town === index }" @click="changeTown(index)">
            {{ item.name }}
          </div>
        </div>
        <div class="right">
          <div class="scenic-item" v-for="(item, index) in filter_point" :key="index" @click="clickPoint(item)">
            <img :src="base_url + item.pic" v-if="item.isDetails" />
            <div class="info">
              <p :class="{
                'blue-color': active_marker
                  ? item.id === active_marker.id
                  : '',
              }">
                {{ item.name }}
              </p>
              <p v-if="!item.isDetails" :class="{
                'blue-color': active_marker
                  ? item.id === active_marker.id
                  : '',
              }" style="margin-top: 8px">
                距您{{ item.distance / 10000 }}km
              </p>
              <p>
                <template v-if="item.isDetails">
                  <img v-if="item.id === (active_marker ? active_marker.id : '')"
                    src="../../static/images/icon_address_se@2x.png" alt="" />
                  <img v-else src="../../static/images/icon_address@2x.png" alt="" />
                </template>
                <span :class="{
                  'blue-color': active_marker
                    ? item.id === active_marker.id
                    : '',
                }">{{ item.address }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <i @touchstart="touchstart" @touchmove="touchmove"></i>
    </div>
    <div class="position-icon" @click="moveCenter" v-show="!line_detail_modal_class_name">
      <img src="@/static/images/icon_location@2x.png" alt="" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AMapLoader from "@amap/amap-jsapi-loader";
import { initData, getStrreet, getScenic } from "@/api/index";
import close_icon from "@/static/images/icon_close@2x.png";
import arrow_icon from "@/static/images/arrow@2x.png";
import nav_icon from "@/static/images/icon_navigation@2x.png";
import {
  InitData,
  initDataFn,
  text_style,
  box_style,
  infoWindowStyle,
  StreetData,
  PointBos,
} from "./Index";
import all_icon from "@/static/images/icon_all@2x.png";
import all_icon_select from "@/static/images/icon_all_selected@2x.png";
@Component
export default class Index extends Vue {
  base_url: string = process.env.VUE_APP_BASE_URL;
  map: any = null; // 地图实例化对象
  AMap: any = null; // 地图构造函数
  init_data: InitData = initDataFn(); // 初始化数据
  active_menu: number = 0; // 当前点击的菜单
  cluster: any = null; // 点聚合实例化对象;
  cluster_marker_list: any[] = []; // 点聚合的marker点;
  active_marker: any = null; // 当前点击的marker点
  info_window: any = null; // 信息窗口
  street_data: StreetData[] = []; // 街道数据
  start_y = 0; // 手指按下位置
  move_x = 0;
  move_y = 0;
  line_detail_modal_class_name: string = ""; // 路线详情模态窗的类名
  active_town: number = 0; // 当前选中的城镇
  filter_point: PointBos[] = []; // 底部列表中的点位;
  img_style: string = "margin: 0 auto 1.067vw;";
  water_line: any = null;
  // 定位到当前位置
  moveCenter() {
    const lng = sessionStorage.getItem("lng");
    const lat = sessionStorage.getItem("lat");
    this.map.setCenter([lng, lat]);
  }

  // 初始化地图
  async initMap() {
    this.AMap = await AMapLoader.load({
      key: "cba65dc7d4bb4fe9a3725052efac8d31",
      version: "2.0",
      plugins: ["AMap.Geolocation", "AMap.MarkerClusterer"],
    });
    this.map = new this.AMap.Map("index", {
      zoom: this.init_data.scenicBO.showZoom,
      center: [
        this.init_data.scenicBO.longitude,
        this.init_data.scenicBO.latitude,
      ],
      // zooms: [this.init_data.scenicBO.minZoom, this.init_data.scenicBO.maxZoom],
    });
  }
  // 点击底部菜单
  async clickMenuItem(index: number) {
    this.map.setZoom(10);
    if (this.active_menu !== index) {
      this.active_menu = index;
    }
    if (index === 0) {
      this.line_detail_modal_class_name = "";
    }
    this.info_window?.close();
  }
  // 通过点聚合渲染marker点
  async showMarker() {
    const that: any = this;
    this.cluster = new this.AMap.MarkerClusterer(
      this.map,
      this.cluster_marker_list,
      {
        gridSize: 80,
        renderMarker: function (context: any) {
          context.marker.setContent(that.getMarkerDom(context).marker_content);
          context.marker.setOffset(new that.AMap.Pixel(-36, -33));
          context.marker.on("click", function () {
            that.active_marker = context.data[0].data;
            that.getInfowWindowDom(context.data[0].data);
            that.info_window.open(that.map, [
              context.data[0].data.longitude,
              context.data[0].data.latitude,
            ]);
            that.clickMarker(context);
          });
        },
        renderClusterMarker: function (context: any) {
          context.marker.setOffset(new that.AMap.Pixel(-36, -33));
          context.marker.setContent(
            that.getMarkerDom(context.clusterData[0], true)
              .cluster_marker_content
          );
          context.marker.on("click", function () {
            that.map.setZoomAndCenter(that.init_data.scenicBO.maxZoom - 1, [
              context.clusterData[0].data.longitude,
              context.clusterData[0].data.latitude,
            ]);
          });
        },
      }
    );
  }
  // 获取所有街道
  async getStreet() {
    const res = await getStrreet();
    this.street_data = res.data;
    this.street_data.unshift({
      id: "",
      name: "全部",
      sort: -1,
    });
  }
  // 获取景点
  async getPoint(
    pointTypeId: number,
    lng1: number,
    lat1: number,
    streetId: number | string
  ) {
    const res = await getScenic(pointTypeId, lng1, lat1, streetId);
    this.filter_point = res.data;
    this.filter_point.forEach((item: PointBos) => {
      item.isDetails = this.init_data.pointTypeBOS.filter((item2) => {
        return item.pointTypeId === item2.id;
      })[0].isDetails;
    });
  }
  // 切换街道
  async changeTown(index: number) {
    if (this.active_town != index) {
      this.active_town = index;
      await this.changeActiveMenu();
      const have_marker: number[] = this.filter_point.map((item: PointBos) => {
        return item.id;
      });
      if (this.street_data[this.active_town].id) {
        this.cluster.setData();
        this.cluster_marker_list = this.cluster_marker_list.filter(
          (item: any) => {
            return have_marker.indexOf(item.data.id) !== -1;
          }
        );
        await this.showMarker();
        this.info_window?.close();
      }
    }
  }
  // 点击底部弹窗的景点
  async clickPoint(item: PointBos) {
    this.water_line ? this.map.remove(this.water_line) : '';
    this.water_line = null;
    this.map.setZoomAndCenter(this.init_data.scenicBO.maxZoom, [
      item.longitude,
      item.latitude,
    ]);
    this.map.panBy(0, -150);
    this.active_marker = this.cluster_marker_list.filter((item2: any) => {
      return item2.data.id === item.id;
    })[0].data;
    this.getInfowWindowDom(this.active_marker);
    this.info_window.open(this.map, [
      this.active_marker.longitude,
      this.active_marker.latitude,
    ]);
    if (item.pointTypeId === 7 && item?.waterBOS?.length) {
      const path = item.waterBOS.map((waterBOS_item: any) => {
        return [waterBOS_item.longitude, waterBOS_item.latitude];
      });
      this.water_line = new this.AMap.Polyline({
        path,
        isOutline: true,
        outlineColor: 'white',
        borderWeight: 3,
        strokeColor: "#4A93FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        // 折线样式还支持 'dashed'
        strokeStyle: "solid",
        lineJoin: 'round',
        lineCap: 'round',
        zIndex: 50,
      });
      this.map.add(this.water_line);
      const marker = new this.AMap.Marker({
        position: [item.longitude, item.latitude],
      });
      this.map.setFitView([this.water_line, marker], false, [50, 300, 150, 60]);
    }
  }
  // 当点击地图上的marker点位时
  clickMarker(context: any) {
    this.active_marker = context.data[0].data;
    this.cluster_marker_list.forEach((item: any) => {
      item.data.markIcon = item.data.copy_markIcon;
    });
    context.data[0].data.markIcon = context.data[0].data.markSelectIcon;
    context.marker.setContent(this.getMarkerDom(context).active_marker_content);
  }
  // 获取要通过点聚合渲染的marker点
  getClusterMarkerList() {
    let marker_list = [];
    if (this.active_menu === 0) {
      marker_list = this.init_data.pointBOS;
    } else {
      marker_list = this.init_data.pointBOS.filter(
        (item) =>
          item.pointTypeId === this.init_data.pointTypeBOS[this.active_menu].id
      );
    }
    marker_list.forEach((item) => {
      const obj = {
        lnglat: [item.longitude, item.latitude],
        data: {
          ...item,
          copy_markIcon: this.init_data.pointTypeBOS.filter(
            (point_type_item: any) => point_type_item.id === item.pointTypeId
          )[0]?.icon,
          markIcon: this.init_data.pointTypeBOS.filter(
            (point_type_item: any) => point_type_item.id === item.pointTypeId
          )[0]?.icon,
          markSelectIcon: this.init_data.pointTypeBOS.filter(
            (point_type_item: any) => point_type_item.id === item.pointTypeId
          )[0]?.iconIn,
          color: this.init_data.pointTypeBOS.filter(
            (point_type_item: any) => point_type_item.id === item.pointTypeId
          )[0]?.color,
        },
      };
      this.cluster_marker_list.push(obj);
    });
  }
  // marker点样式
  getMarkerDom(context: any, is_cluster_marker = false) {
    var obj: any = {
      marker_content: "",
      active_marker_content: "",
    };
    obj.marker_content = `<div style="${box_style}">
            <img style="${this.img_style};width: 40px;height: 45px;" src='${this.base_url}${context?.data[0]?.data.markIcon}'/>
            <div style="${text_style};color:${context?.data[0]?.data.color}">${context?.data[0]?.data.name}</div>
          </div>`;
    obj.active_marker_content = `<div style="${box_style}">
              <img style="margin: 0 auto 1.067vw;width: 40px;height: 45px;" src='${this.base_url}${context?.data[0]?.data.markIcon}'/>
              <div style="${text_style};color:${context?.data[0]?.data.color}">${context?.data[0]?.data.name}</div>
            </div>`;
    if (is_cluster_marker) {
      obj.cluster_marker_content = `<div style="${box_style}">
            <img style="${this.img_style}width: 40px;height: 45px;" src='${this.base_url}${context.data.markIcon}'/>
            <div style="${text_style};color:${context.data.color}">${context.data.name}</div>
          </div>`;
    }
    return obj;
  }
  // infowindow窗口样式
  getInfowWindowDom(data: any) {
    this.info_window = new this.AMap.InfoWindow({
      isCustom: true, //使用自定义窗体
    });
    const point_type = this.init_data.pointTypeBOS.filter((item: any) => {
      return item.id === data.pointTypeId;
    });
    if (point_type[0].isDetails) {
      this.info_window.setContent(
        `<div style="${infoWindowStyle}">
          <img src='${close_icon}' style="position: absolute;right: 4px;top: 1.067px;width: 20px;height: 20px;" onclick="closeWindow()"/>
          <img src="${this.base_url}${this.active_marker.pic
        }"  style="width: 56px;height: 56px;border-radius: 2px;margin-right: 8px;"/>
          <div style="display: flex;flex-direction: column;justify-content:space-between;">
            <p style="width: 150px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;margin-bottom: 4px;text-align: left;font-size: 14;font-weight: 500;color: #444">${this.active_marker.name
        }</p>
            <p style="font-size: 12px;color: #848484;text-align: left;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;">${this.active_marker.synopsis.slice(
          0,
          19
        )}${this.active_marker.synopsis ? "..." : ""
        }<span onclick="jumpDetail()" style="color: #3E68FF">查看详情<img style="width: 16px;height: 16px;vertical-align: middle;display: inline-block;" src="${arrow_icon}"/></span></p>
          </div>
        </div>`
      );
      this.info_window.setOffset(new this.AMap.Pixel(0, -40));
    } else {
      this.info_window.setContent(`<div onclick="jumpMap(${this.active_marker.longitude
        },
        ${this.active_marker.latitude},
        '${this.active_marker.name}'
      )" style="display: flex;flex-direction: column;width: 80px;background: white;border-radius: 4px;padding: 6px 8px;">
        <div style="display: flex;flex-direction: row;width: 64px;height: 28px;background: #3E68FF;border-radius: 4px;align-items: center;justify-content: center;">
          <img style="width:16px;height: 16px;" src="${nav_icon}"/>
          <span style="color: white" onclick="jumpMap(${(this.active_marker.longitude,
          this.active_marker.latitude,
          this.active_marker.name)
        })">导航</span>
        </div>
        <span style="font-size: 12px;color: #848484;margin-top: 6px;">距您${this.filter_point.filter((item) => item.id === this.active_marker.id)[0].distance / 10000}km</span>
      </div>`);
      this.info_window.setOffset(new this.AMap.Pixel(0, -40));
    }
  }
  touchstart(e: any) {
    this.start_y = e.touches[0].clientY;
  }
  // 当当前菜单改变时获取这个点位下的景点
  @Watch("active_menu")
  async changeActiveMenu() {
    const lng: any = sessionStorage.getItem("lng");
    const lat: any = sessionStorage.getItem("lat");
    await this.getPoint(
      this.init_data.pointTypeBOS[this.active_menu].id,
      lng,
      lat,
      this.street_data[this.active_town].id
    );
    this.cluster_marker_list = [];
    this.cluster.setData();
    this.getClusterMarkerList();
    await this.showMarker();
    this.map.setFitView(null, false, [150, 150, 150, 150], 12);
  }
  async touchmove(e: any) {
    this.move_x = e.touches[0].clientX;
    this.move_y = e.touches[0].clientY;
    if (this.start_y - this.move_y >= 100) {
      this.line_detail_modal_class_name = "bottom-menu-active";
      if (this.active_menu === 0) {
        this.active_menu = 1;
      } else {
        this.active_menu = this.active_menu;
      }
    } else if (this.start_y - this.move_y <= -100) {
      this.line_detail_modal_class_name = "";
    }
  }
  async mounted() {
    const res = await initData();
    await this.getStreet();
    this.init_data = initDataFn(res.data);
    this.init_data.pointTypeBOS.sort((a, b) => a.sort - b.sort);
    this.init_data.pointTypeBOS.unshift({
      id: 0,
      pic: all_icon,
      picIn: all_icon_select,
      name: "全部",
      sort: 0,
    } as any);
    await this.initMap();
    await this.getGeolocation();
    this.init_data.pointBOS.forEach((item: any) => {
      item.isDetails = this.init_data.pointTypeBOS.filter(
        (point_type_item: any) => item.pointTypeId === point_type_item.id
      )[0]?.isDetails;
    });
    this.getClusterMarkerList();
    await this.showMarker();
  }
  created() {
    (window as any).closeWindow = this.closeWindow;
    (window as any).jumpDetail = this.jumpDetail;
    (window as any).jumpMap = this.jumpMap;
  }
  async closeWindow() {
    this.info_window?.close();
    this.cluster_marker_list = [];
    this.cluster.setData();
    this.getClusterMarkerList();
    await this.showMarker();
  }
  // 跳转到详情页
  jumpDetail() {
    this.$router.push({
      path: "/scenic-detail",
      query: {
        id: this.active_marker.id,
      },
    });
  }
  // 跳转到高德地图页面
  jumpMap(target_lng: number, target_lat: number, name: string) {
    const lng: any = sessionStorage.getItem("lng");
    const lat: any = sessionStorage.getItem("lat");
    var ua = navigator.userAgent.toLowerCase();
    if ((ua.match(/MicroMessenger/i) as any) == 'micromessenger') {
      //在微信就用微信地图
      (this as any).openLocation({
        name: name, // 位置名
        latitude: target_lat, // 纬度，浮点数，范围为90 ~ -90
        longitude: target_lng, // 经度，浮点数，范围为180 ~ -180。
        address: '', // 地址详情说明
        scale: 12, // 地图缩放级别,整形值,范围从1~28。默认为最大
        infoUrl: '', // 在查看位置界面底部显示的超链接,可点击跳转
      });
    } else {
      let url =
        'http://uri.amap.com/navigation?from=' +
        lng +
        ',' +
        lat +
        ',我的位置&to=' +
        target_lng +
        ',' +
        target_lat +
        ',' +
        name +
        '&mode=car&policy=1&src=mypage&coordinate=gaode&callnative=0';
      window.location.href = url;
    }
  }

  // 获取前定位
  async getGeolocation() {
    const that = this;
    const geolocation = await new this.AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
      // 定位按钮的停靠位置的偏移量
      offset: [10, 20],
      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true,
      //  定位按钮的排放位置,  RB表示右下
      position: "RB",
    });
    geolocation.getCurrentPosition(function (status: string, result: any) {
      if (status == "complete") {
        onComplete(result);
      } else {
        onError(result);
      }
    });
    function onComplete(data: any) {
      console.log('成功了');
      // data是具体的定位信息
      sessionStorage.setItem("lng", data.position.lng);
      sessionStorage.setItem("lat", data.position.lat);
    }
    function onError(data: any) {
      console.log('失败了');
      sessionStorage.setItem("lng", that.map.getCenter().lng);
      sessionStorage.setItem("lat", that.map.getCenter().lat);
    }
  }
}
</script>
<style lang="less" scoped>
#index {
  position: relative;

  .blue-color {
    color: #3e68ff !important;
  }

  .position-icon {
    position: absolute;
    width: 32px;
    height: 32px;
    opacity: 0.96;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 142px;
    right: 16px;
    z-index: 1;

    img {
      width: 22px;
      height: 22px;
    }
  }

  .bottom-menu {
    transition: all 0.3s;
    position: absolute;
    bottom: -292px;
    left: 0;
    z-index: 1;
    width: 375px;
    height: 396px;
    opacity: 0.98;
    background: #ffffff;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;

    >i {
      width: 56px;
      height: 4px;
      background: #cfd2db;
      border-radius: 2px;
      display: block;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -10px;
      z-index: 3;
    }

    >div:first-child {
      width: 100%;
      height: 104px;
      overflow-x: scroll;
      overflow-y: hidden;
      padding: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #f2f2f2;

      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 30px;

        i {
          display: block;
          width: 36px;
          height: 36px;
          margin-bottom: 2px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
        }

        img {
          width: 24px;
          height: 24px;
        }

        span {
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: CENTER;
          color: #666666;
          line-height: 12px;
          letter-spacing: -0.02px;
          white-space: nowrap;
        }
      }
    }

    >div:first-child::-webkit-scrollbar {
      width: 0;
      display: none;
    }

    >div:nth-child(2) {
      // width: 80px;
      height: 284px;
      display: flex;
      flex-direction: row;
      margin-top: 12px;
      padding-bottom: 30px;

      .left {
        overflow-y: scroll;

        .town {
          width: 80px;
          height: 36px;
          background: white;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          text-align: CENTER;
          color: #b1b1b5;
          line-height: 36px;
        }

        .town-active {
          background: #f2f4f9;
          color: #3e68ff;
        }
      }

      .left::-webkit-scrollbar {
        width: 0;
        display: none;
      }

      .right {
        width: 295px;
        height: 284px;
        padding-bottom: 30px;
        overflow-y: scroll;

        .scenic-item {
          display: flex;
          margin-bottom: 12px;
          padding-left: 8px;

          >img {
            width: 80px;
            height: 60px;
            margin-right: 8px;
            border-radius: 2px;
          }

          .info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;

            >p:first-child {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 180px;
              color: #444444;
              text-align: left;
            }

            >p:last-child {
              display: flex;
              width: 162px;

              img {
                width: 14px;
                height: 14px;
                margin-right: 2px;
              }

              span {
                display: block;
                width: 162px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 12px;
                font-family: PingFang SC, PingFang SC-Regular;
                font-weight: 400;
                text-align: LEFT;
                color: #666666;
                line-height: 12px;
                letter-spacing: -0.02px;
              }
            }
          }
        }
      }

      .right::-webkit-scrollbar {
        width: 0;
        display: none;
      }
    }

    .active-menu-item {
      i {
        background: #3e68ff;
      }

      span {
        color: #3e68ff;
      }
    }
  }

  .bottom-menu-active {
    bottom: 0;
  }
}
</style>