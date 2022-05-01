class Cart{
	constructor() {
	  
		// console.log(id);
		this.addGoodsCart();
	}
	
	addGoodsCart(){
	  	 let goods_id = location.hash.substring(1);
		 let userId = localStorage.getItem('userId');
		 axios.post('http://localhost:8888/cart/add',
		    `id=${userId}&goodsId=${goods_id}`,
		    {
				headers: {
		         'Content-Type': 'application/x-www-form-urlencoded',
				 'authorization':localStorage.getItem('token')
		       },
			   }
		 ).then(data=>{
			 console.log(data);
		 })
		  
	}
	// 购物车商品列表
}

new Cart;