<template>
  <d2-container>
<div>

  <p style="margin: 20px 0;">

  </p>
  <u-table
    ref="filterTable"
    :data="tableData"
    style="width: 100%">
    <u-table-column
      prop="ID"
      label="id"
      sortable
      width="90"
      column-key="ID"
    >
    </u-table-column>
    <u-table-column
      prop="PID"
      label="产品"
      width="120">
      <template slot-scope="scope">
        {{product[scope.row.PID]}}
      </template>
    </u-table-column>
    <u-table-column
      prop="WID"
      label="租借员工"
      width="120"
      >
      <template slot-scope="scope">
        {{worker[scope.row.WID]}}
      </template>
    </u-table-column>
    <u-table-column
      prop="BorrowTime"
      label="借出时间"
      width="150"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        {{formatTime(scope.row.BorrowTime,"Y/M/D h:m:s")}}
      </template>
    </u-table-column>
    <u-table-column
      prop="ScheduleTime"
      label="预计归还时间"
      width="150"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        {{formatTime(scope.row.ScheduleTime,"Y/M/D h:m:s")}}
      </template>
    </u-table-column>
    <u-table-column
      prop="ReturnTime"
      label="实际归还时间"
      width="150"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        {{scope.row.ReturnTime==0?'未归还':formatTime(scope.row.ReturnTime,"Y/M/D h:m:s")}}
      </template>
    </u-table-column>
    <u-table-column
      prop="Description"
      label="描述"
      width="120"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        {{scope.row.Description.split(":").length==1?scope.row.Description:scope.row.Description.split(":")[0] + ":" + worker[Number(scope.row.Description.split(":")[1])]}}
      </template>
    </u-table-column>
  </u-table>
</div>
</d2-container>
</template>

<script>
  import config from '@/libs/config.js'
  import common from '@/libs/common.js'

  export default {
    data() {
      return {
        tableData: [],
        product:[],
        worker:[]
      }
    },
    methods: {
      formatter(row, column) {
        return row.address;
      },
      updateData(){
          common.GetProductData("log").then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error("出现未知错误，请稍后重试")
          }).then(res=>{
            console.log(res)
            this.tableData = res.data
          })
      },
      formatTime(number,format) {

          var formateArr  = ['Y','M','D','h','m','s'];
          var returnArr   = [];

          var date = new Date(number * 1000);
          returnArr.push(date.getFullYear());
          returnArr.push(this.formatNumber(date.getMonth() + 1));
          returnArr.push(this.formatNumber(date.getDate()));

          returnArr.push(this.formatNumber(date.getHours()));
          returnArr.push(this.formatNumber(date.getMinutes()));
          returnArr.push(this.formatNumber(date.getSeconds()));

          for (var i in returnArr)
          {
            format = format.replace(formateArr[i], returnArr[i]);
          }
          return format;
       },

      //数据转化
      formatNumber(n) {
          n = n.toString()
          return n[1] ? n : '0' + n
       },
       getWorker(){
         common.GetWorkData("workers").then(res=>res.json()).catch(err=>{
           console.log(err)
           this.$message.error('无法读取员工信息')
           return err
         }).then(res=>{
           console.log(res.data)
           if(res.data.workers === undefined){
             this.$message.error('读取员工信息时出错，请稍后重试')
             return
           }
           for(let temp of res.data.workers){
             this.worker[temp.ID] = temp.Name
           }
         })
       },
       getProduct(){
         common.GetProductData("").then(res=>res.json()).catch(err=>{
           console.log(err)
           this.$message.error('无法读取员工信息')
           return err
         }).then(res=>{
           console.log(res.data)
           if(res.data === null){
             return
           }
           if(res.data === undefined){
             this.$message.error('读取产品表出错，请稍后重试')
             return
           }
           for(let temp of res.data){
             this.product[temp.id] = temp.product_name
           }
         })
       },
       AuthTokenExpires(){
         if(localStorage.getItem("expires")==undefined || localStorage.getItem("expires") < Date.parse(new Date()/1000)){
           localStorage.removeItem("token")
           localStorage.removeItem("expires")
           this.$alert('token已过期，需要重新登陆','token过期了',{
               confirmButtonText:'确定',
               callback:_=>{
                 this.$router.push('/login')
               }
           })
         }
       }
    },
    mounted() {
      this.AuthTokenExpires()
      this.updateData()
      this.getWorker()
      this.getProduct()
    }
  }
</script>
