(()=>{var e,l={638:(e,l,t)=>{var o={"./simpletoc/index.js":824};function n(e){var l=a(e);return t(l)}function a(e){if(!t.o(o,e)){var l=new Error("Cannot find module '"+e+"'");throw l.code="MODULE_NOT_FOUND",l}return o[e]}n.keys=function(){return Object.keys(o)},n.resolve=a,e.exports=n,n.id=638},284:(e,l,t)=>{"use strict";var o=t(981);const n=t(638);n.keys().forEach((e=>{const l=n(e),{metadata:t,settings:a,name:c}=l;(0,o.registerBlockType)(c,{...t,...a})}))},824:(e,l,t)=>{"use strict";t.r(l);const o=window.wp.element;var n=t(981);const a=JSON.parse('{"apiVersion":2,"name":"wearerequired/simpletoc-block","version":"1.0.0","title":"SimpleTOC","category":"layout","keywords":["TOC","Table of Contents","SimpleTOC","Inhaltsverzeichnis","Index"],"icon":"simpletocicon","description":"Adds a Table of Contents.","attributes":{"no_title":{"type":"boolean","default":false},"title_text":{"type":"string"},"use_ol":{"type":"boolean","default":false},"remove_indent":{"type":"boolean","default":false},"add_smooth":{"type":"boolean","default":false},"use_absolute_urls":{"type":"boolean","default":false},"max_level":{"type":"integer","default":6},"min_level":{"type":"integer","default":1},"autorefresh":{"type":"boolean","default":true}},"supports":{"align":["wide","full"]},"textdomain":"simpletoc"}'),c=window.wp.i18n,r=window.wp.blockEditor,i=window.wp.serverSideRender;var s=t.n(i);const u=window.wp.components,m=window.wp.data,d=window.React,b=(0,o.createElement)("svg",{fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",viewBox:"0 0 500 500",xmlns:"http://www.w3.org/2000/svg"},(0,o.createElement)("path",{d:"m365.983 78.248c2.72-32.415 29.921-57.908 63.029-57.908 34.91 0 63.253 28.342 63.253 63.252s-28.343 63.252-63.253 63.252v269.582c0 25.232-20.485 45.718-45.718 45.718h-313.62c-25.233 0-45.719-20.486-45.719-45.718v-292.46c0-25.233 20.486-45.718 45.719-45.718zm-245.943 324.857c-16.883 0-30.511-13.719-30.511-30.714 0-16.79 13.628-30.714 30.511-30.714 16.679 0 30.511 13.924 30.511 30.714 0 16.995-13.832 30.714-30.511 30.714zm50.851-40.952h183.063v20.476h-183.063zm-50.851-61.428c-16.883 0-30.511-13.719-30.511-30.714 0-16.79 13.628-30.714 30.511-30.714 16.679 0 30.511 13.924 30.511 30.714 0 16.995-13.832 30.714-30.511 30.714zm50.851-40.952h183.063v20.476h-183.063zm-50.851-61.428c-16.883 0-30.511-13.719-30.511-30.714 0-16.791 13.628-30.714 30.511-30.714 16.679 0 30.511 13.923 30.511 30.714 0 16.995-13.832 30.714-30.511 30.714zm50.851-40.952h183.063v20.476h-183.063zm253.007-44.649v-24.188h-24.008v-10.108h24.008v-24.008h10.229v24.008h24.008v10.108h-24.008v24.188z"}));(0,n.registerBlockType)(a,{icon:b,edit:function(e){let{attributes:l,setAttributes:t}=e;const n=(0,r.useBlockProps)(),{isSavingPost:a}=(0,m.select)("core/editor"),[i,b]=(0,d.useState)(!1);return(0,m.subscribe)((()=>{a()?b(!0):b(!1)})),(0,d.useEffect)((()=>{i&&!0===l.autorefresh&&t({updated:(new Date).getTime()})}),[i]),(0,o.createElement)("div",n,(0,o.createElement)(r.InspectorControls,null,(0,o.createElement)(u.Panel,null,(0,o.createElement)(u.PanelBody,null,(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.SelectControl,{label:(0,c.__)("Maximum level","simpletoc-block"),help:(0,c.__)("Maximum depth of the headings.","simpletoc-block"),value:l.max_level,options:[{label:(0,c.__)("Including","simpletoc-block")+" H6 ("+(0,c.__)("default","simpletoc-block")+")",value:"6"},{label:(0,c.__)("Including","simpletoc-block")+" H5",value:"5"},{label:(0,c.__)("Including","simpletoc-block")+" H4",value:"4"},{label:(0,c.__)("Including","simpletoc-block")+" H3",value:"3"},{label:(0,c.__)("Including","simpletoc-block")+" H2",value:"2"},{label:(0,c.__)("Including","simpletoc-block")+" H1",value:"1"}],onChange:e=>t({max_level:Number(e)})})),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.SelectControl,{label:(0,c.__)("Minimum level","simpletoc-block"),help:(0,c.__)("Minimum depth of the headings.","simpletoc-block"),value:l.min_level,options:[{label:(0,c.__)("Including","simpletoc-block")+" H6",value:"6"},{label:(0,c.__)("Including","simpletoc-block")+" H5",value:"5"},{label:(0,c.__)("Including","simpletoc-block")+" H4",value:"4"},{label:(0,c.__)("Including","simpletoc-block")+" H3",value:"3"},{label:(0,c.__)("Including","simpletoc-block")+" H2",value:"2"},{label:(0,c.__)("Including","simpletoc-block")+" H1 ("+(0,c.__)("default","simpletoc-block")+")",value:"1"}],onChange:e=>t({min_level:Number(e)})})),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.ToggleControl,{label:(0,c.__)("Remove heading","simpletoc-block"),help:(0,c.__)('Disable the "Table of contents" block heading and add your own heading block.',"simpletoc-block"),checked:l.no_title,onChange:()=>t({no_title:!l.no_title})})),!l.no_title&&(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.TextControl,{label:(0,c.__)("Heading Text","simpletoc-block"),help:(0,c.__)("Set the heading text of the block.","simpletoc-block")+" "+(0,c.__)("Default value","simpletoc-block")+": "+(0,c.__)("Table of Contents","simpletoc-block"),value:l.title_text,onChange:e=>t({title_text:e||(0,c.__)("Table of Contents","simpletoc-block")})})),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.ToggleControl,{label:(0,c.__)("Use an ordered list","simpletoc-block"),help:(0,c.__)("Replace the <ul> tag with an <ol> tag. This adds decimal numbers to each heading in the TOC.","simpletoc-block"),checked:l.use_ol,onChange:()=>t({use_ol:!l.use_ol})})),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.ToggleControl,{label:(0,c.__)("Remove list indent","simpletoc-block"),help:(0,c.__)("No bullet points or numbers at the first level.","simpletoc-block"),checked:l.remove_indent,onChange:()=>t({remove_indent:!l.remove_indent})})))),(0,o.createElement)(u.Panel,null,(0,o.createElement)(u.PanelBody,{title:(0,c.__)("Advanced Features","simpletoc-block"),icon:"settings",initialOpen:!1},(0,o.createElement)(u.PanelRow,null,(0,o.createElement)("div",{style:{marginBottom:"1em",border:"1px solid rgba(0, 0, 0, 0.05)",padding:"0.5em",backgroundColor:"#f7f7f7"}},(0,o.createElement)("p",null,(0,o.createElement)("strong",null,(0,c.__)("Think about making a donation if you use any of these features.","simpletoc-block"))),(0,o.createElement)(u.ExternalLink,{href:"https://marc.tv/out/donate"},(0,c.__)("Donate here!","simpletoc-block")))),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.ToggleControl,{label:(0,c.__)("Smooth scrolling support","simpletoc-block"),help:(0,c.__)('Add the css class "smooth-scroll" to the links. This enables smooth scrolling in some themes like GeneratePress.',"simpletoc-block"),checked:l.add_smooth,onChange:()=>t({add_smooth:!l.add_smooth})})),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.ToggleControl,{label:(0,c.__)("Use absolute urls","simpletoc-block"),help:(0,c.__)("Adds the permalink url to the fragment.","simpletoc-block"),checked:l.use_absolute_urls,onChange:()=>t({use_absolute_urls:!l.use_absolute_urls})})),(0,o.createElement)(u.PanelRow,null,(0,o.createElement)(u.ToggleControl,{label:(0,c.__)("Automatically refresh TOC","simpletoc-block"),help:(0,c.__)("Disable this to remove redudant changed content warning in editor.","simpletoc-block"),checked:l.autorefresh,onChange:()=>t({autorefresh:!l.autorefresh})}))))),(0,o.createElement)(r.BlockControls,null,(0,o.createElement)(u.ToolbarGroup,null,(0,o.createElement)(u.ToolbarButton,{className:"components-icon-button components-toolbar__control",label:(0,c.__)("Update table of contents","simpletoc-block"),onClick:()=>t({updated:(new Date).getTime()}),icon:"update"}))),(0,o.createElement)(s(),{block:"wearerequired/simpletoc-block",attributes:l}))},save:function(e){let{attributes:l}=e;return null}})},981:e=>{"use strict";e.exports=window.wp.blocks}},t={};function o(e){var n=t[e];if(void 0!==n)return n.exports;var a=t[e]={exports:{}};return l[e](a,a.exports,o),a.exports}o.m=l,e=[],o.O=(l,t,n,a)=>{if(!t){var c=1/0;for(u=0;u<e.length;u++){for(var[t,n,a]=e[u],r=!0,i=0;i<t.length;i++)(!1&a||c>=a)&&Object.keys(o.O).every((e=>o.O[e](t[i])))?t.splice(i--,1):(r=!1,a<c&&(c=a));if(r){e.splice(u--,1);var s=n();void 0!==s&&(l=s)}}return l}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[t,n,a]},o.n=e=>{var l=e&&e.__esModule?()=>e.default:()=>e;return o.d(l,{a:l}),l},o.d=(e,l)=>{for(var t in l)o.o(l,t)&&!o.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:l[t]})},o.o=(e,l)=>Object.prototype.hasOwnProperty.call(e,l),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={346:0,812:0};o.O.j=l=>0===e[l];var l=(l,t)=>{var n,a,[c,r,i]=t,s=0;if(c.some((l=>0!==e[l]))){for(n in r)o.o(r,n)&&(o.m[n]=r[n]);if(i)var u=i(o)}for(l&&l(t);s<c.length;s++)a=c[s],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(u)},t=globalThis.webpackChunk_wearerequired_simpletoc_block=globalThis.webpackChunk_wearerequired_simpletoc_block||[];t.forEach(l.bind(null,0)),t.push=l.bind(null,t.push.bind(t))})();var n=o.O(void 0,[812],(()=>o(284)));n=o.O(n)})();