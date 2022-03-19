<template>
  <d2-container>
    <el-drawer
    title="新增员工"
    :before-close="handleClose"
    :visible.sync="dialog"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    >
    <div class="demo-drawer__content">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item sortable label="工号" :label-width="formLabelWidth" prop="nums">
          <el-input type="number" v-model="form.nums" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item sortable label="等级" :label-width="formLabelWidth" prop="level">
          <el-input type="number" v-model="form.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="地区" :label-width="formLabelWidth" prop="place">
          <el-input v-model="form.place" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="telephone">
          <el-input type="number" v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="mail">
          <el-input v-model="form.mail" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="照片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submit('form')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
    <template slot="header">员工管理</template>
    <div class="methods">
      <!--操作-->
      <el-button type="primary" @click="addWorker">添加员工</el-button>
      <el-button type="primary" @click="excel">导出员工</el-button>
    </div>
    <u-table
    :data="tableData"
    :pagination-show="true"
      :total="pageForm.total"
      :page-size="pageForm.pageSize"
      :current-page="pageForm.currentPage"
    style="width: 100%">
    <u-table-column
      fixed
      prop="ID"
      label="id"
      width="90">
    </u-table-column>
    <u-table-column
      prop="Name"
      label="姓名"
      width="90">
    </u-table-column>
    <u-table-column
      prop="Nums"
      label="工号"
      width="90">
    </u-table-column>
    <u-table-column
      prop="Level"
      label="级别"
      width="90">
    </u-table-column>
    <u-table-column
      prop="Sex"
      label="性别"
      width="120">
    </u-table-column>
    <u-table-column
      prop="Place"
      label="地址"
      show-overflow-tooltip
      width="180">
    </u-table-column>
    <u-table-column
      prop="Score"
      label="信誉分"
      min-width="120">
    </u-table-column>
    <u-table-column
      prop="Telephone"
      label="联系电话"
      min-width="120">
    </u-table-column>
    <u-table-column
      prop="Mail"
      label="邮箱"
      min-width="120">
    </u-table-column>
    <u-table-column
      prop="Description"
      label="描述"
      min-width="120">
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
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 80px;
      color: #8c939d;
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }
  .methods{
    margin-bottom: 20px;
  }
</style>
<script>
  import config from '@/libs/config.js'
  import common from '@/libs/common.js'
  let OSS = require('ali-oss')
  let client

function CheckFace(formdata){
        return new Promise((resolve,reject)=>{
          fetch("https://facedetect.dadiqq.cn/check/",{
                method:'POST',
                headers:{
                  // 'Content-Type':'multipart/form-data'
                },
                body:formdata
            }).then(res=>res.json()).then(data=>{
                resolve(data)
            })
        })
  }
  export default {
    data() {
      return {
        columns:[
          {
            label:'ID',
            prop:'ID'
          },
          {
            label:'姓名',
            prop:'Name'
          },
          {
            label:'工号',
            prop:'Nums'
          },
          {
            label:'级别',
            prop:'Level'
          },
          {
            label:'性别',
            prop:'Sex'
          },
          {
            label:'信誉分',
            prop:'Score'
          },
          {
            label:'地址',
            prop:'Place'
          },
          {
            label:'电话',
            prop:'Telephone'
          },
          {
            label:'邮箱',
            prop:'Mail',
          },
          {
            label:'描述',
            prop:'Description'
          }
        ],
        imageUrl: '',
        dialog:false,
        loading:false,
        formLabelWidth:'80px',
        tableData: [],
        client:{},
        file:null,
        add:true,
        id:null,
        form:{
          name:null,
          level:null,
          score:100,
          sex:null,
          telephone:null,
          place:null,
          nums:null,
          description:null,
          username:'',
          password:'',
          mail:'',
          iswork:'true',
          id:null,
          dataMethod:0,//默认增加功能
        },
        rules:{
          name:[
            {required:true,message:'请输入员工姓名',trigger:'change'}
          ],
          level:[
            {required:true,message:'请输入数字格式的等级',trigger:'change'}
          ],
          sex:[
            {required:true,min:1,max:1,message:'请输入正确的性别(男或女)',trigger:'change'}
          ],
          telephone:[
            {required:true,min:11,max:11,message:'请输入正确的中国大陆11位手机号',trigger:'change'}
          ],
          place:[
            {required:true,message:'请输入所在地区',trigger:'change'}
          ],
          nums:[
            {required:true,message:'请输入正确的工号',trigger:'change'}
          ],
        mail:[
            {required:true,message:'请输入电子邮箱',trigger:'change'}
          ],
          username:[
            {required:true,min:3,max:12,message:'用户名必须是3-12位的',trigger:'change'}
          ],
          password:[
            {required:true,min:6,max:15,message:'密码必须是6-15位的',trigger:'change'}
          ],
          Description:[
            {required:true,min:5,max:15,message:'描述信息必须填写',trigger:'change'}
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
      addWorker(){
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
      excel(){
          this.$export.excel({
            columns:this.columns,
            data:this.tableData,
          })
      },
      handleClick(row,method) {
        if(method == 1){
            this.add = false//下一次add要删除所有数据
            this.form.name = row.Name
            this.form.id = row.ID
            this.form.nums = row.Nums
            this.form.level = row.Level
            this.form.sex = row.Sex
            this.form.score = row.Score
            this.form.place = row.Place
            this.form.telephone = row.Telephone
            this.form.description = row.Description
            this.form.mail = row.Mail
            this.dialog = true
            this.dataMethod = 1
        }else{
            this.$confirm(`确认删除id为${row.ID}\n名为${row.Name}的员工吗？该操作不可撤销哦`).then(_=>{
              //1. 发送删除申请
              //2. 删除oss图片
              this.delObject(row.Nums)
              common.DeleteWorker(row.ID).then(res=>res.json()).catch(err=>{
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
        }
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
            if(this.dataMethod==0){
                if(this.file == null){
                  //没有上传头像
                  this.$message.error('必须上传头像方便人脸对比哦')
                  return
                }
            }
            let message,url,method
            if(this.dataMethod == 0){
                message = '添加'
                url = 'worker'
                method = 'POST'
            }else{
                message = '修改'
                url = `worker/${this.form.id}`
                method = 'PUT'
            }
            common.PostWorkData(url,this.form,method).then(data=>data.json()).catch(err=>{
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
                console.log(res)
                this.$message.error(res.msg)
                setTimeout(()=>{
                  this.loading = false
                  this.dialog = false
                },500)
                return
              }
              this.$message.success(`成功${message}员工表`)
              this.UpdateData()
              if(this.file != null){
                  if(this.dataMethod == 0){
                      //添加，获取data就可以了
                      this.id = res.data
                  }else{
                      this.id = this.form.id
                  }
                  this.putObject(this.file) 
                  this.loading = true
              }
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
        common.GetWorkData("workers").then(res=>res.json()).catch(err=>console.log(err)).then(data=>{
          if(data === undefined){
            this.$message.error('未知错误，请稍后重试')
            return
          }
          common.ExpToken(data)
          if(data.data.workers==undefined){
            this.$message.error(`无法读取到员工信息,原因:${data.msg}`)
            return
          }
          console.log(data.data.workers)
          this.tableData = data.data.workers
          this.pageForm.total = this.tableData.length
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
      getKey(){
          let time = Date.parse(new Date()) / 1000
          if(localStorage.getItem("Credentials")==undefined || localStorage.getItem("expiresTime") < time){
              //已过期或没有设置Credentials
              //fetch key
              common.GetWorkData("").then(res=>res.json()).catch(err=>{
                console.log(err)
                this.$message.error("获取ali os 密钥出错")
                return
              }).then(res=>{
                console.log(res)
                localStorage.setItem("Credentials",JSON.stringify(res.Credentials))
                localStorage.setItem("expiresTime",Date.parse(res.Credentials.Expiration)/1000)//到期时间
                console.log(JSON.parse(localStorage.getItem("Credentials")))
                client = new OSS({
                    region: 'oss-cn-guangzhou',
                    accessKeyId: JSON.parse(localStorage.getItem("Credentials")).AccessKeyId,
                    accessKeySecret: JSON.parse(localStorage.getItem("Credentials")).AccessKeySecret,
                    bucket: 'arcsoft',
                    stsToken: JSON.parse(localStorage.getItem("Credentials")).SecurityToken
                })
              })
              return //不执行下面的
          }
          //否则直接使用就可以了
          console.log(JSON.parse(localStorage.getItem("Credentials")))
          client = new OSS({
              region: 'oss-cn-guangzhou',
              accessKeyId: JSON.parse(localStorage.getItem("Credentials")).AccessKeyId,
              accessKeySecret: JSON.parse(localStorage.getItem("Credentials")).AccessKeySecret,
              bucket: 'arcsoft',
              stsToken: JSON.parse(localStorage.getItem("Credentials")).SecurityToken
          })
      },
      async putObject (file) {
        try {
          let result = await client.put(`/face/${this.id}.png`, file);
          console.log(result);
        } catch (e) {
          console.log(e);
        }
      },
      async delObject (nums){
         //删除对应的工号
         try{
           let result = await client.delete(`/face/${id}.png`)
           console.log(result)
         } catch(e) {
           console.log(e)
         }
      },
      
      async beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        var formdata=new FormData();
        formdata.append('image',file)
        if (!isJPG) {
          this.$message.error('人脸暂时只支持jpg和png格式哦');
          return 0
        }
        if (!isLt2M) {
          this.$message.error('上传图片的大小不能超过2M');
          return 0
        }
        const res = await CheckFace(formdata)
        console.log(res)
        if(res.code != 200){
            this.$message.error("图片不是人脸或者图像类型无法识别")
            return 0
        }
        this.imageUrl = URL.createObjectURL(file);
        this.file = file
        //再把图片传入检测服务器，检测下是否符合要求
        return 1
      }
    },
    mounted(){
        //验证权限
        this.AuthTokenExpires()
        this.getKey()
        this.UpdateData()
    },
  }
</script>
