class Cart{
	constructor(){
		this.checkLogin();
		this.getCartGoods();
		this.bindEve();
	}
	//绑定事件
	bindEve(){
		this.$('.cart-list').addEventListener('click',this.distributeEve.bind(this))
		//给全选按钮绑定事件
		this.$('.cart-th input').addEventListener('click',this.clickAllChecked.bind(this))
	}
	//操作购物车页面,用户必须登录
	async checkLogin(){
		//获取token值,进行判断
		const TOKEN=localStorage.getItem('token');
		//判断是否登录过期
		axios.defaults.headers.common['authorization']=TOKEN;
		let userId=localStorage.getItem('user_id');
		let{data,status}=await axios.get('http://localhost:8888/users/info/'+userId);
		console.log(data);
		//如果没有token肯定没有登录
		if(!TOKEN||data.code==401){
			location.assign('./login.html?ReturnUrl=./cart.html')
		}
	}
	//获取购物车中的数据
	async getCartGoods(){
		const TOKEN=localStorage.getItem('token');
		let userId=localStorage.getItem('user_id');
		axios.defaults.headers.common['authorization']=TOKEN;
		let{data,status}=await axios.get('http://localhost:8888/cart/list?id='+userId);
		// console.log (res);  
		if(status==200){ 
			//判断是否超过有效期,过期则跳转到
			if(data.code==401)location .assign('./login.html?ReturnUrl=./cart.html')
			// console.log(data);
			//判断接口的状态
			if(data.code==1){
				let html='';
				data.cart.forEach(goods=>{
				let priceZ=parseInt(goods.price*goods.cart_number);
				// console.log(priceZ)
				// console.log(data.cart);
 					html +=`<ul data-id="${goods.goods_id}" class="goods-list yui3-g">
					<li class="yui3-u-3-8 pr">
						<input type="checkbox" class="good-checkbox">
						<div class="good-item">
							<div class="item-img">
								<img src="${goods.img_small_logo}">
							</div>
							<div class="item-msg">${goods.title}</div>
						</div>
					</li>
					<li class="yui3-u-1-8">
						<span>颜色: 银色</span>
						<br>
						<span>处理器: Core I5</span>
						<br>
						<span>内存: 8GB</span>
						<br>
						<span>尺寸: 13.3英寸</span>
						<br>
					</li>
					<li class="yui3-u-1-8">
						<span class="price">${goods.price}</span>
					</li>
					<li class="yui3-u-1-8">
						<div class="clearfix">
							<a href="javascript:;" class="increment mins">-</a>
							<input autocomplete="off" type="text" value="${goods.cart_number}"minnum="1" class="itxt">
							<a href="javascript:;" class="increment plus">+</a>
						</div>
						<div class="youhuo">有货</div>
					</li>
					<li class="yui3-u-1-8">
						<span class="sum">${priceZ}</span>
					</li>
					<li class="yui3-u-1-8">
						<div class="del1">
							<a href="javascript:;">删除</a>
						</div>
						<div>移到我的关注</div>
					</li>
				</ul>`
				});
				this.$('.cart-list').innerHTML=html;
			} 
		}
	}	
	//将单个商品的操作都委托给cart-list 
	//使用分发目的在于,页面中有多个敌法都会触发div.cart.list上的点击事件,所以需要加以分别
	//(eve)
	//直接解构赋值,只要target
	distributeEve({target}){
		// console.log(target);
		
		//判断是否有div1这个类,是则点击删除这个按钮
		if(target.parentNode.classList.contains('del1')){
			//确认是否删除
			 this.delGoods(target )
			 //统计商品数量和价格的方法
			 this.getNumPriceGoods()
		}
			//判断点击是否为单个商品选中按钮
			if(target.classList.contains('good-checkbox')){
				//  console.log(target);
				this.getOneGoodsCheck(target);
			 }
	}
	//删除的方法
	delGoods(target){
		let that=this
		let layerIndex= layer.confirm('确定删除吗',{title:'删除提示'},function(){
			// console.log('确定了...');
		 //,function(){
			// console.log('取消了...');
				//获取商品id
		let ulObj=target.parentNode.parentNode.parentNode;
		// console.log(ulObj);
		let id=ulObj.dataset.id;
		//获取用户id
		let userId=localStorage.getItem('user_id')
		// console.log(id);   
		//发送ajax删除商品数据
		// console.log(id,userId);
		axios.get('http://localhost:8888/cart/remove?id='+userId+'&goodsId='+id)
		.then(res=>{
			let {data,status}=res
			// console.log(data,status);
			if(data.code==1){//删除成功,则关闭弹出框,删除页面中的商品对应的ul
				//关闭确认框
				layer.close(layerIndex)//关闭弹出窗
				layer.msg('商品删除成功')
				//在页面中删除节点
				ulObj.remove();
				//统计商品数量和价格的方法
				that.getNumPriceGoods()
			}
		})
		})
	}
	//实现单个商品的选中按钮的回调
	getOneGoodsCheck(target){
		//如果是取消,则直接让全选取消
		// console.log(target.checked);
		if(!target.checked){
			this.$('.cart-th input').checked=false;
			return;
		} 
		//如果点击是选中,则返回true
		if(target.checked){
			//选中页面中,没有被选中的商品
			let res=Array.from(this.$('.good-checkbox')).find(checkbox=>{
				//没有被选中,状态为false
				
				// console.log(checkbox.checked);
				return !checkbox.checked
			});
			// console.log(res);
			//如果返回undefined,则是页面中都被选中
		}
	}
	//获取页面中,所有选中商品的价格和数量
	getNumPriceGoods(){
		let goods=document.querySelectorAll('.goods-list');
		// console.log(goods);
		//迭代器
		// let res=goods[Symbol.iterator]();
		// console.log(res.next());
		//保存数量和价格
		let totalNum=0;
		let totalPrice=0;
		// console.log(goods);
		goods.forEach(one=>{
			// console.log(one.firstElementChild.firstElementChild);
			//只统计本选中的商品的价格和数量
			if(one.firstElementChild.firstElementChild){
				// console.log(one.querySelector('.itxt').value);
				//数量的获取
				totalNum=one.querySelector('.itxt').value-0+totalNum;
				// console.log(one.querySelector('.sum').innerHTML);
				totalPrice=one.querySelector('.sum').innerHTML-0+totalPrice;
			}
		});
		// console.log(totalNum,totalPrice);
		// 设置到总计上
		this.$('.sumprice-top strong').innerHTML = totalNum;
		this.$('.sumprice-top .summoney').innerHTML = totalPrice;
	}
	//全选的实现
	clickAllChecked(eve){
		// console.log(eve.target);
		//获取全选按钮的状态true 取消false
		let checked=eve.target.checked;
		// console.log(checked);
		this.OneGoodsCheck(checked)
		//统计数量和价格的方法
		this.getNumPriceGoods(); 
	}
	//设置单个商品的选中状态
	OneGoodsCheck(checkStatus){
		let goodsList=this.$('.goods-list')
		// console.log(goodsList,checkStatus);
		goodsList.forEach(ul=>{
			// console.log(ul);
			//找到单个商品的复选框
			ul.firstElementChild.firstElementChild.checked=checkStatus; 
		})
	}
	$(tag){
        let res=document.querySelectorAll(tag)
        return res.length==1?res[0]:res;
    }
}
new Cart();
