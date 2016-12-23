/**
 * Created by 39753 on 2016/10/8.
 */
(function(){
    function getCss(curEle,attr){
        var val=null;
        var reg=null;
        if('getComputedStyle' in window){
            val=getComputedStyle(curEle,false)[attr]
        }else{
            //处理透明度
            if(attr==='opacity'){
                val=curEle.currentStyle.filter; //'alpha(opacity=30)'
                reg=/^alpha\(opacity[=:](\d+)\)$/gi;
                //RegExp.$1 --第一个小分组   ；他不受全局g的影响，但是用RegExp之前，一定要先影响lastIndex；能影响lastIndex的属性有两个（test，exec）
                //注意。通过RegExp最多只能拿到$9；第九个小分组之后都拿不到；
                //return reg.test(val)?reg.exec(val)[1]/100:1;
                return reg.test(val)?RegExp.$1/100:1;
            }
            val=curEle.currentStyle[attr];
        }
        //处理单位
        reg=/^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
        return reg.test(val)?parseFloat(val):val;
    }
    function setCss(curEle,attr,value){
        //处理浮动问题
        if(attr==='float'){
            curEle.style.cssFloat=value;
            curEle.style.styleFloat=value;
            return;
        }
        //处理透明度
        if(attr==='opacity'){
            curEle.style.opacity=value;
            curEle.style.filter='alpha(opacity='+(value*100)+')';
            return;
        }
        //处理单位
        var reg=/^(width|height|left|top|right|bottom|((margin|padding)(left|top|right|bottom)?))$/ig;
        if(reg.test(attr) && value.toString().indexOf('%')===-1){
            value=parseFloat(value)+'px';
        }
        curEle.style[attr]=value;
    }
    function setGroupCss(curEle,opt){
        if(opt.toString()!=='[object Object]') return;//如果opt不是对象，直接阻断程序；
        for(var attr in opt){
            setCss(curEle,attr,opt[attr])
        }
    }
    function css(curEle){
        var arg2=arguments[1];
        if(typeof arg2==='string'){//获取 or 设置一个
            var arg3=arguments[2];
            if(typeof arg3==='undefined'){//获取
                return getCss(curEle,arg2)
            }else{//设置一个
                setCss(curEle,arg2,arg3)
            }
        }
        if(arg2.toString()==='[object Object]'){//设置一组
            setGroupCss(curEle,arg2)
        }
    }
    var zhufengEffect = {
        //匀速
        Linear: function (t, b, c, d) {
            return c * t / d + b;
        },
        //指数衰减的反弹缓动
        Bounce: {
            easeIn: function (t, b, c, d) {
                return c - zhufengEffect.Bounce.easeOut(d - t, 0, c, d) + b;
            },
            easeOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                } else {
                    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                }
            },
            easeInOut: function (t, b, c, d) {
                if (t < d / 2) {
                    return zhufengEffect.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                }
                return zhufengEffect.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        },
        //二次方的缓动
        Quad: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            }
        },
        //三次方的缓动
        Cubic: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t + 2) + b;
            }
        },
        //四次方的缓动
        Quart: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            }
        },
        //五次方的缓动
        Quint: {
            easeIn: function (t, b, c, d) {
                return c * (t /= d) * t * t * t * t + b;
            },
            easeOut: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t * t + b;
                }
                return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
            }
        },
        //正弦曲线的缓动
        Sine: {
            easeIn: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInOut: function (t, b, c, d) {
                return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
            }
        },
        //指数曲线的缓动
        Expo: {
            easeIn: function (t, b, c, d) {
                return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
            },
            easeOut: function (t, b, c, d) {
                return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
            },
            easeInOut: function (t, b, c, d) {
                if (t == 0) return b;
                if (t == d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        },
        //圆形曲线的缓动
        Circ: {
            easeIn: function (t, b, c, d) {
                return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
            },
            easeOut: function (t, b, c, d) {
                return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
            },
            easeInOut: function (t, b, c, d) {
                if ((t /= d / 2) < 1) {
                    return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                }
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }
        },
        //超过范围的三次方缓动
        Back: {
            easeIn: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            easeOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            easeInOut: function (t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) {
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            }
        },
        //指数衰减的正弦曲线缓动
        Elastic: {
            easeIn: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            easeOut: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d) == 1) return b + c;
                if (!p) p = d * .3;
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
            },
            easeInOut: function (t, b, c, d, a, p) {
                if (t == 0) return b;
                if ((t /= d / 2) == 2) return b + c;
                if (!p) p = d * (.3 * 1.5);
                var s;
                !a || a < Math.abs(c) ? (a = c, s = p / 4) : s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            }
        }
    };
    //1.让谁运动到哪里
    function move(obj,target,opt){
        var ary = ["Linear", "Elastic-easeOut", "Back-easeOut", "Bounce-easeOut", "Expo-easeIn"];
        //1.1为公式的4个参数做准备
        opt=opt||{};//用对象的形式来传参，可以避免参数顺序错误的问题；
        //用defaultOpt来设置一组默认的参数；
        var defaultOpt={
            duration:2000,//总时间
            effect:zhufengEffect.Linear,
        };
        for(var attr in opt){//当没有给opt中传实参的时候，用的是defaultOpt中的默认值，否则，用的就是opt中的实参；
            defaultOpt[attr]=opt[attr];
        }
        //运动形式
        if(typeof defaultOpt.effect === 'number'){
            var str=ary[defaultOpt.effect%ary.length];
            ary=str.split('-'); //["Linear"] ["Elastic","easeOut"]
            defaultOpt.effect=ary.length>=2?zhufengEffect[ary[0]][ary[1]]:zhufengEffect[ary[0]];
        }else if(typeof defaultOpt.effect === 'object'){
            defaultOpt.effect=defaultOpt.effect.length>=2?zhufengEffect[defaultOpt.effect[0]][defaultOpt.effect[1]]:zhufengEffect[defaultOpt.effect[0]];
        }
        var begin={},change={};
        //target:{left:xxxx,top:xx,width:xxx.....}
        for(var attr in target){
            begin[attr]=css(obj,attr);
            change[attr]=target[attr]-begin[attr];
        }
        var time=null;//0;
        //通过定时器累加时间，根据公式求出最新的位置，并且，设置最新的位置；
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            time+=10;
            //停止条件的判断
            if(time>=defaultOpt.duration){
                css(obj,target);
                clearInterval(obj.timer);
                //回调函数，并且改变回调函数中的this指向
                /*defaultOpt.callback && defaultOpt.callback.call(obj);*/
                fire(obj,'moveEnd');
                return;
            }
            for(var attr in begin){//求出最新的位置
                var curPos=defaultOpt.effect(time,begin[attr],change[attr],defaultOpt.duration);
                css(obj,attr,curPos);
            }
        },10);
    }
    window.animate=move;
})();