"use strict";(self.webpackChunknew_material_ui_tut=self.webpackChunknew_material_ui_tut||[]).push([[905],{9905:(e,r,t)=>{t.r(r),t.d(r,{default:()=>n});var a=t(1014),i=t(2362),s=t(6526);const n=()=>a.createElement(i.A,{sx:{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",width:"100%",backgroundColor:"#fff"}},a.createElement(s.A,null))},6526:(e,r,t)=>{t.d(r,{A:()=>w});var a=t(1014),i=t(8788),s=t(1849),n=t(9555),o=t(9505),l=t(2584),c=t(4039),d=t(9476),u=t(1342),p=t(9115),f=t(3439);function h(e){return(0,f.Ay)("MuiCircularProgress",e)}(0,p.A)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var m=t(6550);const v=44,k=n.i7`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,y=n.i7`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`,g="string"!==typeof k?n.AH`
        animation: ${k} 1.4s linear infinite;
      `:null,x="string"!==typeof y?n.AH`
        animation: ${y} 1.4s ease-in-out infinite;
      `:null,A=(0,o.Ay)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:t}=e;return[r.root,r[t.variant],r[`color${(0,d.A)(t.color)}`]]}})((0,l.A)((e=>{let{theme:r}=e;return{display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("transform")}},{props:{variant:"indeterminate"},style:g||{animation:`${k} 1.4s linear infinite`}},...Object.entries(r.palette).filter((0,u.A)()).map((e=>{let[t]=e;return{props:{color:t},style:{color:(r.vars||r).palette[t].main}}}))]}}))),b=(0,o.Ay)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,r)=>r.svg})({display:"block"}),S=(0,o.Ay)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,r)=>{const{ownerState:t}=e;return[r.circle,r[`circle${(0,d.A)(t.variant)}`],t.disableShrink&&r.circleDisableShrink]}})((0,l.A)((e=>{let{theme:r}=e;return{stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:e=>{let{ownerState:r}=e;return"indeterminate"===r.variant&&!r.disableShrink},style:x||{animation:`${y} 1.4s ease-in-out infinite`}}]}}))),w=a.forwardRef((function(e,r){const t=(0,c.b)({props:e,name:"MuiCircularProgress"}),{className:a,color:n="primary",disableShrink:o=!1,size:l=40,style:u,thickness:p=3.6,value:f=0,variant:k="indeterminate",...y}=t,g={...t,color:n,disableShrink:o,size:l,thickness:p,value:f,variant:k},x=(e=>{const{classes:r,variant:t,color:a,disableShrink:i}=e,n={root:["root",t,`color${(0,d.A)(a)}`],svg:["svg"],circle:["circle",`circle${(0,d.A)(t)}`,i&&"circleDisableShrink"]};return(0,s.A)(n,h,r)})(g),w={},C={},$={};if("determinate"===k){const e=2*Math.PI*((v-p)/2);w.strokeDasharray=e.toFixed(3),$["aria-valuenow"]=Math.round(f),w.strokeDashoffset=`${((100-f)/100*e).toFixed(3)}px`,C.transform="rotate(-90deg)"}return(0,m.jsx)(A,{className:(0,i.A)(x.root,a),style:{width:l,height:l,...C,...u},ownerState:g,ref:r,role:"progressbar",...$,...y,children:(0,m.jsx)(b,{className:x.svg,ownerState:g,viewBox:"22 22 44 44",children:(0,m.jsx)(S,{className:x.circle,style:w,ownerState:g,cx:v,cy:v,r:(v-p)/2,fill:"none",strokeWidth:p})})})}))}}]);
//# sourceMappingURL=905.ed6a7ed5.chunk.js.map