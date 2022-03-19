<template>
  <d2-container>
    <el-drawer
    title="新增分类"
    :before-close="handleClose"
    :visible.sync="dialog"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    >
    <div class="demo-drawer__content">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="分类名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submit('form')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
    <template slot="header">分类管理</template>
    <div class="methods">
      <!--操作-->
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <el-button type="primary" @click="excel">导出分类信息</el-button>
    </div>
    <u-table
    :data="tableData"
    :pagination-show="true"
      :total="pageForm.total"
      :page-size="pageForm.pageSize"
      :current-page="pageForm.currentPage"
    border
    style="width: 100%">
    <u-table-column
      fixed
      prop="category_id"
      label="id"
      width="90">
    </u-table-column>
    <u-table-column
      prop="category_name"
      label="名称"
      width="150">
    </u-table-column>
    <u-table-column
      prop="category_description"
      label="描述"
      min-width="150">
    </u-table-column>
    <u-table-column
      fixed="right"
      label="操作"
      width="150">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row,1)" type="text">编辑</el-button>
        <el-button @click="handleClick(scope.row,2)" type="text">删除</el-button>
      </template>
    </u-table-column>
  </u-table>
  </d2-container>
</template>
<style>
  .methods{
    margin-bottom: 20px;
  }
</style>
<script>
  import config from '@/libs/config.js'
  import common from '@/libs/common.js'
  export default {
    data() {
      return {
        columns:[
          {
            label:'ID',
            prop:'category_id'
          },
          {
            label:'分类名',
            prop:'category_name'
          },
          {
            label:'分类描述',
            prop:'category_description'
          },
        ],
        dialog:false,
        loading:false,
        formLabelWidth:'80px',
        tableData: [],
        methodData:0,
        add:true,
        dataMethod:0,
        form:{
          id:null,
          name:null,
          description:null
        },
        rules:{
          name:[
            {required:true,message:'分类名必须填写哦',trigger:'change'}
          ],
          description:[
            {required:true,message:'描述信息必须填写',trigger:'change'}
          ]
        },
        pageForm: {
          total: 0,
          pageSize: 10,
          currentPage: 1
      },
      }
    },
    methods: {
      excel(){
          this.$export.excel({
            columns:this.columns,
            data:this.tableData,
          })
      },
      addCategory(){
          if(!this.add){
            //上次不是add，清空edit数据
            this.add = true
            for(let x in this.form){
                this.form[x] = null
            }
          }
          this.dialog = true
          this.dataMethod = 0
      },
      handleClick(row,method) {
        if(method == 1){
            //编辑功能
            this.add = false
            this.dialog = true
            this.dataMethod = 1
            this.form.id = row.category_id
            this.form.name = row.category_name
            this.form.description = row.category_description
            return
        }
        this.$confirm(`确认删除id为${row.category_id}\n名为${row.category_name}的分类吗？该操作不可撤销哦`).then(_=>{
          //删除前检测对应分类是否有商品
          fetch(config.url + config.product + "bycategory/" + row.category_id,{
              method:"GET",
              headers:new Headers({
                  "Authorization":localStorage.getItem('token')
              })
          }).then(data=>data.json()).catch(err=>{
            console.log(err)
            this.$message.error(err)
            return
          }).then(data=>{
            console.log(data)
            if(data.code == undefined){
              this.$message.error('无法读取数据，请稍后再试')
              return
            }
            if(data.code == 500){
              this.$message.error(data.msg)
              return
            }
            if(data.data != undefined && data.data != null){
              this.$message.error("请删除分类下所有产品后再删除该分类")
              return
            }

              //发送删除申请

              common.DeleteCategory(row.category_id).then(res=>res.json()).catch(err=>{
                this.$message.error("未能删除数据")
                return
              }).then(res=>{
                if(res==undefined){
                  this.$message.error("未知错误，请稍后重试")
                  return
                }
                if(res.code !=200){
                  this.$message.error(res.msg)
                  return
                }
                this.$message.success("成功删除")
                this.UpdateData()
              })
            }).catch(_=>{
              //啥都不用做
            })
          })
      },
      handleClose(done) {
        this.$confirm('确认关闭吗')
          .then(_ => {

            done();
          })
          .catch(_ => {});
      },
      cancelForm() {
        this.loading = false;
        this.dialog = false;
        clearTimeout(this.timer);
      },
      submit(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            this.loading = true
            let message,url,method
            if(this.dataMethod == 0){
                message = '添加'
                url = ''
                method = 'POST'
            }else{
                message = '修改'
                url = `${this.form.id}`
                method = 'PUT'
            }
            this.loading = true
            common.PostCategoryData(url,this.form,method).then(data=>data.json()).catch(err=>{
              console.log(err)
              this.$message.error('提交时出错，请稍后重试')
              setTimeout(()=>{
                this.loading = false
                this.dialog = false
              },500)
              return
            }).then(res=>{
              if(res.code == undefined){
                this.$message.error(`无法${message}，请稍后重试`)
                return
              }
              if(res.code!=200){
                this.$message.error(res.msg)
                setTimeout(()=>{
                  this.loading = false
                  this.dialog = false
                },500)
                return
              }
              this.$message.success(`成功${message}分类表`)
              this.UpdateData()
              setTimeout(()=>{
                this.loading = false
                this.dialog = false
                //顺便刷新页面，重新获取数据
              },500)
            })
          }else{
            return
          }
        })

      },
      UpdateData(){
        common.GetCateegoryData("").then(res=>res.json()).catch(err=>console.log(err)).then(data=>{
          if(data == undefined){
            this.$message.error('未知错误，请稍后重试')
            return
          }
          if(data.data==undefined){
            this.$message.error(`无法读取到分类信息,原因:${data.msg}`)
            return
          }
          console.log(data.data)
          this.tableData = data.data.category
          this.pageForm.total = this.tableData.length
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
    mounted(){
        this.AuthTokenExpires()
        //获取数据
        this.UpdateData()
    },
  }
</script>
