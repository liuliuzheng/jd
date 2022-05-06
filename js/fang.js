const boxObj=document.querySelector('.preview_wrap'),
smallObj=boxObj.firstElementChild,
maskObj=smallObj.lastElementChild,
bigObj=document.querySelector('.big');
bigImg=bigObj.lastElementChild;
smallObj.onmouseenter=function(){
    maskObj.style.display='block';
    bigObj.style.display='block';
       }
smallObj.onmouseleave=function(){
    maskObj.style.display='none'
    bigObj.style.display='none';
}
let boxT=boxObj.offsetTop;
let boxL=boxObj.offsetLeft;
smallObj.onmousemove=function(eve){
    console.log(eve);

let cX=eve.pageX;
let cY=eve.pageY;
// let boxL=boxObj.offsetLeft;
// let boxT=boxObj.offsetTop;
let maskW=maskObj.offsetWidth;
let maskH=maskObj.offsetHeight;
let maskL=cX-boxL-maskW/2;
let maskT=cY-boxT-maskH/2;
if(maskL<0)maskL=0;
if(maskT<0)maskT=0;
let maxMaskL=smallObj.offsetWidth-maskW;
let maxMaskT=smallObj.offsetHeight-maskH;
if(maskL>maxMaskL){
    maskL=maxMaskL
}
if(maskT>maxMaskT)
    maskT=maxMaskT

maskObj.style.top=maskT+'px';
maskObj.style.left=maskL+'px';
let bigMaxLeft=bigImg.offsetWidth-bigObj.offsetWidth;
let bigMaxTop=bigImg.offsetHeight-bigObj.offsetHeight;
let tmpBigImgLeft=maskL/maxMaskL*bigMaxLeft;
let tmpBigImgTop=maskT/maxMaskT*bigMaxTop;
bigImg.style.left=-tmpBigImgLeft+'px';
bigImg.style.top=-tmpBigImgTop+'px';
}