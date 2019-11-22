var game={
	CSIZE:26, //每个格子大小
	OFFSET:15, //格子距离边框的偏移量
	pg:null, //保存游戏容器元素
	shape:null, //保存正在下落的主角图形
	nextShape:null,//保存备胎图形
	timer:null,//保存定时器序号
	interval:200,//下落的时间间隔
	RN:20, CN:10, //保存总行数和总列数
	wall:null,
	start:function(){
		this.wall=[];//初始化wall为空数组
		//r从0开始，到<RN结束
		for(var r=0;r<this.RN;r++){
			//设置wall的r位置为CN个空元素的数组
			this.wall[r]=new Array(this.CN);
		}
		//找到class为playground的div,保存在pg属性中
		this.pg=document.querySelector(".playground");
		//随机生成一个图形保存到shape中
		this.shape=this.randomShape();
		//随机生成一个图形保存到nextShape中
		this.nextShape=this.randomShape();
		this.paint();//绘制主角图形
		//启动周期性定时器，设置任务函数为moveDown, 时间间隔为interval
		this.timer=setInterval(
			this.moveDown.bind(this),this.interval
		);
		//为document绑定键盘按下事件为:
		document.onkeydown=function(e){
			switch(e.keyCode){//判断按键号
				//是32: 调用hardDrop
				case 32: this.hardDrop(); break;
				//是37: 调动moveLeft
				case 37: this.moveLeft(); break;
				//是38: 顺时针旋转
				case 38: this.rotateR(); break;
				//是90: 逆时针旋转
				case 90: this.rotateL(); break;
				//是39: 调用moveRight
				case 39: this.moveRight(); break;
				//是40: 调用moveDown
				case 40: this.moveDown(); break;
				
			}
		}.bind(this)//提前绑定this
	},
	canRotate:function(){
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的r>=RN,或r<0,或c>=CN,或c<0
			if(cell.r>=this.RN||cell.r<0
					||cell.c>=this.CN||cell.c<0)
				return false;//返回false
			//否则,如果wall中和当前cell相同位置有格
			else if(this.wall[cell.r][cell.c])
				return false;//返回false
		}//(遍历结束)
		return true;//返回true
	},
	rotateR:function(){
		this.shape.rotateR();
		if(!this.canRotate())//如果不能旋转
			this.shape.rotateL();
	},
	rotateL:function(){
		this.shape.rotateL();
		if(!this.canRotate())//如果不能旋转
			this.shape.rotateR();
	},	
	hardDrop:function(){//一落到底
		//反复: 只要可以下落
		while(this.canDown())
			this.moveDown();//调用moveDown方法
	},
	canLeft:function(){//能否左移
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的c是0，返回false
			if(cell.c==0) return false;
			//否则，如果wall中cell左侧有格，返回false
			else if(this.wall[cell.r][cell.c-1]) return false;
		}//(遍历结束)
		return true;//返回true
	},
	moveLeft:function(){//左移
		if(this.canLeft()){//如果可以左移:
			this.shape.moveLeft();//调用shape的moveLeft
			this.paint();//重绘一切
		}
	},
	canRight:function(){//能否右移
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将cell临时保存在cell中
			var cell=this.shape.cells[i];
			//如果cell的c是CN-1，返回false
			if(cell.c==this.CN-1) return false;
			//否则，如果wall中cell右侧有格，返回false
			else if(this.wall[cell.r][cell.c+1]) return false;
		}//(遍历结束)
		return true;//返回true
	},
	moveRight:function(){//右移
		if(this.canRight()){//如果可以右移
			this.shape.moveRight();//调用shape的moveRight
			this.paint();//重绘一切
		}
	},
	canDown:function(){//检查是否可继续下落
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时存为cell
			var cell=this.shape.cells[i];
			//如果cell的r等于RN-1
			if(cell.r==this.RN-1) return false;
			//否则，如果wall中和cell相同位置的下方不是undefined
			else if(this.wall[cell.r+1][cell.c]) 
				return false;//返回false
		}//(遍历结束)
		return true;//返回true
	},
	landIntoWall:function(){//将shape中的格落入墙中
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在cell中
			var cell=this.shape.cells[i];
			//设置wall中cell相同r，相同c的位置为cell
			this.wall[cell.r][cell.c]=cell;
		}
	},
	moveDown:function(){
		if(this.canDown()){//如果可以下落
			//调用shape的moveDown方法
			this.shape.moveDown();
			this.paint();//重绘主角图形
		}else{//否则
			this.landIntoWall();//将shape中的格落入墙中
			this.shape=this.nextShape;//将备胎转正
			this.nextShape=this.randomShape();//生成新的备胎
		}
	},
	randomShape:function(){//随机生成一个图形
		//0~2之间生成一个随机整数r
		var r=Math.floor(Math.random()*3);
		switch(r){//判断r
			case 0: return new O();//是0: return new O();
			case 1: return new I();//是1: return new I();
			case 2: return new T();//是2: return new T();
		}
	},
	paintNext:function(){//重绘备胎图形
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历nextShape中每个cell
		for(var i=0;i<this.nextShape.cells.length;i++){
			var img=this.paintCell(this.nextShape.cells[i]);
			//获得img的left，+10*CSIZE，再保存回img的left
			img.style.left=
				parseFloat(img.style.left)+10*this.CSIZE+"px";
			//获得img的top, +CSIZE, 在保存回img的top
			img.style.top=
				parseFloat(img.style.top)+this.CSIZE+"px";

			//将当前cell临时保存在变量cell中
			frag.appendChild(img);//将img追加到frag中
		}//(遍历结束)
		this.pg.appendChild(frag);//将frag追加到pg中
	},
	paintWall:function(){//重绘墙
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//自底向上遍历墙中每个格
		for(var r=this.RN-1;r>=0;r--){
			//如果wall中r行无缝拼接后是"",就退出循环
			if(this.wall[r].join("")=="") break;
			else//否则
				for(var c=0;c<this.CN;c++){
					//如果wall中当前元素有格
					if(this.wall[r][c])
						frag.appendChild(
							this.paintCell(this.wall[r][c])
						);
				}
		}//(遍历结束)
		this.pg.appendChild(frag);
	},
	paintCell:function(cell){//重绘一个格
		var img=new Image();//创建一个img元素
		//设置img的left为cell的c*CSIZE+OFFSET
		img.style.left=
			cell.c*this.CSIZE+this.OFFSET+"px";
		//设置img的top为cell的r*CSIZE+OFFSET
		img.style.top=
			cell.r*this.CSIZE+this.OFFSET+"px";
		img.src=cell.src;//设置img的src为cell的src
		return img;
	},
	paintShape:function(){//绘制主角图形
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
			//将当前cell临时保存在变量cell中
			frag.appendChild(
				this.paintCell(this.shape.cells[i])
			);//将img追加到frag中
		}//(遍历结束)
		this.pg.appendChild(frag);//将frag追加到pg中
	},
	paint:function(){//重绘一切
		//删除pg的内容中所有img元素(<img 除>之外的任意字符任意个>)
		this.pg.innerHTML=
		 this.pg.innerHTML.replace(/<img\s[^>]*>/g,"");
		this.paintShape();//重绘主角图形
		this.paintWall();//重绘墙
		this.paintNext();//重绘备胎
	},
}
game.start();