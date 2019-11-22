var game={
	CSIZE:26,
	OFFSET:15,
	shape:null,//正在下落的主角图形
	pg:null,//保存游戏容器元素
	timer:null,//
	interval:200,
	RN:20,CN:10,
	wall:null,
	start:function(){
		//初始化wall为空数组
		this.wall=[];
		for (var r=0;r<this.RN ;r++ ){
			this.wall[r]=new Array(this.CN);
		}
		this.pg=document.querySelector(".playground");
		this.shape=new T();
		this.paint();
		//启动周期性函数，movedown方法
		this.timer=setInterval(
			this.moveDown.bind(this),this.interval	
		);
		//为document添加事件监听，处理函数为myKeyDown
		//负责响应键盘按下事件
		document.onkeydown=function(e){
				switch(e.keyCode){
					case 37:this.moveLeft();break;
					case 38:
					case 39:this.moveRight();break;
					case 40:this.moveDown;break;
					
				}
		}.bind(this)
		
	},
	canLeft:function(){//判断能否左移
		for (var i=0; i<this.shape.cells.length;i++ ){
			var cell=this.shape.cells[i];
			if(cell.c==0)return false;
			else if(this.wall[cell.r][cell.c-1]) return false;
		}
		return true;

	},
	moveLeft:function(){
		//如果可以左移
		if(this.canLeft()){
			//调用shape的moveLeft的方法
			this.shape.moveLeft();
			//重绘一切
			this.paint();
		}
	},
	canRight:function(){//判断能否右移
		for (var i=0; i<this.shape.cells.length;i++ ){
			var cell=this.shape.cells[i];
			if(cell.c==this.CN-1)return false;
			else if(this.wall[cell.r][cell.c+1]) return false;
		}
		return true;
	},
	moveRight:function(){
		if(this.canRight()){
			//调用shape的moveLeft的方法
			this.shape.moveRight();
			//重绘一切
			this.paint();
		}
	},
	canDown:function(){//判断能下落
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
	
	landIntoWall:function(){
		for (var i=0;i<this.shape.cells.length ; i++){
			var cell=this.shape.cells[i];
			this.wall[cell.r][cell.c]=cell;
		}
	},
	moveDown:function(){
		if (this.canDown()){
			this.shape.moveDown();//调用shape的movedown方法
			this.paint();//重绘主角图形
		}else{
			this.landIntoWall();//将shape中的格落入强中
			this.shape=new T();
		}
	},
	paintWall:function(){//重绘墙
		var frag=document.createDocumentFragment();
		for (var r=this.RN-1;r>=0 ; r--){
			//如果r行为空行
			if(this.wall[r].join("")==""){
			
				break;
			}	//break
			else{//否则
				
				for(var c=0;c<this.CN ; c++){
					if(this.wall[r][c]){
						//还需理解
						frag.appendChild(
							this.paintCell(this.wall[r][c])
						);
					}
				}
			}
		}
		this.pg.appendChild(frag);
	},
	paintCell:function(cell){//重绘一个格
		var img=new Image();
		img.style.left=
			cell.c*this.CSIZE+this.OFFSET+"px";
		img.style.top=
			cell.r*this.CSIZE+this.OFFSET+"px";
		img.src=cell.src;
		return img;
	},
	paint:function(){//重绘一切
		//删除pg中的img元素
		this.pg.innerHTML=
			this.pg.innerHTML.replace(/<img\s[^>]*>/g,"");
		this.paintShape();
		this.paintWall();
	},
	paintShape:function(){//重绘主角图形
		var frag=document.createDocumentFragment();
		for (var i=0; i<this.shape.cells.length; i++){
			frag.appendChild(
				this.paintCell(this.shape.cells[i])
			);
		}
		this.pg.appendChild(frag);
	},
}
game.start();