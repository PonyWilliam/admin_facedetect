<template>
  <d2-container class="container">
  <div class="header">
    <el-card class="header-card">
      <div slot="header" class="clearfix">
        <span>员工数量</span>
      </div>
      <div class="card-container">
          员工总数量:&nbsp;&nbsp;<span class="number">{{this.totalWorkers}}</span>
      </div>
    </el-card>
    <el-card class="header-card">
      <div slot="header" class="clearfix">
        <span>产品数量</span>
      </div>
      <div class="card-container">
          产品总数量:&nbsp;&nbsp;<span class="number">{{this.totalProducts}}</span>
      </div>
    </el-card>
    <el-card class="header-card">
      <div slot="header" class="clearfix">
        <span>租借数量(包括转借)</span>
      </div>
      <div class="card-container">
         租借总数量:&nbsp;&nbsp;<span class="number">{{this.totalBorrows}}</span>
      </div>
      <div class="card-footer">
          <div class="day7">最近7天租借数:{{this.recnt7dayBorrows}}</div>
          <div class="day30">最近30天租借数:{{this.recent30dayBorrows}}</div>
      </div>
    </el-card>
    <el-card class="header-card">
      <div slot="header" class="clearfix">
        <span>转借数量</span>
      </div>
      <div class="card-container">
          <span>转借申请数:&nbsp;&nbsp;{{this.reqBorrow}}</span>
      </div>
      <div class="card-footer2">
        <div>已同意:&nbsp;&nbsp;{{this.agreeBoorow}}</div>
        <div>已拒绝:&nbsp;&nbsp;{{this.RejectBorrow}}</div>
      </div>
    </el-card>
  </div>
  <div class="index">
    <el-card class="box-card">
      <div class="content">
        <div class="pie">
          <span class="tag" type="">产品地区分布</span>
          <ve-pie :data="AreaData"></ve-pie>
        </div>
        <div class="pie">
          <span class="tag" type="">产品所属分类</span>
          <ve-pie :data="Category"></ve-pie>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <span class="tag" type="">近7日租借数据(包含转借)</span>
      <ve-line :data="ProductLogData"></ve-line>
    </el-card>
<!--    <el-card class="box-card">
      <div class="content">

      </div>
    </el-card>
    <el-card class="box-card">
      <ve-line :data="ProductLogData"></ve-line>
    </el-card> -->
  </div>
  </d2-container>
</template>
<style lang="scss">
  .container{
    background:rgba(255,255,255,.05)
  }
  .d2-container-full__body{
    background:rgba(255,255,255,.25)!important;
  }
  .header{
      display: flex;
      .header-card{
          margin-left:2%;
          width: calc(90% / 4);
          box-sizing: border-box;
          transition: all .4s;
          backdrop-filter: blur(2px);
          border-radius: 15px;
          box-shadow: 3px 5px 6px rgba(0,0,0,.1),
          -3px 5px 6px rgba(32,32,32,.1),
          //12px -14px 12px rgba(0,0,0,.25),
          -4px -6px 6px rgba(0,0,0,.1)!important;
          .card-container{
              font-size:16px;
              line-height:30px;
              box-sizing: border-box;
              color:#555;
              span{
                  align-self: center;
                  font-size:26px;
                  line-height: 30px;
                  font-weight: 400;
                  color:#333;
              }
              padding-bottom: 15px;
          }
          .card-footer{
              line-height:30px;
              font-size:15px;
          }
        }
        .header-card:nth-child(1){
            background:rgba(255,255,255,.7)
        }
        .header-card:nth-child(2){
            background:rgba(255,255,255,.75)
        }
        .header-card:nth-child(3){
            background:rgba(255,255,255,.8)
        }
        .header-card:nth-child(4){
            background:rgba(255,255,255,.85)
        }
        .header-card:hover{
            background: rgba(255,255,255,.65);
            backdrop-filter: blur(8px);
            box-shadow: 4px 6px 6px rgba(0,0,0,.2),
            -5px 8px 8px rgba(32,32,32,.2),
            //12px -14px 12px rgba(0,0,0,.25),
            -5px -7px 7px rgba(0,0,0,.2)!important;
        }
  }
  .index{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .box-card{
        width:48%;
        box-sizing: border-box;
        margin-left:calc(4% / 3);
        margin-top:30px;
        box-shadow: 5px 7px 8px rgba(0,0,0,.1),
        -4px 6px 6px rgba(32,32,32,.1),
        //12px -14px 12px rgba(0,0,0,.25),
        -4px -6px 6px rgba(0,0,0,.1)!important;
        background:rgba(255,255,255,.8);
        transition:all .4s;
        backdrop-filter: blur(1px);
        border-radius: 15px;
        padding-bottom: 15px;
        .content{
            display: flex;
            flex-wrap: nowrap;
        }
        .content .pie{
            width:50%;
            box-sizing: border-box;
        }
    }
  }
  .box-card:hover{
    background:rgba(255,255,255,.85);
    box-shadow: 8px 10px 10px rgba(0,0,0,.12),
    -7px 9px 9px rgba(0,0,0,.12),
    //12px -14px 12px rgba(0,0,0,.25),
    -7px -9px 9px rgba(0,0,0,.12)!important;
    backdrop-filter: blur(10px);
  }
  .box-card-1 .content .pie{
    box-sizing: border-box;
    display: inline-block;
    width:48%;
    margin-left: calc(4% / 3);
    .tag{
      font-size:18px;
      line-height: 36px;
      margin-bottom: 18px;
    }
  }
  .clearfix::after{
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  }
</style>
<script>
import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
import config from '@/libs/config.js'
import common from '@/libs/common.js'
export default {
  components: { VeLine,VePie },
  data () {
    return {
      totalWorkers:0,
      totalProducts:0,
      recnt7dayBorrows:0,
      recent30dayBorrows:0,
      totalBorrows:0,
      reqBorrow:0,
      RejectBorrow:0,
      agreeBoorow:0,
      ProductLogData: {
        columns: ['date', 'count'],
        rows: [
        ]
      },
      AreaData: {
        columns: ['Area', 'Count'],
        rows: [
        ]
      },
      Category: {
        columns: ['Category', 'Count'],
        rows: [
        ]
      }
    }
  },
  methods:{
      getTotalWorkers(){
          fetch(config.dataurl + "workers.php",{}).then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error('无法读取员工数量')
          }).then(data=>{
             if(typeof(data)!='number'){
                this.$message.error("无法读取总员工信息，后端数据库连接失败")
                return
             }
             this.totalWorkers = data
          })
      },
      getTotalProducts(){
          fetch(config.dataurl + "products.php",{}).then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error('无法读取产品数量')
          }).then(data=>{
             if(typeof(data)!='number'){
                this.$message.error("无法读取总产品信息，后端数据库连接失败")
                return
             }
             this.totalProducts = data
          })
      },
      getTotalBorrows(){
          fetch(config.dataurl + "borrow.php",{}).then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error('无法读取商品租借记录')
          }).then(data=>{
             if(typeof(data)!='number'){
                this.$message.error("无法读取总租借信息，后端数据库连接失败")
                return
             }
             this.totalBorrows = data
             fetch(config.dataurl + "borrow_now.php?day=7",{}).then(res=>res.json()).catch(err=>{
               console.log(err)
               this.$message.error('无法读取商品租借记录')
             }).then(data=>{
                if(typeof(data)!='number'){
                   this.$message.error("无法读取总租借信息，后端数据库连接失败")
                   return
                }
                this.recnt7dayBorrows = data
                fetch(config.dataurl + "borrow_now.php?day=30",{}).then(res=>res.json()).catch(err=>{
                  console.log(err)
                  this.$message.error('无法读取商品租借记录')
                }).then(data=>{
                   if(typeof(data)!='number'){
                      this.$message.error("无法读取总租借信息，后端数据库连接失败")
                      return
                   }
                   this.recent30dayBorrows = data
                })
             })
          })
      },
      getBorrowLogs(){
          fetch(config.dataurl + "borrowlog.php",{}).then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error('无法读取商品租借记录')
          }).then(data=>{
             if(typeof(data)!='number'){
                this.$message.error("无法读取总租借信息，后端数据库连接失败")
                return
             }
             this.reqBorrow = data
             fetch(config.dataurl + "borrowlog.php?status=1",{}).then(res=>res.json()).catch(err=>{
               console.log(err)
               this.$message.error('无法读取商品租借记录')
             }).then(data=>{
                if(typeof(data)!='number'){
                   this.$message.error("无法读取总租借信息，后端数据库连接失败")
                   return
                }
                this.agreeBoorow = data
                fetch(config.dataurl + "borrowlog.php?status=2",{}).then(res=>res.json()).catch(err=>{
                  console.log(err)
                  this.$message.error('无法读取商品租借记录')
                }).then(data=>{
                   if(typeof(data)!='number'){
                      this.$message.error("无法读取总租借信息，后端数据库连接失败")
                      return
                   }
                   this.RejectBorrow = data
                })
             })
          })
      },
      getProductLog(){
          fetch(config.dataurl + "getProductlog7.php",{}).then(res=>res.json()).catch(err=>{
              console.log(err);
              this.$message.error('无法读取product log折线图数据')
          }).then(res=>{
              if(res == '出错了'){
                this.$message.error('折线图后端出错')
                return
              }
              this.ProductLogData.rows = res
          })
      },
      AuthTokenExpires(){
        if(localStorage.getItem("expires")==undefined || localStorage.getItem("expires") < Date.parse(new Date())/1000){
          localStorage.removeItem("token")
          localStorage.removeItem("expires")
          this.$alert('token已过期，需要重新登陆','token过期了',{
              confirmButtonText:'确定',
              callback:_=>{
                this.$router.push('/login')
              }
          })
        }
      },
  },
  mounted(){
    this.AuthTokenExpires()
    //1. 获取category和area分类的数据，并根据id建立关联
    //2. 获取product具体信息，渲染到数据端
    //3. 获取员工数据信息，进行渲染
    fetch(config.dataurl + "category.php",{

    }).then(res=>res.json()).catch(err=>{
      console.log(err)
      this.$message.error(err)
    }).then(res=>{
      if(res == '出错了'){
        this.$message.error('服务端无法读取数据库')
        return
      }
      //更新数据
      console.log(res)
      for(let x of res){
        let temp = {'Category':x.category_name,'Count':x.count}
        this.Category.rows.push(temp)
      }
      fetch(config.dataurl + "area.php",{
      }).then(res=>res.json()).catch(err=>{
        console.log(err)
        this.$message.error(err)
      }).then(res=>{
        console.log(res)
        if(res == '出错了'){
          this.$message.error('服务端无法读取数据库')
          return
        }
        for(let x of res){
          let temp = {'Area':x.area_name,'Count':x.count}
          this.AreaData.rows.push(temp)
        }
        this.getTotalWorkers()
        this.getTotalProducts()
        this.getTotalBorrows()
        this.getBorrowLogs()
        this.getProductLog()
      })
    })
  }
}
</script>
