/**
 * Created by 39753 on 2016/10/20.
 */
function removeEffect(){
    clearTimeout(this.flyTimer);
    clearTimeout(this.dropTimer);
}
function getSpeed(e){
    if(!this.prevSpeed){
        this.prevSpeed= e.clientX;
    }else{
        this.speedX= e.clientX-this.prevSpeed;
        this.prevSpeed= e.clientX;
    }
}
function fly(){
    clearTimeout(this.flyTimer);
    this.speedX*=.93;
    var l=this.ele.offsetLeft+this.speedX;
    var maxL=(document.documentElement.clientWidth||document.body.clientWidth)-this.ele.offsetWidth;
    if(l<=0){
        l=0;
        this.speedX*=-1;
    }else if(l>=maxL){
        l=maxL;
        this.speedX*=-1;
    }
    this.ele.style.left=l+'px';
    if(Math.abs(this.speedX)>=0.5){
        this.flyTimer=setTimeout(processThis(fly,this),20);
    }
}
function drop(){
    if(!this.speedY){
        this.speedY=9.8;
    }else{
        this.speedY+=9.8;
    }
    this.speedY*=.93;
    var t=this.ele.offsetTop+this.speedY;
    var maxT=(document.documentElement.clientHeight||document.body.clientHeight)-this.ele.offsetHeight;
    if(t>=maxT){
        t=maxT;
        this.speedY*=-1;
        this.flg++;
    }else{
        this.flg=0;
    }
    this.ele.style.top=t+'px';
    if(this.flg<2){
        this.dropTimer=setTimeout(processThis(drop,this),20);
    }
}

