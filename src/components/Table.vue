<template>
  <div class="div-table">
    <div class="div-table-row">
      <div class="div-table-col" v-for="(item,index) in columns">{{item}}</div>
    </div>
    <div class="div-table-row" v-for="(items,index) in tableData">
      <div class="div-table-col" v-for="(item,index) in items">{{item}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Table",
    props: ["columns", "tableData"],
    data: function () {
      return {}
    }
  }
</script>

<style scoped>
  .div-table {
    display: table;
    width: auto;
    background-color: #eee;
    border: 1px solid #666666;
    border-spacing: 5px; /* cellspacing:poor IE support for  this */
  }

  .div-table-row {
    display: table-row;
    width: auto;
    clear: both;
  }

  .div-table-col {
    float: left; /* fix for  buggy browsers */
    display: table-column;
    width: 200px;
    background-color: #ccc;
    border-right: antiquewhite solid;
    text-align: left;
  }
</style>
