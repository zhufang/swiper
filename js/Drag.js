/**
 * Created by 39753 on 2016/10/20.
 */
//面向对象版的订阅发布
//创建一个EventEmitter类；--为了留接口，让产品升级
function EventEmitter(){};
//这里绑定的都是自定义事件
EventEmitter.prototype.on=function(type,fn){//自定义事件绑定--订阅
    if(!this['aEmitter'+type]){//1.把所有跟该行为有关的方法，都放进一个数组，这个数组存在对象的自定义属性上；
        this['aEmitter'+type]=[];
    }
    var a=this['aEmitter'+type];
    for(var i=0; i< a.length; i++){//避免重复的问题
        if(a[i]==fn) return;
    }
    a.push(fn);
    return this;
};
EventEmitter.prototype.fire=function(type,e){//自定义事件发布--发布
    var a=this['aEmitter'+type];//1）拿到对象自定义属性上的数组；
    if(a && a.length){//2)顺序调用数组中的每一项；
        for(var i=0; i< a.length; i++){
            if(typeof a[i]==='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.off=function(type,fn){//自定义事件解绑
    var a=this['aEmitter'+type];//1.拿到数组
    if(a && a.length){//2.判断数组中的函数是否等于fn，等于让其为null，进行解绑
        for(var i=0; i< a.length; i++){
            if(a[i]===fn){
                a[i]=null;
                break;
            }
        }
    }
};
//面向对象版的拖拽
function Drag(ele){
    this.ele=ele;
    this.x=this.y=this.mx=this.my=null;
    this.DOWN=processThis(this.down,this);
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
    on(this.ele,'mousedown',this.DOWN);//1.on方法针对系统事件 2. 要保证所有的this，都指向实例；

}
Drag.prototype=new EventEmitter;//存在问题：construction指向问题；
//-----纯净版的拖拽 start-----
Drag.prototype.constructor=Drag;
Drag.prototype.down=function(e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx= e.clientX;
    this.my= e.clientY;
    //区分浏览器：针对快速拖拽失去焦点的问题-》IE：setCapture捕获焦点  标准浏览器：document
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
        on(this.ele,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
        e.preventDefault();//阻止默认事件
    }
    this.fire('selfDown',e);
};
Drag.prototype.move=function(e){
    this.ele.style.left= e.clientX-this.mx+this.x+'px';
    this.ele.style.top= e.clientY-this.my+this.y+'px';
    this.fire('selfMove',e);
};
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    this.fire('selfUp',e);
};
//-----纯净版的拖拽 end-----
//-----版本升级1：增加限制范围的功能 -------
Drag.prototype.range=function(oRange){
    //1.扩充的这个功能，发生在拖拽的哪个阶段？
    this.oRange=oRange;//客户传给你的边界值；
    this.on('selfMove',this.addRange)
};
Drag.prototype.addRange=function(e){
    var l=e.clientX-this.mx+this.x;
    var t=e.clientY-this.my+this.y;
    if(l<=this.oRange.left){
        l=this.oRange.left
    }else if(l>=this.oRange.right){
        l=this.oRange.right
    }
    if(t<=this.oRange.top){
        t=this.oRange.top
    }else if(t>=this.oRange.bottom){
        t=this.oRange.bottom
    }
    this.ele.style.left= l+'px';
    this.ele.style.top= t+'px';
};
//-----版本升级2：增加边框----------
Drag.prototype.border=function(){
    //1.拖拽开始时，添加border-- addBorder
    this.on('selfDown',this.addBorder);
    //2.拖拽结束时，移出border；--removeBorder
    this.on('selfUp',this.removeBorder);
};
Drag.prototype.addBorder=function(){
    //删除里面的东西，只留虚线框
    this.oImg=this.ele.getElementsByTagName('img')[0];
    this.ele.removeChild(this.oImg);
    this.oldBg=this.ele.style.background;
    this.ele.style.background='none';
    this.ele.style.border='1px dashed red';
};
Drag.prototype.removeBorder=function(){
    //显示以前的内容，移出虚线框
    this.ele.appendChild(this.oImg);
    this.ele.style.background=this.oldBg;
    this.ele.style.border='none';
};
//-----版本升级3：弹性运动----------
/*//工程师自己进行版本升级--作为开发者的角色
Drag.prototype.jump=function(){
    //1.在拖拽开始时，停止运动
    this.on('selfDown',removeEffect);
    //2.在拖拽进行中，获取横向速度
    this.on('selfMove',getSpeed);
    //3.在拖拽结束时，进行横向和纵向的运动；
    this.on('selfUp',fly);
    this.on('selfUp',drop);
};*/






























