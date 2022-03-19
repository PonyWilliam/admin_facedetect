<template>
  <d2-container>
    <el-drawer
    :title="dataMethod===0?'新增产品':`修改产品:${form.id}`"
    :before-close="handleClose"
    :visible.sync="dialog"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    >
    <div class="demo-drawer__content">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" :label-width="formLabelWidth" prop="category">
          <el-select v-model="form.category" placeholder="请选择">
              <el-option
                v-for="item in category"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所在库房" :label-width="formLabelWidth" prop="area">
          <el-select v-model="form.area" placeholder="请选择">
              <el-option
                v-for="item in area"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="当前是否在库" :label-width="formLabelWidth" prop="is">
          <el-radio v-model="form.is" label="1">是</el-radio>
          <el-radio v-model="form.is" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="重要程度" :label-width="formLabelWidth" prop="important">
          <el-radio v-model="form.important" label="1">重要</el-radio>
          <el-radio v-model="form.important" label="0">一般</el-radio>
        </el-form-item>
        <el-form-item label="产品等级" :label-width="formLabelWidth" prop="level">
          <el-input v-model="form.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="rfid信息" :label-width="formLabelWidth" prop="rfid">
          <el-input v-model="form.rfid" autocomplete="off"></el-input>
          <el-button style="margin-top: 10px;" @click="readRfid">一键读取(需配合软件)</el-button>
        </el-form-item>
        <el-form-item label="3d模型(url)" :label-width="formLabelWidth" prop="threed">
          <el-input v-model="form.threed" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submit('form')" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
    </div>
  </el-drawer>
    <el-drawer
    title="位置信息预览"
    :before-close="handleCloseMap"
    :visible.sync="lbsmap"
    direction="rtl"
    custom-class="lbsmap"
    ref="lbsmap"
    size="60%"
    >
    <!--
      高德地图组件
    -->
    <div class="map" id="map">

    </div>
    </el-drawer>
  <el-drawer
    title="批量录入"
    :before-close="handleClose"
    :visible.sync="dialog1"
    direction="ltr"
    custom-class="demo-drawer"
    ref="drawer"
    >
    <div class="demo-drawer__content">
      <el-form :model="form1" :rules="rules" ref="form1">
        <el-form-item label="产品名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form1.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" :label-width="formLabelWidth" prop="category">
          <el-select v-model="form1.category" placeholder="请选择">
              <el-option
                v-for="item in category"
                :key="item.category_id"
                :label="item.category_name"
                :value="item.category_id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所在库房" :label-width="formLabelWidth" prop="area">
          <el-select v-model="form1.area" placeholder="请选择">
              <el-option
                v-for="item in area"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="当前是否在库" :label-width="formLabelWidth" prop="is">
          <el-radio v-model="form1.is" label="1">是</el-radio>
          <el-radio v-model="form1.is" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="是否为重要商品" :label-width="formLabelWidth" prop="important">
          <el-radio v-model="form1.important" label="1">是</el-radio>
          <el-radio v-model="form1.important" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="产品等级" :label-width="formLabelWidth" prop="level">
          <el-input v-model="form1.level" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="3d模型(url)" :label-width="formLabelWidth" prop="threed">
          <el-input v-model="form1.threed" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品描述" :label-width="formLabelWidth" prop="description">
          <el-input v-model="form1.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelLoad">取 消</el-button>
        <el-button type="primary" @click="submitLoad('form1')" :loading="loading">{{ loading ? '录入中 ...' : '开 始 批 量 录 入' }}</el-button>
      </div>
    </div>
  </el-drawer>
    <template slot="header">产品管理</template>
    <div class="methods">
      <!--操作-->
      <el-button type="primary" @click="addProduct()">新增产品</el-button>
      <el-button type="primary" @click="dialog1 = true">rfid批量导入</el-button>
      <el-button type="primary" @click="excel">导出产品信息</el-button>
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
      prop="id"
      label="id"
      width="60">
    </u-table-column>
    <u-table-column
      prop="product_name"
      label="名称"
      width="90">
    </u-table-column>
    <u-table-column
      prop="product_belong_category"
      label="所在分类"
      width="90">
    </u-table-column>
    <u-table-column
      prop="product_belong_area"
      label="所在库房"
      width="120">
    </u-table-column>
    <u-table-column
      prop="product_is"
      label="是否在库"
      width="90">
    </u-table-column>
    <u-table-column
      prop="is_important"
      label="重要程度"
      width="60">
    </u-table-column>
    <u-table-column
      prop="product_level"
      label="产品级别"
      width="60">
    </u-table-column>
    <u-table-column
      prop="product_rfid"
      label="rfid信息"
      width="120">
    </u-table-column>
    <u-table-column
      prop="three_url"
      label="3d模型"
      width="120">
    </u-table-column>
    <u-table-column
      prop="product_location"
      label="当前所在位置"
      width="180">
    <template slot-scope="scope">
        <el-button type="text" @click="OpenMap(scope.row)">{{scope.row.product_location}}</el-button>
    </template>
    </u-table-column>
<!--    <u-table-column
      prop="product_belong_custom"
      label="当前租借用户"
      width="120">
    </u-table-column> -->
    <u-table-column
      prop="product_description"
      label="产品描述"
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
<style lang="scss">
  .methods{
    margin-bottom: 20px;
  }
  .map{
      width:90%;
      margin-left:5%;
      box-sizing: border-box;//盒模型
      height:550px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 2px 4px 3px #dfdfdf,
      -6px 8px 4px #dfdfdf,
      -6px -8px 3px #dfdfdf,
      2px -4px 3px #dfdfdf;
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
            prop:'id'
          },
          {
            label:'产品名称',
            prop:'product_name'
          },
          {
            label:'所在分类',
            prop:'product_belong_category'
          },
          {
            label:'所在库房',
            prop:'product_belong_area'
          },
          {
            label:'租借所需级别',
            prop:'product_level'
          },
          {
            label:'是否重要',
            prop:'is_important'
          },
          {
            label:'是否在库',
            prop:'product_is'
          },
          {
            label:'当前经纬度',
            prop:'product_location',
          },
          {
            label:'RFID信息',
            prop:'product_rfid'
          },
          {
            label:'产品描述',
            prop:'product_description'
          },
        ],
        dialog:false,
        dialog1:false,
        loading:false,
        formLabelWidth:'80px',
        tableData: [],
        dataMethod:0,//0代表add，1代表change
        add:true,
        lbsmap:false,
        mapdata:null,
        form:{
            id:null,
            name:null,
            name:null,
            category:null,
            area:null,
            is:null,
            important:null,
            level:null,
            rfid:null,
            threed:null,
            description:null,

        },
        form1:{
            id:null,
            name:null,
            name:null,
            category:null,
            area:null,
            is:null,
            important:null,
            level:null,
            rfid:null,
            threed:null,
            description:null,

        },
        timer1:null,
        area:null,
        category:null,
        rules:{
          name:[
            {required:true,message:'分类名必须填写哦',trigger:'change'}
          ],
          description:[
            {required:true,message:'描述信息必须填写',trigger:'change'}
          ],
          is:[
            {required:true,message:'是否在库必须选择',trigger:'change'}
          ],
          important:[
            {required:true,message:'是否重要必须选择',trigger:'change'}
          ],
          area:[
            {required:true,message:'所在库房必须填写',trigger:'change'}
          ],
          category:[
            {required:true,message:'所属分类必须填写',trigger:'change'}
          ],
          level:[
            {required:true,message:'产品等级必须填写',trigger:'change'}
          ],
          rfid:[
            {required:true,message: 'rfid必须填写',trigger:'change'}
          ]
        },
        rules1:{
          name:[
            {required:true,message:'分类名必须填写哦',trigger:'change'}
          ],
          description:[
            {required:true,message:'描述信息必须填写',trigger:'change'}
          ],
          is:[
            {required:true,message:'是否在库必须选择',trigger:'change'}
          ],
          important:[
            {required:true,message:'是否重要必须选择',trigger:'change'}
          ],
          area:[
            {required:true,message:'所在库房必须填写',trigger:'change'}
          ],
          category:[
            {required:true,message:'所属分类必须填写',trigger:'change'}
          ],
          level:[
            {required:true,message:'产品等级必须填写',trigger:'change'}
          ]
        },
        pageForm: {
          total: 0,
          pageSize: 10,
          currentPage: 1
      },
      }
    },
    watch:{
       form:{
         handler(val,oldVal){
           console.log(val,oldVal)
         },
         deep:true
       }
    },
    methods: {
      excel(){
          this.$export.excel({
            columns:this.columns,
            data:this.tableData,
          })
      },
      OpenMap(Mapdata){
          // Mapdata.product_location
          //打开高德地图定位
          this.mapdata = Mapdata
          this.lbsmap = true//打开地图
          setTimeout(()=>{
            let icon = {
               // 图标类型，现阶段只支持 image 类型
               type: 'image',
               // 图片 url
               image: 'http://arcsoft.dadiqq.cn/map/1.jpg',
               // 图片尺寸
               size: [24, 48],
               // 图片相对 position 的锚点，默认为 bottom-center
               anchor: 'center',
            };
            let labelsLayer = new AMap.LabelsLayer({
                zooms: [1, 21],
                zIndex: 1000,
                // 该层内标注是否避让
                collision: false,
                // 设置 allowCollision：true，可以让标注避让用户的标注
                allowCollision: true,
            });
            for(let x of this.tableData){
                if(x.product_location == '' || x.product_location.split(",").length != 2){
                  console.log(x)
                  continue
                }
                let text = {
                    // 要展示的文字内容
                    content: `${x.product_name}(ID:${x.id})`,
                    // 文字方向，有 icon 时为围绕文字的方向，没有 icon 时，则为相对 position 的位置
                    direction: 'right',
                    // 在 direction 基础上的偏移量
                    offset: [5, -10],
                    // 文字样式
                    style: {
                        // 字体大小
                        fontSize: x.is_important=="一般"?10:12,
                        // 字体颜色
                        fillColor: x.is_important=="一般"?'#99446f':'#ff0320',
                        // 描边颜色
                        strokeColor: '#fff',
                        // 描边宽度
                        strokeWidth: 2,
                    }
                };
                let labelMarker = new AMap.LabelMarker({
                    name: x.product_rfid, // 此属性非绘制文字内容，仅最为标识使用
                    position: x.product_location.split(","),
                    zIndex: 16,
                    // 将第一步创建的 icon 对象传给 icon 属性
                    icon: icon,
                    // 将第二步创建的 text 对象传给 text 属性
                    text: text,
                });
                labelsLayer.add(labelMarker);
            }
            //采用宏任务等待DOM渲染
            let map = new AMap.Map('map',{
              zoom:15.2,
              center: Mapdata.product_location.split(","),
              mapStyle: 'amap://styles/9c6ab3b2fdc1c7a18834eeb026c38999',
            })
            //渲染所有点，对所有点进行遍历
            map.add(labelsLayer);
          },0)
      },
      readRfid(){
          //调用golang实现请求录入rfid
           fetch(config.rfidIp,{
              method:'GET',
           }).then(res => res.json()).catch(err=>{
              console.log(err)
              this.$message.error('使用本功能需要配套软件')
              return Error('123')
           }).then(data=>{
              if(data.code!=500){
                  this.form.rfid = data.data
              }else{

                  this.$message.error(data.msg || '无法获取rfid状态')
              }
           })
      },
      addProduct(){
          this.dialog = true
          this.dataMethod = 0
          this.add = true
      },
      handleClick(row,method) {
        if(method == 2){
            this.$confirm(`确认删除id为${row.id}\n名为${row.product_name}的产品吗？该操作不可撤销哦`).then(_=>{
              //删除前检测对应分类是否有商品
              common.DeleteProduct(row.id).then(res=>res.json()).catch(err=>{
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
              })
              .catch(_=>{
                  //啥都不用做
                })
        }else{
            this.add =false
            //编辑功能
            this.form.important = row.is_important == '重要'?'1':'0'
            this.dataMethod = 1//标识
            this.form.id = row.id//嗯嗯。。。
            this.form.name = row.product_name
            this.form.category = row.product_belong_category
            this.form.area = row.product_belong_area
            this.form.is = row.product_is == '在库'?'1':'0'
            this.form.level = row.product_level
            this.form.rfid = row.product_rfid
            this.form.description = row.product_description
            this.form.threed = row.three_url
            this.dialog = true
        }
      },
      handleClose(done) {
        this.$confirm('确认关闭吗')
          .then(_ => {

            done();
          })
          .catch(_ => {});
      },
      handleCloseMap(done) {
        this.$confirm('确认关闭吗')
          .then(_ => {
            //确认关闭后
            this.lbsmap = false
            this.mapdata = null
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
            let method,url,message;
            if(this.dataMethod == 0){
                method = 'POST'
                url = "add"
                message = '添加'
            }else{
                method = 'PUT'
                url = `set/${this.form.id}`
                message = '修改'
            }
            console.log(this.form)
            common.PostProductData(url,this.form,method).then(data=>data.json()).catch(err=>{
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
              this.$message.success(`成功${message}产品表`)
              this.UpdateData()
              setTimeout(()=>{
                this.loading = false
                this.dialog = false
                //顺便刷新页面，重新获取数据
              },600)
            })
          }else{
            return
          }
        })},

      submitLoad(formName){
        this.$refs[formName].validate((valid)=>{
          if(valid){
            this.$message.success("已开始监听自动提交数据")
            this.loading = true
            this.timer1 = setInterval(()=>{
              fetch(config.rfidIp,{
                 method:'GET',
              }).then(res => res.json()).catch(err=>{
                 console.log(err)
                 this.$message.error('使用本功能需要配套软件')
                 this.dialog1 = false
                 this.loading = false
                 clearInterval(this.timer1)
                 return new Error("123")
              }).then(data=>{
                 if(data.code!=500 && data.data != undefined || data.data != null){
                     this.form1.rfid = data.data
                     //提交数据
                     common.PostProductData("add",this.form1,'POST').then(data=>data.json()).catch(err=>{
                       console.log(err)
                       this.$message.error('请确认已打开软件')
                       clearInterval(this.timer1)
                       setTimeout(()=>{
                         this.loading = false
                         this.dialog1 = false
                       },500)
                       return
                     }).then(res=>{
                       if(res.code == undefined){
                         clearInterval(this.timer1)
                         this.$message.error(`自动提交失败，无法获取信息`)
                         //清空定时器了。信息都没有
                         return
                       }
                       if(res.code!=200 && res.code==undefined){
                         this.$message.error(`rfid:${this.form1.rfid}重复入库`)
                         return
                       }else if(res.code!=200){
                         this.$message.error(res.msg)
                       }else{
                         this.$message.success(`成功录入${this.form1.rfid}`)
                       }
                 })
              }
            })
            },1000 * 4)
          }
       })
      },
      cancelLoad(){
        this.loading = false
        this.dialog1 = false
        clearInterval(this.timer1)
        this.UpdateData()//rfid连续录入状态下不会实时更新数据
      },
      UpdateData(){
        common.GetProductData("").then(res=>res.json()).catch(err=>console.log(err)).then(data=>{
          if(data === undefined){
            this.$message.error('未知错误，请稍后重试')
            return
          }
          if(data.data===undefined){
            this.$message.error(`无法获取到产品信息,原因:${data.msg}`)
            return
          }
          let temp = true
          if(data.data === null){
              //没有信息不需要渲染
              temp = false
          }
          let category=[],area=[];
          common.GetCateegoryData("").then(res=>res.json()).catch(err=>{
            console.log(err)
            this.$message.error('读取分类信息时出错')
            return
          }).then(res=>{
            if(res == undefined){
              this.$message.error('未知错误，请稍后重试')
              return
            }
            if(res.data != undefined){
              res.data = res.data.category
              console.log(res.data)
              this.category = res.data
              for(let temp of res.data){
                console.log(temp.category_name)
                category[temp.category_id] = temp.category_name
              }
            }
            common.GetAreaData("").then(res=>res.json()).catch(err=>{
              console.log(err)
              this.$message.error('读取库房信息出错')
              return
            }).then(res=>{
              if(res == undefined){
                this.$message.error('未知错误，请稍后重试')
                return
              }
              if(res.data != undefined){
                console.log(res.data)
                this.area = res.data
                for(let temp of res.data){
                  area[temp.id] = temp.name
                }
              }
              for(let x in data.data){
                if(data.data[x].product_is === false){
                  data.data[x].product_is = "不在库"
                }else{
                  data.data[x].product_is = "在库"
                }
                if(data.data[x].is_important === false){
                  data.data[x].is_important = "一般"
                }else{
                  data.data[x].is_important = "重要"
                }
                data.data[x].product_belong_area_id = data.data[x].product_belong_area
                data.data[x].product_belong_category_id = data.data[x].product_belong_category
                console.log(data.data[x].product_belong_category)
                data.data[x].product_belong_category = category[data.data[x].product_belong_category]
                data.data[x].product_belong_area = area[data.data[x].product_belong_area]
              }
              if(temp){
                this.tableData = data.data
                this.pageForm.total = this.tableData.length
              }

            })
          })
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
        //权限验证(增加服务器负担，暂时不用)

        //获取数据
        this.UpdateData()
    },
  }
</script>
