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
      prop="id"
      label="id"
      sortable
      width="90"
      column-key="id"
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
      prop="ReqWID"
      label="申请转借人"
      width="120"
      >
      <template slot-scope="scope">
        {{worker[scope.row.ReqWID]}}
      </template>
    </u-table-column>
    <u-table-column
      prop="RspWID"
      label="被转借人"
      width="120"
      >
      <template slot-scope="scope">
        {{worker[scope.row.RspWID]}}
      </template>
    </u-table-column>
    <u-table-column
      prop="Confirm"
      label="状态"
      width="120"
      >
      <template slot-scope="scope">
        {{scope.row.Confirm==1?'未响应':(scope.row.Confirm==2?'已确认':'已拒绝')}}
      </template>
    </u-table-column>
    <u-table-column
      prop="Reason"
      label="转借原因"
      width="120"
      >
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
          common.GetProductData("borrowlog").then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error("出现未知错误，请稍后重试")
          }).then(res=>{
            console.log(res.data)
            this.tableData = res.data
          })
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
