import config from './config'
import Vue from 'vue'
import router from '@/router'
const common = {
    PostWorkData:function (url,obj,method='POST'){
        if(obj!=undefined){
            let data = new FormData()
            for(let key in obj){
                data.append(key,obj[key])
            }
            return fetch(config.url + config.work + url,{
                method:method,
                headers:new Headers({
                    "Authorization":localStorage.getItem('token')
                }),
                body:data
            })
        }
        return fetch(config.url + config.work + url,{
            method:method,
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    PostCategoryData:function (url,obj,method='POST'){
        if(obj!=undefined){
            let data = new FormData()
            for(let key in obj){
                data.append(key,obj[key])
            }
            return fetch(config.url + config.category + url,{
                method:method,
                headers:new Headers({
                    "Authorization":localStorage.getItem('token')
                }),
                body:data
            })
        }
        return fetch(config.url + config.category + url,{
            method:method,
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    PostProductData:function (url,obj,method='POST'){
        if(obj!=undefined){
            let data = new FormData()
            for(let key in obj){
                data.append(key,obj[key])
            }
            return fetch(config.url + config.product + url,{
                method:method,
                headers:new Headers({
                    "Authorization":localStorage.getItem('token')
                }),
                body:data
            })
        }
        return fetch(config.url + config.product + url,{
            method:method,
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    PostAreaData:function (url,obj,method='POST'){
            if(obj!=undefined){
                let data = new FormData()
                for(let key in obj){
                    data.append(key,obj[key])
                }
                return fetch(config.url + config.area + url,{
                    method:method,
                    headers:new Headers({
                        "Authorization":localStorage.getItem('token')
                    }),
                    body:data
                })
            }
            return fetch(config.url + config.area + url,{
                method:"POST",
                headers:new Headers({
                    "Authorization":localStorage.getItem('token')
                })
            })
        },
    Authorization:function (token){
        return fetch(config.url + config.work + "token",{
            method:'POST',
            headers:new Headers({
                "Authorization":token,
            })
        })
    },
    GetWorkData:function (url){
        return fetch(config.url + config.work + url,{
            method:"GET",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    GetProductData:function (url){
        return fetch(config.url + config.product + url,{
            method:"GET",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    GetCateegoryData:function (url){
        return fetch(config.url + config.category + url,{
            method:"GET",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    GetAreaData:function(url){
        return fetch(config.url + config.area + url,{
            method:"GET",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    DeleteWorker:function(id){
        return fetch(config.url + config.work + "worker/" + id,{
            method:"DELETE",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    DeleteProduct:function(id){
        return fetch(config.url + config.product + "del/" + id,{
            method:"DELETE",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    DeleteCategory:function(id){
        return fetch(config.url + config.category  + id,{
            method:"DELETE",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    DeleteArea:function(id){
        return fetch(config.url + config.area  + id,{
            method:"DELETE",
            headers:new Headers({
                "Authorization":localStorage.getItem('token')
            })
        })
    },
    ExpToken:function(data){
        //token失效解决
        if(data.code && data.code != 500 && data.code != 200){
          //验证token失效
          let temp = new Vue({})
          temp.$alert('token已失效，请重新登陆','token已失效',{
            confirmButtonText:'确认',
            callback:_=>{
              localStorage.clear()//删除现有token
              router.push('/login')//回到登陆界面
            }
          })
          return
        }
    }
}

export default common
