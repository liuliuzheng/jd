class Login{
	constructor(){
		//给登录按钮,绑定点击事件
		this.$('.mc .over').addEventListener('click',this.clickFn.bind(this))
	}
	clickFn(){
		//console.log(location.search.split('=')[1]);
			//点击获取页面中form表单
		let forms=document.forms[0].elements;
		// console.log(forms);
		let username=forms.uname.value;
		let password=forms.password.value
		//判断是否为空
		if(!username.trim()||!password.trim())throw new Error('不能为空');
		// console.log(username,password);
		//注意发送post请求
		axios.defaults.headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded' ;
		//xhr.setRequestHeader
		//对参数进行编码
		//post请求必须是以form data形式传参
		let data=`username=${username}&password=${password}`;
		axios.post('http://localhost:8888/users/login',data).then(res=>{
			
			let{status,data}=res;
			if(status==200){
				console.log(data);
				localStorage.setItem('token',data.token)
				localStorage.setItem('user_id',data.user.id)
				//从哪里来,跳转都哪里去
			 location.assign(location.search.split('=')[1])
			}
		})
	}


	$(tag){
		let res=document.querySelectorAll(tag)
		return res.length==1?res[0]:res;
	}
}
new Login;