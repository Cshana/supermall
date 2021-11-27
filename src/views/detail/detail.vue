<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="dTop" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="scroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-info :goods="goods"></detail-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imgload="goodsimgload"
      ></detail-goods-info>
      <detail-param-info :paramInfo="paramInfo" ref="param"></detail-param-info>
      <detail-comment
        :comment-info="commentInfo"
        ref="comment"
      ></detail-comment>
      <goods-list :goods="recommends" ref="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
import { debounce } from "common/untils";

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backTop/BackTop";

import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailInfo from "./childComps/DetailInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailComment from "./childComps/DetailComment.vue";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";
export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      curreIndex: 0,
      showBack: false,
      isShowBackTop: false,
    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailComment,
    GoodsList,
    DetailBottomBar,
    BackTop,
  },
  created() {
    this.iid = this.$route.params.iid;

    getDetail(this.iid).then((res) => {
      //获取轮播数据
      this.topImages = res.result.itemInfo.topImages;
      const data = res.result;

      //获取商品基本信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //获取商家详情
      this.shop = new Shop(data.shopInfo);

      //获取商家详情图片
      this.detailInfo = data.detailInfo;

      //获取参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //保存评论(如果有)
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
    });

    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE);
    }, 100);
  },
  methods: {
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    goodsimgload() {
      this.$refs.scroll.scroll.refresh();
      this.getThemeTopY();
    },
    scroll(position) {
      this.isShowBackTop = -position.y > 1000;
      for (let i = 0; i < this.themeTopYs.length - 1; i++) {
        if (
          this.curreIndex !== i &&
          -position.y >= this.themeTopYs[i] &&
          -position.y < this.themeTopYs[i + 1]
        ) {
          this.curreIndex = i;
          this.$refs.dTop.curreIndex = this.curreIndex;
        }
      }
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
    addToCart(){
       const obj = {};
      // 2.对象信息
      obj.iid = this.iid;
      obj.imgURL = this.topImages[0];
      obj.title = this.goods.title;
      obj.desc = this.goods.desc;
      obj.newPrice = this.goods.nowPrice;
      this.$store.commit('addCart',obj)
    }
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px - 49px);
}
</style>