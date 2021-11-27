<template>
  <div class="TabControl">
    <div
      v-for="(item, index) in titles"
      :key="index"
      class="TabControlItem"
      :class="{ active: index === currentindex }"
      @click="itemClick(index)"
    >
      <span>{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentindex: 0,
    };
  },
  methods: {
      itemClick(index){
          this.currentindex = index;
          this.$emit('tabClick',index)
      }
  },
};
</script>

<style>
.TabControl {
  display: flex;
  text-align: center;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  background-color: #fff;
}
.TabControlItem {
  flex: 1;
}
.TabControlItem span {
  padding: 5px;
}
.active {
  color: var(--color-high-text);
}
.active span {
  border-bottom: 3px solid var(--color-tint);
}
</style>