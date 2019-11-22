/**
 * Created by 69124 on 2017/3/15.
 */
define(['./a'],function (a) {
    'use strict';
    return{
        name:"xiaoming",
        age:25,
        showInfo:function(){
            console.log(this.name,a.name);
        }
    }
});