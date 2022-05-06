class list{
    constructor(){
        //给属性赋值,调用其他方法
        this.getData();
        //将加入购物车使用事件委托
        this.$('.sk_bd ul').addEventListener('click',this.addCartFn.bind(this))
    }
    //获取数据的方法
    async getData(){//async 把这个方法变成同步的
        //等待promise对象解剖完成
        let {data,status} = await axios.get( 'http://localhost:8888/goods/list/?current=3' ) //等待promise对象解析完成 因为axios返回的就是promise对象
        // console.log(data,status);
        //判断返回值的状态,追加税局
        if(status==200){
            // console.log(data);
            let html='';
            data.list.forEach(goods => {
                // console.log(goods);
                html+=`<li class="sk_goods" data-id="${goods.goods_id}">
                <a href="detail.html"><img src="${goods.img_big_logo}" alt=""></a>
                <h5 class="sk_goods_title">${goods.title}</h5>
                <p class="sk_goods_price"><em>¥${goods.current_price}</em> <del>￥${goods.price}</del></p>
                <div class="sk_goods_progress">
                    已售<i>${goods.sale_type}</i>
                    <div class="bar">
                        <div class="bar_in"></div>
                    </div>
                    剩余<em>${goods.goods_number}</em>件
                </div>
                <a href="#none" class="sk_goods_buy">立即抢购</a>
            </li> `
            });
            this.$('.sk_bd ul').innerHTML=html;
        }         
    }  
    //加入购物车的方法
    async addCartFn(eve){
        //console.log(this);
        // console.log(eve.target);
        //判断用户是否登录,如果能够获取到token,则表示登录,获取不到表示未登录
         let token=localStorage.getItem('token') 
         //跳转
         if(!token)location.assign('./login.html?ReturnUrl=./list.html')
         //assign是跳转的意思,从列表页面跳转到登录页面

         //判断是否点击的是a标签
         //contains判断是否包含一个指定的类名
         if(eve.target.classList.contains('sk_goods_buy')){
             //获取商品id
             let lisObj=eve.target.parentNode;
             let goodsId=lisObj.dataset.id
            //  console.log(lisObj);
            // console.log(goodsId);
            let userId=localStorage.getItem('user_id')
            // console.log(userId)
            //两个id必须都有才能发送请求
            if(!userId||!goodsId)throw new Error('两个id存在问题,请打印...');
            axios.defaults.headers.common['authorization'] = token;
            //必须设置内容的类型,默认是jso格式,server是处理不了
            axios.defaults.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded' ;
            //数据必须以原生的方式拼接好
            let param=`id=${userId}&goodsId=${goodsId}`
            //商品id的获取或用户id的获取
            // console.log(eve.target);
            //如果用户登录,则加数据信息添加到购物车当中
            let {data,status}=await axios.post( 'http://localhost:8888/cart/add',param);
            console.log(data); 
            if(status==200){
                // console.log(data);
                if(data.code==1){//购买单成功
                    layer.open({
                        content:'加入购物车',
                        btn:['去购物车结算','留在当前页面']
                        ,yes:function(index,layero){
                            //按钮[按钮一]的回调
                            location.assign('./cart.html')
                        }
                        ,btn2:function(index,layero){
                            //按钮[按钮二]的回调
                            //return false开启该代码可禁止点击该按钮关闭
                        }
                    })
                }
            }
        }
    }

    $(tag){
        let res=document.querySelectorAll(tag)
        return res.length==1?res[0]:res;
    }
}
new list