"use strict";var Agentation=(()=>{var kf=Object.create;var lc=Object.defineProperty;var xf=Object.getOwnPropertyDescriptor;var Cf=Object.getOwnPropertyNames;var bf=Object.getPrototypeOf,Sf=Object.prototype.hasOwnProperty;var Wt=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Lf=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Cf(t))!Sf.call(e,r)&&r!==n&&lc(e,r,{get:()=>t[r],enumerable:!(o=xf(t,r))||o.enumerable});return e};var tn=(e,t,n)=>(n=e!=null?kf(bf(e)):{},Lf(t||!e||!e.__esModule?lc(n,"default",{value:e,enumerable:!0}):n,e));var gc=Wt(G=>{"use strict";var Yo=Symbol.for("react.element"),Ef=Symbol.for("react.portal"),Nf=Symbol.for("react.fragment"),Pf=Symbol.for("react.strict_mode"),If=Symbol.for("react.profiler"),Tf=Symbol.for("react.provider"),Mf=Symbol.for("react.context"),$f=Symbol.for("react.forward_ref"),Rf=Symbol.for("react.suspense"),zf=Symbol.for("react.memo"),Bf=Symbol.for("react.lazy"),sc=Symbol.iterator;function Of(e){return e===null||typeof e!="object"?null:(e=sc&&e[sc]||e["@@iterator"],typeof e=="function"?e:null)}var uc={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},cc=Object.assign,dc={};function qn(e,t,n){this.props=e,this.context=t,this.refs=dc,this.updater=n||uc}qn.prototype.isReactComponent={};qn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};qn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function _c(){}_c.prototype=qn.prototype;function Vs(e,t,n){this.props=e,this.context=t,this.refs=dc,this.updater=n||uc}var Zs=Vs.prototype=new _c;Zs.constructor=Vs;cc(Zs,qn.prototype);Zs.isPureReactComponent=!0;var ic=Array.isArray,fc=Object.prototype.hasOwnProperty,Ks={current:null},mc={key:!0,ref:!0,__self:!0,__source:!0};function pc(e,t,n){var o,r={},l=null,s=null;if(t!=null)for(o in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(l=""+t.key),t)fc.call(t,o)&&!mc.hasOwnProperty(o)&&(r[o]=t[o]);var i=arguments.length-2;if(i===1)r.children=n;else if(1<i){for(var u=Array(i),m=0;m<i;m++)u[m]=arguments[m+2];r.children=u}if(e&&e.defaultProps)for(o in i=e.defaultProps,i)r[o]===void 0&&(r[o]=i[o]);return{$$typeof:Yo,type:e,key:l,ref:s,props:r,_owner:Ks.current}}function Df(e,t){return{$$typeof:Yo,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Gs(e){return typeof e=="object"&&e!==null&&e.$$typeof===Yo}function Af(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(n){return t[n]})}var ac=/\/+/g;function Qs(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Af(""+e.key):t.toString(36)}function tl(e,t,n,o,r){var l=typeof e;(l==="undefined"||l==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(l){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case Yo:case Ef:s=!0}}if(s)return s=e,r=r(s),e=o===""?"."+Qs(s,0):o,ic(r)?(n="",e!=null&&(n=e.replace(ac,"$&/")+"/"),tl(r,t,n,"",function(m){return m})):r!=null&&(Gs(r)&&(r=Df(r,n+(!r.key||s&&s.key===r.key?"":(""+r.key).replace(ac,"$&/")+"/")+e)),t.push(r)),1;if(s=0,o=o===""?".":o+":",ic(e))for(var i=0;i<e.length;i++){l=e[i];var u=o+Qs(l,i);s+=tl(l,t,n,u,r)}else if(u=Of(e),typeof u=="function")for(e=u.call(e),i=0;!(l=e.next()).done;)l=l.value,u=o+Qs(l,i++),s+=tl(l,t,n,u,r);else if(l==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function el(e,t,n){if(e==null)return e;var o=[],r=0;return tl(e,o,"","",function(l){return t.call(n,l,r++)}),o}function jf(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(n){(e._status===0||e._status===-1)&&(e._status=1,e._result=n)},function(n){(e._status===0||e._status===-1)&&(e._status=2,e._result=n)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Ae={current:null},nl={transition:null},Ff={ReactCurrentDispatcher:Ae,ReactCurrentBatchConfig:nl,ReactCurrentOwner:Ks};function hc(){throw Error("act(...) is not supported in production builds of React.")}G.Children={map:el,forEach:function(e,t,n){el(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return el(e,function(){t++}),t},toArray:function(e){return el(e,function(t){return t})||[]},only:function(e){if(!Gs(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};G.Component=qn;G.Fragment=Nf;G.Profiler=If;G.PureComponent=Vs;G.StrictMode=Pf;G.Suspense=Rf;G.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ff;G.act=hc;G.cloneElement=function(e,t,n){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=cc({},e.props),r=e.key,l=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(l=t.ref,s=Ks.current),t.key!==void 0&&(r=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(u in t)fc.call(t,u)&&!mc.hasOwnProperty(u)&&(o[u]=t[u]===void 0&&i!==void 0?i[u]:t[u])}var u=arguments.length-2;if(u===1)o.children=n;else if(1<u){i=Array(u);for(var m=0;m<u;m++)i[m]=arguments[m+2];o.children=i}return{$$typeof:Yo,type:e.type,key:r,ref:l,props:o,_owner:s}};G.createContext=function(e){return e={$$typeof:Mf,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Tf,_context:e},e.Consumer=e};G.createElement=pc;G.createFactory=function(e){var t=pc.bind(null,e);return t.type=e,t};G.createRef=function(){return{current:null}};G.forwardRef=function(e){return{$$typeof:$f,render:e}};G.isValidElement=Gs;G.lazy=function(e){return{$$typeof:Bf,_payload:{_status:-1,_result:e},_init:jf}};G.memo=function(e,t){return{$$typeof:zf,type:e,compare:t===void 0?null:t}};G.startTransition=function(e){var t=nl.transition;nl.transition={};try{e()}finally{nl.transition=t}};G.unstable_act=hc;G.useCallback=function(e,t){return Ae.current.useCallback(e,t)};G.useContext=function(e){return Ae.current.useContext(e)};G.useDebugValue=function(){};G.useDeferredValue=function(e){return Ae.current.useDeferredValue(e)};G.useEffect=function(e,t){return Ae.current.useEffect(e,t)};G.useId=function(){return Ae.current.useId()};G.useImperativeHandle=function(e,t,n){return Ae.current.useImperativeHandle(e,t,n)};G.useInsertionEffect=function(e,t){return Ae.current.useInsertionEffect(e,t)};G.useLayoutEffect=function(e,t){return Ae.current.useLayoutEffect(e,t)};G.useMemo=function(e,t){return Ae.current.useMemo(e,t)};G.useReducer=function(e,t,n){return Ae.current.useReducer(e,t,n)};G.useRef=function(e){return Ae.current.useRef(e)};G.useState=function(e){return Ae.current.useState(e)};G.useSyncExternalStore=function(e,t,n){return Ae.current.useSyncExternalStore(e,t,n)};G.useTransition=function(){return Ae.current.useTransition()};G.version="18.3.1"});var eo=Wt((Hp,yc)=>{"use strict";yc.exports=gc()});var Nc=Wt(se=>{"use strict";function ti(e,t){var n=e.length;e.push(t);e:for(;0<n;){var o=n-1>>>1,r=e[o];if(0<ol(r,t))e[o]=t,e[n]=r,n=o;else break e}}function yt(e){return e.length===0?null:e[0]}function ll(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;e:for(var o=0,r=e.length,l=r>>>1;o<l;){var s=2*(o+1)-1,i=e[s],u=s+1,m=e[u];if(0>ol(i,n))u<r&&0>ol(m,i)?(e[o]=m,e[u]=n,o=u):(e[o]=i,e[s]=n,o=s);else if(u<r&&0>ol(m,n))e[o]=m,e[u]=n,o=u;else break e}}return t}function ol(e,t){var n=e.sortIndex-t.sortIndex;return n!==0?n:e.id-t.id}typeof performance=="object"&&typeof performance.now=="function"?(vc=performance,se.unstable_now=function(){return vc.now()}):(Js=Date,wc=Js.now(),se.unstable_now=function(){return Js.now()-wc});var vc,Js,wc,It=[],nn=[],Wf=1,ut=null,$e=3,sl=!1,Tn=!1,Uo=!1,Cc=typeof setTimeout=="function"?setTimeout:null,bc=typeof clearTimeout=="function"?clearTimeout:null,kc=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function ni(e){for(var t=yt(nn);t!==null;){if(t.callback===null)ll(nn);else if(t.startTime<=e)ll(nn),t.sortIndex=t.expirationTime,ti(It,t);else break;t=yt(nn)}}function oi(e){if(Uo=!1,ni(e),!Tn)if(yt(It)!==null)Tn=!0,li(ri);else{var t=yt(nn);t!==null&&si(oi,t.startTime-e)}}function ri(e,t){Tn=!1,Uo&&(Uo=!1,bc(Xo),Xo=-1),sl=!0;var n=$e;try{for(ni(t),ut=yt(It);ut!==null&&(!(ut.expirationTime>t)||e&&!Ec());){var o=ut.callback;if(typeof o=="function"){ut.callback=null,$e=ut.priorityLevel;var r=o(ut.expirationTime<=t);t=se.unstable_now(),typeof r=="function"?ut.callback=r:ut===yt(It)&&ll(It),ni(t)}else ll(It);ut=yt(It)}if(ut!==null)var l=!0;else{var s=yt(nn);s!==null&&si(oi,s.startTime-t),l=!1}return l}finally{ut=null,$e=n,sl=!1}}var il=!1,rl=null,Xo=-1,Sc=5,Lc=-1;function Ec(){return!(se.unstable_now()-Lc<Sc)}function qs(){if(rl!==null){var e=se.unstable_now();Lc=e;var t=!0;try{t=rl(!0,e)}finally{t?Ho():(il=!1,rl=null)}}else il=!1}var Ho;typeof kc=="function"?Ho=function(){kc(qs)}:typeof MessageChannel<"u"?(ei=new MessageChannel,xc=ei.port2,ei.port1.onmessage=qs,Ho=function(){xc.postMessage(null)}):Ho=function(){Cc(qs,0)};var ei,xc;function li(e){rl=e,il||(il=!0,Ho())}function si(e,t){Xo=Cc(function(){e(se.unstable_now())},t)}se.unstable_IdlePriority=5;se.unstable_ImmediatePriority=1;se.unstable_LowPriority=4;se.unstable_NormalPriority=3;se.unstable_Profiling=null;se.unstable_UserBlockingPriority=2;se.unstable_cancelCallback=function(e){e.callback=null};se.unstable_continueExecution=function(){Tn||sl||(Tn=!0,li(ri))};se.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Sc=0<e?Math.floor(1e3/e):5};se.unstable_getCurrentPriorityLevel=function(){return $e};se.unstable_getFirstCallbackNode=function(){return yt(It)};se.unstable_next=function(e){switch($e){case 1:case 2:case 3:var t=3;break;default:t=$e}var n=$e;$e=t;try{return e()}finally{$e=n}};se.unstable_pauseExecution=function(){};se.unstable_requestPaint=function(){};se.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=$e;$e=e;try{return t()}finally{$e=n}};se.unstable_scheduleCallback=function(e,t,n){var o=se.unstable_now();switch(typeof n=="object"&&n!==null?(n=n.delay,n=typeof n=="number"&&0<n?o+n:o):n=o,e){case 1:var r=-1;break;case 2:r=250;break;case 5:r=1073741823;break;case 4:r=1e4;break;default:r=5e3}return r=n+r,e={id:Wf++,callback:t,priorityLevel:e,startTime:n,expirationTime:r,sortIndex:-1},n>o?(e.sortIndex=n,ti(nn,e),yt(It)===null&&e===yt(nn)&&(Uo?(bc(Xo),Xo=-1):Uo=!0,si(oi,n-o))):(e.sortIndex=r,ti(It,e),Tn||sl||(Tn=!0,li(ri))),e};se.unstable_shouldYield=Ec;se.unstable_wrapCallback=function(e){var t=$e;return function(){var n=$e;$e=t;try{return e.apply(this,arguments)}finally{$e=n}}}});var Ic=Wt((Xp,Pc)=>{"use strict";Pc.exports=Nc()});var R1=Wt(rt=>{"use strict";var Yf=eo(),nt=Ic();function L(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Od=new Set,mr={};function Hn(e,t){xo(e,t),xo(e+"Capture",t)}function xo(e,t){for(mr[e]=t,e=0;e<t.length;e++)Od.add(t[e])}var Vt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Pi=Object.prototype.hasOwnProperty,Hf=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Tc={},Mc={};function Uf(e){return Pi.call(Mc,e)?!0:Pi.call(Tc,e)?!1:Hf.test(e)?Mc[e]=!0:(Tc[e]=!0,!1)}function Xf(e,t,n,o){if(n!==null&&n.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:n!==null?!n.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function Qf(e,t,n,o){if(t===null||typeof t>"u"||Xf(e,t,n,o))return!0;if(o)return!1;if(n!==null)switch(n.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function We(e,t,n,o,r,l,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=e,this.type=t,this.sanitizeURL=l,this.removeEmptyString=s}var Me={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){Me[e]=new We(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];Me[t]=new We(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){Me[e]=new We(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){Me[e]=new We(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){Me[e]=new We(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){Me[e]=new We(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){Me[e]=new We(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){Me[e]=new We(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){Me[e]=new We(e,5,!1,e.toLowerCase(),null,!1,!1)});var ka=/[\-:]([a-z])/g;function xa(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(ka,xa);Me[t]=new We(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(ka,xa);Me[t]=new We(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(ka,xa);Me[t]=new We(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){Me[e]=new We(e,1,!1,e.toLowerCase(),null,!1,!1)});Me.xlinkHref=new We("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){Me[e]=new We(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ca(e,t,n,o){var r=Me.hasOwnProperty(t)?Me[t]:null;(r!==null?r.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(Qf(t,n,r,o)&&(n=null),o||r===null?Uf(t)&&(n===null?e.removeAttribute(t):e.setAttribute(t,""+n)):r.mustUseProperty?e[r.propertyName]=n===null?r.type===3?!1:"":n:(t=r.attributeName,o=r.attributeNamespace,n===null?e.removeAttribute(t):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,o?e.setAttributeNS(o,t,n):e.setAttribute(t,n))))}var Jt=Yf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,al=Symbol.for("react.element"),oo=Symbol.for("react.portal"),ro=Symbol.for("react.fragment"),ba=Symbol.for("react.strict_mode"),Ii=Symbol.for("react.profiler"),Dd=Symbol.for("react.provider"),Ad=Symbol.for("react.context"),Sa=Symbol.for("react.forward_ref"),Ti=Symbol.for("react.suspense"),Mi=Symbol.for("react.suspense_list"),La=Symbol.for("react.memo"),rn=Symbol.for("react.lazy"),jd=Symbol.for("react.offscreen"),$c=Symbol.iterator;function Qo(e){return e===null||typeof e!="object"?null:(e=$c&&e[$c]||e["@@iterator"],typeof e=="function"?e:null)}var pe=Object.assign,ii;function tr(e){if(ii===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);ii=t&&t[1]||""}return`
`+ii+e}var ai=!1;function ui(e,t){if(!e||ai)return"";ai=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(m){var o=m}Reflect.construct(e,[],t)}else{try{t.call()}catch(m){o=m}e.call(t.prototype)}else{try{throw Error()}catch(m){o=m}e()}}catch(m){if(m&&o&&typeof m.stack=="string"){for(var r=m.stack.split(`
`),l=o.stack.split(`
`),s=r.length-1,i=l.length-1;1<=s&&0<=i&&r[s]!==l[i];)i--;for(;1<=s&&0<=i;s--,i--)if(r[s]!==l[i]){if(s!==1||i!==1)do if(s--,i--,0>i||r[s]!==l[i]){var u=`
`+r[s].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=s&&0<=i);break}}}finally{ai=!1,Error.prepareStackTrace=n}return(e=e?e.displayName||e.name:"")?tr(e):""}function Vf(e){switch(e.tag){case 5:return tr(e.type);case 16:return tr("Lazy");case 13:return tr("Suspense");case 19:return tr("SuspenseList");case 0:case 2:case 15:return e=ui(e.type,!1),e;case 11:return e=ui(e.type.render,!1),e;case 1:return e=ui(e.type,!0),e;default:return""}}function $i(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case ro:return"Fragment";case oo:return"Portal";case Ii:return"Profiler";case ba:return"StrictMode";case Ti:return"Suspense";case Mi:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Ad:return(e.displayName||"Context")+".Consumer";case Dd:return(e._context.displayName||"Context")+".Provider";case Sa:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case La:return t=e.displayName||null,t!==null?t:$i(e.type)||"Memo";case rn:t=e._payload,e=e._init;try{return $i(e(t))}catch{}}return null}function Zf(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return $i(t);case 8:return t===ba?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function vn(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function Fd(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function Kf(e){var t=Fd(e)?"checked":"value",n=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,l=n.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return r.call(this)},set:function(s){o=""+s,l.call(this,s)}}),Object.defineProperty(e,t,{enumerable:n.enumerable}),{getValue:function(){return o},setValue:function(s){o=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function ul(e){e._valueTracker||(e._valueTracker=Kf(e))}function Wd(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),o="";return e&&(o=Fd(e)?e.checked?"true":"false":e.value),e=o,e!==n?(t.setValue(e),!0):!1}function Ol(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Ri(e,t){var n=t.checked;return pe({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??e._wrapperState.initialChecked})}function Rc(e,t){var n=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;n=vn(t.value!=null?t.value:n),e._wrapperState={initialChecked:o,initialValue:n,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function Yd(e,t){t=t.checked,t!=null&&Ca(e,"checked",t,!1)}function zi(e,t){Yd(e,t);var n=vn(t.value),o=t.type;if(n!=null)o==="number"?(n===0&&e.value===""||e.value!=n)&&(e.value=""+n):e.value!==""+n&&(e.value=""+n);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Bi(e,t.type,n):t.hasOwnProperty("defaultValue")&&Bi(e,t.type,vn(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function zc(e,t,n){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,n||t===e.value||(e.value=t),e.defaultValue=t}n=e.name,n!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,n!==""&&(e.name=n)}function Bi(e,t,n){(t!=="number"||Ol(e.ownerDocument)!==e)&&(n==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+n&&(e.defaultValue=""+n))}var nr=Array.isArray;function ho(e,t,n,o){if(e=e.options,t){t={};for(var r=0;r<n.length;r++)t["$"+n[r]]=!0;for(n=0;n<e.length;n++)r=t.hasOwnProperty("$"+e[n].value),e[n].selected!==r&&(e[n].selected=r),r&&o&&(e[n].defaultSelected=!0)}else{for(n=""+vn(n),t=null,r=0;r<e.length;r++){if(e[r].value===n){e[r].selected=!0,o&&(e[r].defaultSelected=!0);return}t!==null||e[r].disabled||(t=e[r])}t!==null&&(t.selected=!0)}}function Oi(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(L(91));return pe({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Bc(e,t){var n=t.value;if(n==null){if(n=t.children,t=t.defaultValue,n!=null){if(t!=null)throw Error(L(92));if(nr(n)){if(1<n.length)throw Error(L(93));n=n[0]}t=n}t==null&&(t=""),n=t}e._wrapperState={initialValue:vn(n)}}function Hd(e,t){var n=vn(t.value),o=vn(t.defaultValue);n!=null&&(n=""+n,n!==e.value&&(e.value=n),t.defaultValue==null&&e.defaultValue!==n&&(e.defaultValue=n)),o!=null&&(e.defaultValue=""+o)}function Oc(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function Ud(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Di(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?Ud(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var cl,Xd=(function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,n,o,r){MSApp.execUnsafeLocalFunction(function(){return e(t,n,o,r)})}:e})(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(cl=cl||document.createElement("div"),cl.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=cl.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function pr(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var lr={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Gf=["Webkit","ms","Moz","O"];Object.keys(lr).forEach(function(e){Gf.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),lr[t]=lr[e]})});function Qd(e,t,n){return t==null||typeof t=="boolean"||t===""?"":n||typeof t!="number"||t===0||lr.hasOwnProperty(e)&&lr[e]?(""+t).trim():t+"px"}function Vd(e,t){e=e.style;for(var n in t)if(t.hasOwnProperty(n)){var o=n.indexOf("--")===0,r=Qd(n,t[n],o);n==="float"&&(n="cssFloat"),o?e.setProperty(n,r):e[n]=r}}var Jf=pe({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ai(e,t){if(t){if(Jf[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(L(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(L(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(L(61))}if(t.style!=null&&typeof t.style!="object")throw Error(L(62))}}function ji(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Fi=null;function Ea(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Wi=null,go=null,yo=null;function Dc(e){if(e=$r(e)){if(typeof Wi!="function")throw Error(L(280));var t=e.stateNode;t&&(t=ds(t),Wi(e.stateNode,e.type,t))}}function Zd(e){go?yo?yo.push(e):yo=[e]:go=e}function Kd(){if(go){var e=go,t=yo;if(yo=go=null,Dc(e),t)for(e=0;e<t.length;e++)Dc(t[e])}}function Gd(e,t){return e(t)}function Jd(){}var ci=!1;function qd(e,t,n){if(ci)return e(t,n);ci=!0;try{return Gd(e,t,n)}finally{ci=!1,(go!==null||yo!==null)&&(Jd(),Kd())}}function hr(e,t){var n=e.stateNode;if(n===null)return null;var o=ds(n);if(o===null)return null;n=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(L(231,t,typeof n));return n}var Yi=!1;if(Vt)try{to={},Object.defineProperty(to,"passive",{get:function(){Yi=!0}}),window.addEventListener("test",to,to),window.removeEventListener("test",to,to)}catch{Yi=!1}var to;function qf(e,t,n,o,r,l,s,i,u){var m=Array.prototype.slice.call(arguments,3);try{t.apply(n,m)}catch(g){this.onError(g)}}var sr=!1,Dl=null,Al=!1,Hi=null,e0={onError:function(e){sr=!0,Dl=e}};function t0(e,t,n,o,r,l,s,i,u){sr=!1,Dl=null,qf.apply(e0,arguments)}function n0(e,t,n,o,r,l,s,i,u){if(t0.apply(this,arguments),sr){if(sr){var m=Dl;sr=!1,Dl=null}else throw Error(L(198));Al||(Al=!0,Hi=m)}}function Un(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function e_(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Ac(e){if(Un(e)!==e)throw Error(L(188))}function o0(e){var t=e.alternate;if(!t){if(t=Un(e),t===null)throw Error(L(188));return t!==e?null:e}for(var n=e,o=t;;){var r=n.return;if(r===null)break;var l=r.alternate;if(l===null){if(o=r.return,o!==null){n=o;continue}break}if(r.child===l.child){for(l=r.child;l;){if(l===n)return Ac(r),e;if(l===o)return Ac(r),t;l=l.sibling}throw Error(L(188))}if(n.return!==o.return)n=r,o=l;else{for(var s=!1,i=r.child;i;){if(i===n){s=!0,n=r,o=l;break}if(i===o){s=!0,o=r,n=l;break}i=i.sibling}if(!s){for(i=l.child;i;){if(i===n){s=!0,n=l,o=r;break}if(i===o){s=!0,o=l,n=r;break}i=i.sibling}if(!s)throw Error(L(189))}}if(n.alternate!==o)throw Error(L(190))}if(n.tag!==3)throw Error(L(188));return n.stateNode.current===n?e:t}function t_(e){return e=o0(e),e!==null?n_(e):null}function n_(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=n_(e);if(t!==null)return t;e=e.sibling}return null}var o_=nt.unstable_scheduleCallback,jc=nt.unstable_cancelCallback,r0=nt.unstable_shouldYield,l0=nt.unstable_requestPaint,ye=nt.unstable_now,s0=nt.unstable_getCurrentPriorityLevel,Na=nt.unstable_ImmediatePriority,r_=nt.unstable_UserBlockingPriority,jl=nt.unstable_NormalPriority,i0=nt.unstable_LowPriority,l_=nt.unstable_IdlePriority,is=null,Rt=null;function a0(e){if(Rt&&typeof Rt.onCommitFiberRoot=="function")try{Rt.onCommitFiberRoot(is,e,void 0,(e.current.flags&128)===128)}catch{}}var Ct=Math.clz32?Math.clz32:d0,u0=Math.log,c0=Math.LN2;function d0(e){return e>>>=0,e===0?32:31-(u0(e)/c0|0)|0}var dl=64,_l=4194304;function or(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Fl(e,t){var n=e.pendingLanes;if(n===0)return 0;var o=0,r=e.suspendedLanes,l=e.pingedLanes,s=n&268435455;if(s!==0){var i=s&~r;i!==0?o=or(i):(l&=s,l!==0&&(o=or(l)))}else s=n&~r,s!==0?o=or(s):l!==0&&(o=or(l));if(o===0)return 0;if(t!==0&&t!==o&&(t&r)===0&&(r=o&-o,l=t&-t,r>=l||r===16&&(l&4194240)!==0))return t;if((o&4)!==0&&(o|=n&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)n=31-Ct(t),r=1<<n,o|=e[n],t&=~r;return o}function _0(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function f0(e,t){for(var n=e.suspendedLanes,o=e.pingedLanes,r=e.expirationTimes,l=e.pendingLanes;0<l;){var s=31-Ct(l),i=1<<s,u=r[s];u===-1?((i&n)===0||(i&o)!==0)&&(r[s]=_0(i,t)):u<=t&&(e.expiredLanes|=i),l&=~i}}function Ui(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function s_(){var e=dl;return dl<<=1,(dl&4194240)===0&&(dl=64),e}function di(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Tr(e,t,n){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ct(t),e[t]=n}function m0(e,t){var n=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<n;){var r=31-Ct(n),l=1<<r;t[r]=0,o[r]=-1,e[r]=-1,n&=~l}}function Pa(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var o=31-Ct(n),r=1<<o;r&t|e[o]&t&&(e[o]|=t),n&=~r}}var ne=0;function i_(e){return e&=-e,1<e?4<e?(e&268435455)!==0?16:536870912:4:1}var a_,Ia,u_,c_,d_,Xi=!1,fl=[],dn=null,_n=null,fn=null,gr=new Map,yr=new Map,sn=[],p0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Fc(e,t){switch(e){case"focusin":case"focusout":dn=null;break;case"dragenter":case"dragleave":_n=null;break;case"mouseover":case"mouseout":fn=null;break;case"pointerover":case"pointerout":gr.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":yr.delete(t.pointerId)}}function Vo(e,t,n,o,r,l){return e===null||e.nativeEvent!==l?(e={blockedOn:t,domEventName:n,eventSystemFlags:o,nativeEvent:l,targetContainers:[r]},t!==null&&(t=$r(t),t!==null&&Ia(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,r!==null&&t.indexOf(r)===-1&&t.push(r),e)}function h0(e,t,n,o,r){switch(t){case"focusin":return dn=Vo(dn,e,t,n,o,r),!0;case"dragenter":return _n=Vo(_n,e,t,n,o,r),!0;case"mouseover":return fn=Vo(fn,e,t,n,o,r),!0;case"pointerover":var l=r.pointerId;return gr.set(l,Vo(gr.get(l)||null,e,t,n,o,r)),!0;case"gotpointercapture":return l=r.pointerId,yr.set(l,Vo(yr.get(l)||null,e,t,n,o,r)),!0}return!1}function __(e){var t=Rn(e.target);if(t!==null){var n=Un(t);if(n!==null){if(t=n.tag,t===13){if(t=e_(n),t!==null){e.blockedOn=t,d_(e.priority,function(){u_(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function El(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Qi(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(n===null){n=e.nativeEvent;var o=new n.constructor(n.type,n);Fi=o,n.target.dispatchEvent(o),Fi=null}else return t=$r(n),t!==null&&Ia(t),e.blockedOn=n,!1;t.shift()}return!0}function Wc(e,t,n){El(e)&&n.delete(t)}function g0(){Xi=!1,dn!==null&&El(dn)&&(dn=null),_n!==null&&El(_n)&&(_n=null),fn!==null&&El(fn)&&(fn=null),gr.forEach(Wc),yr.forEach(Wc)}function Zo(e,t){e.blockedOn===t&&(e.blockedOn=null,Xi||(Xi=!0,nt.unstable_scheduleCallback(nt.unstable_NormalPriority,g0)))}function vr(e){function t(r){return Zo(r,e)}if(0<fl.length){Zo(fl[0],e);for(var n=1;n<fl.length;n++){var o=fl[n];o.blockedOn===e&&(o.blockedOn=null)}}for(dn!==null&&Zo(dn,e),_n!==null&&Zo(_n,e),fn!==null&&Zo(fn,e),gr.forEach(t),yr.forEach(t),n=0;n<sn.length;n++)o=sn[n],o.blockedOn===e&&(o.blockedOn=null);for(;0<sn.length&&(n=sn[0],n.blockedOn===null);)__(n),n.blockedOn===null&&sn.shift()}var vo=Jt.ReactCurrentBatchConfig,Wl=!0;function y0(e,t,n,o){var r=ne,l=vo.transition;vo.transition=null;try{ne=1,Ta(e,t,n,o)}finally{ne=r,vo.transition=l}}function v0(e,t,n,o){var r=ne,l=vo.transition;vo.transition=null;try{ne=4,Ta(e,t,n,o)}finally{ne=r,vo.transition=l}}function Ta(e,t,n,o){if(Wl){var r=Qi(e,t,n,o);if(r===null)yi(e,t,o,Yl,n),Fc(e,o);else if(h0(r,e,t,n,o))o.stopPropagation();else if(Fc(e,o),t&4&&-1<p0.indexOf(e)){for(;r!==null;){var l=$r(r);if(l!==null&&a_(l),l=Qi(e,t,n,o),l===null&&yi(e,t,o,Yl,n),l===r)break;r=l}r!==null&&o.stopPropagation()}else yi(e,t,o,null,n)}}var Yl=null;function Qi(e,t,n,o){if(Yl=null,e=Ea(o),e=Rn(e),e!==null)if(t=Un(e),t===null)e=null;else if(n=t.tag,n===13){if(e=e_(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Yl=e,null}function f_(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(s0()){case Na:return 1;case r_:return 4;case jl:case i0:return 16;case l_:return 536870912;default:return 16}default:return 16}}var un=null,Ma=null,Nl=null;function m_(){if(Nl)return Nl;var e,t=Ma,n=t.length,o,r="value"in un?un.value:un.textContent,l=r.length;for(e=0;e<n&&t[e]===r[e];e++);var s=n-e;for(o=1;o<=s&&t[n-o]===r[l-o];o++);return Nl=r.slice(e,1<o?1-o:void 0)}function Pl(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ml(){return!0}function Yc(){return!1}function ot(e){function t(n,o,r,l,s){this._reactName=n,this._targetInst=r,this.type=o,this.nativeEvent=l,this.target=s,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(n=e[i],this[i]=n?n(l):l[i]);return this.isDefaultPrevented=(l.defaultPrevented!=null?l.defaultPrevented:l.returnValue===!1)?ml:Yc,this.isPropagationStopped=Yc,this}return pe(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ml)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ml)},persist:function(){},isPersistent:ml}),t}var Po={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},$a=ot(Po),Mr=pe({},Po,{view:0,detail:0}),w0=ot(Mr),_i,fi,Ko,as=pe({},Mr,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ra,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ko&&(Ko&&e.type==="mousemove"?(_i=e.screenX-Ko.screenX,fi=e.screenY-Ko.screenY):fi=_i=0,Ko=e),_i)},movementY:function(e){return"movementY"in e?e.movementY:fi}}),Hc=ot(as),k0=pe({},as,{dataTransfer:0}),x0=ot(k0),C0=pe({},Mr,{relatedTarget:0}),mi=ot(C0),b0=pe({},Po,{animationName:0,elapsedTime:0,pseudoElement:0}),S0=ot(b0),L0=pe({},Po,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),E0=ot(L0),N0=pe({},Po,{data:0}),Uc=ot(N0),P0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},I0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},T0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function M0(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=T0[e])?!!t[e]:!1}function Ra(){return M0}var $0=pe({},Mr,{key:function(e){if(e.key){var t=P0[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Pl(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?I0[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ra,charCode:function(e){return e.type==="keypress"?Pl(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Pl(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),R0=ot($0),z0=pe({},as,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Xc=ot(z0),B0=pe({},Mr,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ra}),O0=ot(B0),D0=pe({},Po,{propertyName:0,elapsedTime:0,pseudoElement:0}),A0=ot(D0),j0=pe({},as,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),F0=ot(j0),W0=[9,13,27,32],za=Vt&&"CompositionEvent"in window,ir=null;Vt&&"documentMode"in document&&(ir=document.documentMode);var Y0=Vt&&"TextEvent"in window&&!ir,p_=Vt&&(!za||ir&&8<ir&&11>=ir),Qc=" ",Vc=!1;function h_(e,t){switch(e){case"keyup":return W0.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function g_(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var lo=!1;function H0(e,t){switch(e){case"compositionend":return g_(t);case"keypress":return t.which!==32?null:(Vc=!0,Qc);case"textInput":return e=t.data,e===Qc&&Vc?null:e;default:return null}}function U0(e,t){if(lo)return e==="compositionend"||!za&&h_(e,t)?(e=m_(),Nl=Ma=un=null,lo=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return p_&&t.locale!=="ko"?null:t.data;default:return null}}var X0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Zc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!X0[e.type]:t==="textarea"}function y_(e,t,n,o){Zd(o),t=Hl(t,"onChange"),0<t.length&&(n=new $a("onChange","change",null,n,o),e.push({event:n,listeners:t}))}var ar=null,wr=null;function Q0(e){P_(e,0)}function us(e){var t=ao(e);if(Wd(t))return e}function V0(e,t){if(e==="change")return t}var v_=!1;Vt&&(Vt?(hl="oninput"in document,hl||(pi=document.createElement("div"),pi.setAttribute("oninput","return;"),hl=typeof pi.oninput=="function"),pl=hl):pl=!1,v_=pl&&(!document.documentMode||9<document.documentMode));var pl,hl,pi;function Kc(){ar&&(ar.detachEvent("onpropertychange",w_),wr=ar=null)}function w_(e){if(e.propertyName==="value"&&us(wr)){var t=[];y_(t,wr,e,Ea(e)),qd(Q0,t)}}function Z0(e,t,n){e==="focusin"?(Kc(),ar=t,wr=n,ar.attachEvent("onpropertychange",w_)):e==="focusout"&&Kc()}function K0(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return us(wr)}function G0(e,t){if(e==="click")return us(t)}function J0(e,t){if(e==="input"||e==="change")return us(t)}function q0(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var St=typeof Object.is=="function"?Object.is:q0;function kr(e,t){if(St(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),o=Object.keys(t);if(n.length!==o.length)return!1;for(o=0;o<n.length;o++){var r=n[o];if(!Pi.call(t,r)||!St(e[r],t[r]))return!1}return!0}function Gc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Jc(e,t){var n=Gc(e);e=0;for(var o;n;){if(n.nodeType===3){if(o=e+n.textContent.length,e<=t&&o>=t)return{node:n,offset:t-e};e=o}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Gc(n)}}function k_(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?k_(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function x_(){for(var e=window,t=Ol();t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ol(e.document)}return t}function Ba(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function em(e){var t=x_(),n=e.focusedElem,o=e.selectionRange;if(t!==n&&n&&n.ownerDocument&&k_(n.ownerDocument.documentElement,n)){if(o!==null&&Ba(n)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in n)n.selectionStart=t,n.selectionEnd=Math.min(e,n.value.length);else if(e=(t=n.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var r=n.textContent.length,l=Math.min(o.start,r);o=o.end===void 0?l:Math.min(o.end,r),!e.extend&&l>o&&(r=o,o=l,l=r),r=Jc(n,l);var s=Jc(n,o);r&&s&&(e.rangeCount!==1||e.anchorNode!==r.node||e.anchorOffset!==r.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(r.node,r.offset),e.removeAllRanges(),l>o?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=n;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<t.length;n++)e=t[n],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var tm=Vt&&"documentMode"in document&&11>=document.documentMode,so=null,Vi=null,ur=null,Zi=!1;function qc(e,t,n){var o=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Zi||so==null||so!==Ol(o)||(o=so,"selectionStart"in o&&Ba(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ur&&kr(ur,o)||(ur=o,o=Hl(Vi,"onSelect"),0<o.length&&(t=new $a("onSelect","select",null,t,n),e.push({event:t,listeners:o}),t.target=so)))}function gl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var io={animationend:gl("Animation","AnimationEnd"),animationiteration:gl("Animation","AnimationIteration"),animationstart:gl("Animation","AnimationStart"),transitionend:gl("Transition","TransitionEnd")},hi={},C_={};Vt&&(C_=document.createElement("div").style,"AnimationEvent"in window||(delete io.animationend.animation,delete io.animationiteration.animation,delete io.animationstart.animation),"TransitionEvent"in window||delete io.transitionend.transition);function cs(e){if(hi[e])return hi[e];if(!io[e])return e;var t=io[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in C_)return hi[e]=t[n];return e}var b_=cs("animationend"),S_=cs("animationiteration"),L_=cs("animationstart"),E_=cs("transitionend"),N_=new Map,ed="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function kn(e,t){N_.set(e,t),Hn(t,[e])}for(yl=0;yl<ed.length;yl++)vl=ed[yl],td=vl.toLowerCase(),nd=vl[0].toUpperCase()+vl.slice(1),kn(td,"on"+nd);var vl,td,nd,yl;kn(b_,"onAnimationEnd");kn(S_,"onAnimationIteration");kn(L_,"onAnimationStart");kn("dblclick","onDoubleClick");kn("focusin","onFocus");kn("focusout","onBlur");kn(E_,"onTransitionEnd");xo("onMouseEnter",["mouseout","mouseover"]);xo("onMouseLeave",["mouseout","mouseover"]);xo("onPointerEnter",["pointerout","pointerover"]);xo("onPointerLeave",["pointerout","pointerover"]);Hn("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Hn("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Hn("onBeforeInput",["compositionend","keypress","textInput","paste"]);Hn("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Hn("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Hn("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var rr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),nm=new Set("cancel close invalid load scroll toggle".split(" ").concat(rr));function od(e,t,n){var o=e.type||"unknown-event";e.currentTarget=n,n0(o,t,void 0,e),e.currentTarget=null}function P_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var o=e[n],r=o.event;o=o.listeners;e:{var l=void 0;if(t)for(var s=o.length-1;0<=s;s--){var i=o[s],u=i.instance,m=i.currentTarget;if(i=i.listener,u!==l&&r.isPropagationStopped())break e;od(r,i,m),l=u}else for(s=0;s<o.length;s++){if(i=o[s],u=i.instance,m=i.currentTarget,i=i.listener,u!==l&&r.isPropagationStopped())break e;od(r,i,m),l=u}}}if(Al)throw e=Hi,Al=!1,Hi=null,e}function ae(e,t){var n=t[ea];n===void 0&&(n=t[ea]=new Set);var o=e+"__bubble";n.has(o)||(I_(t,e,2,!1),n.add(o))}function gi(e,t,n){var o=0;t&&(o|=4),I_(n,e,o,t)}var wl="_reactListening"+Math.random().toString(36).slice(2);function xr(e){if(!e[wl]){e[wl]=!0,Od.forEach(function(n){n!=="selectionchange"&&(nm.has(n)||gi(n,!1,e),gi(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[wl]||(t[wl]=!0,gi("selectionchange",!1,t))}}function I_(e,t,n,o){switch(f_(t)){case 1:var r=y0;break;case 4:r=v0;break;default:r=Ta}n=r.bind(null,t,n,e),r=void 0,!Yi||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(r=!0),o?r!==void 0?e.addEventListener(t,n,{capture:!0,passive:r}):e.addEventListener(t,n,!0):r!==void 0?e.addEventListener(t,n,{passive:r}):e.addEventListener(t,n,!1)}function yi(e,t,n,o,r){var l=o;if((t&1)===0&&(t&2)===0&&o!==null)e:for(;;){if(o===null)return;var s=o.tag;if(s===3||s===4){var i=o.stateNode.containerInfo;if(i===r||i.nodeType===8&&i.parentNode===r)break;if(s===4)for(s=o.return;s!==null;){var u=s.tag;if((u===3||u===4)&&(u=s.stateNode.containerInfo,u===r||u.nodeType===8&&u.parentNode===r))return;s=s.return}for(;i!==null;){if(s=Rn(i),s===null)return;if(u=s.tag,u===5||u===6){o=l=s;continue e}i=i.parentNode}}o=o.return}qd(function(){var m=l,g=Ea(n),w=[];e:{var k=N_.get(e);if(k!==void 0){var N=$a,C=e;switch(e){case"keypress":if(Pl(n)===0)break e;case"keydown":case"keyup":N=R0;break;case"focusin":C="focus",N=mi;break;case"focusout":C="blur",N=mi;break;case"beforeblur":case"afterblur":N=mi;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":N=Hc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":N=x0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":N=O0;break;case b_:case S_:case L_:N=S0;break;case E_:N=A0;break;case"scroll":N=w0;break;case"wheel":N=F0;break;case"copy":case"cut":case"paste":N=E0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":N=Xc}var I=(t&4)!==0,z=!I&&e==="scroll",p=I?k!==null?k+"Capture":null:k;I=[];for(var _=m,h;_!==null;){h=_;var S=h.stateNode;if(h.tag===5&&S!==null&&(h=S,p!==null&&(S=hr(_,p),S!=null&&I.push(Cr(_,S,h)))),z)break;_=_.return}0<I.length&&(k=new N(k,C,null,n,g),w.push({event:k,listeners:I}))}}if((t&7)===0){e:{if(k=e==="mouseover"||e==="pointerover",N=e==="mouseout"||e==="pointerout",k&&n!==Fi&&(C=n.relatedTarget||n.fromElement)&&(Rn(C)||C[Zt]))break e;if((N||k)&&(k=g.window===g?g:(k=g.ownerDocument)?k.defaultView||k.parentWindow:window,N?(C=n.relatedTarget||n.toElement,N=m,C=C?Rn(C):null,C!==null&&(z=Un(C),C!==z||C.tag!==5&&C.tag!==6)&&(C=null)):(N=null,C=m),N!==C)){if(I=Hc,S="onMouseLeave",p="onMouseEnter",_="mouse",(e==="pointerout"||e==="pointerover")&&(I=Xc,S="onPointerLeave",p="onPointerEnter",_="pointer"),z=N==null?k:ao(N),h=C==null?k:ao(C),k=new I(S,_+"leave",N,n,g),k.target=z,k.relatedTarget=h,S=null,Rn(g)===m&&(I=new I(p,_+"enter",C,n,g),I.target=h,I.relatedTarget=z,S=I),z=S,N&&C)t:{for(I=N,p=C,_=0,h=I;h;h=no(h))_++;for(h=0,S=p;S;S=no(S))h++;for(;0<_-h;)I=no(I),_--;for(;0<h-_;)p=no(p),h--;for(;_--;){if(I===p||p!==null&&I===p.alternate)break t;I=no(I),p=no(p)}I=null}else I=null;N!==null&&rd(w,k,N,I,!1),C!==null&&z!==null&&rd(w,z,C,I,!0)}}e:{if(k=m?ao(m):window,N=k.nodeName&&k.nodeName.toLowerCase(),N==="select"||N==="input"&&k.type==="file")var $=V0;else if(Zc(k))if(v_)$=J0;else{$=K0;var M=Z0}else(N=k.nodeName)&&N.toLowerCase()==="input"&&(k.type==="checkbox"||k.type==="radio")&&($=G0);if($&&($=$(e,m))){y_(w,$,n,g);break e}M&&M(e,k,m),e==="focusout"&&(M=k._wrapperState)&&M.controlled&&k.type==="number"&&Bi(k,"number",k.value)}switch(M=m?ao(m):window,e){case"focusin":(Zc(M)||M.contentEditable==="true")&&(so=M,Vi=m,ur=null);break;case"focusout":ur=Vi=so=null;break;case"mousedown":Zi=!0;break;case"contextmenu":case"mouseup":case"dragend":Zi=!1,qc(w,n,g);break;case"selectionchange":if(tm)break;case"keydown":case"keyup":qc(w,n,g)}var A;if(za)e:{switch(e){case"compositionstart":var B="onCompositionStart";break e;case"compositionend":B="onCompositionEnd";break e;case"compositionupdate":B="onCompositionUpdate";break e}B=void 0}else lo?h_(e,n)&&(B="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(B="onCompositionStart");B&&(p_&&n.locale!=="ko"&&(lo||B!=="onCompositionStart"?B==="onCompositionEnd"&&lo&&(A=m_()):(un=g,Ma="value"in un?un.value:un.textContent,lo=!0)),M=Hl(m,B),0<M.length&&(B=new Uc(B,e,null,n,g),w.push({event:B,listeners:M}),A?B.data=A:(A=g_(n),A!==null&&(B.data=A)))),(A=Y0?H0(e,n):U0(e,n))&&(m=Hl(m,"onBeforeInput"),0<m.length&&(g=new Uc("onBeforeInput","beforeinput",null,n,g),w.push({event:g,listeners:m}),g.data=A))}P_(w,t)})}function Cr(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Hl(e,t){for(var n=t+"Capture",o=[];e!==null;){var r=e,l=r.stateNode;r.tag===5&&l!==null&&(r=l,l=hr(e,n),l!=null&&o.unshift(Cr(e,l,r)),l=hr(e,t),l!=null&&o.push(Cr(e,l,r))),e=e.return}return o}function no(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function rd(e,t,n,o,r){for(var l=t._reactName,s=[];n!==null&&n!==o;){var i=n,u=i.alternate,m=i.stateNode;if(u!==null&&u===o)break;i.tag===5&&m!==null&&(i=m,r?(u=hr(n,l),u!=null&&s.unshift(Cr(n,u,i))):r||(u=hr(n,l),u!=null&&s.push(Cr(n,u,i)))),n=n.return}s.length!==0&&e.push({event:t,listeners:s})}var om=/\r\n?/g,rm=/\u0000|\uFFFD/g;function ld(e){return(typeof e=="string"?e:""+e).replace(om,`
`).replace(rm,"")}function kl(e,t,n){if(t=ld(t),ld(e)!==t&&n)throw Error(L(425))}function Ul(){}var Ki=null,Gi=null;function Ji(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var qi=typeof setTimeout=="function"?setTimeout:void 0,lm=typeof clearTimeout=="function"?clearTimeout:void 0,sd=typeof Promise=="function"?Promise:void 0,sm=typeof queueMicrotask=="function"?queueMicrotask:typeof sd<"u"?function(e){return sd.resolve(null).then(e).catch(im)}:qi;function im(e){setTimeout(function(){throw e})}function vi(e,t){var n=t,o=0;do{var r=n.nextSibling;if(e.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(o===0){e.removeChild(r),vr(t);return}o--}else n!=="$"&&n!=="$?"&&n!=="$!"||o++;n=r}while(n);vr(t)}function mn(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function id(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"){if(t===0)return e;t--}else n==="/$"&&t++}e=e.previousSibling}return null}var Io=Math.random().toString(36).slice(2),$t="__reactFiber$"+Io,br="__reactProps$"+Io,Zt="__reactContainer$"+Io,ea="__reactEvents$"+Io,am="__reactListeners$"+Io,um="__reactHandles$"+Io;function Rn(e){var t=e[$t];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Zt]||n[$t]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=id(e);e!==null;){if(n=e[$t])return n;e=id(e)}return t}e=n,n=e.parentNode}return null}function $r(e){return e=e[$t]||e[Zt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function ao(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(L(33))}function ds(e){return e[br]||null}var ta=[],uo=-1;function xn(e){return{current:e}}function ue(e){0>uo||(e.current=ta[uo],ta[uo]=null,uo--)}function ie(e,t){uo++,ta[uo]=e.current,e.current=t}var wn={},Oe=xn(wn),Qe=xn(!1),An=wn;function Co(e,t){var n=e.type.contextTypes;if(!n)return wn;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var r={},l;for(l in n)r[l]=t[l];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=r),r}function Ve(e){return e=e.childContextTypes,e!=null}function Xl(){ue(Qe),ue(Oe)}function ad(e,t,n){if(Oe.current!==wn)throw Error(L(168));ie(Oe,t),ie(Qe,n)}function T_(e,t,n){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return n;o=o.getChildContext();for(var r in o)if(!(r in t))throw Error(L(108,Zf(e)||"Unknown",r));return pe({},n,o)}function Ql(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||wn,An=Oe.current,ie(Oe,e),ie(Qe,Qe.current),!0}function ud(e,t,n){var o=e.stateNode;if(!o)throw Error(L(169));n?(e=T_(e,t,An),o.__reactInternalMemoizedMergedChildContext=e,ue(Qe),ue(Oe),ie(Oe,e)):ue(Qe),ie(Qe,n)}var Ht=null,_s=!1,wi=!1;function M_(e){Ht===null?Ht=[e]:Ht.push(e)}function cm(e){_s=!0,M_(e)}function Cn(){if(!wi&&Ht!==null){wi=!0;var e=0,t=ne;try{var n=Ht;for(ne=1;e<n.length;e++){var o=n[e];do o=o(!0);while(o!==null)}Ht=null,_s=!1}catch(r){throw Ht!==null&&(Ht=Ht.slice(e+1)),o_(Na,Cn),r}finally{ne=t,wi=!1}}return null}var co=[],_o=0,Vl=null,Zl=0,ct=[],dt=0,jn=null,Ut=1,Xt="";function Mn(e,t){co[_o++]=Zl,co[_o++]=Vl,Vl=e,Zl=t}function $_(e,t,n){ct[dt++]=Ut,ct[dt++]=Xt,ct[dt++]=jn,jn=e;var o=Ut;e=Xt;var r=32-Ct(o)-1;o&=~(1<<r),n+=1;var l=32-Ct(t)+r;if(30<l){var s=r-r%5;l=(o&(1<<s)-1).toString(32),o>>=s,r-=s,Ut=1<<32-Ct(t)+r|n<<r|o,Xt=l+e}else Ut=1<<l|n<<r|o,Xt=e}function Oa(e){e.return!==null&&(Mn(e,1),$_(e,1,0))}function Da(e){for(;e===Vl;)Vl=co[--_o],co[_o]=null,Zl=co[--_o],co[_o]=null;for(;e===jn;)jn=ct[--dt],ct[dt]=null,Xt=ct[--dt],ct[dt]=null,Ut=ct[--dt],ct[dt]=null}var tt=null,et=null,ce=!1,xt=null;function R_(e,t){var n=_t(5,null,null,0);n.elementType="DELETED",n.stateNode=t,n.return=e,t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)}function cd(e,t){switch(e.tag){case 5:var n=e.type;return t=t.nodeType!==1||n.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,tt=e,et=mn(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,tt=e,et=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(n=jn!==null?{id:Ut,overflow:Xt}:null,e.memoizedState={dehydrated:t,treeContext:n,retryLane:1073741824},n=_t(18,null,null,0),n.stateNode=t,n.return=e,e.child=n,tt=e,et=null,!0):!1;default:return!1}}function na(e){return(e.mode&1)!==0&&(e.flags&128)===0}function oa(e){if(ce){var t=et;if(t){var n=t;if(!cd(e,t)){if(na(e))throw Error(L(418));t=mn(n.nextSibling);var o=tt;t&&cd(e,t)?R_(o,n):(e.flags=e.flags&-4097|2,ce=!1,tt=e)}}else{if(na(e))throw Error(L(418));e.flags=e.flags&-4097|2,ce=!1,tt=e}}}function dd(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;tt=e}function xl(e){if(e!==tt)return!1;if(!ce)return dd(e),ce=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Ji(e.type,e.memoizedProps)),t&&(t=et)){if(na(e))throw z_(),Error(L(418));for(;t;)R_(e,t),t=mn(t.nextSibling)}if(dd(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(L(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"){if(t===0){et=mn(e.nextSibling);break e}t--}else n!=="$"&&n!=="$!"&&n!=="$?"||t++}e=e.nextSibling}et=null}}else et=tt?mn(e.stateNode.nextSibling):null;return!0}function z_(){for(var e=et;e;)e=mn(e.nextSibling)}function bo(){et=tt=null,ce=!1}function Aa(e){xt===null?xt=[e]:xt.push(e)}var dm=Jt.ReactCurrentBatchConfig;function Go(e,t,n){if(e=n.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(L(309));var o=n.stateNode}if(!o)throw Error(L(147,e));var r=o,l=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===l?t.ref:(t=function(s){var i=r.refs;s===null?delete i[l]:i[l]=s},t._stringRef=l,t)}if(typeof e!="string")throw Error(L(284));if(!n._owner)throw Error(L(290,e))}return e}function Cl(e,t){throw e=Object.prototype.toString.call(t),Error(L(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function _d(e){var t=e._init;return t(e._payload)}function B_(e){function t(p,_){if(e){var h=p.deletions;h===null?(p.deletions=[_],p.flags|=16):h.push(_)}}function n(p,_){if(!e)return null;for(;_!==null;)t(p,_),_=_.sibling;return null}function o(p,_){for(p=new Map;_!==null;)_.key!==null?p.set(_.key,_):p.set(_.index,_),_=_.sibling;return p}function r(p,_){return p=yn(p,_),p.index=0,p.sibling=null,p}function l(p,_,h){return p.index=h,e?(h=p.alternate,h!==null?(h=h.index,h<_?(p.flags|=2,_):h):(p.flags|=2,_)):(p.flags|=1048576,_)}function s(p){return e&&p.alternate===null&&(p.flags|=2),p}function i(p,_,h,S){return _===null||_.tag!==6?(_=Ei(h,p.mode,S),_.return=p,_):(_=r(_,h),_.return=p,_)}function u(p,_,h,S){var $=h.type;return $===ro?g(p,_,h.props.children,S,h.key):_!==null&&(_.elementType===$||typeof $=="object"&&$!==null&&$.$$typeof===rn&&_d($)===_.type)?(S=r(_,h.props),S.ref=Go(p,_,h),S.return=p,S):(S=Bl(h.type,h.key,h.props,null,p.mode,S),S.ref=Go(p,_,h),S.return=p,S)}function m(p,_,h,S){return _===null||_.tag!==4||_.stateNode.containerInfo!==h.containerInfo||_.stateNode.implementation!==h.implementation?(_=Ni(h,p.mode,S),_.return=p,_):(_=r(_,h.children||[]),_.return=p,_)}function g(p,_,h,S,$){return _===null||_.tag!==7?(_=Dn(h,p.mode,S,$),_.return=p,_):(_=r(_,h),_.return=p,_)}function w(p,_,h){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Ei(""+_,p.mode,h),_.return=p,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case al:return h=Bl(_.type,_.key,_.props,null,p.mode,h),h.ref=Go(p,null,_),h.return=p,h;case oo:return _=Ni(_,p.mode,h),_.return=p,_;case rn:var S=_._init;return w(p,S(_._payload),h)}if(nr(_)||Qo(_))return _=Dn(_,p.mode,h,null),_.return=p,_;Cl(p,_)}return null}function k(p,_,h,S){var $=_!==null?_.key:null;if(typeof h=="string"&&h!==""||typeof h=="number")return $!==null?null:i(p,_,""+h,S);if(typeof h=="object"&&h!==null){switch(h.$$typeof){case al:return h.key===$?u(p,_,h,S):null;case oo:return h.key===$?m(p,_,h,S):null;case rn:return $=h._init,k(p,_,$(h._payload),S)}if(nr(h)||Qo(h))return $!==null?null:g(p,_,h,S,null);Cl(p,h)}return null}function N(p,_,h,S,$){if(typeof S=="string"&&S!==""||typeof S=="number")return p=p.get(h)||null,i(_,p,""+S,$);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case al:return p=p.get(S.key===null?h:S.key)||null,u(_,p,S,$);case oo:return p=p.get(S.key===null?h:S.key)||null,m(_,p,S,$);case rn:var M=S._init;return N(p,_,h,M(S._payload),$)}if(nr(S)||Qo(S))return p=p.get(h)||null,g(_,p,S,$,null);Cl(_,S)}return null}function C(p,_,h,S){for(var $=null,M=null,A=_,B=_=0,oe=null;A!==null&&B<h.length;B++){A.index>B?(oe=A,A=null):oe=A.sibling;var V=k(p,A,h[B],S);if(V===null){A===null&&(A=oe);break}e&&A&&V.alternate===null&&t(p,A),_=l(V,_,B),M===null?$=V:M.sibling=V,M=V,A=oe}if(B===h.length)return n(p,A),ce&&Mn(p,B),$;if(A===null){for(;B<h.length;B++)A=w(p,h[B],S),A!==null&&(_=l(A,_,B),M===null?$=A:M.sibling=A,M=A);return ce&&Mn(p,B),$}for(A=o(p,A);B<h.length;B++)oe=N(A,p,B,h[B],S),oe!==null&&(e&&oe.alternate!==null&&A.delete(oe.key===null?B:oe.key),_=l(oe,_,B),M===null?$=oe:M.sibling=oe,M=oe);return e&&A.forEach(function(lt){return t(p,lt)}),ce&&Mn(p,B),$}function I(p,_,h,S){var $=Qo(h);if(typeof $!="function")throw Error(L(150));if(h=$.call(h),h==null)throw Error(L(151));for(var M=$=null,A=_,B=_=0,oe=null,V=h.next();A!==null&&!V.done;B++,V=h.next()){A.index>B?(oe=A,A=null):oe=A.sibling;var lt=k(p,A,V.value,S);if(lt===null){A===null&&(A=oe);break}e&&A&&lt.alternate===null&&t(p,A),_=l(lt,_,B),M===null?$=lt:M.sibling=lt,M=lt,A=oe}if(V.done)return n(p,A),ce&&Mn(p,B),$;if(A===null){for(;!V.done;B++,V=h.next())V=w(p,V.value,S),V!==null&&(_=l(V,_,B),M===null?$=V:M.sibling=V,M=V);return ce&&Mn(p,B),$}for(A=o(p,A);!V.done;B++,V=h.next())V=N(A,p,B,V.value,S),V!==null&&(e&&V.alternate!==null&&A.delete(V.key===null?B:V.key),_=l(V,_,B),M===null?$=V:M.sibling=V,M=V);return e&&A.forEach(function(O){return t(p,O)}),ce&&Mn(p,B),$}function z(p,_,h,S){if(typeof h=="object"&&h!==null&&h.type===ro&&h.key===null&&(h=h.props.children),typeof h=="object"&&h!==null){switch(h.$$typeof){case al:e:{for(var $=h.key,M=_;M!==null;){if(M.key===$){if($=h.type,$===ro){if(M.tag===7){n(p,M.sibling),_=r(M,h.props.children),_.return=p,p=_;break e}}else if(M.elementType===$||typeof $=="object"&&$!==null&&$.$$typeof===rn&&_d($)===M.type){n(p,M.sibling),_=r(M,h.props),_.ref=Go(p,M,h),_.return=p,p=_;break e}n(p,M);break}else t(p,M);M=M.sibling}h.type===ro?(_=Dn(h.props.children,p.mode,S,h.key),_.return=p,p=_):(S=Bl(h.type,h.key,h.props,null,p.mode,S),S.ref=Go(p,_,h),S.return=p,p=S)}return s(p);case oo:e:{for(M=h.key;_!==null;){if(_.key===M)if(_.tag===4&&_.stateNode.containerInfo===h.containerInfo&&_.stateNode.implementation===h.implementation){n(p,_.sibling),_=r(_,h.children||[]),_.return=p,p=_;break e}else{n(p,_);break}else t(p,_);_=_.sibling}_=Ni(h,p.mode,S),_.return=p,p=_}return s(p);case rn:return M=h._init,z(p,_,M(h._payload),S)}if(nr(h))return C(p,_,h,S);if(Qo(h))return I(p,_,h,S);Cl(p,h)}return typeof h=="string"&&h!==""||typeof h=="number"?(h=""+h,_!==null&&_.tag===6?(n(p,_.sibling),_=r(_,h),_.return=p,p=_):(n(p,_),_=Ei(h,p.mode,S),_.return=p,p=_),s(p)):n(p,_)}return z}var So=B_(!0),O_=B_(!1),Kl=xn(null),Gl=null,fo=null,ja=null;function Fa(){ja=fo=Gl=null}function Wa(e){var t=Kl.current;ue(Kl),e._currentValue=t}function ra(e,t,n){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===n)break;e=e.return}}function wo(e,t){Gl=e,ja=fo=null,e=e.dependencies,e!==null&&e.firstContext!==null&&((e.lanes&t)!==0&&(Xe=!0),e.firstContext=null)}function mt(e){var t=e._currentValue;if(ja!==e)if(e={context:e,memoizedValue:t,next:null},fo===null){if(Gl===null)throw Error(L(308));fo=e,Gl.dependencies={lanes:0,firstContext:e}}else fo=fo.next=e;return t}var zn=null;function Ya(e){zn===null?zn=[e]:zn.push(e)}function D_(e,t,n,o){var r=t.interleaved;return r===null?(n.next=n,Ya(t)):(n.next=r.next,r.next=n),t.interleaved=n,Kt(e,o)}function Kt(e,t){e.lanes|=t;var n=e.alternate;for(n!==null&&(n.lanes|=t),n=e,e=e.return;e!==null;)e.childLanes|=t,n=e.alternate,n!==null&&(n.childLanes|=t),n=e,e=e.return;return n.tag===3?n.stateNode:null}var ln=!1;function Ha(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function A_(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Qt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function pn(e,t,n){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,(ee&2)!==0){var r=o.pending;return r===null?t.next=t:(t.next=r.next,r.next=t),o.pending=t,Kt(e,n)}return r=o.interleaved,r===null?(t.next=t,Ya(o)):(t.next=r.next,r.next=t),o.interleaved=t,Kt(e,n)}function Il(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Pa(e,n)}}function fd(e,t){var n=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,n===o)){var r=null,l=null;if(n=n.firstBaseUpdate,n!==null){do{var s={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};l===null?r=l=s:l=l.next=s,n=n.next}while(n!==null);l===null?r=l=t:l=l.next=t}else r=l=t;n={baseState:o.baseState,firstBaseUpdate:r,lastBaseUpdate:l,shared:o.shared,effects:o.effects},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}function Jl(e,t,n,o){var r=e.updateQueue;ln=!1;var l=r.firstBaseUpdate,s=r.lastBaseUpdate,i=r.shared.pending;if(i!==null){r.shared.pending=null;var u=i,m=u.next;u.next=null,s===null?l=m:s.next=m,s=u;var g=e.alternate;g!==null&&(g=g.updateQueue,i=g.lastBaseUpdate,i!==s&&(i===null?g.firstBaseUpdate=m:i.next=m,g.lastBaseUpdate=u))}if(l!==null){var w=r.baseState;s=0,g=m=u=null,i=l;do{var k=i.lane,N=i.eventTime;if((o&k)===k){g!==null&&(g=g.next={eventTime:N,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var C=e,I=i;switch(k=t,N=n,I.tag){case 1:if(C=I.payload,typeof C=="function"){w=C.call(N,w,k);break e}w=C;break e;case 3:C.flags=C.flags&-65537|128;case 0:if(C=I.payload,k=typeof C=="function"?C.call(N,w,k):C,k==null)break e;w=pe({},w,k);break e;case 2:ln=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,k=r.effects,k===null?r.effects=[i]:k.push(i))}else N={eventTime:N,lane:k,tag:i.tag,payload:i.payload,callback:i.callback,next:null},g===null?(m=g=N,u=w):g=g.next=N,s|=k;if(i=i.next,i===null){if(i=r.shared.pending,i===null)break;k=i,i=k.next,k.next=null,r.lastBaseUpdate=k,r.shared.pending=null}}while(!0);if(g===null&&(u=w),r.baseState=u,r.firstBaseUpdate=m,r.lastBaseUpdate=g,t=r.shared.interleaved,t!==null){r=t;do s|=r.lane,r=r.next;while(r!==t)}else l===null&&(r.shared.lanes=0);Wn|=s,e.lanes=s,e.memoizedState=w}}function md(e,t,n){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],r=o.callback;if(r!==null){if(o.callback=null,o=n,typeof r!="function")throw Error(L(191,r));r.call(o)}}}var Rr={},zt=xn(Rr),Sr=xn(Rr),Lr=xn(Rr);function Bn(e){if(e===Rr)throw Error(L(174));return e}function Ua(e,t){switch(ie(Lr,t),ie(Sr,e),ie(zt,Rr),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Di(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Di(t,e)}ue(zt),ie(zt,t)}function Lo(){ue(zt),ue(Sr),ue(Lr)}function j_(e){Bn(Lr.current);var t=Bn(zt.current),n=Di(t,e.type);t!==n&&(ie(Sr,e),ie(zt,n))}function Xa(e){Sr.current===e&&(ue(zt),ue(Sr))}var fe=xn(0);function ql(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var ki=[];function Qa(){for(var e=0;e<ki.length;e++)ki[e]._workInProgressVersionPrimary=null;ki.length=0}var Tl=Jt.ReactCurrentDispatcher,xi=Jt.ReactCurrentBatchConfig,Fn=0,me=null,Se=null,Ne=null,es=!1,cr=!1,Er=0,_m=0;function Re(){throw Error(L(321))}function Va(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!St(e[n],t[n]))return!1;return!0}function Za(e,t,n,o,r,l){if(Fn=l,me=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Tl.current=e===null||e.memoizedState===null?hm:gm,e=n(o,r),cr){l=0;do{if(cr=!1,Er=0,25<=l)throw Error(L(301));l+=1,Ne=Se=null,t.updateQueue=null,Tl.current=ym,e=n(o,r)}while(cr)}if(Tl.current=ts,t=Se!==null&&Se.next!==null,Fn=0,Ne=Se=me=null,es=!1,t)throw Error(L(300));return e}function Ka(){var e=Er!==0;return Er=0,e}function Mt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ne===null?me.memoizedState=Ne=e:Ne=Ne.next=e,Ne}function pt(){if(Se===null){var e=me.alternate;e=e!==null?e.memoizedState:null}else e=Se.next;var t=Ne===null?me.memoizedState:Ne.next;if(t!==null)Ne=t,Se=e;else{if(e===null)throw Error(L(310));Se=e,e={memoizedState:Se.memoizedState,baseState:Se.baseState,baseQueue:Se.baseQueue,queue:Se.queue,next:null},Ne===null?me.memoizedState=Ne=e:Ne=Ne.next=e}return Ne}function Nr(e,t){return typeof t=="function"?t(e):t}function Ci(e){var t=pt(),n=t.queue;if(n===null)throw Error(L(311));n.lastRenderedReducer=e;var o=Se,r=o.baseQueue,l=n.pending;if(l!==null){if(r!==null){var s=r.next;r.next=l.next,l.next=s}o.baseQueue=r=l,n.pending=null}if(r!==null){l=r.next,o=o.baseState;var i=s=null,u=null,m=l;do{var g=m.lane;if((Fn&g)===g)u!==null&&(u=u.next={lane:0,action:m.action,hasEagerState:m.hasEagerState,eagerState:m.eagerState,next:null}),o=m.hasEagerState?m.eagerState:e(o,m.action);else{var w={lane:g,action:m.action,hasEagerState:m.hasEagerState,eagerState:m.eagerState,next:null};u===null?(i=u=w,s=o):u=u.next=w,me.lanes|=g,Wn|=g}m=m.next}while(m!==null&&m!==l);u===null?s=o:u.next=i,St(o,t.memoizedState)||(Xe=!0),t.memoizedState=o,t.baseState=s,t.baseQueue=u,n.lastRenderedState=o}if(e=n.interleaved,e!==null){r=e;do l=r.lane,me.lanes|=l,Wn|=l,r=r.next;while(r!==e)}else r===null&&(n.lanes=0);return[t.memoizedState,n.dispatch]}function bi(e){var t=pt(),n=t.queue;if(n===null)throw Error(L(311));n.lastRenderedReducer=e;var o=n.dispatch,r=n.pending,l=t.memoizedState;if(r!==null){n.pending=null;var s=r=r.next;do l=e(l,s.action),s=s.next;while(s!==r);St(l,t.memoizedState)||(Xe=!0),t.memoizedState=l,t.baseQueue===null&&(t.baseState=l),n.lastRenderedState=l}return[l,o]}function F_(){}function W_(e,t){var n=me,o=pt(),r=t(),l=!St(o.memoizedState,r);if(l&&(o.memoizedState=r,Xe=!0),o=o.queue,Ga(U_.bind(null,n,o,e),[e]),o.getSnapshot!==t||l||Ne!==null&&Ne.memoizedState.tag&1){if(n.flags|=2048,Pr(9,H_.bind(null,n,o,r,t),void 0,null),Pe===null)throw Error(L(349));(Fn&30)!==0||Y_(n,t,r)}return r}function Y_(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=me.updateQueue,t===null?(t={lastEffect:null,stores:null},me.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function H_(e,t,n,o){t.value=n,t.getSnapshot=o,X_(t)&&Q_(e)}function U_(e,t,n){return n(function(){X_(t)&&Q_(e)})}function X_(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!St(e,n)}catch{return!0}}function Q_(e){var t=Kt(e,1);t!==null&&bt(t,e,1,-1)}function pd(e){var t=Mt();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Nr,lastRenderedState:e},t.queue=e,e=e.dispatch=pm.bind(null,me,e),[t.memoizedState,e]}function Pr(e,t,n,o){return e={tag:e,create:t,destroy:n,deps:o,next:null},t=me.updateQueue,t===null?(t={lastEffect:null,stores:null},me.updateQueue=t,t.lastEffect=e.next=e):(n=t.lastEffect,n===null?t.lastEffect=e.next=e:(o=n.next,n.next=e,e.next=o,t.lastEffect=e)),e}function V_(){return pt().memoizedState}function Ml(e,t,n,o){var r=Mt();me.flags|=e,r.memoizedState=Pr(1|t,n,void 0,o===void 0?null:o)}function fs(e,t,n,o){var r=pt();o=o===void 0?null:o;var l=void 0;if(Se!==null){var s=Se.memoizedState;if(l=s.destroy,o!==null&&Va(o,s.deps)){r.memoizedState=Pr(t,n,l,o);return}}me.flags|=e,r.memoizedState=Pr(1|t,n,l,o)}function hd(e,t){return Ml(8390656,8,e,t)}function Ga(e,t){return fs(2048,8,e,t)}function Z_(e,t){return fs(4,2,e,t)}function K_(e,t){return fs(4,4,e,t)}function G_(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function J_(e,t,n){return n=n!=null?n.concat([e]):null,fs(4,4,G_.bind(null,t,e),n)}function Ja(){}function q_(e,t){var n=pt();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Va(t,o[1])?o[0]:(n.memoizedState=[e,t],e)}function e1(e,t){var n=pt();t=t===void 0?null:t;var o=n.memoizedState;return o!==null&&t!==null&&Va(t,o[1])?o[0]:(e=e(),n.memoizedState=[e,t],e)}function t1(e,t,n){return(Fn&21)===0?(e.baseState&&(e.baseState=!1,Xe=!0),e.memoizedState=n):(St(n,t)||(n=s_(),me.lanes|=n,Wn|=n,e.baseState=!0),t)}function fm(e,t){var n=ne;ne=n!==0&&4>n?n:4,e(!0);var o=xi.transition;xi.transition={};try{e(!1),t()}finally{ne=n,xi.transition=o}}function n1(){return pt().memoizedState}function mm(e,t,n){var o=gn(e);if(n={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null},o1(e))r1(t,n);else if(n=D_(e,t,n,o),n!==null){var r=Fe();bt(n,e,o,r),l1(n,t,o)}}function pm(e,t,n){var o=gn(e),r={lane:o,action:n,hasEagerState:!1,eagerState:null,next:null};if(o1(e))r1(t,r);else{var l=e.alternate;if(e.lanes===0&&(l===null||l.lanes===0)&&(l=t.lastRenderedReducer,l!==null))try{var s=t.lastRenderedState,i=l(s,n);if(r.hasEagerState=!0,r.eagerState=i,St(i,s)){var u=t.interleaved;u===null?(r.next=r,Ya(t)):(r.next=u.next,u.next=r),t.interleaved=r;return}}catch{}n=D_(e,t,r,o),n!==null&&(r=Fe(),bt(n,e,o,r),l1(n,t,o))}}function o1(e){var t=e.alternate;return e===me||t!==null&&t===me}function r1(e,t){cr=es=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function l1(e,t,n){if((n&4194240)!==0){var o=t.lanes;o&=e.pendingLanes,n|=o,t.lanes=n,Pa(e,n)}}var ts={readContext:mt,useCallback:Re,useContext:Re,useEffect:Re,useImperativeHandle:Re,useInsertionEffect:Re,useLayoutEffect:Re,useMemo:Re,useReducer:Re,useRef:Re,useState:Re,useDebugValue:Re,useDeferredValue:Re,useTransition:Re,useMutableSource:Re,useSyncExternalStore:Re,useId:Re,unstable_isNewReconciler:!1},hm={readContext:mt,useCallback:function(e,t){return Mt().memoizedState=[e,t===void 0?null:t],e},useContext:mt,useEffect:hd,useImperativeHandle:function(e,t,n){return n=n!=null?n.concat([e]):null,Ml(4194308,4,G_.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ml(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ml(4,2,e,t)},useMemo:function(e,t){var n=Mt();return t=t===void 0?null:t,e=e(),n.memoizedState=[e,t],e},useReducer:function(e,t,n){var o=Mt();return t=n!==void 0?n(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=mm.bind(null,me,e),[o.memoizedState,e]},useRef:function(e){var t=Mt();return e={current:e},t.memoizedState=e},useState:pd,useDebugValue:Ja,useDeferredValue:function(e){return Mt().memoizedState=e},useTransition:function(){var e=pd(!1),t=e[0];return e=fm.bind(null,e[1]),Mt().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,n){var o=me,r=Mt();if(ce){if(n===void 0)throw Error(L(407));n=n()}else{if(n=t(),Pe===null)throw Error(L(349));(Fn&30)!==0||Y_(o,t,n)}r.memoizedState=n;var l={value:n,getSnapshot:t};return r.queue=l,hd(U_.bind(null,o,l,e),[e]),o.flags|=2048,Pr(9,H_.bind(null,o,l,n,t),void 0,null),n},useId:function(){var e=Mt(),t=Pe.identifierPrefix;if(ce){var n=Xt,o=Ut;n=(o&~(1<<32-Ct(o)-1)).toString(32)+n,t=":"+t+"R"+n,n=Er++,0<n&&(t+="H"+n.toString(32)),t+=":"}else n=_m++,t=":"+t+"r"+n.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},gm={readContext:mt,useCallback:q_,useContext:mt,useEffect:Ga,useImperativeHandle:J_,useInsertionEffect:Z_,useLayoutEffect:K_,useMemo:e1,useReducer:Ci,useRef:V_,useState:function(){return Ci(Nr)},useDebugValue:Ja,useDeferredValue:function(e){var t=pt();return t1(t,Se.memoizedState,e)},useTransition:function(){var e=Ci(Nr)[0],t=pt().memoizedState;return[e,t]},useMutableSource:F_,useSyncExternalStore:W_,useId:n1,unstable_isNewReconciler:!1},ym={readContext:mt,useCallback:q_,useContext:mt,useEffect:Ga,useImperativeHandle:J_,useInsertionEffect:Z_,useLayoutEffect:K_,useMemo:e1,useReducer:bi,useRef:V_,useState:function(){return bi(Nr)},useDebugValue:Ja,useDeferredValue:function(e){var t=pt();return Se===null?t.memoizedState=e:t1(t,Se.memoizedState,e)},useTransition:function(){var e=bi(Nr)[0],t=pt().memoizedState;return[e,t]},useMutableSource:F_,useSyncExternalStore:W_,useId:n1,unstable_isNewReconciler:!1};function wt(e,t){if(e&&e.defaultProps){t=pe({},t),e=e.defaultProps;for(var n in e)t[n]===void 0&&(t[n]=e[n]);return t}return t}function la(e,t,n,o){t=e.memoizedState,n=n(o,t),n=n==null?t:pe({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ms={isMounted:function(e){return(e=e._reactInternals)?Un(e)===e:!1},enqueueSetState:function(e,t,n){e=e._reactInternals;var o=Fe(),r=gn(e),l=Qt(o,r);l.payload=t,n!=null&&(l.callback=n),t=pn(e,l,r),t!==null&&(bt(t,e,r,o),Il(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var o=Fe(),r=gn(e),l=Qt(o,r);l.tag=1,l.payload=t,n!=null&&(l.callback=n),t=pn(e,l,r),t!==null&&(bt(t,e,r,o),Il(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Fe(),o=gn(e),r=Qt(n,o);r.tag=2,t!=null&&(r.callback=t),t=pn(e,r,o),t!==null&&(bt(t,e,o,n),Il(t,e,o))}};function gd(e,t,n,o,r,l,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,l,s):t.prototype&&t.prototype.isPureReactComponent?!kr(n,o)||!kr(r,l):!0}function s1(e,t,n){var o=!1,r=wn,l=t.contextType;return typeof l=="object"&&l!==null?l=mt(l):(r=Ve(t)?An:Oe.current,o=t.contextTypes,l=(o=o!=null)?Co(e,r):wn),t=new t(n,l),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=ms,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=r,e.__reactInternalMemoizedMaskedChildContext=l),t}function yd(e,t,n,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,o),t.state!==e&&ms.enqueueReplaceState(t,t.state,null)}function sa(e,t,n,o){var r=e.stateNode;r.props=n,r.state=e.memoizedState,r.refs={},Ha(e);var l=t.contextType;typeof l=="object"&&l!==null?r.context=mt(l):(l=Ve(t)?An:Oe.current,r.context=Co(e,l)),r.state=e.memoizedState,l=t.getDerivedStateFromProps,typeof l=="function"&&(la(e,t,l,n),r.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(t=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),t!==r.state&&ms.enqueueReplaceState(r,r.state,null),Jl(e,n,r,o),r.state=e.memoizedState),typeof r.componentDidMount=="function"&&(e.flags|=4194308)}function Eo(e,t){try{var n="",o=t;do n+=Vf(o),o=o.return;while(o);var r=n}catch(l){r=`
Error generating stack: `+l.message+`
`+l.stack}return{value:e,source:t,stack:r,digest:null}}function Si(e,t,n){return{value:e,source:null,stack:n??null,digest:t??null}}function ia(e,t){try{console.error(t.value)}catch(n){setTimeout(function(){throw n})}}var vm=typeof WeakMap=="function"?WeakMap:Map;function i1(e,t,n){n=Qt(-1,n),n.tag=3,n.payload={element:null};var o=t.value;return n.callback=function(){os||(os=!0,ga=o),ia(e,t)},n}function a1(e,t,n){n=Qt(-1,n),n.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var r=t.value;n.payload=function(){return o(r)},n.callback=function(){ia(e,t)}}var l=e.stateNode;return l!==null&&typeof l.componentDidCatch=="function"&&(n.callback=function(){ia(e,t),typeof o!="function"&&(hn===null?hn=new Set([this]):hn.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),n}function vd(e,t,n){var o=e.pingCache;if(o===null){o=e.pingCache=new vm;var r=new Set;o.set(t,r)}else r=o.get(t),r===void 0&&(r=new Set,o.set(t,r));r.has(n)||(r.add(n),e=$m.bind(null,e,t,n),t.then(e,e))}function wd(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function kd(e,t,n,o,r){return(e.mode&1)===0?(e===t?e.flags|=65536:(e.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(t=Qt(-1,1),t.tag=2,pn(n,t,1))),n.lanes|=1),e):(e.flags|=65536,e.lanes=r,e)}var wm=Jt.ReactCurrentOwner,Xe=!1;function je(e,t,n,o){t.child=e===null?O_(t,null,n,o):So(t,e.child,n,o)}function xd(e,t,n,o,r){n=n.render;var l=t.ref;return wo(t,r),o=Za(e,t,n,o,l,r),n=Ka(),e!==null&&!Xe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Gt(e,t,r)):(ce&&n&&Oa(t),t.flags|=1,je(e,t,o,r),t.child)}function Cd(e,t,n,o,r){if(e===null){var l=n.type;return typeof l=="function"&&!su(l)&&l.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(t.tag=15,t.type=l,u1(e,t,l,o,r)):(e=Bl(n.type,null,o,t,t.mode,r),e.ref=t.ref,e.return=t,t.child=e)}if(l=e.child,(e.lanes&r)===0){var s=l.memoizedProps;if(n=n.compare,n=n!==null?n:kr,n(s,o)&&e.ref===t.ref)return Gt(e,t,r)}return t.flags|=1,e=yn(l,o),e.ref=t.ref,e.return=t,t.child=e}function u1(e,t,n,o,r){if(e!==null){var l=e.memoizedProps;if(kr(l,o)&&e.ref===t.ref)if(Xe=!1,t.pendingProps=o=l,(e.lanes&r)!==0)(e.flags&131072)!==0&&(Xe=!0);else return t.lanes=e.lanes,Gt(e,t,r)}return aa(e,t,n,o,r)}function c1(e,t,n){var o=t.pendingProps,r=o.children,l=e!==null?e.memoizedState:null;if(o.mode==="hidden")if((t.mode&1)===0)t.memoizedState={baseLanes:0,cachePool:null,transitions:null},ie(po,qe),qe|=n;else{if((n&1073741824)===0)return e=l!==null?l.baseLanes|n:n,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,ie(po,qe),qe|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=l!==null?l.baseLanes:n,ie(po,qe),qe|=o}else l!==null?(o=l.baseLanes|n,t.memoizedState=null):o=n,ie(po,qe),qe|=o;return je(e,t,r,n),t.child}function d1(e,t){var n=t.ref;(e===null&&n!==null||e!==null&&e.ref!==n)&&(t.flags|=512,t.flags|=2097152)}function aa(e,t,n,o,r){var l=Ve(n)?An:Oe.current;return l=Co(t,l),wo(t,r),n=Za(e,t,n,o,l,r),o=Ka(),e!==null&&!Xe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~r,Gt(e,t,r)):(ce&&o&&Oa(t),t.flags|=1,je(e,t,n,r),t.child)}function bd(e,t,n,o,r){if(Ve(n)){var l=!0;Ql(t)}else l=!1;if(wo(t,r),t.stateNode===null)$l(e,t),s1(t,n,o),sa(t,n,o,r),o=!0;else if(e===null){var s=t.stateNode,i=t.memoizedProps;s.props=i;var u=s.context,m=n.contextType;typeof m=="object"&&m!==null?m=mt(m):(m=Ve(n)?An:Oe.current,m=Co(t,m));var g=n.getDerivedStateFromProps,w=typeof g=="function"||typeof s.getSnapshotBeforeUpdate=="function";w||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==o||u!==m)&&yd(t,s,o,m),ln=!1;var k=t.memoizedState;s.state=k,Jl(t,o,s,r),u=t.memoizedState,i!==o||k!==u||Qe.current||ln?(typeof g=="function"&&(la(t,n,g,o),u=t.memoizedState),(i=ln||gd(t,n,i,o,k,u,m))?(w||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=u),s.props=o,s.state=u,s.context=m,o=i):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{s=t.stateNode,A_(e,t),i=t.memoizedProps,m=t.type===t.elementType?i:wt(t.type,i),s.props=m,w=t.pendingProps,k=s.context,u=n.contextType,typeof u=="object"&&u!==null?u=mt(u):(u=Ve(n)?An:Oe.current,u=Co(t,u));var N=n.getDerivedStateFromProps;(g=typeof N=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==w||k!==u)&&yd(t,s,o,u),ln=!1,k=t.memoizedState,s.state=k,Jl(t,o,s,r);var C=t.memoizedState;i!==w||k!==C||Qe.current||ln?(typeof N=="function"&&(la(t,n,N,o),C=t.memoizedState),(m=ln||gd(t,n,m,o,k,C,u)||!1)?(g||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(o,C,u),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(o,C,u)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&k===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&k===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=C),s.props=o,s.state=C,s.context=u,o=m):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&k===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&k===e.memoizedState||(t.flags|=1024),o=!1)}return ua(e,t,n,o,l,r)}function ua(e,t,n,o,r,l){d1(e,t);var s=(t.flags&128)!==0;if(!o&&!s)return r&&ud(t,n,!1),Gt(e,t,l);o=t.stateNode,wm.current=t;var i=s&&typeof n.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&s?(t.child=So(t,e.child,null,l),t.child=So(t,null,i,l)):je(e,t,i,l),t.memoizedState=o.state,r&&ud(t,n,!0),t.child}function _1(e){var t=e.stateNode;t.pendingContext?ad(e,t.pendingContext,t.pendingContext!==t.context):t.context&&ad(e,t.context,!1),Ua(e,t.containerInfo)}function Sd(e,t,n,o,r){return bo(),Aa(r),t.flags|=256,je(e,t,n,o),t.child}var ca={dehydrated:null,treeContext:null,retryLane:0};function da(e){return{baseLanes:e,cachePool:null,transitions:null}}function f1(e,t,n){var o=t.pendingProps,r=fe.current,l=!1,s=(t.flags&128)!==0,i;if((i=s)||(i=e!==null&&e.memoizedState===null?!1:(r&2)!==0),i?(l=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(r|=1),ie(fe,r&1),e===null)return oa(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?((t.mode&1)===0?t.lanes=1:e.data==="$!"?t.lanes=8:t.lanes=1073741824,null):(s=o.children,e=o.fallback,l?(o=t.mode,l=t.child,s={mode:"hidden",children:s},(o&1)===0&&l!==null?(l.childLanes=0,l.pendingProps=s):l=gs(s,o,0,null),e=Dn(e,o,n,null),l.return=t,e.return=t,l.sibling=e,t.child=l,t.child.memoizedState=da(n),t.memoizedState=ca,e):qa(t,s));if(r=e.memoizedState,r!==null&&(i=r.dehydrated,i!==null))return km(e,t,s,o,i,r,n);if(l){l=o.fallback,s=t.mode,r=e.child,i=r.sibling;var u={mode:"hidden",children:o.children};return(s&1)===0&&t.child!==r?(o=t.child,o.childLanes=0,o.pendingProps=u,t.deletions=null):(o=yn(r,u),o.subtreeFlags=r.subtreeFlags&14680064),i!==null?l=yn(i,l):(l=Dn(l,s,n,null),l.flags|=2),l.return=t,o.return=t,o.sibling=l,t.child=o,o=l,l=t.child,s=e.child.memoizedState,s=s===null?da(n):{baseLanes:s.baseLanes|n,cachePool:null,transitions:s.transitions},l.memoizedState=s,l.childLanes=e.childLanes&~n,t.memoizedState=ca,o}return l=e.child,e=l.sibling,o=yn(l,{mode:"visible",children:o.children}),(t.mode&1)===0&&(o.lanes=n),o.return=t,o.sibling=null,e!==null&&(n=t.deletions,n===null?(t.deletions=[e],t.flags|=16):n.push(e)),t.child=o,t.memoizedState=null,o}function qa(e,t){return t=gs({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function bl(e,t,n,o){return o!==null&&Aa(o),So(t,e.child,null,n),e=qa(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function km(e,t,n,o,r,l,s){if(n)return t.flags&256?(t.flags&=-257,o=Si(Error(L(422))),bl(e,t,s,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(l=o.fallback,r=t.mode,o=gs({mode:"visible",children:o.children},r,0,null),l=Dn(l,r,s,null),l.flags|=2,o.return=t,l.return=t,o.sibling=l,t.child=o,(t.mode&1)!==0&&So(t,e.child,null,s),t.child.memoizedState=da(s),t.memoizedState=ca,l);if((t.mode&1)===0)return bl(e,t,s,null);if(r.data==="$!"){if(o=r.nextSibling&&r.nextSibling.dataset,o)var i=o.dgst;return o=i,l=Error(L(419)),o=Si(l,o,void 0),bl(e,t,s,o)}if(i=(s&e.childLanes)!==0,Xe||i){if(o=Pe,o!==null){switch(s&-s){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=(r&(o.suspendedLanes|s))!==0?0:r,r!==0&&r!==l.retryLane&&(l.retryLane=r,Kt(e,r),bt(o,e,r,-1))}return lu(),o=Si(Error(L(421))),bl(e,t,s,o)}return r.data==="$?"?(t.flags|=128,t.child=e.child,t=Rm.bind(null,e),r._reactRetry=t,null):(e=l.treeContext,et=mn(r.nextSibling),tt=t,ce=!0,xt=null,e!==null&&(ct[dt++]=Ut,ct[dt++]=Xt,ct[dt++]=jn,Ut=e.id,Xt=e.overflow,jn=t),t=qa(t,o.children),t.flags|=4096,t)}function Ld(e,t,n){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),ra(e.return,t,n)}function Li(e,t,n,o,r){var l=e.memoizedState;l===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:n,tailMode:r}:(l.isBackwards=t,l.rendering=null,l.renderingStartTime=0,l.last=o,l.tail=n,l.tailMode=r)}function m1(e,t,n){var o=t.pendingProps,r=o.revealOrder,l=o.tail;if(je(e,t,o.children,n),o=fe.current,(o&2)!==0)o=o&1|2,t.flags|=128;else{if(e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ld(e,n,t);else if(e.tag===19)Ld(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(ie(fe,o),(t.mode&1)===0)t.memoizedState=null;else switch(r){case"forwards":for(n=t.child,r=null;n!==null;)e=n.alternate,e!==null&&ql(e)===null&&(r=n),n=n.sibling;n=r,n===null?(r=t.child,t.child=null):(r=n.sibling,n.sibling=null),Li(t,!1,r,n,l);break;case"backwards":for(n=null,r=t.child,t.child=null;r!==null;){if(e=r.alternate,e!==null&&ql(e)===null){t.child=r;break}e=r.sibling,r.sibling=n,n=r,r=e}Li(t,!0,n,null,l);break;case"together":Li(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function $l(e,t){(t.mode&1)===0&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Gt(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Wn|=t.lanes,(n&t.childLanes)===0)return null;if(e!==null&&t.child!==e.child)throw Error(L(153));if(t.child!==null){for(e=t.child,n=yn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=yn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function xm(e,t,n){switch(t.tag){case 3:_1(t),bo();break;case 5:j_(t);break;case 1:Ve(t.type)&&Ql(t);break;case 4:Ua(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,r=t.memoizedProps.value;ie(Kl,o._currentValue),o._currentValue=r;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(ie(fe,fe.current&1),t.flags|=128,null):(n&t.child.childLanes)!==0?f1(e,t,n):(ie(fe,fe.current&1),e=Gt(e,t,n),e!==null?e.sibling:null);ie(fe,fe.current&1);break;case 19:if(o=(n&t.childLanes)!==0,(e.flags&128)!==0){if(o)return m1(e,t,n);t.flags|=128}if(r=t.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ie(fe,fe.current),o)break;return null;case 22:case 23:return t.lanes=0,c1(e,t,n)}return Gt(e,t,n)}var p1,_a,h1,g1;p1=function(e,t){for(var n=t.child;n!==null;){if(n.tag===5||n.tag===6)e.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};_a=function(){};h1=function(e,t,n,o){var r=e.memoizedProps;if(r!==o){e=t.stateNode,Bn(zt.current);var l=null;switch(n){case"input":r=Ri(e,r),o=Ri(e,o),l=[];break;case"select":r=pe({},r,{value:void 0}),o=pe({},o,{value:void 0}),l=[];break;case"textarea":r=Oi(e,r),o=Oi(e,o),l=[];break;default:typeof r.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=Ul)}Ai(n,o);var s;n=null;for(m in r)if(!o.hasOwnProperty(m)&&r.hasOwnProperty(m)&&r[m]!=null)if(m==="style"){var i=r[m];for(s in i)i.hasOwnProperty(s)&&(n||(n={}),n[s]="")}else m!=="dangerouslySetInnerHTML"&&m!=="children"&&m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(mr.hasOwnProperty(m)?l||(l=[]):(l=l||[]).push(m,null));for(m in o){var u=o[m];if(i=r?.[m],o.hasOwnProperty(m)&&u!==i&&(u!=null||i!=null))if(m==="style")if(i){for(s in i)!i.hasOwnProperty(s)||u&&u.hasOwnProperty(s)||(n||(n={}),n[s]="");for(s in u)u.hasOwnProperty(s)&&i[s]!==u[s]&&(n||(n={}),n[s]=u[s])}else n||(l||(l=[]),l.push(m,n)),n=u;else m==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,i=i?i.__html:void 0,u!=null&&i!==u&&(l=l||[]).push(m,u)):m==="children"?typeof u!="string"&&typeof u!="number"||(l=l||[]).push(m,""+u):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&(mr.hasOwnProperty(m)?(u!=null&&m==="onScroll"&&ae("scroll",e),l||i===u||(l=[])):(l=l||[]).push(m,u))}n&&(l=l||[]).push("style",n);var m=l;(t.updateQueue=m)&&(t.flags|=4)}};g1=function(e,t,n,o){n!==o&&(t.flags|=4)};function Jo(e,t){if(!ce)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var o=null;n!==null;)n.alternate!==null&&(o=n),n=n.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,o=0;if(t)for(var r=e.child;r!==null;)n|=r.lanes|r.childLanes,o|=r.subtreeFlags&14680064,o|=r.flags&14680064,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)n|=r.lanes|r.childLanes,o|=r.subtreeFlags,o|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=o,e.childLanes=n,t}function Cm(e,t,n){var o=t.pendingProps;switch(Da(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ze(t),null;case 1:return Ve(t.type)&&Xl(),ze(t),null;case 3:return o=t.stateNode,Lo(),ue(Qe),ue(Oe),Qa(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(xl(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,xt!==null&&(wa(xt),xt=null))),_a(e,t),ze(t),null;case 5:Xa(t);var r=Bn(Lr.current);if(n=t.type,e!==null&&t.stateNode!=null)h1(e,t,n,o,r),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(L(166));return ze(t),null}if(e=Bn(zt.current),xl(t)){o=t.stateNode,n=t.type;var l=t.memoizedProps;switch(o[$t]=t,o[br]=l,e=(t.mode&1)!==0,n){case"dialog":ae("cancel",o),ae("close",o);break;case"iframe":case"object":case"embed":ae("load",o);break;case"video":case"audio":for(r=0;r<rr.length;r++)ae(rr[r],o);break;case"source":ae("error",o);break;case"img":case"image":case"link":ae("error",o),ae("load",o);break;case"details":ae("toggle",o);break;case"input":Rc(o,l),ae("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!l.multiple},ae("invalid",o);break;case"textarea":Bc(o,l),ae("invalid",o)}Ai(n,l),r=null;for(var s in l)if(l.hasOwnProperty(s)){var i=l[s];s==="children"?typeof i=="string"?o.textContent!==i&&(l.suppressHydrationWarning!==!0&&kl(o.textContent,i,e),r=["children",i]):typeof i=="number"&&o.textContent!==""+i&&(l.suppressHydrationWarning!==!0&&kl(o.textContent,i,e),r=["children",""+i]):mr.hasOwnProperty(s)&&i!=null&&s==="onScroll"&&ae("scroll",o)}switch(n){case"input":ul(o),zc(o,l,!0);break;case"textarea":ul(o),Oc(o);break;case"select":case"option":break;default:typeof l.onClick=="function"&&(o.onclick=Ul)}o=r,t.updateQueue=o,o!==null&&(t.flags|=4)}else{s=r.nodeType===9?r:r.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=Ud(n)),e==="http://www.w3.org/1999/xhtml"?n==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=s.createElement(n,{is:o.is}):(e=s.createElement(n),n==="select"&&(s=e,o.multiple?s.multiple=!0:o.size&&(s.size=o.size))):e=s.createElementNS(e,n),e[$t]=t,e[br]=o,p1(e,t,!1,!1),t.stateNode=e;e:{switch(s=ji(n,o),n){case"dialog":ae("cancel",e),ae("close",e),r=o;break;case"iframe":case"object":case"embed":ae("load",e),r=o;break;case"video":case"audio":for(r=0;r<rr.length;r++)ae(rr[r],e);r=o;break;case"source":ae("error",e),r=o;break;case"img":case"image":case"link":ae("error",e),ae("load",e),r=o;break;case"details":ae("toggle",e),r=o;break;case"input":Rc(e,o),r=Ri(e,o),ae("invalid",e);break;case"option":r=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},r=pe({},o,{value:void 0}),ae("invalid",e);break;case"textarea":Bc(e,o),r=Oi(e,o),ae("invalid",e);break;default:r=o}Ai(n,r),i=r;for(l in i)if(i.hasOwnProperty(l)){var u=i[l];l==="style"?Vd(e,u):l==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Xd(e,u)):l==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&pr(e,u):typeof u=="number"&&pr(e,""+u):l!=="suppressContentEditableWarning"&&l!=="suppressHydrationWarning"&&l!=="autoFocus"&&(mr.hasOwnProperty(l)?u!=null&&l==="onScroll"&&ae("scroll",e):u!=null&&Ca(e,l,u,s))}switch(n){case"input":ul(e),zc(e,o,!1);break;case"textarea":ul(e),Oc(e);break;case"option":o.value!=null&&e.setAttribute("value",""+vn(o.value));break;case"select":e.multiple=!!o.multiple,l=o.value,l!=null?ho(e,!!o.multiple,l,!1):o.defaultValue!=null&&ho(e,!!o.multiple,o.defaultValue,!0);break;default:typeof r.onClick=="function"&&(e.onclick=Ul)}switch(n){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ze(t),null;case 6:if(e&&t.stateNode!=null)g1(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(L(166));if(n=Bn(Lr.current),Bn(zt.current),xl(t)){if(o=t.stateNode,n=t.memoizedProps,o[$t]=t,(l=o.nodeValue!==n)&&(e=tt,e!==null))switch(e.tag){case 3:kl(o.nodeValue,n,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&kl(o.nodeValue,n,(e.mode&1)!==0)}l&&(t.flags|=4)}else o=(n.nodeType===9?n:n.ownerDocument).createTextNode(o),o[$t]=t,t.stateNode=o}return ze(t),null;case 13:if(ue(fe),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(ce&&et!==null&&(t.mode&1)!==0&&(t.flags&128)===0)z_(),bo(),t.flags|=98560,l=!1;else if(l=xl(t),o!==null&&o.dehydrated!==null){if(e===null){if(!l)throw Error(L(318));if(l=t.memoizedState,l=l!==null?l.dehydrated:null,!l)throw Error(L(317));l[$t]=t}else bo(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;ze(t),l=!1}else xt!==null&&(wa(xt),xt=null),l=!0;if(!l)return t.flags&65536?t:null}return(t.flags&128)!==0?(t.lanes=n,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,(t.mode&1)!==0&&(e===null||(fe.current&1)!==0?Le===0&&(Le=3):lu())),t.updateQueue!==null&&(t.flags|=4),ze(t),null);case 4:return Lo(),_a(e,t),e===null&&xr(t.stateNode.containerInfo),ze(t),null;case 10:return Wa(t.type._context),ze(t),null;case 17:return Ve(t.type)&&Xl(),ze(t),null;case 19:if(ue(fe),l=t.memoizedState,l===null)return ze(t),null;if(o=(t.flags&128)!==0,s=l.rendering,s===null)if(o)Jo(l,!1);else{if(Le!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=ql(e),s!==null){for(t.flags|=128,Jo(l,!1),o=s.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=n,n=t.child;n!==null;)l=n,e=o,l.flags&=14680066,s=l.alternate,s===null?(l.childLanes=0,l.lanes=e,l.child=null,l.subtreeFlags=0,l.memoizedProps=null,l.memoizedState=null,l.updateQueue=null,l.dependencies=null,l.stateNode=null):(l.childLanes=s.childLanes,l.lanes=s.lanes,l.child=s.child,l.subtreeFlags=0,l.deletions=null,l.memoizedProps=s.memoizedProps,l.memoizedState=s.memoizedState,l.updateQueue=s.updateQueue,l.type=s.type,e=s.dependencies,l.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),n=n.sibling;return ie(fe,fe.current&1|2),t.child}e=e.sibling}l.tail!==null&&ye()>No&&(t.flags|=128,o=!0,Jo(l,!1),t.lanes=4194304)}else{if(!o)if(e=ql(s),e!==null){if(t.flags|=128,o=!0,n=e.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),Jo(l,!0),l.tail===null&&l.tailMode==="hidden"&&!s.alternate&&!ce)return ze(t),null}else 2*ye()-l.renderingStartTime>No&&n!==1073741824&&(t.flags|=128,o=!0,Jo(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(n=l.last,n!==null?n.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(t=l.tail,l.rendering=t,l.tail=t.sibling,l.renderingStartTime=ye(),t.sibling=null,n=fe.current,ie(fe,o?n&1|2:n&1),t):(ze(t),null);case 22:case 23:return ru(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&(t.mode&1)!==0?(qe&1073741824)!==0&&(ze(t),t.subtreeFlags&6&&(t.flags|=8192)):ze(t),null;case 24:return null;case 25:return null}throw Error(L(156,t.tag))}function bm(e,t){switch(Da(t),t.tag){case 1:return Ve(t.type)&&Xl(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Lo(),ue(Qe),ue(Oe),Qa(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 5:return Xa(t),null;case 13:if(ue(fe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(L(340));bo()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ue(fe),null;case 4:return Lo(),null;case 10:return Wa(t.type._context),null;case 22:case 23:return ru(),null;case 24:return null;default:return null}}var Sl=!1,Be=!1,Sm=typeof WeakSet=="function"?WeakSet:Set,R=null;function mo(e,t){var n=e.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(o){ge(e,t,o)}else n.current=null}function fa(e,t,n){try{n()}catch(o){ge(e,t,o)}}var Ed=!1;function Lm(e,t){if(Ki=Wl,e=x_(),Ba(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var o=n.getSelection&&n.getSelection();if(o&&o.rangeCount!==0){n=o.anchorNode;var r=o.anchorOffset,l=o.focusNode;o=o.focusOffset;try{n.nodeType,l.nodeType}catch{n=null;break e}var s=0,i=-1,u=-1,m=0,g=0,w=e,k=null;t:for(;;){for(var N;w!==n||r!==0&&w.nodeType!==3||(i=s+r),w!==l||o!==0&&w.nodeType!==3||(u=s+o),w.nodeType===3&&(s+=w.nodeValue.length),(N=w.firstChild)!==null;)k=w,w=N;for(;;){if(w===e)break t;if(k===n&&++m===r&&(i=s),k===l&&++g===o&&(u=s),(N=w.nextSibling)!==null)break;w=k,k=w.parentNode}w=N}n=i===-1||u===-1?null:{start:i,end:u}}else n=null}n=n||{start:0,end:0}}else n=null;for(Gi={focusedElem:e,selectionRange:n},Wl=!1,R=t;R!==null;)if(t=R,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,R=e;else for(;R!==null;){t=R;try{var C=t.alternate;if((t.flags&1024)!==0)switch(t.tag){case 0:case 11:case 15:break;case 1:if(C!==null){var I=C.memoizedProps,z=C.memoizedState,p=t.stateNode,_=p.getSnapshotBeforeUpdate(t.elementType===t.type?I:wt(t.type,I),z);p.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var h=t.stateNode.containerInfo;h.nodeType===1?h.textContent="":h.nodeType===9&&h.documentElement&&h.removeChild(h.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(L(163))}}catch(S){ge(t,t.return,S)}if(e=t.sibling,e!==null){e.return=t.return,R=e;break}R=t.return}return C=Ed,Ed=!1,C}function dr(e,t,n){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var r=o=o.next;do{if((r.tag&e)===e){var l=r.destroy;r.destroy=void 0,l!==void 0&&fa(t,n,l)}r=r.next}while(r!==o)}}function ps(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var n=t=t.next;do{if((n.tag&e)===e){var o=n.create;n.destroy=o()}n=n.next}while(n!==t)}}function ma(e){var t=e.ref;if(t!==null){var n=e.stateNode;e.tag,e=n,typeof t=="function"?t(e):t.current=e}}function y1(e){var t=e.alternate;t!==null&&(e.alternate=null,y1(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[$t],delete t[br],delete t[ea],delete t[am],delete t[um])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function v1(e){return e.tag===5||e.tag===3||e.tag===4}function Nd(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||v1(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function pa(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.nodeType===8?n.parentNode.insertBefore(e,t):n.insertBefore(e,t):(n.nodeType===8?(t=n.parentNode,t.insertBefore(e,n)):(t=n,t.appendChild(e)),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=Ul));else if(o!==4&&(e=e.child,e!==null))for(pa(e,t,n),e=e.sibling;e!==null;)pa(e,t,n),e=e.sibling}function ha(e,t,n){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(ha(e,t,n),e=e.sibling;e!==null;)ha(e,t,n),e=e.sibling}var Ie=null,kt=!1;function on(e,t,n){for(n=n.child;n!==null;)w1(e,t,n),n=n.sibling}function w1(e,t,n){if(Rt&&typeof Rt.onCommitFiberUnmount=="function")try{Rt.onCommitFiberUnmount(is,n)}catch{}switch(n.tag){case 5:Be||mo(n,t);case 6:var o=Ie,r=kt;Ie=null,on(e,t,n),Ie=o,kt=r,Ie!==null&&(kt?(e=Ie,n=n.stateNode,e.nodeType===8?e.parentNode.removeChild(n):e.removeChild(n)):Ie.removeChild(n.stateNode));break;case 18:Ie!==null&&(kt?(e=Ie,n=n.stateNode,e.nodeType===8?vi(e.parentNode,n):e.nodeType===1&&vi(e,n),vr(e)):vi(Ie,n.stateNode));break;case 4:o=Ie,r=kt,Ie=n.stateNode.containerInfo,kt=!0,on(e,t,n),Ie=o,kt=r;break;case 0:case 11:case 14:case 15:if(!Be&&(o=n.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){r=o=o.next;do{var l=r,s=l.destroy;l=l.tag,s!==void 0&&((l&2)!==0||(l&4)!==0)&&fa(n,t,s),r=r.next}while(r!==o)}on(e,t,n);break;case 1:if(!Be&&(mo(n,t),o=n.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=n.memoizedProps,o.state=n.memoizedState,o.componentWillUnmount()}catch(i){ge(n,t,i)}on(e,t,n);break;case 21:on(e,t,n);break;case 22:n.mode&1?(Be=(o=Be)||n.memoizedState!==null,on(e,t,n),Be=o):on(e,t,n);break;default:on(e,t,n)}}function Pd(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var n=e.stateNode;n===null&&(n=e.stateNode=new Sm),t.forEach(function(o){var r=zm.bind(null,e,o);n.has(o)||(n.add(o),o.then(r,r))})}}function vt(e,t){var n=t.deletions;if(n!==null)for(var o=0;o<n.length;o++){var r=n[o];try{var l=e,s=t,i=s;e:for(;i!==null;){switch(i.tag){case 5:Ie=i.stateNode,kt=!1;break e;case 3:Ie=i.stateNode.containerInfo,kt=!0;break e;case 4:Ie=i.stateNode.containerInfo,kt=!0;break e}i=i.return}if(Ie===null)throw Error(L(160));w1(l,s,r),Ie=null,kt=!1;var u=r.alternate;u!==null&&(u.return=null),r.return=null}catch(m){ge(r,t,m)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)k1(t,e),t=t.sibling}function k1(e,t){var n=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(vt(t,e),Tt(e),o&4){try{dr(3,e,e.return),ps(3,e)}catch(I){ge(e,e.return,I)}try{dr(5,e,e.return)}catch(I){ge(e,e.return,I)}}break;case 1:vt(t,e),Tt(e),o&512&&n!==null&&mo(n,n.return);break;case 5:if(vt(t,e),Tt(e),o&512&&n!==null&&mo(n,n.return),e.flags&32){var r=e.stateNode;try{pr(r,"")}catch(I){ge(e,e.return,I)}}if(o&4&&(r=e.stateNode,r!=null)){var l=e.memoizedProps,s=n!==null?n.memoizedProps:l,i=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{i==="input"&&l.type==="radio"&&l.name!=null&&Yd(r,l),ji(i,s);var m=ji(i,l);for(s=0;s<u.length;s+=2){var g=u[s],w=u[s+1];g==="style"?Vd(r,w):g==="dangerouslySetInnerHTML"?Xd(r,w):g==="children"?pr(r,w):Ca(r,g,w,m)}switch(i){case"input":zi(r,l);break;case"textarea":Hd(r,l);break;case"select":var k=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!l.multiple;var N=l.value;N!=null?ho(r,!!l.multiple,N,!1):k!==!!l.multiple&&(l.defaultValue!=null?ho(r,!!l.multiple,l.defaultValue,!0):ho(r,!!l.multiple,l.multiple?[]:"",!1))}r[br]=l}catch(I){ge(e,e.return,I)}}break;case 6:if(vt(t,e),Tt(e),o&4){if(e.stateNode===null)throw Error(L(162));r=e.stateNode,l=e.memoizedProps;try{r.nodeValue=l}catch(I){ge(e,e.return,I)}}break;case 3:if(vt(t,e),Tt(e),o&4&&n!==null&&n.memoizedState.isDehydrated)try{vr(t.containerInfo)}catch(I){ge(e,e.return,I)}break;case 4:vt(t,e),Tt(e);break;case 13:vt(t,e),Tt(e),r=e.child,r.flags&8192&&(l=r.memoizedState!==null,r.stateNode.isHidden=l,!l||r.alternate!==null&&r.alternate.memoizedState!==null||(nu=ye())),o&4&&Pd(e);break;case 22:if(g=n!==null&&n.memoizedState!==null,e.mode&1?(Be=(m=Be)||g,vt(t,e),Be=m):vt(t,e),Tt(e),o&8192){if(m=e.memoizedState!==null,(e.stateNode.isHidden=m)&&!g&&(e.mode&1)!==0)for(R=e,g=e.child;g!==null;){for(w=R=g;R!==null;){switch(k=R,N=k.child,k.tag){case 0:case 11:case 14:case 15:dr(4,k,k.return);break;case 1:mo(k,k.return);var C=k.stateNode;if(typeof C.componentWillUnmount=="function"){o=k,n=k.return;try{t=o,C.props=t.memoizedProps,C.state=t.memoizedState,C.componentWillUnmount()}catch(I){ge(o,n,I)}}break;case 5:mo(k,k.return);break;case 22:if(k.memoizedState!==null){Td(w);continue}}N!==null?(N.return=k,R=N):Td(w)}g=g.sibling}e:for(g=null,w=e;;){if(w.tag===5){if(g===null){g=w;try{r=w.stateNode,m?(l=r.style,typeof l.setProperty=="function"?l.setProperty("display","none","important"):l.display="none"):(i=w.stateNode,u=w.memoizedProps.style,s=u!=null&&u.hasOwnProperty("display")?u.display:null,i.style.display=Qd("display",s))}catch(I){ge(e,e.return,I)}}}else if(w.tag===6){if(g===null)try{w.stateNode.nodeValue=m?"":w.memoizedProps}catch(I){ge(e,e.return,I)}}else if((w.tag!==22&&w.tag!==23||w.memoizedState===null||w===e)&&w.child!==null){w.child.return=w,w=w.child;continue}if(w===e)break e;for(;w.sibling===null;){if(w.return===null||w.return===e)break e;g===w&&(g=null),w=w.return}g===w&&(g=null),w.sibling.return=w.return,w=w.sibling}}break;case 19:vt(t,e),Tt(e),o&4&&Pd(e);break;case 21:break;default:vt(t,e),Tt(e)}}function Tt(e){var t=e.flags;if(t&2){try{e:{for(var n=e.return;n!==null;){if(v1(n)){var o=n;break e}n=n.return}throw Error(L(160))}switch(o.tag){case 5:var r=o.stateNode;o.flags&32&&(pr(r,""),o.flags&=-33);var l=Nd(e);ha(e,l,r);break;case 3:case 4:var s=o.stateNode.containerInfo,i=Nd(e);pa(e,i,s);break;default:throw Error(L(161))}}catch(u){ge(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Em(e,t,n){R=e,x1(e,t,n)}function x1(e,t,n){for(var o=(e.mode&1)!==0;R!==null;){var r=R,l=r.child;if(r.tag===22&&o){var s=r.memoizedState!==null||Sl;if(!s){var i=r.alternate,u=i!==null&&i.memoizedState!==null||Be;i=Sl;var m=Be;if(Sl=s,(Be=u)&&!m)for(R=r;R!==null;)s=R,u=s.child,s.tag===22&&s.memoizedState!==null?Md(r):u!==null?(u.return=s,R=u):Md(r);for(;l!==null;)R=l,x1(l,t,n),l=l.sibling;R=r,Sl=i,Be=m}Id(e,t,n)}else(r.subtreeFlags&8772)!==0&&l!==null?(l.return=r,R=l):Id(e,t,n)}}function Id(e){for(;R!==null;){var t=R;if((t.flags&8772)!==0){var n=t.alternate;try{if((t.flags&8772)!==0)switch(t.tag){case 0:case 11:case 15:Be||ps(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Be)if(n===null)o.componentDidMount();else{var r=t.elementType===t.type?n.memoizedProps:wt(t.type,n.memoizedProps);o.componentDidUpdate(r,n.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var l=t.updateQueue;l!==null&&md(t,l,o);break;case 3:var s=t.updateQueue;if(s!==null){if(n=null,t.child!==null)switch(t.child.tag){case 5:n=t.child.stateNode;break;case 1:n=t.child.stateNode}md(t,s,n)}break;case 5:var i=t.stateNode;if(n===null&&t.flags&4){n=i;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&n.focus();break;case"img":u.src&&(n.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var m=t.alternate;if(m!==null){var g=m.memoizedState;if(g!==null){var w=g.dehydrated;w!==null&&vr(w)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(L(163))}Be||t.flags&512&&ma(t)}catch(k){ge(t,t.return,k)}}if(t===e){R=null;break}if(n=t.sibling,n!==null){n.return=t.return,R=n;break}R=t.return}}function Td(e){for(;R!==null;){var t=R;if(t===e){R=null;break}var n=t.sibling;if(n!==null){n.return=t.return,R=n;break}R=t.return}}function Md(e){for(;R!==null;){var t=R;try{switch(t.tag){case 0:case 11:case 15:var n=t.return;try{ps(4,t)}catch(u){ge(t,n,u)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var r=t.return;try{o.componentDidMount()}catch(u){ge(t,r,u)}}var l=t.return;try{ma(t)}catch(u){ge(t,l,u)}break;case 5:var s=t.return;try{ma(t)}catch(u){ge(t,s,u)}}}catch(u){ge(t,t.return,u)}if(t===e){R=null;break}var i=t.sibling;if(i!==null){i.return=t.return,R=i;break}R=t.return}}var Nm=Math.ceil,ns=Jt.ReactCurrentDispatcher,eu=Jt.ReactCurrentOwner,ft=Jt.ReactCurrentBatchConfig,ee=0,Pe=null,be=null,Te=0,qe=0,po=xn(0),Le=0,Ir=null,Wn=0,hs=0,tu=0,_r=null,Ue=null,nu=0,No=1/0,Yt=null,os=!1,ga=null,hn=null,Ll=!1,cn=null,rs=0,fr=0,ya=null,Rl=-1,zl=0;function Fe(){return(ee&6)!==0?ye():Rl!==-1?Rl:Rl=ye()}function gn(e){return(e.mode&1)===0?1:(ee&2)!==0&&Te!==0?Te&-Te:dm.transition!==null?(zl===0&&(zl=s_()),zl):(e=ne,e!==0||(e=window.event,e=e===void 0?16:f_(e.type)),e)}function bt(e,t,n,o){if(50<fr)throw fr=0,ya=null,Error(L(185));Tr(e,n,o),((ee&2)===0||e!==Pe)&&(e===Pe&&((ee&2)===0&&(hs|=n),Le===4&&an(e,Te)),Ze(e,o),n===1&&ee===0&&(t.mode&1)===0&&(No=ye()+500,_s&&Cn()))}function Ze(e,t){var n=e.callbackNode;f0(e,t);var o=Fl(e,e===Pe?Te:0);if(o===0)n!==null&&jc(n),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(n!=null&&jc(n),t===1)e.tag===0?cm($d.bind(null,e)):M_($d.bind(null,e)),sm(function(){(ee&6)===0&&Cn()}),n=null;else{switch(i_(o)){case 1:n=Na;break;case 4:n=r_;break;case 16:n=jl;break;case 536870912:n=l_;break;default:n=jl}n=I1(n,C1.bind(null,e))}e.callbackPriority=t,e.callbackNode=n}}function C1(e,t){if(Rl=-1,zl=0,(ee&6)!==0)throw Error(L(327));var n=e.callbackNode;if(ko()&&e.callbackNode!==n)return null;var o=Fl(e,e===Pe?Te:0);if(o===0)return null;if((o&30)!==0||(o&e.expiredLanes)!==0||t)t=ls(e,o);else{t=o;var r=ee;ee|=2;var l=S1();(Pe!==e||Te!==t)&&(Yt=null,No=ye()+500,On(e,t));do try{Tm();break}catch(i){b1(e,i)}while(!0);Fa(),ns.current=l,ee=r,be!==null?t=0:(Pe=null,Te=0,t=Le)}if(t!==0){if(t===2&&(r=Ui(e),r!==0&&(o=r,t=va(e,r))),t===1)throw n=Ir,On(e,0),an(e,o),Ze(e,ye()),n;if(t===6)an(e,o);else{if(r=e.current.alternate,(o&30)===0&&!Pm(r)&&(t=ls(e,o),t===2&&(l=Ui(e),l!==0&&(o=l,t=va(e,l))),t===1))throw n=Ir,On(e,0),an(e,o),Ze(e,ye()),n;switch(e.finishedWork=r,e.finishedLanes=o,t){case 0:case 1:throw Error(L(345));case 2:$n(e,Ue,Yt);break;case 3:if(an(e,o),(o&130023424)===o&&(t=nu+500-ye(),10<t)){if(Fl(e,0)!==0)break;if(r=e.suspendedLanes,(r&o)!==o){Fe(),e.pingedLanes|=e.suspendedLanes&r;break}e.timeoutHandle=qi($n.bind(null,e,Ue,Yt),t);break}$n(e,Ue,Yt);break;case 4:if(an(e,o),(o&4194240)===o)break;for(t=e.eventTimes,r=-1;0<o;){var s=31-Ct(o);l=1<<s,s=t[s],s>r&&(r=s),o&=~l}if(o=r,o=ye()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*Nm(o/1960))-o,10<o){e.timeoutHandle=qi($n.bind(null,e,Ue,Yt),o);break}$n(e,Ue,Yt);break;case 5:$n(e,Ue,Yt);break;default:throw Error(L(329))}}}return Ze(e,ye()),e.callbackNode===n?C1.bind(null,e):null}function va(e,t){var n=_r;return e.current.memoizedState.isDehydrated&&(On(e,t).flags|=256),e=ls(e,t),e!==2&&(t=Ue,Ue=n,t!==null&&wa(t)),e}function wa(e){Ue===null?Ue=e:Ue.push.apply(Ue,e)}function Pm(e){for(var t=e;;){if(t.flags&16384){var n=t.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var o=0;o<n.length;o++){var r=n[o],l=r.getSnapshot;r=r.value;try{if(!St(l(),r))return!1}catch{return!1}}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function an(e,t){for(t&=~tu,t&=~hs,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var n=31-Ct(t),o=1<<n;e[n]=-1,t&=~o}}function $d(e){if((ee&6)!==0)throw Error(L(327));ko();var t=Fl(e,0);if((t&1)===0)return Ze(e,ye()),null;var n=ls(e,t);if(e.tag!==0&&n===2){var o=Ui(e);o!==0&&(t=o,n=va(e,o))}if(n===1)throw n=Ir,On(e,0),an(e,t),Ze(e,ye()),n;if(n===6)throw Error(L(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,$n(e,Ue,Yt),Ze(e,ye()),null}function ou(e,t){var n=ee;ee|=1;try{return e(t)}finally{ee=n,ee===0&&(No=ye()+500,_s&&Cn())}}function Yn(e){cn!==null&&cn.tag===0&&(ee&6)===0&&ko();var t=ee;ee|=1;var n=ft.transition,o=ne;try{if(ft.transition=null,ne=1,e)return e()}finally{ne=o,ft.transition=n,ee=t,(ee&6)===0&&Cn()}}function ru(){qe=po.current,ue(po)}function On(e,t){e.finishedWork=null,e.finishedLanes=0;var n=e.timeoutHandle;if(n!==-1&&(e.timeoutHandle=-1,lm(n)),be!==null)for(n=be.return;n!==null;){var o=n;switch(Da(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&Xl();break;case 3:Lo(),ue(Qe),ue(Oe),Qa();break;case 5:Xa(o);break;case 4:Lo();break;case 13:ue(fe);break;case 19:ue(fe);break;case 10:Wa(o.type._context);break;case 22:case 23:ru()}n=n.return}if(Pe=e,be=e=yn(e.current,null),Te=qe=t,Le=0,Ir=null,tu=hs=Wn=0,Ue=_r=null,zn!==null){for(t=0;t<zn.length;t++)if(n=zn[t],o=n.interleaved,o!==null){n.interleaved=null;var r=o.next,l=n.pending;if(l!==null){var s=l.next;l.next=r,o.next=s}n.pending=o}zn=null}return e}function b1(e,t){do{var n=be;try{if(Fa(),Tl.current=ts,es){for(var o=me.memoizedState;o!==null;){var r=o.queue;r!==null&&(r.pending=null),o=o.next}es=!1}if(Fn=0,Ne=Se=me=null,cr=!1,Er=0,eu.current=null,n===null||n.return===null){Le=1,Ir=t,be=null;break}e:{var l=e,s=n.return,i=n,u=t;if(t=Te,i.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var m=u,g=i,w=g.tag;if((g.mode&1)===0&&(w===0||w===11||w===15)){var k=g.alternate;k?(g.updateQueue=k.updateQueue,g.memoizedState=k.memoizedState,g.lanes=k.lanes):(g.updateQueue=null,g.memoizedState=null)}var N=wd(s);if(N!==null){N.flags&=-257,kd(N,s,i,l,t),N.mode&1&&vd(l,m,t),t=N,u=m;var C=t.updateQueue;if(C===null){var I=new Set;I.add(u),t.updateQueue=I}else C.add(u);break e}else{if((t&1)===0){vd(l,m,t),lu();break e}u=Error(L(426))}}else if(ce&&i.mode&1){var z=wd(s);if(z!==null){(z.flags&65536)===0&&(z.flags|=256),kd(z,s,i,l,t),Aa(Eo(u,i));break e}}l=u=Eo(u,i),Le!==4&&(Le=2),_r===null?_r=[l]:_r.push(l),l=s;do{switch(l.tag){case 3:l.flags|=65536,t&=-t,l.lanes|=t;var p=i1(l,u,t);fd(l,p);break e;case 1:i=u;var _=l.type,h=l.stateNode;if((l.flags&128)===0&&(typeof _.getDerivedStateFromError=="function"||h!==null&&typeof h.componentDidCatch=="function"&&(hn===null||!hn.has(h)))){l.flags|=65536,t&=-t,l.lanes|=t;var S=a1(l,i,t);fd(l,S);break e}}l=l.return}while(l!==null)}E1(n)}catch($){t=$,be===n&&n!==null&&(be=n=n.return);continue}break}while(!0)}function S1(){var e=ns.current;return ns.current=ts,e===null?ts:e}function lu(){(Le===0||Le===3||Le===2)&&(Le=4),Pe===null||(Wn&268435455)===0&&(hs&268435455)===0||an(Pe,Te)}function ls(e,t){var n=ee;ee|=2;var o=S1();(Pe!==e||Te!==t)&&(Yt=null,On(e,t));do try{Im();break}catch(r){b1(e,r)}while(!0);if(Fa(),ee=n,ns.current=o,be!==null)throw Error(L(261));return Pe=null,Te=0,Le}function Im(){for(;be!==null;)L1(be)}function Tm(){for(;be!==null&&!r0();)L1(be)}function L1(e){var t=P1(e.alternate,e,qe);e.memoizedProps=e.pendingProps,t===null?E1(e):be=t,eu.current=null}function E1(e){var t=e;do{var n=t.alternate;if(e=t.return,(t.flags&32768)===0){if(n=Cm(n,t,qe),n!==null){be=n;return}}else{if(n=bm(n,t),n!==null){n.flags&=32767,be=n;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Le=6,be=null;return}}if(t=t.sibling,t!==null){be=t;return}be=t=e}while(t!==null);Le===0&&(Le=5)}function $n(e,t,n){var o=ne,r=ft.transition;try{ft.transition=null,ne=1,Mm(e,t,n,o)}finally{ft.transition=r,ne=o}return null}function Mm(e,t,n,o){do ko();while(cn!==null);if((ee&6)!==0)throw Error(L(327));n=e.finishedWork;var r=e.finishedLanes;if(n===null)return null;if(e.finishedWork=null,e.finishedLanes=0,n===e.current)throw Error(L(177));e.callbackNode=null,e.callbackPriority=0;var l=n.lanes|n.childLanes;if(m0(e,l),e===Pe&&(be=Pe=null,Te=0),(n.subtreeFlags&2064)===0&&(n.flags&2064)===0||Ll||(Ll=!0,I1(jl,function(){return ko(),null})),l=(n.flags&15990)!==0,(n.subtreeFlags&15990)!==0||l){l=ft.transition,ft.transition=null;var s=ne;ne=1;var i=ee;ee|=4,eu.current=null,Lm(e,n),k1(n,e),em(Gi),Wl=!!Ki,Gi=Ki=null,e.current=n,Em(n,e,r),l0(),ee=i,ne=s,ft.transition=l}else e.current=n;if(Ll&&(Ll=!1,cn=e,rs=r),l=e.pendingLanes,l===0&&(hn=null),a0(n.stateNode,o),Ze(e,ye()),t!==null)for(o=e.onRecoverableError,n=0;n<t.length;n++)r=t[n],o(r.value,{componentStack:r.stack,digest:r.digest});if(os)throw os=!1,e=ga,ga=null,e;return(rs&1)!==0&&e.tag!==0&&ko(),l=e.pendingLanes,(l&1)!==0?e===ya?fr++:(fr=0,ya=e):fr=0,Cn(),null}function ko(){if(cn!==null){var e=i_(rs),t=ft.transition,n=ne;try{if(ft.transition=null,ne=16>e?16:e,cn===null)var o=!1;else{if(e=cn,cn=null,rs=0,(ee&6)!==0)throw Error(L(331));var r=ee;for(ee|=4,R=e.current;R!==null;){var l=R,s=l.child;if((R.flags&16)!==0){var i=l.deletions;if(i!==null){for(var u=0;u<i.length;u++){var m=i[u];for(R=m;R!==null;){var g=R;switch(g.tag){case 0:case 11:case 15:dr(8,g,l)}var w=g.child;if(w!==null)w.return=g,R=w;else for(;R!==null;){g=R;var k=g.sibling,N=g.return;if(y1(g),g===m){R=null;break}if(k!==null){k.return=N,R=k;break}R=N}}}var C=l.alternate;if(C!==null){var I=C.child;if(I!==null){C.child=null;do{var z=I.sibling;I.sibling=null,I=z}while(I!==null)}}R=l}}if((l.subtreeFlags&2064)!==0&&s!==null)s.return=l,R=s;else e:for(;R!==null;){if(l=R,(l.flags&2048)!==0)switch(l.tag){case 0:case 11:case 15:dr(9,l,l.return)}var p=l.sibling;if(p!==null){p.return=l.return,R=p;break e}R=l.return}}var _=e.current;for(R=_;R!==null;){s=R;var h=s.child;if((s.subtreeFlags&2064)!==0&&h!==null)h.return=s,R=h;else e:for(s=_;R!==null;){if(i=R,(i.flags&2048)!==0)try{switch(i.tag){case 0:case 11:case 15:ps(9,i)}}catch($){ge(i,i.return,$)}if(i===s){R=null;break e}var S=i.sibling;if(S!==null){S.return=i.return,R=S;break e}R=i.return}}if(ee=r,Cn(),Rt&&typeof Rt.onPostCommitFiberRoot=="function")try{Rt.onPostCommitFiberRoot(is,e)}catch{}o=!0}return o}finally{ne=n,ft.transition=t}}return!1}function Rd(e,t,n){t=Eo(n,t),t=i1(e,t,1),e=pn(e,t,1),t=Fe(),e!==null&&(Tr(e,1,t),Ze(e,t))}function ge(e,t,n){if(e.tag===3)Rd(e,e,n);else for(;t!==null;){if(t.tag===3){Rd(t,e,n);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(hn===null||!hn.has(o))){e=Eo(n,e),e=a1(t,e,1),t=pn(t,e,1),e=Fe(),t!==null&&(Tr(t,1,e),Ze(t,e));break}}t=t.return}}function $m(e,t,n){var o=e.pingCache;o!==null&&o.delete(t),t=Fe(),e.pingedLanes|=e.suspendedLanes&n,Pe===e&&(Te&n)===n&&(Le===4||Le===3&&(Te&130023424)===Te&&500>ye()-nu?On(e,0):tu|=n),Ze(e,t)}function N1(e,t){t===0&&((e.mode&1)===0?t=1:(t=_l,_l<<=1,(_l&130023424)===0&&(_l=4194304)));var n=Fe();e=Kt(e,t),e!==null&&(Tr(e,t,n),Ze(e,n))}function Rm(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),N1(e,n)}function zm(e,t){var n=0;switch(e.tag){case 13:var o=e.stateNode,r=e.memoizedState;r!==null&&(n=r.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(L(314))}o!==null&&o.delete(t),N1(e,n)}var P1;P1=function(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps||Qe.current)Xe=!0;else{if((e.lanes&n)===0&&(t.flags&128)===0)return Xe=!1,xm(e,t,n);Xe=(e.flags&131072)!==0}else Xe=!1,ce&&(t.flags&1048576)!==0&&$_(t,Zl,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;$l(e,t),e=t.pendingProps;var r=Co(t,Oe.current);wo(t,n),r=Za(null,t,o,e,r,n);var l=Ka();return t.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Ve(o)?(l=!0,Ql(t)):l=!1,t.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Ha(t),r.updater=ms,t.stateNode=r,r._reactInternals=t,sa(t,o,e,n),t=ua(null,t,o,!0,l,n)):(t.tag=0,ce&&l&&Oa(t),je(null,t,r,n),t=t.child),t;case 16:o=t.elementType;e:{switch($l(e,t),e=t.pendingProps,r=o._init,o=r(o._payload),t.type=o,r=t.tag=Om(o),e=wt(o,e),r){case 0:t=aa(null,t,o,e,n);break e;case 1:t=bd(null,t,o,e,n);break e;case 11:t=xd(null,t,o,e,n);break e;case 14:t=Cd(null,t,o,wt(o.type,e),n);break e}throw Error(L(306,o,""))}return t;case 0:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:wt(o,r),aa(e,t,o,r,n);case 1:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:wt(o,r),bd(e,t,o,r,n);case 3:e:{if(_1(t),e===null)throw Error(L(387));o=t.pendingProps,l=t.memoizedState,r=l.element,A_(e,t),Jl(t,o,null,n);var s=t.memoizedState;if(o=s.element,l.isDehydrated)if(l={element:o,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=l,t.memoizedState=l,t.flags&256){r=Eo(Error(L(423)),t),t=Sd(e,t,o,n,r);break e}else if(o!==r){r=Eo(Error(L(424)),t),t=Sd(e,t,o,n,r);break e}else for(et=mn(t.stateNode.containerInfo.firstChild),tt=t,ce=!0,xt=null,n=O_(t,null,o,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(bo(),o===r){t=Gt(e,t,n);break e}je(e,t,o,n)}t=t.child}return t;case 5:return j_(t),e===null&&oa(t),o=t.type,r=t.pendingProps,l=e!==null?e.memoizedProps:null,s=r.children,Ji(o,r)?s=null:l!==null&&Ji(o,l)&&(t.flags|=32),d1(e,t),je(e,t,s,n),t.child;case 6:return e===null&&oa(t),null;case 13:return f1(e,t,n);case 4:return Ua(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=So(t,null,o,n):je(e,t,o,n),t.child;case 11:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:wt(o,r),xd(e,t,o,r,n);case 7:return je(e,t,t.pendingProps,n),t.child;case 8:return je(e,t,t.pendingProps.children,n),t.child;case 12:return je(e,t,t.pendingProps.children,n),t.child;case 10:e:{if(o=t.type._context,r=t.pendingProps,l=t.memoizedProps,s=r.value,ie(Kl,o._currentValue),o._currentValue=s,l!==null)if(St(l.value,s)){if(l.children===r.children&&!Qe.current){t=Gt(e,t,n);break e}}else for(l=t.child,l!==null&&(l.return=t);l!==null;){var i=l.dependencies;if(i!==null){s=l.child;for(var u=i.firstContext;u!==null;){if(u.context===o){if(l.tag===1){u=Qt(-1,n&-n),u.tag=2;var m=l.updateQueue;if(m!==null){m=m.shared;var g=m.pending;g===null?u.next=u:(u.next=g.next,g.next=u),m.pending=u}}l.lanes|=n,u=l.alternate,u!==null&&(u.lanes|=n),ra(l.return,n,t),i.lanes|=n;break}u=u.next}}else if(l.tag===10)s=l.type===t.type?null:l.child;else if(l.tag===18){if(s=l.return,s===null)throw Error(L(341));s.lanes|=n,i=s.alternate,i!==null&&(i.lanes|=n),ra(s,n,t),s=l.sibling}else s=l.child;if(s!==null)s.return=l;else for(s=l;s!==null;){if(s===t){s=null;break}if(l=s.sibling,l!==null){l.return=s.return,s=l;break}s=s.return}l=s}je(e,t,r.children,n),t=t.child}return t;case 9:return r=t.type,o=t.pendingProps.children,wo(t,n),r=mt(r),o=o(r),t.flags|=1,je(e,t,o,n),t.child;case 14:return o=t.type,r=wt(o,t.pendingProps),r=wt(o.type,r),Cd(e,t,o,r,n);case 15:return u1(e,t,t.type,t.pendingProps,n);case 17:return o=t.type,r=t.pendingProps,r=t.elementType===o?r:wt(o,r),$l(e,t),t.tag=1,Ve(o)?(e=!0,Ql(t)):e=!1,wo(t,n),s1(t,o,r),sa(t,o,r,n),ua(null,t,o,!0,e,n);case 19:return m1(e,t,n);case 22:return c1(e,t,n)}throw Error(L(156,t.tag))};function I1(e,t){return o_(e,t)}function Bm(e,t,n,o){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function _t(e,t,n,o){return new Bm(e,t,n,o)}function su(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Om(e){if(typeof e=="function")return su(e)?1:0;if(e!=null){if(e=e.$$typeof,e===Sa)return 11;if(e===La)return 14}return 2}function yn(e,t){var n=e.alternate;return n===null?(n=_t(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&14680064,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n}function Bl(e,t,n,o,r,l){var s=2;if(o=e,typeof e=="function")su(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case ro:return Dn(n.children,r,l,t);case ba:s=8,r|=8;break;case Ii:return e=_t(12,n,t,r|2),e.elementType=Ii,e.lanes=l,e;case Ti:return e=_t(13,n,t,r),e.elementType=Ti,e.lanes=l,e;case Mi:return e=_t(19,n,t,r),e.elementType=Mi,e.lanes=l,e;case jd:return gs(n,r,l,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Dd:s=10;break e;case Ad:s=9;break e;case Sa:s=11;break e;case La:s=14;break e;case rn:s=16,o=null;break e}throw Error(L(130,e==null?e:typeof e,""))}return t=_t(s,n,t,r),t.elementType=e,t.type=o,t.lanes=l,t}function Dn(e,t,n,o){return e=_t(7,e,o,t),e.lanes=n,e}function gs(e,t,n,o){return e=_t(22,e,o,t),e.elementType=jd,e.lanes=n,e.stateNode={isHidden:!1},e}function Ei(e,t,n){return e=_t(6,e,null,t),e.lanes=n,e}function Ni(e,t,n){return t=_t(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function Dm(e,t,n,o,r){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=di(0),this.expirationTimes=di(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=di(0),this.identifierPrefix=o,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function iu(e,t,n,o,r,l,s,i,u){return e=new Dm(e,t,n,i,u),t===1?(t=1,l===!0&&(t|=8)):t=0,l=_t(3,null,null,t),e.current=l,l.stateNode=e,l.memoizedState={element:o,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ha(l),e}function Am(e,t,n){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:oo,key:o==null?null:""+o,children:e,containerInfo:t,implementation:n}}function T1(e){if(!e)return wn;e=e._reactInternals;e:{if(Un(e)!==e||e.tag!==1)throw Error(L(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Ve(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(L(171))}if(e.tag===1){var n=e.type;if(Ve(n))return T_(e,n,t)}return t}function M1(e,t,n,o,r,l,s,i,u){return e=iu(n,o,!0,e,r,l,s,i,u),e.context=T1(null),n=e.current,o=Fe(),r=gn(n),l=Qt(o,r),l.callback=t??null,pn(n,l,r),e.current.lanes=r,Tr(e,r,o),Ze(e,o),e}function ys(e,t,n,o){var r=t.current,l=Fe(),s=gn(r);return n=T1(n),t.context===null?t.context=n:t.pendingContext=n,t=Qt(l,s),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=pn(r,t,s),e!==null&&(bt(e,r,s,l),Il(e,r,s)),s}function ss(e){return e=e.current,e.child?(e.child.tag===5,e.child.stateNode):null}function zd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function au(e,t){zd(e,t),(e=e.alternate)&&zd(e,t)}function jm(){return null}var $1=typeof reportError=="function"?reportError:function(e){console.error(e)};function uu(e){this._internalRoot=e}vs.prototype.render=uu.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(L(409));ys(e,t,null,null)};vs.prototype.unmount=uu.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Yn(function(){ys(null,e,null,null)}),t[Zt]=null}};function vs(e){this._internalRoot=e}vs.prototype.unstable_scheduleHydration=function(e){if(e){var t=c_();e={blockedOn:null,target:e,priority:t};for(var n=0;n<sn.length&&t!==0&&t<sn[n].priority;n++);sn.splice(n,0,e),n===0&&__(e)}};function cu(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function ws(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Bd(){}function Fm(e,t,n,o,r){if(r){if(typeof o=="function"){var l=o;o=function(){var m=ss(s);l.call(m)}}var s=M1(t,o,e,0,null,!1,!1,"",Bd);return e._reactRootContainer=s,e[Zt]=s.current,xr(e.nodeType===8?e.parentNode:e),Yn(),s}for(;r=e.lastChild;)e.removeChild(r);if(typeof o=="function"){var i=o;o=function(){var m=ss(u);i.call(m)}}var u=iu(e,0,!1,null,null,!1,!1,"",Bd);return e._reactRootContainer=u,e[Zt]=u.current,xr(e.nodeType===8?e.parentNode:e),Yn(function(){ys(t,u,n,o)}),u}function ks(e,t,n,o,r){var l=n._reactRootContainer;if(l){var s=l;if(typeof r=="function"){var i=r;r=function(){var u=ss(s);i.call(u)}}ys(t,s,e,r)}else s=Fm(n,t,e,r,o);return ss(s)}a_=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var n=or(t.pendingLanes);n!==0&&(Pa(t,n|1),Ze(t,ye()),(ee&6)===0&&(No=ye()+500,Cn()))}break;case 13:Yn(function(){var o=Kt(e,1);if(o!==null){var r=Fe();bt(o,e,1,r)}}),au(e,1)}};Ia=function(e){if(e.tag===13){var t=Kt(e,134217728);if(t!==null){var n=Fe();bt(t,e,134217728,n)}au(e,134217728)}};u_=function(e){if(e.tag===13){var t=gn(e),n=Kt(e,t);if(n!==null){var o=Fe();bt(n,e,t,o)}au(e,t)}};c_=function(){return ne};d_=function(e,t){var n=ne;try{return ne=e,t()}finally{ne=n}};Wi=function(e,t,n){switch(t){case"input":if(zi(e,n),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<n.length;t++){var o=n[t];if(o!==e&&o.form===e.form){var r=ds(o);if(!r)throw Error(L(90));Wd(o),zi(o,r)}}}break;case"textarea":Hd(e,n);break;case"select":t=n.value,t!=null&&ho(e,!!n.multiple,t,!1)}};Gd=ou;Jd=Yn;var Wm={usingClientEntryPoint:!1,Events:[$r,ao,ds,Zd,Kd,ou]},qo={findFiberByHostInstance:Rn,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Ym={bundleType:qo.bundleType,version:qo.version,rendererPackageName:qo.rendererPackageName,rendererConfig:qo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Jt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=t_(e),e===null?null:e.stateNode},findFiberByHostInstance:qo.findFiberByHostInstance||jm,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(er=__REACT_DEVTOOLS_GLOBAL_HOOK__,!er.isDisabled&&er.supportsFiber))try{is=er.inject(Ym),Rt=er}catch{}var er;rt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Wm;rt.createPortal=function(e,t){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!cu(t))throw Error(L(200));return Am(e,t,null,n)};rt.createRoot=function(e,t){if(!cu(e))throw Error(L(299));var n=!1,o="",r=$1;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(r=t.onRecoverableError)),t=iu(e,1,!1,null,null,n,!1,o,r),e[Zt]=t.current,xr(e.nodeType===8?e.parentNode:e),new uu(t)};rt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(L(188)):(e=Object.keys(e).join(","),Error(L(268,e)));return e=t_(t),e=e===null?null:e.stateNode,e};rt.flushSync=function(e){return Yn(e)};rt.hydrate=function(e,t,n){if(!ws(t))throw Error(L(200));return ks(null,e,t,!0,n)};rt.hydrateRoot=function(e,t,n){if(!cu(e))throw Error(L(405));var o=n!=null&&n.hydratedSources||null,r=!1,l="",s=$1;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(l=n.identifierPrefix),n.onRecoverableError!==void 0&&(s=n.onRecoverableError)),t=M1(t,null,e,1,n??null,r,!1,l,s),e[Zt]=t.current,xr(e),o)for(e=0;e<o.length;e++)n=o[e],r=n._getVersion,r=r(n._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[n,r]:t.mutableSourceEagerHydrationData.push(n,r);return new vs(t)};rt.render=function(e,t,n){if(!ws(t))throw Error(L(200));return ks(null,e,t,!1,n)};rt.unmountComponentAtNode=function(e){if(!ws(e))throw Error(L(40));return e._reactRootContainer?(Yn(function(){ks(null,null,e,!1,function(){e._reactRootContainer=null,e[Zt]=null})}),!0):!1};rt.unstable_batchedUpdates=ou;rt.unstable_renderSubtreeIntoContainer=function(e,t,n,o){if(!ws(n))throw Error(L(200));if(e==null||e._reactInternals===void 0)throw Error(L(38));return ks(e,t,n,!1,o)};rt.version="18.3.1-next-f1338f8080-20240426"});var du=Wt((Vp,B1)=>{"use strict";function z1(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(z1)}catch(e){console.error(e)}}z1(),B1.exports=R1()});var D1=Wt(_u=>{"use strict";var O1=du();_u.createRoot=O1.createRoot,_u.hydrateRoot=O1.hydrateRoot;var Zp});var j1=Wt(xs=>{"use strict";var Hm=eo(),Um=Symbol.for("react.element"),Xm=Symbol.for("react.fragment"),Qm=Object.prototype.hasOwnProperty,Vm=Hm.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Zm={key:!0,ref:!0,__self:!0,__source:!0};function A1(e,t,n){var o,r={},l=null,s=null;n!==void 0&&(l=""+n),t.key!==void 0&&(l=""+t.key),t.ref!==void 0&&(s=t.ref);for(o in t)Qm.call(t,o)&&!Zm.hasOwnProperty(o)&&(r[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps,t)r[o]===void 0&&(r[o]=t[o]);return{$$typeof:Um,type:e,key:l,ref:s,props:r,_owner:Vm.current}}xs.Fragment=Xm;xs.jsx=A1;xs.jsxs=A1});var Cs=Wt((Jp,F1)=>{"use strict";F1.exports=j1()});var nf=tn(eo()),of=tn(D1());var x=tn(eo(),1),wu=tn(du(),1),ve=tn(eo(),1),E=tn(Cs(),1),de=tn(Cs(),1),f=tn(Cs(),1),Km=`svg[fill=none] {
  fill: none !important;
}

@keyframes styles-module__popupEnter___AuQDN {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
@keyframes styles-module__popupExit___JJKQX {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
}
@keyframes styles-module__shake___jdbWe {
  0%, 100% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(0);
  }
  20% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);
  }
  40% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);
  }
  60% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);
  }
  80% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);
  }
}
.styles-module__popup___IhzrD {
  position: fixed;
  transform: translateX(-50%);
  width: 280px;
  padding: 0.75rem 1rem 14px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  cursor: default;
  z-index: 100001;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  will-change: transform, opacity;
  opacity: 0;
}
.styles-module__popup___IhzrD.styles-module__enter___L7U7N {
  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
.styles-module__popup___IhzrD.styles-module__exit___5eGjE {
  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {
  animation: styles-module__shake___jdbWe 0.25s ease-out;
}

.styles-module__header___wWsSi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5625rem;
}

.styles-module__element___fTV2z {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.styles-module__headerToggle___WpW0b {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {
  flex: 1;
}

.styles-module__chevron___ZZJlR {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {
  transform: rotate(90deg);
}

.styles-module__stylesWrapper___pnHgy {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {
  grid-template-rows: 1fr;
}

.styles-module__stylesInner___YYZe2 {
  overflow: hidden;
}

.styles-module__stylesBlock___VfQKn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
}

.styles-module__styleLine___1YQiD {
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.styles-module__styleProperty___84L1i {
  color: #c792ea;
}

.styles-module__styleValue___q51-h {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__timestamp___Dtpsv {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.styles-module__quote___mcMmQ {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  line-height: 1.45;
}

.styles-module__textarea___jrSae {
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
}
.styles-module__textarea___jrSae:focus {
  border-color: #3c82f7;
}
.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {
  border-color: #34c759;
}
.styles-module__textarea___jrSae::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__textarea___jrSae::-webkit-scrollbar {
  width: 6px;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-track {
  background: transparent;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.styles-module__actions___D6x3f {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.styles-module__cancel___hRjnL,
.styles-module__submit___K-mIR {
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.styles-module__cancel___hRjnL {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__cancel___hRjnL:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.styles-module__submit___K-mIR {
  color: white;
}
.styles-module__submit___K-mIR:hover:not(:disabled) {
  filter: brightness(0.9);
}
.styles-module__submit___K-mIR:disabled {
  cursor: not-allowed;
}

.styles-module__deleteWrapper___oSjdo {
  margin-right: auto;
}

.styles-module__deleteButton___4VuAE {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.styles-module__deleteButton___4VuAE:hover {
  background: rgba(255, 59, 48, 0.25);
  color: #ff3b30;
}
.styles-module__deleteButton___4VuAE:active {
  transform: scale(0.92);
}

.styles-module__light___6AaSQ.styles-module__popup___IhzrD {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___6AaSQ .styles-module__element___fTV2z {
  color: rgba(0, 0, 0, 0.6);
}
.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {
  background: rgba(0, 0, 0, 0.03);
}
.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {
  color: #7c3aed;
}
.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.04);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}`,Gm={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",popupEnter:"styles-module__popupEnter___AuQDN",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",popupExit:"styles-module__popupExit___JJKQX",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",green:"styles-module__green___99l3h",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-annotation-popup-css-styles",e.textContent=Km,document.head.appendChild(e))}var le=Gm,Jm=({size:e=16})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 16 16",fill:"none",children:(0,E.jsx)("path",{d:"M4 4l8 8M12 4l-8 8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})}),qm=({size:e=16})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 16 16",fill:"none",children:(0,E.jsx)("path",{d:"M8 3v10M3 8h10",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})});var ep=({size:e=24,style:t={}})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",style:t,children:[(0,E.jsxs)("g",{clipPath:"url(#clip0_list_sparkle)",children:[(0,E.jsx)("path",{d:"M11.5 12L5.5 12",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M18.5 6.75L5.5 6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M9.25 17.25L5.5 17.25",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinejoin:"round"})]}),(0,E.jsx)("defs",{children:(0,E.jsx)("clipPath",{id:"clip0_list_sparkle",children:(0,E.jsx)("rect",{width:"24",height:"24",fill:"white"})})})]}),zr=({size:e=20})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 20 20",fill:"none",children:[(0,E.jsx)("circle",{cx:"10",cy:"10.5",r:"5.25",stroke:"currentColor",strokeWidth:"1.25"}),(0,E.jsx)("path",{d:"M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("circle",{cx:"10",cy:"13",r:"0.75",fill:"currentColor"})]}),W1=({size:e=14})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 14 14",fill:"none",children:[(0,E.jsx)("style",{children:`
      @keyframes checkDraw {
        0% {
          stroke-dashoffset: 12;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes checkBounce {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        50% {
          transform: scale(1.12);
          opacity: 1;
        }
        75% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
      .check-path-animated {
        stroke-dasharray: 12;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: checkDraw 0.18s ease-out, checkBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    `}),(0,E.jsx)("path",{className:"check-path-animated",d:"M3.9375 7L6.125 9.1875L10.5 4.8125",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]});var tp=({size:e=24,copied:t=!1})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:[(0,E.jsx)("style",{children:`
      .copy-icon, .check-icon {
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
    `}),(0,E.jsxs)("g",{className:"copy-icon",style:{opacity:t?0:1,transform:t?"scale(0.8)":"scale(1)",transformOrigin:"center"},children:[(0,E.jsx)("path",{d:"M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",stroke:"currentColor",strokeWidth:"1.5"}),(0,E.jsx)("path",{d:"M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]}),(0,E.jsxs)("g",{className:"check-icon",style:{opacity:t?1:0,transform:t?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[(0,E.jsx)("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]})]}),np=({size:e=24,state:t="idle"})=>{let n=t==="idle",o=t==="sent",r=t==="failed";return(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:[(0,E.jsx)("style",{children:`
        .send-arrow-icon, .send-check-icon, .send-error-icon {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
      `}),(0,E.jsx)("g",{className:"send-arrow-icon",style:{opacity:n?1:t==="sending"?.5:0,transform:n?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:(0,E.jsx)("path",{d:"M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,E.jsxs)("g",{className:"send-check-icon",style:{opacity:o?1:0,transform:o?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[(0,E.jsx)("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M15 10L11 14.25L9.25 12.25",stroke:"#22c55e",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),(0,E.jsxs)("g",{className:"send-error-icon",style:{opacity:r?1:0,transform:r?"scale(1)":"scale(0.8)",transformOrigin:"center"},children:[(0,E.jsx)("path",{d:"M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M12 8V12",stroke:"#ef4444",strokeWidth:"1.5",strokeLinecap:"round"}),(0,E.jsx)("circle",{cx:"12",cy:"15",r:"0.5",fill:"#ef4444",stroke:"#ef4444",strokeWidth:"1"})]})]})};var op=({size:e=24,isOpen:t=!0})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:[(0,E.jsx)("style",{children:`
      .eye-open, .eye-closed {
        transition: opacity 0.2s ease;
      }
    `}),(0,E.jsxs)("g",{className:"eye-open",style:{opacity:t?1:0},children:[(0,E.jsx)("path",{d:"M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),(0,E.jsxs)("g",{className:"eye-closed",style:{opacity:t?0:1},children:[(0,E.jsx)("path",{d:"M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",fill:"currentColor"}),(0,E.jsx)("path",{d:"M5 19L19 5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})]}),rp=({size:e=24,isPaused:t=!1})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:[(0,E.jsx)("style",{children:`
      .pause-bar, .play-triangle {
        transition: opacity 0.15s ease;
      }
    `}),(0,E.jsx)("path",{className:"pause-bar",d:"M8 6L8 18",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:t?0:1}}),(0,E.jsx)("path",{className:"pause-bar",d:"M16 18L16 6",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",style:{opacity:t?0:1}}),(0,E.jsx)("path",{className:"play-triangle",d:"M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",stroke:"currentColor",strokeWidth:"1.5",style:{opacity:t?1:0}})]});var lp=({size:e=16})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:[(0,E.jsx)("path",{d:"M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("circle",{cx:"12",cy:"12",r:"2.5",stroke:"currentColor",strokeWidth:"1.5"})]});var sp=({size:e=16})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:(0,E.jsx)("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})});var fu=({size:e=16})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:[(0,E.jsxs)("g",{clipPath:"url(#clip0_2_53)",children:[(0,E.jsx)("path",{d:"M16.25 16.25L7.75 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M7.75 16.25L16.25 7.75",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}),(0,E.jsx)("defs",{children:(0,E.jsx)("clipPath",{id:"clip0_2_53",children:(0,E.jsx)("rect",{width:"24",height:"24",fill:"white"})})})]}),ip=({size:e=24})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",children:(0,E.jsx)("path",{d:"M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",fill:"currentColor"})}),ap=({size:e=16})=>(0,E.jsxs)("svg",{width:e,height:e,viewBox:"0 0 20 20",fill:"none",children:[(0,E.jsx)("path",{d:"M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M10 3.9585V5.05698",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M10 14.9429V16.0414",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M5.7269 5.72656L6.50682 6.50649",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M13.4932 13.4932L14.2731 14.2731",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M3.95834 10H5.05683",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M14.9432 10H16.0417",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M5.7269 14.2731L6.50682 13.4932",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"}),(0,E.jsx)("path",{d:"M13.4932 6.50649L14.2731 5.72656",stroke:"currentColor",strokeWidth:"1.25",strokeLinecap:"round",strokeLinejoin:"round"})]}),up=({size:e=16})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 20 20",fill:"none",children:(0,E.jsx)("path",{d:"M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",stroke:"currentColor",strokeWidth:"1.13793",strokeLinecap:"round",strokeLinejoin:"round"})}),Y1=({size:e=16})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,E.jsx)("path",{d:"M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",stroke:"currentColor",strokeWidth:"0.9",strokeLinecap:"round",strokeLinejoin:"round"})}),cp=({size:e=24})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,E.jsx)("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),dp=({size:e=16})=>(0,E.jsx)("svg",{width:e,height:e,viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,E.jsx)("path",{d:"M8.5 3.5L4 8L8.5 12.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})});var H1=(0,ve.forwardRef)(function({element:t,timestamp:n,selectedText:o,placeholder:r="What should change?",initialValue:l="",submitLabel:s="Add",onSubmit:i,onCancel:u,onDelete:m,style:g,accentColor:w="#3c82f7",isExiting:k=!1,lightMode:N=!1,computedStyles:C},I){let[z,p]=(0,ve.useState)(l),[_,h]=(0,ve.useState)(!1),[S,$]=(0,ve.useState)("initial"),[M,A]=(0,ve.useState)(!1),[B,oe]=(0,ve.useState)(!1),V=(0,ve.useRef)(null),lt=(0,ve.useRef)(null);(0,ve.useEffect)(()=>{k&&S!=="exit"&&$("exit")},[k,S]),(0,ve.useEffect)(()=>{requestAnimationFrame(()=>{$("enter")});let we=setTimeout(()=>{$("entered")},200),Yr=setTimeout(()=>{let Lt=V.current;Lt&&(Lt.focus(),Lt.selectionStart=Lt.selectionEnd=Lt.value.length,Lt.scrollTop=Lt.scrollHeight)},50);return()=>{clearTimeout(we),clearTimeout(Yr)}},[]);let O=(0,ve.useCallback)(()=>{h(!0),setTimeout(()=>{h(!1),V.current?.focus()},250)},[]);(0,ve.useImperativeHandle)(I,()=>({shake:O}),[O]);let st=(0,ve.useCallback)(()=>{$("exit"),setTimeout(()=>{u()},150)},[u]),Sn=(0,ve.useCallback)(()=>{z.trim()&&i(z.trim())},[z,i]),Wr=(0,ve.useCallback)(we=>{we.nativeEvent.isComposing||(we.key==="Enter"&&!we.shiftKey&&(we.preventDefault(),Sn()),we.key==="Escape"&&st())},[Sn,st]),ht=[le.popup,N?le.light:"",S==="enter"?le.enter:"",S==="entered"?le.entered:"",S==="exit"?le.exit:"",_?le.shake:""].filter(Boolean).join(" ");return(0,de.jsxs)("div",{ref:lt,className:ht,"data-annotation-popup":!0,style:g,onClick:we=>we.stopPropagation(),children:[(0,de.jsxs)("div",{className:le.header,children:[C&&Object.keys(C).length>0?(0,de.jsxs)("button",{className:le.headerToggle,onClick:()=>{let we=B;oe(!B),we&&setTimeout(()=>V.current?.focus(),0)},type:"button",children:[(0,de.jsx)("svg",{className:`${le.chevron} ${B?le.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,de.jsx)("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),(0,de.jsx)("span",{className:le.element,children:t})]}):(0,de.jsx)("span",{className:le.element,children:t}),n&&(0,de.jsx)("span",{className:le.timestamp,children:n})]}),C&&Object.keys(C).length>0&&(0,de.jsx)("div",{className:`${le.stylesWrapper} ${B?le.expanded:""}`,children:(0,de.jsx)("div",{className:le.stylesInner,children:(0,de.jsx)("div",{className:le.stylesBlock,children:Object.entries(C).map(([we,Yr])=>(0,de.jsxs)("div",{className:le.styleLine,children:[(0,de.jsx)("span",{className:le.styleProperty,children:we.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",(0,de.jsx)("span",{className:le.styleValue,children:Yr}),";"]},we))})})}),o&&(0,de.jsxs)("div",{className:le.quote,children:["\u201C",o.slice(0,80),o.length>80?"...":"","\u201D"]}),(0,de.jsx)("textarea",{ref:V,className:le.textarea,style:{borderColor:M?w:void 0},placeholder:r,value:z,onChange:we=>p(we.target.value),onFocus:()=>A(!0),onBlur:()=>A(!1),rows:2,onKeyDown:Wr}),(0,de.jsxs)("div",{className:le.actions,children:[m&&(0,de.jsx)("div",{className:le.deleteWrapper,children:(0,de.jsx)("button",{className:le.deleteButton,onClick:m,type:"button",children:(0,de.jsx)(cp,{size:22})})}),(0,de.jsx)("button",{className:le.cancel,onClick:st,children:"Cancel"}),(0,de.jsx)("button",{className:le.submit,style:{backgroundColor:w,opacity:z.trim()?1:.4},onClick:Sn,disabled:!z.trim(),children:s})]})]})});function $o(e){if(e.parentElement)return e.parentElement;let t=e.getRootNode();return t instanceof ShadowRoot?t.host:null}function Ke(e,t){let n=e;for(;n;){if(n.matches(t))return n;n=$o(n)}return null}function _p(e,t=4){let n=[],o=e,r=0;for(;o&&r<t;){let l=o.tagName.toLowerCase();if(l==="html"||l==="body")break;let s=l;if(o.id)s=`#${o.id}`;else if(o.className&&typeof o.className=="string"){let u=o.className.split(/\s+/).find(m=>m.length>2&&!m.match(/^[a-z]{1,2}$/)&&!m.match(/[A-Z0-9]{5,}/));u&&(s=`.${u.split("_")[0]}`)}let i=$o(o);!o.parentElement&&i&&(s=`\u27E8shadow\u27E9 ${s}`),n.unshift(s),o=i,r++}return n.join(" > ")}function Is(e){let t=_p(e);if(e.dataset.element)return{name:e.dataset.element,path:t};let n=e.tagName.toLowerCase();if(["path","circle","rect","line","g"].includes(n)){let o=Ke(e,"svg");if(o){let r=$o(o);if(r instanceof HTMLElement)return{name:`graphic in ${Is(r).name}`,path:t}}return{name:"graphic element",path:t}}if(n==="svg"){let o=$o(e);if(o?.tagName.toLowerCase()==="button"){let r=o.textContent?.trim();return{name:r?`icon in "${r}" button`:"button icon",path:t}}return{name:"icon",path:t}}if(n==="button"){let o=e.textContent?.trim(),r=e.getAttribute("aria-label");return r?{name:`button [${r}]`,path:t}:{name:o?`button "${o.slice(0,25)}"`:"button",path:t}}if(n==="a"){let o=e.textContent?.trim(),r=e.getAttribute("href");return o?{name:`link "${o.slice(0,25)}"`,path:t}:r?{name:`link to ${r.slice(0,30)}`,path:t}:{name:"link",path:t}}if(n==="input"){let o=e.getAttribute("type")||"text",r=e.getAttribute("placeholder"),l=e.getAttribute("name");return r?{name:`input "${r}"`,path:t}:l?{name:`input [${l}]`,path:t}:{name:`${o} input`,path:t}}if(["h1","h2","h3","h4","h5","h6"].includes(n)){let o=e.textContent?.trim();return{name:o?`${n} "${o.slice(0,35)}"`:n,path:t}}if(n==="p"){let o=e.textContent?.trim();return o?{name:`paragraph: "${o.slice(0,40)}${o.length>40?"...":""}"`,path:t}:{name:"paragraph",path:t}}if(n==="span"||n==="label"){let o=e.textContent?.trim();return o&&o.length<40?{name:`"${o}"`,path:t}:{name:n,path:t}}if(n==="li"){let o=e.textContent?.trim();return o&&o.length<40?{name:`list item: "${o.slice(0,35)}"`,path:t}:{name:"list item",path:t}}if(n==="blockquote")return{name:"blockquote",path:t};if(n==="code"){let o=e.textContent?.trim();return o&&o.length<30?{name:`code: \`${o}\``,path:t}:{name:"code",path:t}}if(n==="pre")return{name:"code block",path:t};if(n==="img"){let o=e.getAttribute("alt");return{name:o?`image "${o.slice(0,30)}"`:"image",path:t}}if(n==="video")return{name:"video",path:t};if(["div","section","article","nav","header","footer","aside","main"].includes(n)){let o=e.className,r=e.getAttribute("role"),l=e.getAttribute("aria-label");if(l)return{name:`${n} [${l}]`,path:t};if(r)return{name:`${r}`,path:t};if(typeof o=="string"&&o){let s=o.split(/[\s_-]+/).map(i=>i.replace(/[A-Z0-9]{5,}.*$/,"")).filter(i=>i.length>2&&!/^[a-z]{1,2}$/.test(i)).slice(0,2);if(s.length>0)return{name:s.join(" "),path:t}}return{name:n==="div"?"container":n,path:t}}return{name:n,path:t}}function Br(e){let t=[],n=e.textContent?.trim();n&&n.length<100&&t.push(n);let o=e.previousElementSibling;if(o){let l=o.textContent?.trim();l&&l.length<50&&t.unshift(`[before: "${l.slice(0,40)}"]`)}let r=e.nextElementSibling;if(r){let l=r.textContent?.trim();l&&l.length<50&&t.push(`[after: "${l.slice(0,40)}"]`)}return t.join(" ")}function bs(e){let t=$o(e);if(!t)return"";let r=(e.getRootNode()instanceof ShadowRoot&&e.parentElement?Array.from(e.parentElement.children):Array.from(t.children)).filter(g=>g!==e&&g instanceof HTMLElement);if(r.length===0)return"";let l=r.slice(0,4).map(g=>{let w=g.tagName.toLowerCase(),k=g.className,N="";if(typeof k=="string"&&k){let C=k.split(/\s+/).map(I=>I.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(I=>I.length>2&&!/^[a-z]{1,2}$/.test(I));C&&(N=`.${C}`)}if(w==="button"||w==="a"){let C=g.textContent?.trim().slice(0,15);if(C)return`${w}${N} "${C}"`}return`${w}${N}`}),i=t.tagName.toLowerCase();if(typeof t.className=="string"&&t.className){let g=t.className.split(/\s+/).map(w=>w.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(w=>w.length>2&&!/^[a-z]{1,2}$/.test(w));g&&(i=`.${g}`)}let u=t.children.length,m=u>l.length+1?` (${u} total in ${i})`:"";return l.join(", ")+m}function Or(e){let t=e.className;return typeof t!="string"||!t?"":t.split(/\s+/).filter(o=>o.length>0).map(o=>{let r=o.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);return r?r[1]:o}).filter((o,r,l)=>l.indexOf(o)===r).join(", ")}var J1=new Set(["none","normal","auto","0px","rgba(0, 0, 0, 0)","transparent","static","visible"]),fp=new Set(["p","span","h1","h2","h3","h4","h5","h6","label","li","td","th","blockquote","figcaption","caption","legend","dt","dd","pre","code","em","strong","b","i","a","time","cite","q"]),mp=new Set(["input","textarea","select"]),pp=new Set(["img","video","canvas","svg"]),hp=new Set(["div","section","article","nav","header","footer","aside","main","ul","ol","form","fieldset"]);function Ss(e){if(typeof window>"u")return{};let t=window.getComputedStyle(e),n={},o=e.tagName.toLowerCase(),r;fp.has(o)?r=["color","fontSize","fontWeight","fontFamily","lineHeight"]:o==="button"||o==="a"&&e.getAttribute("role")==="button"?r=["backgroundColor","color","padding","borderRadius","fontSize"]:mp.has(o)?r=["backgroundColor","color","padding","borderRadius","fontSize"]:pp.has(o)?r=["width","height","objectFit","borderRadius"]:hp.has(o)?r=["display","padding","margin","gap","backgroundColor"]:r=["color","fontSize","margin","padding","backgroundColor"];for(let l of r){let s=l.replace(/([A-Z])/g,"-$1").toLowerCase(),i=t.getPropertyValue(s);i&&!J1.has(i)&&(n[l]=i)}return n}var gp=["color","backgroundColor","borderColor","fontSize","fontWeight","fontFamily","lineHeight","letterSpacing","textAlign","width","height","padding","margin","border","borderRadius","display","position","top","right","bottom","left","zIndex","flexDirection","justifyContent","alignItems","gap","opacity","visibility","overflow","boxShadow","transform"];function Ls(e){if(typeof window>"u")return"";let t=window.getComputedStyle(e),n=[];for(let o of gp){let r=o.replace(/([A-Z])/g,"-$1").toLowerCase(),l=t.getPropertyValue(r);l&&!J1.has(l)&&n.push(`${r}: ${l}`)}return n.join("; ")}function yp(e){if(!e)return;let t={},n=e.split(";").map(o=>o.trim()).filter(Boolean);for(let o of n){let r=o.indexOf(":");if(r>0){let l=o.slice(0,r).trim(),s=o.slice(r+1).trim();l&&s&&(t[l]=s)}}return Object.keys(t).length>0?t:void 0}function Es(e){let t=[],n=e.getAttribute("role"),o=e.getAttribute("aria-label"),r=e.getAttribute("aria-describedby"),l=e.getAttribute("tabindex"),s=e.getAttribute("aria-hidden");return n&&t.push(`role="${n}"`),o&&t.push(`aria-label="${o}"`),r&&t.push(`aria-describedby="${r}"`),l&&t.push(`tabindex=${l}`),s==="true"&&t.push("aria-hidden"),e.matches("a, button, input, select, textarea, [tabindex]")&&t.push("focusable"),t.join(", ")}function Ns(e){let t=[],n=e;for(;n&&n.tagName.toLowerCase()!=="html";){let o=n.tagName.toLowerCase(),r=o;if(n.id)r=`${o}#${n.id}`;else if(n.className&&typeof n.className=="string"){let s=n.className.split(/\s+/).map(i=>i.replace(/[_][a-zA-Z0-9]{5,}.*$/,"")).find(i=>i.length>2);s&&(r=`${o}.${s}`)}let l=$o(n);!n.parentElement&&l&&(r=`\u27E8shadow\u27E9 ${r}`),t.unshift(r),n=l}return t.join(" > ")}var ku="feedback-annotations-",q1=7;function Ts(e){return`${ku}${e}`}function mu(e){if(typeof window>"u")return[];try{let t=localStorage.getItem(Ts(e));if(!t)return[];let n=JSON.parse(t),o=Date.now()-q1*24*60*60*1e3;return n.filter(r=>!r.timestamp||r.timestamp>o)}catch{return[]}}function ef(e,t){if(!(typeof window>"u"))try{localStorage.setItem(Ts(e),JSON.stringify(t))}catch{}}function vp(){let e=new Map;if(typeof window>"u")return e;try{let t=Date.now()-q1*24*60*60*1e3;for(let n=0;n<localStorage.length;n++){let o=localStorage.key(n);if(o?.startsWith(ku)){let r=o.slice(ku.length),l=localStorage.getItem(o);if(l){let i=JSON.parse(l).filter(u=>!u.timestamp||u.timestamp>t);i.length>0&&e.set(r,i)}}}}catch{}return e}function Dr(e,t,n){let o=t.map(r=>({...r,_syncedTo:n}));ef(e,o)}var wp="agentation-session-";function xu(e){return`${wp}${e}`}function kp(e){if(typeof window>"u")return null;try{return localStorage.getItem(xu(e))}catch{return null}}function pu(e,t){if(!(typeof window>"u"))try{localStorage.setItem(xu(e),t)}catch{}}function xp(e){if(!(typeof window>"u"))try{localStorage.removeItem(xu(e))}catch{}}async function hu(e,t){let n=await fetch(`${e}/sessions`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:t})});if(!n.ok)throw new Error(`Failed to create session: ${n.status}`);return n.json()}async function U1(e,t){let n=await fetch(`${e}/sessions/${t}`);if(!n.ok)throw new Error(`Failed to get session: ${n.status}`);return n.json()}async function Ps(e,t,n){let o=await fetch(`${e}/sessions/${t}/annotations`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!o.ok)throw new Error(`Failed to sync annotation: ${o.status}`);return o.json()}async function Cp(e,t,n){let o=await fetch(`${e}/annotations/${t}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!o.ok)throw new Error(`Failed to update annotation: ${o.status}`);return o.json()}async function X1(e,t){let n=await fetch(`${e}/annotations/${t}`,{method:"DELETE"});if(!n.ok)throw new Error(`Failed to delete annotation: ${n.status}`)}var te={FunctionComponent:0,ClassComponent:1,IndeterminateComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,Fragment:7,Mode:8,ContextConsumer:9,ContextProvider:10,ForwardRef:11,Profiler:12,SuspenseComponent:13,MemoComponent:14,SimpleMemoComponent:15,LazyComponent:16,IncompleteClassComponent:17,DehydratedFragment:18,SuspenseListComponent:19,ScopeComponent:21,OffscreenComponent:22,LegacyHiddenComponent:23,CacheComponent:24,TracingMarkerComponent:25,HostHoistable:26,HostSingleton:27,IncompleteFunctionComponent:28,Throw:29,ViewTransitionComponent:30,ActivityComponent:31},Q1=new Set(["Component","PureComponent","Fragment","Suspense","Profiler","StrictMode","Routes","Route","Outlet","Root","ErrorBoundaryHandler","HotReload","Hot"]),V1=[/Boundary$/,/BoundaryHandler$/,/Provider$/,/Consumer$/,/^(Inner|Outer)/,/Router$/,/^Client(Page|Segment|Root)/,/^Server(Root|Component|Render)/,/^RSC/,/Context$/,/^Hot(Reload)?$/,/^(Dev|React)(Overlay|Tools|Root)/,/Overlay$/,/Handler$/,/^With[A-Z]/,/Wrapper$/,/^Root$/],bp=[/Page$/,/View$/,/Screen$/,/Section$/,/Card$/,/List$/,/Item$/,/Form$/,/Modal$/,/Dialog$/,/Button$/,/Nav$/,/Header$/,/Footer$/,/Layout$/,/Panel$/,/Tab$/,/Menu$/];function Sp(e){let t=e?.mode??"filtered",n=Q1;if(e?.skipExact){let o=e.skipExact instanceof Set?e.skipExact:new Set(e.skipExact);n=new Set([...Q1,...o])}return{maxComponents:e?.maxComponents??6,maxDepth:e?.maxDepth??30,mode:t,skipExact:n,skipPatterns:e?.skipPatterns?[...V1,...e.skipPatterns]:V1,userPatterns:e?.userPatterns??bp,filter:e?.filter}}function Lp(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/([A-Z])([A-Z][a-z])/g,"$1-$2").toLowerCase()}function Ep(e,t=10){let n=new Set,o=e,r=0;for(;o&&r<t;)o.className&&typeof o.className=="string"&&o.className.split(/\s+/).forEach(l=>{if(l.length>1){let s=l.replace(/[_][a-zA-Z0-9]{5,}.*$/,"").toLowerCase();s.length>1&&n.add(s)}}),o=o.parentElement,r++;return n}function Np(e,t){let n=Lp(e);for(let o of t){if(o===n)return!0;let r=n.split("-").filter(s=>s.length>2),l=o.split("-").filter(s=>s.length>2);for(let s of r)for(let i of l)if(s===i||s.includes(i)||i.includes(s))return!0}return!1}function Pp(e,t,n,o){if(n.filter)return n.filter(e,t);switch(n.mode){case"all":return!0;case"filtered":return!(n.skipExact.has(e)||n.skipPatterns.some(r=>r.test(e)));case"smart":return n.skipExact.has(e)||n.skipPatterns.some(r=>r.test(e))?!1:!!(o&&Np(e,o)||n.userPatterns.some(r=>r.test(e)));default:return!0}}var To=null,Ip=new WeakMap;function gu(e){return Object.keys(e).some(t=>t.startsWith("__reactFiber$")||t.startsWith("__reactInternalInstance$")||t.startsWith("__reactProps$"))}function Tp(){if(To!==null)return To;if(typeof document>"u")return!1;if(document.body&&gu(document.body))return To=!0,!0;let e=["#root","#app","#__next","[data-reactroot]"];for(let t of e){let n=document.querySelector(t);if(n&&gu(n))return To=!0,!0}if(document.body){for(let t of document.body.children)if(gu(t))return To=!0,!0}return To=!1,!1}var Ar={map:Ip};function Mp(e){return Object.keys(e).find(n=>n.startsWith("__reactFiber$")||n.startsWith("__reactInternalInstance$"))||null}function $p(e){let t=Mp(e);return t?e[t]:null}function Xn(e){return e?e.displayName?e.displayName:e.name?e.name:null:null}function Rp(e){let{tag:t,type:n,elementType:o}=e;if(t===te.HostComponent||t===te.HostText||t===te.HostHoistable||t===te.HostSingleton||t===te.Fragment||t===te.Mode||t===te.Profiler||t===te.DehydratedFragment||t===te.HostRoot||t===te.HostPortal||t===te.ScopeComponent||t===te.OffscreenComponent||t===te.LegacyHiddenComponent||t===te.CacheComponent||t===te.TracingMarkerComponent||t===te.Throw||t===te.ViewTransitionComponent||t===te.ActivityComponent)return null;if(t===te.ForwardRef){let r=o;if(r?.render){let l=Xn(r.render);if(l)return l}return r?.displayName?r.displayName:Xn(n)}if(t===te.MemoComponent||t===te.SimpleMemoComponent){let r=o;if(r?.type){let l=Xn(r.type);if(l)return l}return r?.displayName?r.displayName:Xn(n)}if(t===te.ContextProvider){let r=n;return r?._context?.displayName?`${r._context.displayName}.Provider`:null}if(t===te.ContextConsumer){let r=n;return r?.displayName?`${r.displayName}.Consumer`:null}if(t===te.LazyComponent){let r=o;return r?._status===1&&r._result?Xn(r._result):null}return t===te.SuspenseComponent||t===te.SuspenseListComponent?null:t===te.IncompleteClassComponent||t===te.IncompleteFunctionComponent||t===te.FunctionComponent||t===te.ClassComponent||t===te.IndeterminateComponent?Xn(n):null}function zp(e){return e.length<=2||e.length<=3&&e===e.toLowerCase()}function Bp(e,t){let n=Sp(t),o=n.mode==="all";if(o){let u=Ar.map.get(e);if(u!==void 0)return u}if(!Tp()){let u={path:null,components:[]};return o&&Ar.map.set(e,u),u}let r=n.mode==="smart"?Ep(e):void 0,l=[];try{let u=$p(e),m=0;for(;u&&m<n.maxDepth&&l.length<n.maxComponents;){let g=Rp(u);g&&!zp(g)&&Pp(g,m,n,r)&&l.push(g),u=u.return,m++}}catch{let u={path:null,components:[]};return o&&Ar.map.set(e,u),u}if(l.length===0){let u={path:null,components:[]};return o&&Ar.map.set(e,u),u}let i={path:l.slice().reverse().map(u=>`<${u}>`).join(" "),components:l};return o&&Ar.map.set(e,i),i}var Op=`svg[fill=none] {
  fill: none !important;
}

@keyframes styles-module__toolbarEnter___u8RRu {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes styles-module__badgeEnter___mVQLj {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleIn___c-r1K {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleOut___Wctwz {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@keyframes styles-module__slideUp___kgD36 {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__slideDown___zcdje {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
}
@keyframes styles-module__markerIn___5FaAP {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes styles-module__markerOut___GU5jX {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes styles-module__fadeIn___b9qmf {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__fadeOut___6Ut6- {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__tooltipIn___0N31w {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(2px) scale(0.891);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.909);
  }
}
@keyframes styles-module__hoverHighlightIn___6WYHY {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__hoverTooltipIn___FYGQx {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__settingsPanelIn___MGfO8 {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}
@keyframes styles-module__settingsPanelOut___Zfymi {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(5px);
  }
}
.styles-module__toolbar___wNsdK {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 297px;
  z-index: 100000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
  transition: left 0s, top 0s, right 0s, bottom 0s;
}

.styles-module__toolbarContainer___dIhma {
  user-select: none;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  cursor: grab;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toolbarContainer___dIhma.styles-module__dragging___xrolZ {
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: grabbing;
}
.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {
  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  padding: 0;
  cursor: pointer;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {
  margin-top: -1px;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #2a2a2a;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {
  transform: scale(0.95);
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {
  height: 44px;
  border-radius: 1.5rem;
  padding: 0.375rem;
  width: 257px;
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {
  width: 297px;
}

.styles-module__toggleContent___0yfyP {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {
  opacity: 0;
  pointer-events: none;
}

.styles-module__controlsContent___9GJWU {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}
.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.4);
}

.styles-module__badge___2XsgF {
  position: absolute;
  top: -13px;
  right: -13px;
  user-select: none;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #3c82f7;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: scale(1);
}
.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {
  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;
}

.styles-module__controlButton___8Q0jc {
  position: relative;
  cursor: pointer !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;
}
.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.styles-module__controlButton___8Q0jc:active:not(:disabled) {
  transform: scale(0.92);
}
.styles-module__controlButton___8Q0jc:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.styles-module__controlButton___8Q0jc[data-active=true] {
  color: #3c82f7;
  background: rgba(60, 130, 247, 0.25);
}
.styles-module__controlButton___8Q0jc[data-error=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.25);
}
.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background: rgba(255, 59, 48, 0.25);
  color: #ff3b30;
}
.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {
  cursor: default !important;
  pointer-events: none;
  background: transparent !important;
}
.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: #34c759;
  background: transparent;
  cursor: default;
}
.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.25);
}

.styles-module__buttonBadge___NeFWb {
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #3c82f7;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
.styles-module__buttonBadge___NeFWb.styles-module__light___r6n4Y {
  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(52, 199, 89, 0);
  }
}
@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(245, 166, 35, 0);
  }
}
.styles-module__mcpIndicator___zGJeL {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  transition: background 0.3s ease, opacity 0.15s ease, transform 0.15s ease;
  opacity: 1;
  transform: scale(1);
}
.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {
  opacity: 0;
  transform: scale(0);
  animation: none;
}

@keyframes styles-module__connectionPulse___-Zycw {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
.styles-module__connectionIndicatorWrapper___L-e-3 {
  width: 8px;
  height: 34px;
  margin-left: 6px;
  margin-right: 6px;
}

.styles-module__connectionIndicator___afk9p {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
  cursor: default;
}

.styles-module__connectionIndicatorVisible___C-i5B {
  opacity: 1;
}

.styles-module__connectionIndicatorConnected___IY8pR {
  background: #34c759;
  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;
}

.styles-module__connectionIndicatorDisconnected___kmpaZ {
  background: #ff3b30;
  animation: none;
}

.styles-module__connectionIndicatorConnecting___QmSLH {
  background: #f59e0b;
  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;
}

.styles-module__buttonWrapper___rBcdv {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.85s;
}
.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {
  opacity: 0;
  visibility: hidden;
}

.styles-module__sendButtonWrapper___UUxG6 {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  margin-left: -0.375rem;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {
  width: 34px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  margin-left: 0;
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {
  transform: scale(1);
}

.styles-module__buttonTooltip___Burd9 {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 6px 10px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;
}
.styles-module__buttonTooltip___Burd9::after {
  content: "";
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 0 0 2px 0;
}

.styles-module__shortcut___lEAQk {
  margin-left: 4px;
  opacity: 0.5;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {
  bottom: auto;
  top: calc(100% + 14px);
  transform: translateX(-50%) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {
  top: -4px;
  bottom: auto;
  border-radius: 2px 0 0 0;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-50%) scale(1);
}

.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

.styles-module__tooltipVisible___0jcCv,
.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
  transition-delay: 0s !important;
}

.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(-12px) scale(0.95);
}
.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {
  left: 16px;
}
.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {
  left: auto;
  right: 8px;
}
.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__divider___c--s1 {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.125rem;
}

.styles-module__overlay___Q1O9y {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
}
.styles-module__overlay___Q1O9y > * {
  pointer-events: auto;
}

.styles-module__hoverHighlight___ogakW {
  position: fixed;
  border: 2px solid rgba(60, 130, 247, 0.5);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(60, 130, 247, 0.04);
  box-sizing: border-box;
  will-change: opacity;
  contain: layout style;
}
.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {
  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;
}

.styles-module__multiSelectOutline___cSJ-m {
  position: fixed;
  border: 2px dashed rgba(52, 199, 89, 0.6);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(52, 199, 89, 0.05);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__singleSelectOutline___QhX-O {
  position: fixed;
  border: 2px solid rgba(60, 130, 247, 0.6);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(60, 130, 247, 0.05);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__hoverTooltip___bvLk7 {
  position: fixed;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  pointer-events: none !important;
  white-space: nowrap;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {
  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;
}

.styles-module__hoverReactPath___gx1IJ {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__hoverElementName___QMLMl {
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markersLayer___-25j1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__markersLayer___-25j1 > * {
  pointer-events: auto;
}

.styles-module__fixedMarkersLayer___ffyX6 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__fixedMarkersLayer___ffyX6 > * {
  pointer-events: auto;
}

.styles-module__marker___6sQrs {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #3c82f7;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___6sQrs:hover {
  z-index: 2;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___6sQrs.styles-module__enter___WFIki {
  animation: styles-module__markerIn___5FaAP 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___6sQrs.styles-module__exit___fyOJ0 {
  animation: styles-module__markerOut___GU5jX 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs.styles-module__clearing___FQ--7 {
  animation: styles-module__markerOut___GU5jX 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___6sQrs.styles-module__pending___2IHLC {
  position: fixed;
  background: #3c82f7;
}
.styles-module__marker___6sQrs.styles-module__fixed___dBMHC {
  position: fixed;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz {
  background: #34c759;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz.styles-module__pending___2IHLC {
  background: #34c759;
}
.styles-module__marker___6sQrs.styles-module__hovered___ZgXIy {
  background: #ff3b30;
}

.styles-module__renumber___nCTxD {
  display: block;
  animation: styles-module__renumberRoll___Wgbq3 0.2s ease-out;
}

@keyframes styles-module__renumberRoll___Wgbq3 {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__markerTooltip___aLJID {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___aLJID.styles-module__enter___WFIki {
  animation: styles-module__tooltipIn___0N31w 0.1s ease-out forwards;
}

.styles-module__markerQuote___FHmrz {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___QkrrS {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

.styles-module__markerHint___2iF-6 {
  display: block;
  font-size: 0.625rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.375rem;
  white-space: nowrap;
}

.styles-module__settingsPanel___OxX3Y {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 1rem;
  padding: 13px 0 16px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y::before, .styles-module__settingsPanel___OxX3Y::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___OxX3Y::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY,
.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz,
.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa,
.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax,
.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr,
.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp,
.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56,
.styles-module__settingsPanel___OxX3Y .styles-module__themeToggle___2rUjA {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__enter___WFIki {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__exit___fyOJ0 {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.6);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12 {
  color: rgba(255, 255, 255, 0.85);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12:hover {
  background: rgba(255, 255, 255, 0.1);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__toggleLabel___Xm8Aa {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__settingsPanelContainer___Xksv8 {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 1rem;
}
.styles-module__settingsPanelContainer___Xksv8.styles-module__transitioning___qxzCk {
  overflow-x: clip;
  overflow-y: visible;
}

.styles-module__settingsPage___6YfHH {
  min-width: 100%;
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease-out;
  opacity: 1;
}

.styles-module__settingsPage___6YfHH.styles-module__slideLeft___Ps01J {
  transform: translateX(-100%);
  opacity: 0;
}

.styles-module__automationsPage___uvCq6 {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  padding: 3px 1rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease-out 0.1s;
  opacity: 0;
}

.styles-module__automationsPage___uvCq6.styles-module__slideIn___4-qXe {
  transform: translateX(-100%);
  opacity: 1;
}

.styles-module__settingsNavLink___wCzJt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(255, 255, 255, 0.9);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y:hover {
  color: rgba(0, 0, 0, 0.8);
}
.styles-module__settingsNavLink___wCzJt svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover svg {
  color: #fff;
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y svg {
  color: rgba(0, 0, 0, 0.25);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___ZWwhj {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__mcpNavIndicator___cl9pO {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpPulse___uNggr 1.5s ease-in-out infinite;
}

.styles-module__settingsBackButton___bIe2j {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0 12px 0;
  margin: -6px 0 0.5rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j:hover svg {
  opacity: 1;
}
.styles-module__settingsBackButton___bIe2j.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___InP0r {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
.styles-module__automationHeader___InP0r .styles-module__helpIcon___xQg56 svg {
  transform: none;
}
.styles-module__automationHeader___InP0r.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___NKlmo {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
.styles-module__automationDescription___NKlmo.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___8xv-x {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___8xv-x:hover {
  color: #fff;
}
.styles-module__learnMoreLink___8xv-x.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
.styles-module__learnMoreLink___8xv-x.styles-module__light___r6n4Y:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendRow___UblX5 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.styles-module__autoSendLabel___icDc2 {
  font-size: 0.6875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: #66b8ff;
}
.styles-module__autoSendLabel___icDc2.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__autoSendLabel___icDc2.styles-module__light___r6n4Y.styles-module__active___-zoN6 {
  color: #3c82f7;
}

.styles-module__webhookUrlInput___2375C {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  cursor: text !important;
  user-select: text;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__settingsHeader___pwDY9 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 0.5rem;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.styles-module__settingsBrand___0gJeM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
}

.styles-module__settingsBrandSlash___uTG18 {
  color: rgba(255, 255, 255, 0.5);
}

.styles-module__settingsVersion___TUcFq {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__settingsSection___m-YM2.styles-module__settingsSectionExtraPadding___jdhFV {
  padding-top: calc(0.5rem + 4px);
}

.styles-module__settingsSectionGrow___h-5HZ {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___3sdhc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___3sdhc.styles-module__settingsRowMarginTop___zA0Sp {
  margin-top: 8px;
}

.styles-module__dropdownContainer___BVnxe {
  position: relative;
}

.styles-module__dropdownButton___16NPz {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownButton___16NPz:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownButton___16NPz svg {
  opacity: 0.6;
}

.styles-module__cycleButton___FMKfw {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
.styles-module__cycleButton___FMKfw.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___FMKfw:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__toggleSwitch___l4Ygm {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes styles-module__cycleTextIn___Q6zJf {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__cycleButtonText___fD1LR {
  display: inline-block;
  animation: styles-module__cycleTextIn___Q6zJf 0.2s ease-out;
}

.styles-module__cycleDots___LWuoQ {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___nPgLY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: #fff;
  transform: scale(1);
}
.styles-module__cycleDot___nPgLY.styles-module__light___r6n4Y {
  background: rgba(0, 0, 0, 0.2);
}
.styles-module__cycleDot___nPgLY.styles-module__light___r6n4Y.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__dropdownMenu___k73ER {
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 0.25rem;
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  animation: styles-module__scaleIn___c-r1K 0.15s ease-out;
}

.styles-module__dropdownItem___ylsLj {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.625rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownItem___ylsLj:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownItem___ylsLj.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.styles-module__settingsLabel___8UjfX {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.styles-module__settingsLabel___8UjfX.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__settingsLabelMarker___ewdtV {
  padding-top: 3px;
  margin-bottom: 10px;
}

.styles-module__settingsOptions___LyrBA {
  display: flex;
  gap: 0.25rem;
}

.styles-module__settingsOption___UNa12 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__settingsOption___UNa12:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(60, 130, 247, 0.15);
  color: #3c82f7;
}

.styles-module__sliderContainer___ducXj {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.styles-module__slider___GLdxp {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.styles-module__slider___GLdxp::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.styles-module__slider___GLdxp:hover::-moz-range-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.styles-module__sliderLabels___FhLDB {
  display: flex;
  justify-content: space-between;
}

.styles-module__sliderLabel___U8sPr {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__sliderLabel___U8sPr:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(255, 255, 255, 0.9);
}

.styles-module__colorOptions___iHCNX {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  margin-bottom: 1px;
}

.styles-module__colorOption___IodiY {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.styles-module__colorOption___IodiY:hover {
  transform: scale(1.15);
}
.styles-module__colorOption___IodiY.styles-module__selected___OwRqP {
  transform: scale(0.83);
}

.styles-module__colorOptionRing___U2xpo {
  display: flex;
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}
.styles-module__settingsToggle___fBrFn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.styles-module__settingsToggle___fBrFn + .styles-module__settingsToggle___fBrFn {
  margin-top: calc(0.5rem + 6px);
}
.styles-module__settingsToggle___fBrFn input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__settingsToggle___fBrFn.styles-module__settingsToggleMarginBottom___MZUyF {
  margin-bottom: calc(0.5rem + 6px);
}

.styles-module__customCheckbox___U39ax {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.styles-module__customCheckbox___U39ax svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
input[type=checkbox]:checked + .styles-module__customCheckbox___U39ax {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y.styles-module__checked___mnZLo svg {
  color: #fff;
}

.styles-module__toggleLabel___Xm8Aa {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.styles-module__toggleLabel___Xm8Aa.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__toggleSwitch___l4Ygm {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.styles-module__toggleSwitch___l4Ygm input {
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn {
  background: #3c82f7;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn::before {
  transform: translateX(8px);
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw {
  opacity: 0.4;
  pointer-events: none;
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw .styles-module__toggleSlider___wprIn {
  cursor: not-allowed;
}

.styles-module__toggleSlider___wprIn {
  position: absolute;
  cursor: pointer;
  inset: 0;
  border-radius: 16px;
  background: #484848;
}
.styles-module__light___r6n4Y .styles-module__toggleSlider___wprIn {
  background: #dddddd;
}
.styles-module__toggleSlider___wprIn::before {
  content: "";
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpPulse___uNggr {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(52, 199, 89, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0);
  }
}
@keyframes styles-module__mcpPulseError___fov9B {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 59, 48, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
  }
}
.styles-module__mcpStatusDot___ibgkc {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpPulse___uNggr 1.5s infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__disconnected___cHPxR {
  background: #ff3b30;
  animation: styles-module__mcpPulseError___fov9B 2s infinite;
}

.styles-module__helpIcon___xQg56 {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  margin-left: 0;
}
.styles-module__helpIcon___xQg56 svg {
  display: block;
  transform: translateY(1px);
  color: rgba(255, 255, 255, 0.2);
  transition: color 0.15s ease;
}
.styles-module__helpIcon___xQg56:hover svg {
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudgeDown___0cqpM svg {
  transform: translateY(1px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNoNudge___abogC svg {
  transform: translateY(0.5px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudge1-5___DM2TQ svg {
  transform: translateY(1.5px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudge2___TfWgC svg {
  transform: translateY(2px);
}

.styles-module__dragSelection___kZLq2 {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid rgba(52, 199, 89, 0.6);
  border-radius: 4px;
  background: rgba(52, 199, 89, 0.08);
  pointer-events: none;
  z-index: 99997;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__dragCount___KM90j {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #34c759;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.styles-module__highlightsContainer___-0xzG {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__selectedElementHighlight___fyVlI {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid rgba(52, 199, 89, 0.5);
  border-radius: 4px;
  background: rgba(52, 199, 89, 0.06);
  pointer-events: none;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__light___r6n4Y.styles-module__toolbarContainer___dIhma {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #f5f5f5;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-active=true] {
  color: #3c82f7;
  background: rgba(60, 130, 247, 0.15);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-error=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.15);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: #34c759;
  background: transparent;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.15);
}
.styles-module__light___r6n4Y.styles-module__buttonTooltip___Burd9 {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__buttonTooltip___Burd9::after {
  background: #fff;
}
.styles-module__light___r6n4Y.styles-module__divider___c--s1 {
  background: rgba(0, 0, 0, 0.1);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerQuote___FHmrz {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerNote___QkrrS {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerHint___2iF-6 {
  color: rgba(0, 0, 0, 0.35);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y::before {
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y::after {
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9 {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18 {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2 {
  border-top-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY {
  background: rgba(0, 0, 0, 0.2);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo svg {
  color: #fff;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr:hover {
  color: rgba(0, 0, 0, 0.7);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(0, 0, 0, 0.9);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp {
  background: rgba(0, 0, 0, 0.1);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp::-webkit-slider-thumb {
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp::-moz-range-thumb {
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56 svg {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56:hover svg {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__themeToggle___2rUjA {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 0.5rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__themeToggle___2rUjA:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
.styles-module__light___r6n4Y .styles-module__themeToggle___2rUjA {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y .styles-module__themeToggle___2rUjA:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.styles-module__themeIconWrapper___LsJIM {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
}

.styles-module__themeIcon___lCCmo {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: styles-module__themeIconIn___TU6ML 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes styles-module__themeIconIn___TU6ML {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}`,Dp={toolbar:"styles-module__toolbar___wNsdK",toolbarContainer:"styles-module__toolbarContainer___dIhma",dragging:"styles-module__dragging___xrolZ",entrance:"styles-module__entrance___sgHd8",toolbarEnter:"styles-module__toolbarEnter___u8RRu",collapsed:"styles-module__collapsed___Rydsn",expanded:"styles-module__expanded___ofKPx",serverConnected:"styles-module__serverConnected___Gfbou",toggleContent:"styles-module__toggleContent___0yfyP",visible:"styles-module__visible___KHwEW",hidden:"styles-module__hidden___Ae8H4",controlsContent:"styles-module__controlsContent___9GJWU",badge:"styles-module__badge___2XsgF",fadeOut:"styles-module__fadeOut___6Ut6-",badgeEnter:"styles-module__badgeEnter___mVQLj",controlButton:"styles-module__controlButton___8Q0jc",statusShowing:"styles-module__statusShowing___te6iu",buttonBadge:"styles-module__buttonBadge___NeFWb",light:"styles-module__light___r6n4Y",mcpIndicator:"styles-module__mcpIndicator___zGJeL",connected:"styles-module__connected___7c28g",mcpIndicatorPulseConnected:"styles-module__mcpIndicatorPulseConnected___EDodZ",connecting:"styles-module__connecting___uo-CW",mcpIndicatorPulseConnecting:"styles-module__mcpIndicatorPulseConnecting___cCYte",connectionIndicatorWrapper:"styles-module__connectionIndicatorWrapper___L-e-3",connectionIndicator:"styles-module__connectionIndicator___afk9p",connectionIndicatorVisible:"styles-module__connectionIndicatorVisible___C-i5B",connectionIndicatorConnected:"styles-module__connectionIndicatorConnected___IY8pR",connectionPulse:"styles-module__connectionPulse___-Zycw",connectionIndicatorDisconnected:"styles-module__connectionIndicatorDisconnected___kmpaZ",connectionIndicatorConnecting:"styles-module__connectionIndicatorConnecting___QmSLH",buttonWrapper:"styles-module__buttonWrapper___rBcdv",buttonTooltip:"styles-module__buttonTooltip___Burd9",sendButtonWrapper:"styles-module__sendButtonWrapper___UUxG6",sendButtonVisible:"styles-module__sendButtonVisible___WPSQU",shortcut:"styles-module__shortcut___lEAQk",tooltipBelow:"styles-module__tooltipBelow___m6ats",tooltipsHidden:"styles-module__tooltipsHidden___VtLJG",tooltipVisible:"styles-module__tooltipVisible___0jcCv",buttonWrapperAlignLeft:"styles-module__buttonWrapperAlignLeft___myzIp",buttonWrapperAlignRight:"styles-module__buttonWrapperAlignRight___HCQFR",divider:"styles-module__divider___c--s1",overlay:"styles-module__overlay___Q1O9y",hoverHighlight:"styles-module__hoverHighlight___ogakW",enter:"styles-module__enter___WFIki",hoverHighlightIn:"styles-module__hoverHighlightIn___6WYHY",multiSelectOutline:"styles-module__multiSelectOutline___cSJ-m",fadeIn:"styles-module__fadeIn___b9qmf",exit:"styles-module__exit___fyOJ0",singleSelectOutline:"styles-module__singleSelectOutline___QhX-O",hoverTooltip:"styles-module__hoverTooltip___bvLk7",hoverTooltipIn:"styles-module__hoverTooltipIn___FYGQx",hoverReactPath:"styles-module__hoverReactPath___gx1IJ",hoverElementName:"styles-module__hoverElementName___QMLMl",markersLayer:"styles-module__markersLayer___-25j1",fixedMarkersLayer:"styles-module__fixedMarkersLayer___ffyX6",marker:"styles-module__marker___6sQrs",clearing:"styles-module__clearing___FQ--7",markerIn:"styles-module__markerIn___5FaAP",markerOut:"styles-module__markerOut___GU5jX",pending:"styles-module__pending___2IHLC",fixed:"styles-module__fixed___dBMHC",multiSelect:"styles-module__multiSelect___YWiuz",hovered:"styles-module__hovered___ZgXIy",renumber:"styles-module__renumber___nCTxD",renumberRoll:"styles-module__renumberRoll___Wgbq3",markerTooltip:"styles-module__markerTooltip___aLJID",tooltipIn:"styles-module__tooltipIn___0N31w",markerQuote:"styles-module__markerQuote___FHmrz",markerNote:"styles-module__markerNote___QkrrS",markerHint:"styles-module__markerHint___2iF-6",settingsPanel:"styles-module__settingsPanel___OxX3Y",settingsHeader:"styles-module__settingsHeader___pwDY9",settingsBrand:"styles-module__settingsBrand___0gJeM",settingsBrandSlash:"styles-module__settingsBrandSlash___uTG18",settingsVersion:"styles-module__settingsVersion___TUcFq",settingsSection:"styles-module__settingsSection___m-YM2",settingsLabel:"styles-module__settingsLabel___8UjfX",cycleButton:"styles-module__cycleButton___FMKfw",cycleDot:"styles-module__cycleDot___nPgLY",dropdownButton:"styles-module__dropdownButton___16NPz",toggleLabel:"styles-module__toggleLabel___Xm8Aa",customCheckbox:"styles-module__customCheckbox___U39ax",sliderLabel:"styles-module__sliderLabel___U8sPr",slider:"styles-module__slider___GLdxp",helpIcon:"styles-module__helpIcon___xQg56",themeToggle:"styles-module__themeToggle___2rUjA",dark:"styles-module__dark___ILIQf",settingsOption:"styles-module__settingsOption___UNa12",selected:"styles-module__selected___OwRqP",settingsPanelContainer:"styles-module__settingsPanelContainer___Xksv8",transitioning:"styles-module__transitioning___qxzCk",settingsPage:"styles-module__settingsPage___6YfHH",slideLeft:"styles-module__slideLeft___Ps01J",automationsPage:"styles-module__automationsPage___uvCq6",slideIn:"styles-module__slideIn___4-qXe",settingsNavLink:"styles-module__settingsNavLink___wCzJt",settingsNavLinkRight:"styles-module__settingsNavLinkRight___ZWwhj",mcpNavIndicator:"styles-module__mcpNavIndicator___cl9pO",mcpPulse:"styles-module__mcpPulse___uNggr",settingsBackButton:"styles-module__settingsBackButton___bIe2j",automationHeader:"styles-module__automationHeader___InP0r",automationDescription:"styles-module__automationDescription___NKlmo",learnMoreLink:"styles-module__learnMoreLink___8xv-x",autoSendRow:"styles-module__autoSendRow___UblX5",autoSendLabel:"styles-module__autoSendLabel___icDc2",active:"styles-module__active___-zoN6",webhookUrlInput:"styles-module__webhookUrlInput___2375C",settingsSectionExtraPadding:"styles-module__settingsSectionExtraPadding___jdhFV",settingsSectionGrow:"styles-module__settingsSectionGrow___h-5HZ",settingsRow:"styles-module__settingsRow___3sdhc",settingsRowMarginTop:"styles-module__settingsRowMarginTop___zA0Sp",dropdownContainer:"styles-module__dropdownContainer___BVnxe",settingsRowDisabled:"styles-module__settingsRowDisabled___EgS0V",toggleSwitch:"styles-module__toggleSwitch___l4Ygm",cycleButtonText:"styles-module__cycleButtonText___fD1LR",cycleTextIn:"styles-module__cycleTextIn___Q6zJf",cycleDots:"styles-module__cycleDots___LWuoQ",dropdownMenu:"styles-module__dropdownMenu___k73ER",scaleIn:"styles-module__scaleIn___c-r1K",dropdownItem:"styles-module__dropdownItem___ylsLj",settingsLabelMarker:"styles-module__settingsLabelMarker___ewdtV",settingsOptions:"styles-module__settingsOptions___LyrBA",sliderContainer:"styles-module__sliderContainer___ducXj",sliderLabels:"styles-module__sliderLabels___FhLDB",colorOptions:"styles-module__colorOptions___iHCNX",colorOption:"styles-module__colorOption___IodiY",colorOptionRing:"styles-module__colorOptionRing___U2xpo",settingsToggle:"styles-module__settingsToggle___fBrFn",settingsToggleMarginBottom:"styles-module__settingsToggleMarginBottom___MZUyF",checked:"styles-module__checked___mnZLo",toggleSlider:"styles-module__toggleSlider___wprIn",disabled:"styles-module__disabled___332Jw",mcpStatusDot:"styles-module__mcpStatusDot___ibgkc",disconnected:"styles-module__disconnected___cHPxR",mcpPulseError:"styles-module__mcpPulseError___fov9B",helpIconNudgeDown:"styles-module__helpIconNudgeDown___0cqpM",helpIconNoNudge:"styles-module__helpIconNoNudge___abogC","helpIconNudge1-5":"styles-module__helpIconNudge1-5___DM2TQ",helpIconNudge2:"styles-module__helpIconNudge2___TfWgC",dragSelection:"styles-module__dragSelection___kZLq2",dragCount:"styles-module__dragCount___KM90j",highlightsContainer:"styles-module__highlightsContainer___-0xzG",selectedElementHighlight:"styles-module__selectedElementHighlight___fyVlI",themeIconWrapper:"styles-module__themeIconWrapper___LsJIM",themeIcon:"styles-module__themeIcon___lCCmo",themeIconIn:"styles-module__themeIconIn___TU6ML",scaleOut:"styles-module__scaleOut___Wctwz",slideUp:"styles-module__slideUp___kgD36",slideDown:"styles-module__slideDown___zcdje",settingsPanelIn:"styles-module__settingsPanelIn___MGfO8",settingsPanelOut:"styles-module__settingsPanelOut___Zfymi"};if(typeof document<"u"){let e=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");e||(e=document.createElement("style"),e.id="feedback-tool-styles-page-toolbar-css-styles",e.textContent=Op,document.head.appendChild(e))}var d=Dp;function yu(e,t="filtered"){let{name:n,path:o}=Is(e);if(t==="off")return{name:n,elementName:n,path:o,reactComponents:null};let r=Bp(e,{mode:t});return{name:r.path?`${r.path} ${n}`:n,elementName:n,path:o,reactComponents:r.path}}var Z1=!1,K1={outputDetail:"standard",autoClearAfterCopy:!1,annotationColor:"#3c82f7",blockInteractions:!0,reactEnabled:!0,markerClickBehavior:"edit",webhookUrl:"",webhooksEnabled:!0},Bt=e=>{if(!e||!e.trim())return!1;try{let t=new URL(e.trim());return t.protocol==="http:"||t.protocol==="https:"}catch{return!1}},Ap={compact:"off",standard:"filtered",detailed:"smart",forensic:"all"},jr=[{value:"compact",label:"Compact"},{value:"standard",label:"Standard"},{value:"detailed",label:"Detailed"},{value:"forensic",label:"Forensic"}],jp=[{value:"#AF52DE",label:"Purple"},{value:"#3c82f7",label:"Blue"},{value:"#5AC8FA",label:"Cyan"},{value:"#34C759",label:"Green"},{value:"#FFD60A",label:"Yellow"},{value:"#FF9500",label:"Orange"},{value:"#FF3B30",label:"Red"}];function Mo(e,t){let n=document.elementFromPoint(e,t);if(!n)return null;for(;n?.shadowRoot;){let o=n.shadowRoot.elementFromPoint(e,t);if(!o||o===n)break;n=o}return n}function vu(e){let t=e;for(;t&&t!==document.body;){let o=window.getComputedStyle(t).position;if(o==="fixed"||o==="sticky")return!0;t=t.parentElement}return!1}function G1(e,t,n="standard",o="filtered"){if(e.length===0)return"";let r=typeof window<"u"?`${window.innerWidth}\xD7${window.innerHeight}`:"unknown",l=`## Page Feedback: ${t}
`;return n==="forensic"?(l+=`
**Environment:**
`,l+=`- Viewport: ${r}
`,typeof window<"u"&&(l+=`- URL: ${window.location.href}
`,l+=`- User Agent: ${navigator.userAgent}
`,l+=`- Timestamp: ${new Date().toISOString()}
`,l+=`- Device Pixel Ratio: ${window.devicePixelRatio}
`),l+=`
---
`):n!=="compact"&&(l+=`**Viewport:** ${r}
`),l+=`
`,e.forEach((s,i)=>{n==="compact"?(l+=`${i+1}. **${s.element}**: ${s.comment}`,s.selectedText&&(l+=` (re: "${s.selectedText.slice(0,30)}${s.selectedText.length>30?"...":""}")`),l+=`
`):n==="forensic"?(l+=`### ${i+1}. ${s.element}
`,s.isMultiSelect&&s.fullPath&&(l+=`*Forensic data shown for first element of selection*
`),s.fullPath&&(l+=`**Full DOM Path:** ${s.fullPath}
`),s.cssClasses&&(l+=`**CSS Classes:** ${s.cssClasses}
`),s.boundingBox&&(l+=`**Position:** x:${Math.round(s.boundingBox.x)}, y:${Math.round(s.boundingBox.y)} (${Math.round(s.boundingBox.width)}\xD7${Math.round(s.boundingBox.height)}px)
`),l+=`**Annotation at:** ${s.x.toFixed(1)}% from left, ${Math.round(s.y)}px from top
`,s.selectedText&&(l+=`**Selected text:** "${s.selectedText}"
`),s.nearbyText&&!s.selectedText&&(l+=`**Context:** ${s.nearbyText.slice(0,100)}
`),s.computedStyles&&(l+=`**Computed Styles:** ${s.computedStyles}
`),s.accessibility&&(l+=`**Accessibility:** ${s.accessibility}
`),s.nearbyElements&&(l+=`**Nearby Elements:** ${s.nearbyElements}
`),s.reactComponents&&(l+=`**React:** ${s.reactComponents}
`),l+=`**Feedback:** ${s.comment}

`):(l+=`### ${i+1}. ${s.element}
`,l+=`**Location:** ${s.elementPath}
`,s.reactComponents&&(l+=`**React:** ${s.reactComponents}
`),n==="detailed"&&(s.cssClasses&&(l+=`**Classes:** ${s.cssClasses}
`),s.boundingBox&&(l+=`**Position:** ${Math.round(s.boundingBox.x)}px, ${Math.round(s.boundingBox.y)}px (${Math.round(s.boundingBox.width)}\xD7${Math.round(s.boundingBox.height)}px)
`)),s.selectedText&&(l+=`**Selected text:** "${s.selectedText}"
`),n==="detailed"&&s.nearbyText&&!s.selectedText&&(l+=`**Context:** ${s.nearbyText.slice(0,100)}
`),l+=`**Feedback:** ${s.comment}

`)}),l.trim()}function tf({demoAnnotations:e,demoDelay:t=1e3,enableDemoMode:n=!1,onAnnotationAdd:o,onAnnotationDelete:r,onAnnotationUpdate:l,onAnnotationsClear:s,onCopy:i,onSubmit:u,copyToClipboard:m=!0,endpoint:g,sessionId:w,onSessionCreated:k,webhookUrl:N}={}){let[C,I]=(0,x.useState)(!1),[z,p]=(0,x.useState)([]),[_,h]=(0,x.useState)(!0),[S,$]=(0,x.useState)(!1),[M,A]=(0,x.useState)(!1),[B,oe]=(0,x.useState)(null),[V,lt]=(0,x.useState)({x:0,y:0}),[O,st]=(0,x.useState)(null),[Sn,Wr]=(0,x.useState)(!1),[ht,we]=(0,x.useState)("idle"),[Yr,Lt]=(0,x.useState)(!1),[Cu,bu]=(0,x.useState)(!1),[Hr,$s]=(0,x.useState)(null),[Rs,Ln]=(0,x.useState)(null),[Su,Ro]=(0,x.useState)([]),[Lu,Eu]=(0,x.useState)(null),[Ur,Nu]=(0,x.useState)(null),[K,zo]=(0,x.useState)(null),[zs,Ot]=(0,x.useState)(null),[Pu,En]=(0,x.useState)([]),[Nn,Iu]=(0,x.useState)(0),[Tu,Mu]=(0,x.useState)(!1),[ke,lf]=(0,x.useState)(!1),[gt,$u]=(0,x.useState)(!1),[Bo,Ru]=(0,x.useState)(!1),[sf,zu]=(0,x.useState)(!1),[Bs,Os]=(0,x.useState)("main"),[Bu,Ou]=(0,x.useState)(!1),[af,Ds]=(0,x.useState)(!1),[xe,Qn]=(0,x.useState)([]),Et=(0,x.useRef)({cmd:!1,shift:!1}),Ye=()=>{Ds(!0)},uf=()=>{Ds(!1)},Oo=({content:a,children:c})=>{let[v,b]=(0,x.useState)(!1),[y,P]=(0,x.useState)(!1),[D,F]=(0,x.useState)(!1),[Q,U]=(0,x.useState)({top:0,right:0}),W=(0,x.useRef)(null),Y=(0,x.useRef)(null),X=(0,x.useRef)(null),H=()=>{if(W.current){let he=W.current.getBoundingClientRect();U({top:he.top+he.height/2,right:window.innerWidth-he.left+8})}},j=()=>{b(!0),F(!0),X.current&&(clearTimeout(X.current),X.current=null),H(),Y.current=setTimeout(()=>{P(!0)},500)},it=()=>{b(!1),Y.current&&(clearTimeout(Y.current),Y.current=null),P(!1),X.current=setTimeout(()=>{F(!1)},150)};return(0,x.useEffect)(()=>()=>{Y.current&&clearTimeout(Y.current),X.current&&clearTimeout(X.current)},[]),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("span",{ref:W,onMouseEnter:j,onMouseLeave:it,children:c}),D&&(0,wu.createPortal)((0,f.jsx)("div",{style:{position:"fixed",top:Q.top,right:Q.right,transform:"translateY(-50%)",padding:"6px 10px",background:"#383838",color:"rgba(255, 255, 255, 0.7)",fontSize:"11px",fontWeight:400,lineHeight:"14px",borderRadius:"10px",width:"180px",textAlign:"left",zIndex:100020,pointerEvents:"none",boxShadow:"0px 1px 8px rgba(0, 0, 0, 0.28)",opacity:y&&!Bu?1:0,transition:"opacity 0.15s ease"},children:a}),document.body)]})},[T,qt]=(0,x.useState)(K1),[Z,Du]=(0,x.useState)(!0),[Au,ju]=(0,x.useState)(!1),Vn=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"||window.location.hostname==="0.0.0.0"||window.location.hostname.endsWith(".local")),Dt=Vn&&T.reactEnabled?Ap[T.outputDetail]:"off",[Ge,As]=(0,x.useState)(w??null),Fu=(0,x.useRef)(!1),[De,Pn]=(0,x.useState)(g?"connecting":"disconnected"),[_e,js]=(0,x.useState)(null),[At,Wu]=(0,x.useState)(!1),[Zn,Yu]=(0,x.useState)(null),[cf,df]=(0,x.useState)(0),Fs=(0,x.useRef)(!1),[Hu,Do]=(0,x.useState)(new Set),[Uu,Xr]=(0,x.useState)(new Set),[Ao,Qr]=(0,x.useState)(!1),[_f,Kn]=(0,x.useState)(!1),[jt,Xu]=(0,x.useState)(!1),Gn=(0,x.useRef)(null),Nt=(0,x.useRef)(null),jo=(0,x.useRef)(null),Fo=(0,x.useRef)(null),Vr=(0,x.useRef)(!1),Qu=(0,x.useRef)(0),Zr=(0,x.useRef)(null),Vu=(0,x.useRef)(null),Ws=8,ff=50,Zu=(0,x.useRef)(null),Ku=(0,x.useRef)(null),Wo=(0,x.useRef)(null),re=typeof window<"u"?window.location.pathname:"/";(0,x.useEffect)(()=>{if(Bo)zu(!0);else{Ds(!1),Os("main");let a=setTimeout(()=>zu(!1),0);return()=>clearTimeout(a)}},[Bo]),(0,x.useEffect)(()=>{Ou(!0);let a=setTimeout(()=>Ou(!1),350);return()=>clearTimeout(a)},[Bs]);let Gu=C&&_;(0,x.useEffect)(()=>{if(Gu){A(!1),$(!0),Do(new Set);let a=setTimeout(()=>{Do(c=>{let v=new Set(c);return z.forEach(b=>v.add(b.id)),v})},350);return()=>clearTimeout(a)}else if(S){A(!0);let a=setTimeout(()=>{$(!1),A(!1)},250);return()=>clearTimeout(a)}},[Gu]),(0,x.useEffect)(()=>{lf(!0),Iu(window.scrollY);let a=mu(re);p(a),Z1||(ju(!0),Z1=!0,setTimeout(()=>ju(!1),750));try{let c=localStorage.getItem("feedback-toolbar-settings");c&&qt({...K1,...JSON.parse(c)})}catch{}try{let c=localStorage.getItem("feedback-toolbar-theme");c!==null&&Du(c==="dark")}catch{}try{let c=localStorage.getItem("feedback-toolbar-position");if(c){let v=JSON.parse(c);typeof v.x=="number"&&typeof v.y=="number"&&js(v)}}catch{}},[re]),(0,x.useEffect)(()=>{ke&&localStorage.setItem("feedback-toolbar-settings",JSON.stringify(T))},[T,ke]),(0,x.useEffect)(()=>{ke&&localStorage.setItem("feedback-toolbar-theme",Z?"dark":"light")},[Z,ke]);let Ju=(0,x.useRef)(!1);(0,x.useEffect)(()=>{let a=Ju.current;Ju.current=At,a&&!At&&_e&&ke&&localStorage.setItem("feedback-toolbar-position",JSON.stringify(_e))},[At,_e,ke]),(0,x.useEffect)(()=>{if(!g||!ke||Fu.current)return;Fu.current=!0,Pn("connecting"),(async()=>{try{let c=kp(re),v=w||c,b=!1;if(v)try{let y=await U1(g,v);As(y.id),Pn("connected"),pu(re,y.id),b=!0;let P=mu(re),D=new Set(y.annotations.map(Q=>Q.id)),F=P.filter(Q=>!D.has(Q.id));if(F.length>0){let U=`${typeof window<"u"?window.location.origin:""}${re}`,Y=(await Promise.allSettled(F.map(H=>Ps(g,y.id,{...H,sessionId:y.id,url:U})))).map((H,j)=>H.status==="fulfilled"?H.value:(console.warn("[Agentation] Failed to sync annotation:",H.reason),F[j])),X=[...y.annotations,...Y];p(X),Dr(re,X,y.id)}else p(y.annotations),Dr(re,y.annotations,y.id)}catch(y){console.warn("[Agentation] Could not join session, creating new:",y),xp(re)}if(!b){let y=typeof window<"u"?window.location.href:"/",P=await hu(g,y);As(P.id),Pn("connected"),pu(re,P.id),k?.(P.id);let D=vp(),F=typeof window<"u"?window.location.origin:"",Q=[];for(let[U,W]of D){let Y=W.filter(j=>!j._syncedTo);if(Y.length===0)continue;let X=`${F}${U}`,H=U===re;Q.push((async()=>{try{let j=H?P:await hu(g,X),he=(await Promise.allSettled(Y.map(Je=>Ps(g,j.id,{...Je,sessionId:j.id,url:X})))).map((Je,He)=>Je.status==="fulfilled"?Je.value:(console.warn("[Agentation] Failed to sync annotation:",Je.reason),Y[He]));if(Dr(U,he,j.id),H){let Je=new Set(Y.map(He=>He.id));p(He=>{let at=He.filter(q=>!Je.has(q.id));return[...he,...at]})}}catch(j){console.warn(`[Agentation] Failed to sync annotations for ${U}:`,j)}})())}await Promise.allSettled(Q)}}catch(c){Pn("disconnected"),console.warn("[Agentation] Failed to initialize session, using local storage:",c)}})()},[g,w,ke,k,re]),(0,x.useEffect)(()=>{if(!g||!ke)return;let a=async()=>{try{(await fetch(`${g}/health`)).ok?Pn("connected"):Pn("disconnected")}catch{Pn("disconnected")}};a();let c=setInterval(a,1e4);return()=>clearInterval(c)},[g,ke]),(0,x.useEffect)(()=>{if(!g||!ke||!Ge)return;let a=new EventSource(`${g}/sessions/${Ge}/events`),c=["resolved","dismissed"],v=b=>{try{let y=JSON.parse(b.data);if(c.includes(y.payload?.status)){let P=y.payload.id;Xr(D=>new Set(D).add(P)),setTimeout(()=>{p(D=>D.filter(F=>F.id!==P)),Xr(D=>{let F=new Set(D);return F.delete(P),F})},150)}}catch{}};return a.addEventListener("annotation.updated",v),()=>{a.removeEventListener("annotation.updated",v),a.close()}},[g,ke,Ge]),(0,x.useEffect)(()=>{if(!g||!ke)return;let a=Vu.current==="disconnected",c=De==="connected";Vu.current=De,a&&c&&(async()=>{try{let b=mu(re);if(b.length===0)return;let P=`${typeof window<"u"?window.location.origin:""}${re}`,D=Ge,F=[];if(D)try{F=(await U1(g,D)).annotations}catch{D=null}D||(D=(await hu(g,P)).id,As(D),pu(re,D));let Q=new Set(F.map(W=>W.id)),U=b.filter(W=>!Q.has(W.id));if(U.length>0){let Y=(await Promise.allSettled(U.map(H=>Ps(g,D,{...H,sessionId:D,url:P})))).map((H,j)=>H.status==="fulfilled"?H.value:(console.warn("[Agentation] Failed to sync annotation on reconnect:",H.reason),U[j])),X=[...F,...Y];p(X),Dr(re,X,D)}}catch(b){console.warn("[Agentation] Failed to sync on reconnect:",b)}})()},[De,g,ke,Ge,re]),(0,x.useEffect)(()=>{if(!n||!ke||!e||e.length===0||z.length>0)return;let a=[];return a.push(setTimeout(()=>{I(!0)},t-200)),e.forEach((c,v)=>{let b=t+v*300;a.push(setTimeout(()=>{let y=document.querySelector(c.selector);if(!y)return;let P=y.getBoundingClientRect(),{name:D,path:F}=Is(y),Q={id:`demo-${Date.now()}-${v}`,x:(P.left+P.width/2)/window.innerWidth*100,y:P.top+P.height/2+window.scrollY,comment:c.comment,element:D,elementPath:F,timestamp:Date.now(),selectedText:c.selectedText,boundingBox:{x:P.left,y:P.top+window.scrollY,width:P.width,height:P.height},nearbyText:Br(y),cssClasses:Or(y)};p(U=>[...U,Q])},b))}),()=>{a.forEach(clearTimeout)}},[n,ke,e,t]),(0,x.useEffect)(()=>{let a=()=>{Iu(window.scrollY),Mu(!0),Wo.current&&clearTimeout(Wo.current),Wo.current=setTimeout(()=>{Mu(!1)},150)};return window.addEventListener("scroll",a,{passive:!0}),()=>{window.removeEventListener("scroll",a),Wo.current&&clearTimeout(Wo.current)}},[]),(0,x.useEffect)(()=>{ke&&z.length>0?Ge?Dr(re,z,Ge):ef(re,z):ke&&z.length===0&&localStorage.removeItem(Ts(re))},[z,re,ke,Ge]);let qu=(0,x.useCallback)(()=>{if(gt)return;let a=document.createElement("style");a.id="feedback-freeze-styles",a.textContent=`
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *),
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::before,
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `,document.head.appendChild(a),document.querySelectorAll("video").forEach(c=>{c.paused||(c.dataset.wasPaused="false",c.pause())}),$u(!0)},[gt]),Kr=(0,x.useCallback)(()=>{if(!gt)return;let a=document.getElementById("feedback-freeze-styles");a&&a.remove(),document.querySelectorAll("video").forEach(c=>{c.dataset.wasPaused==="false"&&(c.play(),delete c.dataset.wasPaused)}),$u(!1)},[gt]),Ys=(0,x.useCallback)(()=>{gt?Kr():qu()},[gt,qu,Kr]),ec=(0,x.useCallback)(()=>{if(xe.length===0)return;let a=xe[0],c=a.element,v=xe.length>1,b=xe.map(y=>y.element.getBoundingClientRect());if(v){let y={left:Math.min(...b.map(j=>j.left)),top:Math.min(...b.map(j=>j.top)),right:Math.max(...b.map(j=>j.right)),bottom:Math.max(...b.map(j=>j.bottom))},P=xe.slice(0,5).map(j=>j.name).join(", "),D=xe.length>5?` +${xe.length-5} more`:"",F=b.map(j=>({x:j.left,y:j.top+window.scrollY,width:j.width,height:j.height})),U=xe[xe.length-1].element,W=b[b.length-1],Y=W.left+W.width/2,X=W.top+W.height/2,H=vu(U);st({x:Y/window.innerWidth*100,y:H?X:X+window.scrollY,clientY:X,element:`${xe.length} elements: ${P}${D}`,elementPath:"multi-select",boundingBox:{x:y.left,y:y.top+window.scrollY,width:y.right-y.left,height:y.bottom-y.top},isMultiSelect:!0,isFixed:H,elementBoundingBoxes:F,multiSelectElements:xe.map(j=>j.element),targetElement:U,fullPath:Ns(c),accessibility:Es(c),computedStyles:Ls(c),computedStylesObj:Ss(c),nearbyElements:bs(c),cssClasses:Or(c),nearbyText:Br(c)})}else{let y=b[0],P=vu(c);st({x:y.left/window.innerWidth*100,y:P?y.top:y.top+window.scrollY,clientY:y.top,element:a.name,elementPath:a.path,boundingBox:{x:y.left,y:P?y.top:y.top+window.scrollY,width:y.width,height:y.height},isFixed:P,fullPath:Ns(c),accessibility:Es(c),computedStyles:Ls(c),computedStylesObj:Ss(c),nearbyElements:bs(c),cssClasses:Or(c),nearbyText:Br(c),reactComponents:a.reactComponents})}Qn([]),oe(null)},[xe]);(0,x.useEffect)(()=>{C||(st(null),zo(null),Ot(null),En([]),oe(null),Ru(!1),Qn([]),Et.current={cmd:!1,shift:!1},gt&&Kr())},[C,gt,Kr]),(0,x.useEffect)(()=>{if(!C)return;let a=document.createElement("style");return a.id="feedback-cursor-styles",a.textContent=`
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-feedback-toolbar] textarea,
      [data-feedback-toolbar] input[type="text"],
      [data-feedback-toolbar] input[type="url"] {
        cursor: text !important;
      }
      [data-feedback-toolbar] button,
      [data-feedback-toolbar] button *,
      [data-feedback-toolbar] label,
      [data-feedback-toolbar] label *,
      [data-feedback-toolbar] a,
      [data-feedback-toolbar] a *,
      [data-feedback-toolbar] [role="button"],
      [data-feedback-toolbar] [role="button"] * {
        cursor: pointer !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `,document.head.appendChild(a),()=>{let c=document.getElementById("feedback-cursor-styles");c&&c.remove()}},[C]),(0,x.useEffect)(()=>{if(!C||O)return;let a=c=>{let v=c.composedPath()[0]||c.target;if(Ke(v,"[data-feedback-toolbar]")){oe(null);return}let b=Mo(c.clientX,c.clientY);if(!b||Ke(b,"[data-feedback-toolbar]")){oe(null);return}let{name:y,elementName:P,path:D,reactComponents:F}=yu(b,Dt),Q=b.getBoundingClientRect();oe({element:y,elementName:P,elementPath:D,rect:Q,reactComponents:F}),lt({x:c.clientX,y:c.clientY})};return document.addEventListener("mousemove",a),()=>document.removeEventListener("mousemove",a)},[C,O,Dt]),(0,x.useEffect)(()=>{if(!C)return;let a=c=>{if(Vr.current){Vr.current=!1;return}let v=c.composedPath()[0]||c.target;if(Ke(v,"[data-feedback-toolbar]")||Ke(v,"[data-annotation-popup]")||Ke(v,"[data-annotation-marker]"))return;if(c.metaKey&&c.shiftKey&&!O&&!K){c.preventDefault(),c.stopPropagation();let he=Mo(c.clientX,c.clientY);if(!he)return;let Je=he.getBoundingClientRect(),{name:He,path:at,reactComponents:q}=yu(he,Dt),J=xe.findIndex(Ee=>Ee.element===he);J>=0?Qn(Ee=>Ee.filter((Ce,en)=>en!==J)):Qn(Ee=>[...Ee,{element:he,rect:Je,name:He,path:at,reactComponents:q??void 0}]);return}let b=Ke(v,"button, a, input, select, textarea, [role='button'], [onclick]");if(T.blockInteractions&&b&&(c.preventDefault(),c.stopPropagation()),O){if(b&&!T.blockInteractions)return;c.preventDefault(),Zu.current?.shake();return}if(K){if(b&&!T.blockInteractions)return;c.preventDefault(),Ku.current?.shake();return}c.preventDefault();let y=Mo(c.clientX,c.clientY);if(!y)return;let{name:P,path:D,reactComponents:F}=yu(y,Dt),Q=y.getBoundingClientRect(),U=c.clientX/window.innerWidth*100,W=vu(y),Y=W?c.clientY:c.clientY+window.scrollY,X=window.getSelection(),H;X&&X.toString().trim().length>0&&(H=X.toString().trim().slice(0,500));let j=Ss(y),it=Ls(y);st({x:U,y:Y,clientY:c.clientY,element:P,elementPath:D,selectedText:H,boundingBox:{x:Q.left,y:W?Q.top:Q.top+window.scrollY,width:Q.width,height:Q.height},nearbyText:Br(y),cssClasses:Or(y),isFixed:W,fullPath:Ns(y),accessibility:Es(y),computedStyles:it,computedStylesObj:j,nearbyElements:bs(y),reactComponents:F??void 0,targetElement:y}),oe(null)};return document.addEventListener("click",a,!0),()=>document.removeEventListener("click",a,!0)},[C,O,K,T.blockInteractions,Dt,xe]),(0,x.useEffect)(()=>{if(!C)return;let a=b=>{b.key==="Meta"&&(Et.current.cmd=!0),b.key==="Shift"&&(Et.current.shift=!0)},c=b=>{let y=Et.current.cmd&&Et.current.shift;b.key==="Meta"&&(Et.current.cmd=!1),b.key==="Shift"&&(Et.current.shift=!1);let P=Et.current.cmd&&Et.current.shift;y&&!P&&xe.length>0&&ec()},v=()=>{Et.current={cmd:!1,shift:!1},Qn([])};return document.addEventListener("keydown",a),document.addEventListener("keyup",c),window.addEventListener("blur",v),()=>{document.removeEventListener("keydown",a),document.removeEventListener("keyup",c),window.removeEventListener("blur",v)}},[C,xe,ec]),(0,x.useEffect)(()=>{if(!C||O)return;let a=c=>{let v=c.composedPath()[0]||c.target;Ke(v,"[data-feedback-toolbar]")||Ke(v,"[data-annotation-marker]")||Ke(v,"[data-annotation-popup]")||new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LI","TD","TH","LABEL","BLOCKQUOTE","FIGCAPTION","CAPTION","LEGEND","DT","DD","PRE","CODE","EM","STRONG","B","I","U","S","A","TIME","ADDRESS","CITE","Q","ABBR","DFN","MARK","SMALL","SUB","SUP"]).has(v.tagName)||v.isContentEditable||(Gn.current={x:c.clientX,y:c.clientY})};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[C,O]),(0,x.useEffect)(()=>{if(!C||O)return;let a=c=>{if(!Gn.current)return;let v=c.clientX-Gn.current.x,b=c.clientY-Gn.current.y,y=v*v+b*b,P=Ws*Ws;if(!jt&&y>=P&&(Nt.current=Gn.current,Xu(!0)),(jt||y>=P)&&Nt.current){if(jo.current){let q=Math.min(Nt.current.x,c.clientX),J=Math.min(Nt.current.y,c.clientY),Ee=Math.abs(c.clientX-Nt.current.x),Ce=Math.abs(c.clientY-Nt.current.y);jo.current.style.transform=`translate(${q}px, ${J}px)`,jo.current.style.width=`${Ee}px`,jo.current.style.height=`${Ce}px`}let D=Date.now();if(D-Qu.current<ff)return;Qu.current=D;let F=Nt.current.x,Q=Nt.current.y,U=Math.min(F,c.clientX),W=Math.min(Q,c.clientY),Y=Math.max(F,c.clientX),X=Math.max(Q,c.clientY),H=(U+Y)/2,j=(W+X)/2,it=new Set,he=[[U,W],[Y,W],[U,X],[Y,X],[H,j],[H,W],[H,X],[U,j],[Y,j]];for(let[q,J]of he){let Ee=document.elementsFromPoint(q,J);for(let Ce of Ee)Ce instanceof HTMLElement&&it.add(Ce)}let Je=document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav");for(let q of Je)if(q instanceof HTMLElement){let J=q.getBoundingClientRect(),Ee=J.left+J.width/2,Ce=J.top+J.height/2,en=Ee>=U&&Ee<=Y&&Ce>=W&&Ce<=X,Ft=Math.min(J.right,Y)-Math.max(J.left,U),oc=Math.min(J.bottom,X)-Math.max(J.top,W),vf=Ft>0&&oc>0?Ft*oc:0,rc=J.width*J.height,wf=rc>0?vf/rc:0;(en||wf>.5)&&it.add(q)}let He=[],at=new Set(["BUTTON","A","INPUT","IMG","P","H1","H2","H3","H4","H5","H6","LI","LABEL","TD","TH","SECTION","ARTICLE","ASIDE","NAV"]);for(let q of it){if(Ke(q,"[data-feedback-toolbar]")||Ke(q,"[data-annotation-marker]"))continue;let J=q.getBoundingClientRect();if(!(J.width>window.innerWidth*.8&&J.height>window.innerHeight*.5)&&!(J.width<10||J.height<10)&&J.left<Y&&J.right>U&&J.top<X&&J.bottom>W){let Ee=q.tagName,Ce=at.has(Ee);if(!Ce&&(Ee==="DIV"||Ee==="SPAN")){let en=q.textContent&&q.textContent.trim().length>0,Ft=q.onclick!==null||q.getAttribute("role")==="button"||q.getAttribute("role")==="link"||q.classList.contains("clickable")||q.hasAttribute("data-clickable");(en||Ft)&&!q.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")&&(Ce=!0)}if(Ce){let en=!1;for(let Ft of He)if(Ft.left<=J.left&&Ft.right>=J.right&&Ft.top<=J.top&&Ft.bottom>=J.bottom){en=!0;break}en||He.push(J)}}}if(Fo.current){let q=Fo.current;for(;q.children.length>He.length;)q.removeChild(q.lastChild);He.forEach((J,Ee)=>{let Ce=q.children[Ee];Ce||(Ce=document.createElement("div"),Ce.className=d.selectedElementHighlight,q.appendChild(Ce)),Ce.style.transform=`translate(${J.left}px, ${J.top}px)`,Ce.style.width=`${J.width}px`,Ce.style.height=`${J.height}px`})}}};return document.addEventListener("mousemove",a,{passive:!0}),()=>document.removeEventListener("mousemove",a)},[C,O,jt,Ws]),(0,x.useEffect)(()=>{if(!C)return;let a=c=>{let v=jt,b=Nt.current;if(jt&&b){Vr.current=!0;let y=Math.min(b.x,c.clientX),P=Math.min(b.y,c.clientY),D=Math.max(b.x,c.clientX),F=Math.max(b.y,c.clientY),Q=[];document.querySelectorAll("button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th").forEach(H=>{if(!(H instanceof HTMLElement)||Ke(H,"[data-feedback-toolbar]")||Ke(H,"[data-annotation-marker]"))return;let j=H.getBoundingClientRect();j.width>window.innerWidth*.8&&j.height>window.innerHeight*.5||j.width<10||j.height<10||j.left<D&&j.right>y&&j.top<F&&j.bottom>P&&Q.push({element:H,rect:j})});let W=Q.filter(({element:H})=>!Q.some(({element:j})=>j!==H&&H.contains(j))),Y=c.clientX/window.innerWidth*100,X=c.clientY+window.scrollY;if(W.length>0){let H=W.reduce((at,{rect:q})=>({left:Math.min(at.left,q.left),top:Math.min(at.top,q.top),right:Math.max(at.right,q.right),bottom:Math.max(at.bottom,q.bottom)}),{left:1/0,top:1/0,right:-1/0,bottom:-1/0}),j=W.slice(0,5).map(({element:at})=>Is(at).name).join(", "),it=W.length>5?` +${W.length-5} more`:"",he=W[0].element,Je=Ss(he),He=Ls(he);st({x:Y,y:X,clientY:c.clientY,element:`${W.length} elements: ${j}${it}`,elementPath:"multi-select",boundingBox:{x:H.left,y:H.top+window.scrollY,width:H.right-H.left,height:H.bottom-H.top},isMultiSelect:!0,fullPath:Ns(he),accessibility:Es(he),computedStyles:He,computedStylesObj:Je,nearbyElements:bs(he),cssClasses:Or(he),nearbyText:Br(he)})}else{let H=Math.abs(D-y),j=Math.abs(F-P);H>20&&j>20&&st({x:Y,y:X,clientY:c.clientY,element:"Area selection",elementPath:`region at (${Math.round(y)}, ${Math.round(P)})`,boundingBox:{x:y,y:P+window.scrollY,width:H,height:j},isMultiSelect:!0})}oe(null)}else v&&(Vr.current=!0);Gn.current=null,Nt.current=null,Xu(!1),Fo.current&&(Fo.current.innerHTML="")};return document.addEventListener("mouseup",a),()=>document.removeEventListener("mouseup",a)},[C,jt]);let Pt=(0,x.useCallback)(async(a,c,v)=>{let b=T.webhookUrl||N;if(!b||!T.webhooksEnabled&&!v)return!1;try{return(await fetch(b,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:a,timestamp:Date.now(),url:typeof window<"u"?window.location.href:void 0,...c})})).ok}catch(y){return console.warn("[Agentation] Webhook failed:",y),!1}},[N,T.webhookUrl,T.webhooksEnabled]),mf=(0,x.useCallback)(a=>{if(!O)return;let c={id:Date.now().toString(),x:O.x,y:O.y,comment:a,element:O.element,elementPath:O.elementPath,timestamp:Date.now(),selectedText:O.selectedText,boundingBox:O.boundingBox,nearbyText:O.nearbyText,cssClasses:O.cssClasses,isMultiSelect:O.isMultiSelect,isFixed:O.isFixed,fullPath:O.fullPath,accessibility:O.accessibility,computedStyles:O.computedStyles,nearbyElements:O.nearbyElements,reactComponents:O.reactComponents,elementBoundingBoxes:O.elementBoundingBoxes,...g&&Ge?{sessionId:Ge,url:typeof window<"u"?window.location.href:void 0,status:"pending"}:{}};p(v=>[...v,c]),Zr.current=c.id,setTimeout(()=>{Zr.current=null},300),setTimeout(()=>{Do(v=>new Set(v).add(c.id))},250),o?.(c),Pt("annotation.add",{annotation:c}),Qr(!0),setTimeout(()=>{st(null),Qr(!1)},150),window.getSelection()?.removeAllRanges(),g&&Ge&&Ps(g,Ge,c).then(v=>{v.id!==c.id&&(p(b=>b.map(y=>y.id===c.id?{...y,id:v.id}:y)),Do(b=>{let y=new Set(b);return y.delete(c.id),y.add(v.id),y}))}).catch(v=>{console.warn("[Agentation] Failed to sync annotation:",v)})},[O,o,Pt,g,Ge]),pf=(0,x.useCallback)(()=>{Qr(!0),setTimeout(()=>{st(null),Qr(!1)},150)},[]),Hs=(0,x.useCallback)(a=>{let c=z.findIndex(b=>b.id===a),v=z[c];K?.id===a&&(Kn(!0),setTimeout(()=>{zo(null),Ot(null),En([]),Kn(!1)},150)),Eu(a),Xr(b=>new Set(b).add(a)),v&&(r?.(v),Pt("annotation.delete",{annotation:v})),g&&X1(g,a).catch(b=>{console.warn("[Agentation] Failed to delete annotation from server:",b)}),setTimeout(()=>{p(b=>b.filter(y=>y.id!==a)),Xr(b=>{let y=new Set(b);return y.delete(a),y}),Eu(null),c<z.length-1&&(Nu(c),setTimeout(()=>Nu(null),200))},150)},[z,K,r,Pt,g]),Gr=(0,x.useCallback)(a=>{if(zo(a),$s(null),Ln(null),Ro([]),a.elementBoundingBoxes?.length){let c=[];for(let v of a.elementBoundingBoxes){let b=v.x+v.width/2,y=v.y+v.height/2-window.scrollY,P=Mo(b,y);P&&c.push(P)}En(c),Ot(null)}else if(a.boundingBox){let c=a.boundingBox,v=c.x+c.width/2,b=a.isFixed?c.y+c.height/2:c.y+c.height/2-window.scrollY,y=Mo(v,b);if(y){let P=y.getBoundingClientRect(),D=P.width/c.width,F=P.height/c.height;D<.5||F<.5?Ot(null):Ot(y)}else Ot(null);En([])}else Ot(null),En([])},[]),Jr=(0,x.useCallback)(a=>{if(!a){$s(null),Ln(null),Ro([]);return}if($s(a.id),a.elementBoundingBoxes?.length){let c=[];for(let v of a.elementBoundingBoxes){let b=v.x+v.width/2,y=v.y+v.height/2-window.scrollY,D=document.elementsFromPoint(b,y).find(F=>!F.closest("[data-annotation-marker]")&&!F.closest("[data-agentation-root]"));D&&c.push(D)}Ro(c),Ln(null)}else if(a.boundingBox){let c=a.boundingBox,v=c.x+c.width/2,b=a.isFixed?c.y+c.height/2:c.y+c.height/2-window.scrollY,y=Mo(v,b);if(y){let P=y.getBoundingClientRect(),D=P.width/c.width,F=P.height/c.height;D<.5||F<.5?Ln(null):Ln(y)}else Ln(null);Ro([])}else Ln(null),Ro([])},[]),hf=(0,x.useCallback)(a=>{if(!K)return;let c={...K,comment:a};p(v=>v.map(b=>b.id===K.id?c:b)),l?.(c),Pt("annotation.update",{annotation:c}),g&&Cp(g,K.id,{comment:a}).catch(v=>{console.warn("[Agentation] Failed to update annotation on server:",v)}),Kn(!0),setTimeout(()=>{zo(null),Ot(null),En([]),Kn(!1)},150)},[K,l,Pt,g]),gf=(0,x.useCallback)(()=>{Kn(!0),setTimeout(()=>{zo(null),Ot(null),En([]),Kn(!1)},150)},[]),In=(0,x.useCallback)(()=>{let a=z.length;if(a===0)return;s?.(z),Pt("annotations.clear",{annotations:z}),g&&Promise.all(z.map(v=>X1(g,v.id).catch(b=>{console.warn("[Agentation] Failed to delete annotation from server:",b)}))),bu(!0),Lt(!0);let c=a*30+200;setTimeout(()=>{p([]),Do(new Set),localStorage.removeItem(Ts(re)),bu(!1)},c),setTimeout(()=>Lt(!1),1500)},[re,z,s,Pt,g]),Us=(0,x.useCallback)(async()=>{let a=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:re,c=G1(z,a,T.outputDetail,Dt);if(c){if(m)try{await navigator.clipboard.writeText(c)}catch{}i?.(c),Wr(!0),setTimeout(()=>Wr(!1),2e3),T.autoClearAfterCopy&&setTimeout(()=>In(),500)}},[z,re,T.outputDetail,Dt,T.autoClearAfterCopy,In,m,i]),Xs=(0,x.useCallback)(async()=>{let a=typeof window<"u"?window.location.pathname+window.location.search+window.location.hash:re,c=G1(z,a,T.outputDetail,Dt);if(!c)return;u&&u(c,z),we("sending"),await new Promise(b=>setTimeout(b,150));let v=await Pt("submit",{output:c,annotations:z},!0);we(v?"sent":"failed"),setTimeout(()=>we("idle"),2500),v&&T.autoClearAfterCopy&&setTimeout(()=>In(),500)},[u,Pt,z,re,T.outputDetail,Dt,T.autoClearAfterCopy,In]);(0,x.useEffect)(()=>{if(!Zn)return;let a=10,c=b=>{let y=b.clientX-Zn.x,P=b.clientY-Zn.y,D=Math.sqrt(y*y+P*P);if(!At&&D>a&&Wu(!0),At||D>a){let F=Zn.toolbarX+y,Q=Zn.toolbarY+P,U=20,W=297,Y=44,H=W-(C?De==="connected"?297:257:44),j=U-H,it=window.innerWidth-U-W;F=Math.max(j,Math.min(it,F)),Q=Math.max(U,Math.min(window.innerHeight-Y-U,Q)),js({x:F,y:Q})}},v=()=>{At&&(Fs.current=!0),Wu(!1),Yu(null)};return document.addEventListener("mousemove",c),document.addEventListener("mouseup",v),()=>{document.removeEventListener("mousemove",c),document.removeEventListener("mouseup",v)}},[Zn,At,C,De]);let yf=(0,x.useCallback)(a=>{if(a.target.closest("button")||a.target.closest(`.${d.settingsPanel}`))return;let c=a.currentTarget.parentElement;if(!c)return;let v=c.getBoundingClientRect(),b=_e?.x??v.left,y=_e?.y??v.top,P=(Math.random()-.5)*10;df(P),Yu({x:a.clientX,y:a.clientY,toolbarX:b,toolbarY:y})},[_e]);if((0,x.useEffect)(()=>{if(!_e)return;let a=()=>{let y=_e.x,P=_e.y,Q=20-(297-(C?De==="connected"?297:257:44)),U=window.innerWidth-20-297;y=Math.max(Q,Math.min(U,y)),P=Math.max(20,Math.min(window.innerHeight-44-20,P)),(y!==_e.x||P!==_e.y)&&js({x:y,y:P})};return a(),window.addEventListener("resize",a),()=>window.removeEventListener("resize",a)},[_e,C,De]),(0,x.useEffect)(()=>{let a=c=>{let v=c.target,b=v.tagName==="INPUT"||v.tagName==="TEXTAREA"||v.isContentEditable;if(c.key==="Escape"){if(xe.length>0){Qn([]);return}O||C&&(Ye(),I(!1))}if((c.metaKey||c.ctrlKey)&&c.shiftKey&&(c.key==="f"||c.key==="F")){c.preventDefault(),Ye(),I(y=>!y);return}if(!(b||c.metaKey||c.ctrlKey)&&((c.key==="p"||c.key==="P")&&(c.preventDefault(),Ye(),Ys()),(c.key==="h"||c.key==="H")&&z.length>0&&(c.preventDefault(),Ye(),h(y=>!y)),(c.key==="c"||c.key==="C")&&z.length>0&&(c.preventDefault(),Ye(),Us()),(c.key==="x"||c.key==="X")&&z.length>0&&(c.preventDefault(),Ye(),In()),c.key==="s"||c.key==="S")){let y=Bt(T.webhookUrl)||Bt(N||"");z.length>0&&y&&ht==="idle"&&(c.preventDefault(),Ye(),Xs())}};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[C,O,z.length,T.webhookUrl,N,ht,Xs,Ys,Us,In,xe]),!ke)return null;let Jn=z.length>0,qr=z.filter(a=>!Uu.has(a.id)),tc=z.filter(a=>Uu.has(a.id)),nc=a=>{let P=a.x/100*window.innerWidth,D=typeof a.y=="string"?parseFloat(a.y):a.y,F={};window.innerHeight-D-22-10<80&&(F.top="auto",F.bottom="calc(100% + 10px)");let U=P-200/2,W=10;if(U<W){let Y=W-U;F.left=`calc(50% + ${Y}px)`}else if(U+200>window.innerWidth-W){let Y=U+200-(window.innerWidth-W);F.left=`calc(50% - ${Y}px)`}return F};return(0,wu.createPortal)((0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{className:d.toolbar,"data-feedback-toolbar":!0,style:_e?{left:_e.x,top:_e.y,right:"auto",bottom:"auto"}:void 0,children:(0,f.jsxs)("div",{className:`${d.toolbarContainer} ${Z?"":d.light} ${C?d.expanded:d.collapsed} ${Au?d.entrance:""} ${At?d.dragging:""} ${!T.webhooksEnabled&&(Bt(T.webhookUrl)||Bt(N||""))?d.serverConnected:""}`,onClick:C?void 0:a=>{if(Fs.current){Fs.current=!1,a.preventDefault();return}I(!0)},onMouseDown:yf,role:C?void 0:"button",tabIndex:C?-1:0,title:C?void 0:"Start feedback mode",style:{...At&&{transform:`scale(1.05) rotate(${cf}deg)`,cursor:"grabbing"}},children:[(0,f.jsxs)("div",{className:`${d.toggleContent} ${C?d.hidden:d.visible}`,children:[(0,f.jsx)(ep,{size:24}),Jn&&(0,f.jsx)("span",{className:`${d.badge} ${C?d.fadeOut:""} ${Au?d.entrance:""}`,style:{backgroundColor:T.annotationColor},children:z.length})]}),(0,f.jsxs)("div",{className:`${d.controlsContent} ${C?d.visible:d.hidden} ${_e&&_e.y<100?d.tooltipBelow:""} ${af||Bo?d.tooltipsHidden:""}`,onMouseLeave:uf,children:[(0,f.jsxs)("div",{className:`${d.buttonWrapper} ${_e&&_e.x<120?d.buttonWrapperAlignLeft:""}`,children:[(0,f.jsx)("button",{className:`${d.controlButton} ${Z?"":d.light}`,onClick:a=>{a.stopPropagation(),Ye(),Ys()},"data-active":gt,children:(0,f.jsx)(rp,{size:24,isPaused:gt})}),(0,f.jsxs)("span",{className:d.buttonTooltip,children:[gt?"Resume animations":"Pause animations",(0,f.jsx)("span",{className:d.shortcut,children:"P"})]})]}),(0,f.jsxs)("div",{className:d.buttonWrapper,children:[(0,f.jsx)("button",{className:`${d.controlButton} ${Z?"":d.light}`,onClick:a=>{a.stopPropagation(),Ye(),h(!_)},disabled:!Jn,children:(0,f.jsx)(op,{size:24,isOpen:_})}),(0,f.jsxs)("span",{className:d.buttonTooltip,children:[_?"Hide markers":"Show markers",(0,f.jsx)("span",{className:d.shortcut,children:"H"})]})]}),(0,f.jsxs)("div",{className:d.buttonWrapper,children:[(0,f.jsx)("button",{className:`${d.controlButton} ${Z?"":d.light} ${Sn?d.statusShowing:""}`,onClick:a=>{a.stopPropagation(),Ye(),Us()},disabled:!Jn,"data-active":Sn,children:(0,f.jsx)(tp,{size:24,copied:Sn})}),(0,f.jsxs)("span",{className:d.buttonTooltip,children:["Copy feedback",(0,f.jsx)("span",{className:d.shortcut,children:"C"})]})]}),(0,f.jsxs)("div",{className:`${d.buttonWrapper} ${d.sendButtonWrapper} ${!T.webhooksEnabled&&(Bt(T.webhookUrl)||Bt(N||""))?d.sendButtonVisible:""}`,children:[(0,f.jsxs)("button",{className:`${d.controlButton} ${Z?"":d.light} ${ht==="sent"||ht==="failed"?d.statusShowing:""}`,onClick:a=>{a.stopPropagation(),Ye(),Xs()},disabled:!Jn||!Bt(T.webhookUrl)&&!Bt(N||"")||ht==="sending","data-no-hover":ht==="sent"||ht==="failed",tabIndex:Bt(T.webhookUrl)||Bt(N||"")?0:-1,children:[(0,f.jsx)(np,{size:24,state:ht}),Jn&&ht==="idle"&&(0,f.jsx)("span",{className:`${d.buttonBadge} ${Z?"":d.light}`,style:{backgroundColor:T.annotationColor},children:z.length})]}),(0,f.jsxs)("span",{className:d.buttonTooltip,children:["Send Annotations",(0,f.jsx)("span",{className:d.shortcut,children:"S"})]})]}),(0,f.jsxs)("div",{className:d.buttonWrapper,children:[(0,f.jsx)("button",{className:`${d.controlButton} ${Z?"":d.light}`,onClick:a=>{a.stopPropagation(),Ye(),In()},disabled:!Jn,"data-danger":!0,children:(0,f.jsx)(sp,{size:24})}),(0,f.jsxs)("span",{className:d.buttonTooltip,children:["Clear all",(0,f.jsx)("span",{className:d.shortcut,children:"X"})]})]}),(0,f.jsxs)("div",{className:d.buttonWrapper,children:[(0,f.jsx)("button",{className:`${d.controlButton} ${Z?"":d.light}`,onClick:a=>{a.stopPropagation(),Ye(),Ru(!Bo)},children:(0,f.jsx)(lp,{size:24})}),g&&De!=="disconnected"&&(0,f.jsx)("span",{className:`${d.mcpIndicator} ${Z?"":d.light} ${d[De]} ${Bo?d.hidden:""}`,title:De==="connected"?"MCP Connected":"MCP Connecting..."}),(0,f.jsx)("span",{className:d.buttonTooltip,children:"Settings"})]}),(0,f.jsx)("div",{className:`${d.divider} ${Z?"":d.light}`}),(0,f.jsxs)("div",{className:`${d.buttonWrapper} ${_e&&typeof window<"u"&&_e.x>window.innerWidth-120?d.buttonWrapperAlignRight:""}`,children:[(0,f.jsx)("button",{className:`${d.controlButton} ${Z?"":d.light}`,onClick:a=>{a.stopPropagation(),Ye(),I(!1)},children:(0,f.jsx)(ip,{size:24})}),(0,f.jsxs)("span",{className:d.buttonTooltip,children:["Exit",(0,f.jsx)("span",{className:d.shortcut,children:"Esc"})]})]})]}),(0,f.jsx)("div",{className:`${d.settingsPanel} ${Z?d.dark:d.light} ${sf?d.enter:d.exit}`,onClick:a=>a.stopPropagation(),style:_e&&_e.y<230?{bottom:"auto",top:"calc(100% + 0.5rem)"}:void 0,children:(0,f.jsxs)("div",{className:`${d.settingsPanelContainer} ${Bu?d.transitioning:""}`,children:[(0,f.jsxs)("div",{className:`${d.settingsPage} ${Bs==="automations"?d.slideLeft:""}`,children:[(0,f.jsxs)("div",{className:d.settingsHeader,children:[(0,f.jsxs)("span",{className:d.settingsBrand,children:[(0,f.jsx)("span",{className:d.settingsBrandSlash,style:{color:T.annotationColor,transition:"color 0.2s ease"},children:"/"}),"agentation"]}),(0,f.jsxs)("span",{className:d.settingsVersion,children:["v","2.1.1"]}),(0,f.jsx)("button",{className:d.themeToggle,onClick:()=>Du(!Z),title:Z?"Switch to light mode":"Switch to dark mode",children:(0,f.jsx)("span",{className:d.themeIconWrapper,children:(0,f.jsx)("span",{className:d.themeIcon,children:Z?(0,f.jsx)(ap,{size:20}):(0,f.jsx)(up,{size:20})},Z?"sun":"moon")})})]}),(0,f.jsxs)("div",{className:d.settingsSection,children:[(0,f.jsxs)("div",{className:d.settingsRow,children:[(0,f.jsxs)("div",{className:`${d.settingsLabel} ${Z?"":d.light}`,children:["Output Detail",(0,f.jsx)(Oo,{content:"Controls how much detail is included in the copied output",children:(0,f.jsx)("span",{className:d.helpIcon,children:(0,f.jsx)(zr,{size:20})})})]}),(0,f.jsxs)("button",{className:`${d.cycleButton} ${Z?"":d.light}`,onClick:()=>{let c=(jr.findIndex(v=>v.value===T.outputDetail)+1)%jr.length;qt(v=>({...v,outputDetail:jr[c].value}))},children:[(0,f.jsx)("span",{className:d.cycleButtonText,children:jr.find(a=>a.value===T.outputDetail)?.label},T.outputDetail),(0,f.jsx)("span",{className:d.cycleDots,children:jr.map((a,c)=>(0,f.jsx)("span",{className:`${d.cycleDot} ${Z?"":d.light} ${T.outputDetail===a.value?d.active:""}`},a.value))})]})]}),(0,f.jsxs)("div",{className:`${d.settingsRow} ${d.settingsRowMarginTop} ${Vn?"":d.settingsRowDisabled}`,children:[(0,f.jsxs)("div",{className:`${d.settingsLabel} ${Z?"":d.light}`,children:["React Components",(0,f.jsx)(Oo,{content:Vn?"Include React component names in annotations":"Disabled \u2014 production builds minify component names, making detection unreliable. Use on localhost in development mode.",children:(0,f.jsx)("span",{className:d.helpIcon,children:(0,f.jsx)(zr,{size:20})})})]}),(0,f.jsxs)("label",{className:`${d.toggleSwitch} ${Vn?"":d.disabled}`,children:[(0,f.jsx)("input",{type:"checkbox",checked:Vn&&T.reactEnabled,disabled:!Vn,onChange:()=>qt(a=>({...a,reactEnabled:!a.reactEnabled}))}),(0,f.jsx)("span",{className:d.toggleSlider})]})]})]}),(0,f.jsxs)("div",{className:d.settingsSection,children:[(0,f.jsx)("div",{className:`${d.settingsLabel} ${d.settingsLabelMarker} ${Z?"":d.light}`,children:"Marker Colour"}),(0,f.jsx)("div",{className:d.colorOptions,children:jp.map(a=>(0,f.jsx)("div",{role:"button",onClick:()=>qt(c=>({...c,annotationColor:a.value})),style:{borderColor:T.annotationColor===a.value?a.value:"transparent"},className:`${d.colorOptionRing} ${T.annotationColor===a.value?d.selected:""}`,children:(0,f.jsx)("div",{className:`${d.colorOption} ${T.annotationColor===a.value?d.selected:""}`,style:{backgroundColor:a.value},title:a.label})},a.value))})]}),(0,f.jsxs)("div",{className:d.settingsSection,children:[(0,f.jsxs)("label",{className:d.settingsToggle,children:[(0,f.jsx)("input",{type:"checkbox",id:"autoClearAfterCopy",checked:T.autoClearAfterCopy,onChange:a=>qt(c=>({...c,autoClearAfterCopy:a.target.checked}))}),(0,f.jsx)("label",{className:`${d.customCheckbox} ${T.autoClearAfterCopy?d.checked:""}`,htmlFor:"autoClearAfterCopy",children:T.autoClearAfterCopy&&(0,f.jsx)(W1,{size:14})}),(0,f.jsxs)("span",{className:`${d.toggleLabel} ${Z?"":d.light}`,children:["Clear on copy/send",(0,f.jsx)(Oo,{content:"Automatically clear annotations after copying",children:(0,f.jsx)("span",{className:`${d.helpIcon} ${d.helpIconNudge2}`,children:(0,f.jsx)(zr,{size:20})})})]})]}),(0,f.jsxs)("label",{className:`${d.settingsToggle} ${d.settingsToggleMarginBottom}`,children:[(0,f.jsx)("input",{type:"checkbox",id:"blockInteractions",checked:T.blockInteractions,onChange:a=>qt(c=>({...c,blockInteractions:a.target.checked}))}),(0,f.jsx)("label",{className:`${d.customCheckbox} ${T.blockInteractions?d.checked:""}`,htmlFor:"blockInteractions",children:T.blockInteractions&&(0,f.jsx)(W1,{size:14})}),(0,f.jsx)("span",{className:`${d.toggleLabel} ${Z?"":d.light}`,children:"Block page interactions"})]})]}),(0,f.jsx)("div",{className:`${d.settingsSection} ${d.settingsSectionExtraPadding}`,children:(0,f.jsxs)("button",{className:`${d.settingsNavLink} ${Z?"":d.light}`,onClick:()=>Os("automations"),children:[(0,f.jsx)("span",{children:"Manage MCP & Webhooks"}),(0,f.jsxs)("span",{className:d.settingsNavLinkRight,children:[g&&De!=="disconnected"&&(0,f.jsx)("span",{className:`${d.mcpNavIndicator} ${d[De]}`}),(0,f.jsx)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,f.jsx)("path",{d:"M7.5 12.5L12 8L7.5 3.5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})})]}),(0,f.jsxs)("div",{className:`${d.settingsPage} ${d.automationsPage} ${Bs==="automations"?d.slideIn:""}`,children:[(0,f.jsxs)("button",{className:`${d.settingsBackButton} ${Z?"":d.light}`,onClick:()=>Os("main"),children:[(0,f.jsx)(dp,{size:16}),(0,f.jsx)("span",{children:"Manage MCP & Webhooks"})]}),(0,f.jsxs)("div",{className:d.settingsSection,children:[(0,f.jsxs)("div",{className:d.settingsRow,children:[(0,f.jsxs)("span",{className:`${d.automationHeader} ${Z?"":d.light}`,children:["MCP Connection",(0,f.jsx)(Oo,{content:"Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",children:(0,f.jsx)("span",{className:`${d.helpIcon} ${d.helpIconNudgeDown}`,children:(0,f.jsx)(zr,{size:20})})})]}),g&&(0,f.jsx)("div",{className:`${d.mcpStatusDot} ${d[De]}`,title:De==="connected"?"Connected":De==="connecting"?"Connecting...":"Disconnected"})]}),(0,f.jsxs)("p",{className:`${d.automationDescription} ${Z?"":d.light}`,style:{paddingBottom:6},children:["MCP connection allows agents to receive and act on annotations."," ",(0,f.jsx)("a",{href:"https://agentation.dev/mcp",target:"_blank",rel:"noopener noreferrer",className:`${d.learnMoreLink} ${Z?"":d.light}`,children:"Learn more"})]})]}),(0,f.jsxs)("div",{className:`${d.settingsSection} ${d.settingsSectionGrow}`,children:[(0,f.jsxs)("div",{className:d.settingsRow,children:[(0,f.jsxs)("span",{className:`${d.automationHeader} ${Z?"":d.light}`,children:["Webhooks",(0,f.jsx)(Oo,{content:"Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",children:(0,f.jsx)("span",{className:`${d.helpIcon} ${d.helpIconNoNudge}`,children:(0,f.jsx)(zr,{size:20})})})]}),(0,f.jsxs)("div",{className:d.autoSendRow,children:[(0,f.jsx)("span",{className:`${d.autoSendLabel} ${Z?"":d.light} ${T.webhooksEnabled?d.active:""}`,children:"Auto-Send"}),(0,f.jsxs)("label",{className:`${d.toggleSwitch} ${T.webhookUrl?"":d.disabled}`,children:[(0,f.jsx)("input",{type:"checkbox",checked:T.webhooksEnabled,disabled:!T.webhookUrl,onChange:()=>qt(a=>({...a,webhooksEnabled:!a.webhooksEnabled}))}),(0,f.jsx)("span",{className:d.toggleSlider})]})]})]}),(0,f.jsx)("p",{className:`${d.automationDescription} ${Z?"":d.light}`,children:"The webhook URL will receive live annotation changes and annotation data."}),(0,f.jsx)("textarea",{className:`${d.webhookUrlInput} ${Z?"":d.light}`,placeholder:"Webhook URL",value:T.webhookUrl,style:{"--marker-color":T.annotationColor},onChange:a=>qt(c=>({...c,webhookUrl:a.target.value}))})]})]})]})})]})}),(0,f.jsxs)("div",{className:d.markersLayer,"data-feedback-toolbar":!0,children:[S&&qr.filter(a=>!a.isFixed).map((a,c)=>{let v=!M&&Hr===a.id,b=Lu===a.id,y=(v||b)&&!K,P=a.isMultiSelect,D=P?"#34C759":T.annotationColor,F=z.findIndex(Y=>Y.id===a.id),Q=!Hu.has(a.id),U=M?d.exit:Cu?d.clearing:Q?d.enter:"",W=y&&T.markerClickBehavior==="delete";return(0,f.jsxs)("div",{className:`${d.marker} ${P?d.multiSelect:""} ${U} ${W?d.hovered:""}`,"data-annotation-marker":!0,style:{left:`${a.x}%`,top:a.y,backgroundColor:W?void 0:D,animationDelay:M?`${(qr.length-1-c)*20}ms`:`${c*20}ms`},onMouseEnter:()=>!M&&a.id!==Zr.current&&Jr(a),onMouseLeave:()=>Jr(null),onClick:Y=>{Y.stopPropagation(),M||(T.markerClickBehavior==="delete"?Hs(a.id):Gr(a))},onContextMenu:Y=>{T.markerClickBehavior==="delete"&&(Y.preventDefault(),Y.stopPropagation(),M||Gr(a))},children:[y?W?(0,f.jsx)(fu,{size:P?18:16}):(0,f.jsx)(Y1,{size:16}):(0,f.jsx)("span",{className:Ur!==null&&F>=Ur?d.renumber:void 0,children:F+1}),v&&!K&&(0,f.jsxs)("div",{className:`${d.markerTooltip} ${Z?"":d.light} ${d.enter}`,style:nc(a),children:[(0,f.jsxs)("span",{className:d.markerQuote,children:[a.element,a.selectedText&&` "${a.selectedText.slice(0,30)}${a.selectedText.length>30?"...":""}"`]}),(0,f.jsx)("span",{className:d.markerNote,children:a.comment})]})]},a.id)}),S&&!M&&tc.filter(a=>!a.isFixed).map(a=>{let c=a.isMultiSelect;return(0,f.jsx)("div",{className:`${d.marker} ${d.hovered} ${c?d.multiSelect:""} ${d.exit}`,"data-annotation-marker":!0,style:{left:`${a.x}%`,top:a.y},children:(0,f.jsx)(fu,{size:c?12:10})},a.id)})]}),(0,f.jsxs)("div",{className:d.fixedMarkersLayer,"data-feedback-toolbar":!0,children:[S&&qr.filter(a=>a.isFixed).map((a,c)=>{let v=qr.filter(X=>X.isFixed),b=!M&&Hr===a.id,y=Lu===a.id,P=(b||y)&&!K,D=a.isMultiSelect,F=D?"#34C759":T.annotationColor,Q=z.findIndex(X=>X.id===a.id),U=!Hu.has(a.id),W=M?d.exit:Cu?d.clearing:U?d.enter:"",Y=P&&T.markerClickBehavior==="delete";return(0,f.jsxs)("div",{className:`${d.marker} ${d.fixed} ${D?d.multiSelect:""} ${W} ${Y?d.hovered:""}`,"data-annotation-marker":!0,style:{left:`${a.x}%`,top:a.y,backgroundColor:Y?void 0:F,animationDelay:M?`${(v.length-1-c)*20}ms`:`${c*20}ms`},onMouseEnter:()=>!M&&a.id!==Zr.current&&Jr(a),onMouseLeave:()=>Jr(null),onClick:X=>{X.stopPropagation(),M||(T.markerClickBehavior==="delete"?Hs(a.id):Gr(a))},onContextMenu:X=>{T.markerClickBehavior==="delete"&&(X.preventDefault(),X.stopPropagation(),M||Gr(a))},children:[P?Y?(0,f.jsx)(fu,{size:D?18:16}):(0,f.jsx)(Y1,{size:16}):(0,f.jsx)("span",{className:Ur!==null&&Q>=Ur?d.renumber:void 0,children:Q+1}),b&&!K&&(0,f.jsxs)("div",{className:`${d.markerTooltip} ${Z?"":d.light} ${d.enter}`,style:nc(a),children:[(0,f.jsxs)("span",{className:d.markerQuote,children:[a.element,a.selectedText&&` "${a.selectedText.slice(0,30)}${a.selectedText.length>30?"...":""}"`]}),(0,f.jsx)("span",{className:d.markerNote,children:a.comment})]})]},a.id)}),S&&!M&&tc.filter(a=>a.isFixed).map(a=>{let c=a.isMultiSelect;return(0,f.jsx)("div",{className:`${d.marker} ${d.fixed} ${d.hovered} ${c?d.multiSelect:""} ${d.exit}`,"data-annotation-marker":!0,style:{left:`${a.x}%`,top:a.y},children:(0,f.jsx)(Jm,{size:c?12:10})},a.id)})]}),C&&(0,f.jsxs)("div",{className:d.overlay,"data-feedback-toolbar":!0,style:O||K?{zIndex:99999}:void 0,children:[B?.rect&&!O&&!Tu&&!jt&&(0,f.jsx)("div",{className:`${d.hoverHighlight} ${d.enter}`,style:{left:B.rect.left,top:B.rect.top,width:B.rect.width,height:B.rect.height,borderColor:`${T.annotationColor}80`,backgroundColor:`${T.annotationColor}0A`}}),xe.filter(a=>document.contains(a.element)).map((a,c)=>{let v=a.element.getBoundingClientRect(),b=xe.length>1;return(0,f.jsx)("div",{className:b?d.multiSelectOutline:d.singleSelectOutline,style:{position:"fixed",left:v.left,top:v.top,width:v.width,height:v.height,...b?{}:{borderColor:`${T.annotationColor}99`,backgroundColor:`${T.annotationColor}0D`}}},c)}),Hr&&!O&&(()=>{let a=z.find(y=>y.id===Hr);if(!a?.boundingBox)return null;if(a.elementBoundingBoxes?.length)return Su.length>0?Su.filter(y=>document.contains(y)).map((y,P)=>{let D=y.getBoundingClientRect();return(0,f.jsx)("div",{className:`${d.multiSelectOutline} ${d.enter}`,style:{left:D.left,top:D.top,width:D.width,height:D.height}},`hover-outline-live-${P}`)}):a.elementBoundingBoxes.map((y,P)=>(0,f.jsx)("div",{className:`${d.multiSelectOutline} ${d.enter}`,style:{left:y.x,top:y.y-Nn,width:y.width,height:y.height}},`hover-outline-${P}`));let c=Rs&&document.contains(Rs)?Rs.getBoundingClientRect():null,v=c?{x:c.left,y:c.top,width:c.width,height:c.height}:{x:a.boundingBox.x,y:a.isFixed?a.boundingBox.y:a.boundingBox.y-Nn,width:a.boundingBox.width,height:a.boundingBox.height},b=a.isMultiSelect;return(0,f.jsx)("div",{className:`${b?d.multiSelectOutline:d.singleSelectOutline} ${d.enter}`,style:{left:v.x,top:v.y,width:v.width,height:v.height,...b?{}:{borderColor:`${T.annotationColor}99`,backgroundColor:`${T.annotationColor}0D`}}})})(),B&&!O&&!Tu&&!jt&&(0,f.jsxs)("div",{className:`${d.hoverTooltip} ${d.enter}`,style:{left:Math.max(8,Math.min(V.x,window.innerWidth-100)),top:Math.max(V.y-(B.reactComponents?48:32),8)},children:[B.reactComponents&&(0,f.jsx)("div",{className:d.hoverReactPath,children:B.reactComponents}),(0,f.jsx)("div",{className:d.hoverElementName,children:B.elementName})]}),O&&(0,f.jsxs)(f.Fragment,{children:[O.multiSelectElements?.length?O.multiSelectElements.filter(a=>document.contains(a)).map((a,c)=>{let v=a.getBoundingClientRect();return(0,f.jsx)("div",{className:`${d.multiSelectOutline} ${Ao?d.exit:d.enter}`,style:{left:v.left,top:v.top,width:v.width,height:v.height}},`pending-multi-${c}`)}):O.targetElement&&document.contains(O.targetElement)?(()=>{let a=O.targetElement.getBoundingClientRect();return(0,f.jsx)("div",{className:`${d.singleSelectOutline} ${Ao?d.exit:d.enter}`,style:{left:a.left,top:a.top,width:a.width,height:a.height,borderColor:`${T.annotationColor}99`,backgroundColor:`${T.annotationColor}0D`}})})():O.boundingBox&&(0,f.jsx)("div",{className:`${O.isMultiSelect?d.multiSelectOutline:d.singleSelectOutline} ${Ao?d.exit:d.enter}`,style:{left:O.boundingBox.x,top:O.boundingBox.y-Nn,width:O.boundingBox.width,height:O.boundingBox.height,...O.isMultiSelect?{}:{borderColor:`${T.annotationColor}99`,backgroundColor:`${T.annotationColor}0D`}}}),(()=>{let a=O.x,c=O.isFixed?O.y:O.y-Nn;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{className:`${d.marker} ${d.pending} ${O.isMultiSelect?d.multiSelect:""} ${Ao?d.exit:d.enter}`,style:{left:`${a}%`,top:c,backgroundColor:O.isMultiSelect?"#34C759":T.annotationColor},children:(0,f.jsx)(qm,{size:12})}),(0,f.jsx)(H1,{ref:Zu,element:O.element,selectedText:O.selectedText,computedStyles:O.computedStylesObj,placeholder:O.element==="Area selection"?"What should change in this area?":O.isMultiSelect?"Feedback for this group of elements...":"What should change?",onSubmit:mf,onCancel:pf,isExiting:Ao,lightMode:!Z,accentColor:O.isMultiSelect?"#34C759":T.annotationColor,style:{left:Math.max(160,Math.min(window.innerWidth-160,a/100*window.innerWidth)),...c>window.innerHeight-290?{bottom:window.innerHeight-c+20}:{top:c+20}}})]})})()]}),K&&(0,f.jsxs)(f.Fragment,{children:[K.elementBoundingBoxes?.length?Pu.length>0?Pu.filter(a=>document.contains(a)).map((a,c)=>{let v=a.getBoundingClientRect();return(0,f.jsx)("div",{className:`${d.multiSelectOutline} ${d.enter}`,style:{left:v.left,top:v.top,width:v.width,height:v.height}},`edit-multi-live-${c}`)}):K.elementBoundingBoxes.map((a,c)=>(0,f.jsx)("div",{className:`${d.multiSelectOutline} ${d.enter}`,style:{left:a.x,top:a.y-Nn,width:a.width,height:a.height}},`edit-multi-${c}`)):(()=>{let a=zs&&document.contains(zs)?zs.getBoundingClientRect():null,c=a?{x:a.left,y:a.top,width:a.width,height:a.height}:K.boundingBox?{x:K.boundingBox.x,y:K.isFixed?K.boundingBox.y:K.boundingBox.y-Nn,width:K.boundingBox.width,height:K.boundingBox.height}:null;return c?(0,f.jsx)("div",{className:`${K.isMultiSelect?d.multiSelectOutline:d.singleSelectOutline} ${d.enter}`,style:{left:c.x,top:c.y,width:c.width,height:c.height,...K.isMultiSelect?{}:{borderColor:`${T.annotationColor}99`,backgroundColor:`${T.annotationColor}0D`}}}):null})(),(0,f.jsx)(H1,{ref:Ku,element:K.element,selectedText:K.selectedText,computedStyles:yp(K.computedStyles),placeholder:"Edit your feedback...",initialValue:K.comment,submitLabel:"Save",onSubmit:hf,onCancel:gf,onDelete:()=>Hs(K.id),isExiting:_f,lightMode:!Z,accentColor:K.isMultiSelect?"#34C759":T.annotationColor,style:(()=>{let a=K.isFixed?K.y:K.y-Nn;return{left:Math.max(160,Math.min(window.innerWidth-160,K.x/100*window.innerWidth)),...a>window.innerHeight-290?{bottom:window.innerHeight-a+20}:{top:a+20}}})()})]}),jt&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)("div",{ref:jo,className:d.dragSelection}),(0,f.jsx)("div",{ref:Fo,className:d.highlightsContainer})]})]})]}),document.body)}var Fr=null,bn=null;function Fp(){let e={},t=document.getElementById("agentation-config");if(t){for(let n of Array.from(t.attributes))if(n.name.startsWith("data-")){let o=n.name.slice(5).replace(/-([a-z])/g,(r,l)=>l.toUpperCase());e[o]=n.value}}return e}function Ms(){if(bn)return;let e=Fp();bn=document.createElement("div"),bn.id="agentation-root",document.body.appendChild(bn),Fr=(0,of.createRoot)(bn),Fr.render(nf.default.createElement(tf,{endpoint:e.endpoint||void 0,sessionId:e.sessionId||void 0,webhookUrl:e.webhookUrl||void 0}))}function rf(){Fr&&(Fr.unmount(),Fr=null),bn&&(bn.remove(),bn=null)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ms):Ms();document.addEventListener("turbo:before-cache",rf);document.addEventListener("turbo:load",Ms);window.__agentation={mount:Ms,unmount:rf};})();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.production.min.js:
  (**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
