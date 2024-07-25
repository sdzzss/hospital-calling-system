<template>
  <router-view/>
</template>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar{
  width: 5px;
  position: absolute;
}
::-webkit-scrollbar-thumb{
  background: #1890ff;
}
::-webkit-scrollbar-track{
  background: #add;
}
.el-popper{
    z-index: 12005 !important;
}
</style>
