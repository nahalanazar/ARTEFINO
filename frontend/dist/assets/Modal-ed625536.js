import{aZ as _,r as o,aL as f,j as n,aO as d,a_ as je,a$ as Ce,b0 as Ee,b1 as ke,b2 as U,b3 as Be,b4 as Ae,b5 as W,b6 as De,b7 as Oe,b8 as K,b9 as Fe,ba as Ie,bb as He,bc as xe}from"./index-54d6a279.js";var p;function z(e){if((!p&&p!==0||e)&&_){var t=document.createElement("div");t.style.position="absolute",t.style.top="-9999px",t.style.width="50px",t.style.height="50px",t.style.overflow="scroll",document.body.appendChild(t),p=t.offsetWidth-t.clientWidth,document.body.removeChild(t)}return p}const Z=o.forwardRef(({className:e,bsPrefix:t,as:s="div",...r},l)=>(t=f(t,"modal-body"),n.jsx(s,{ref:l,className:d(e,t),...r})));Z.displayName="ModalBody";const Le=Z,q=o.forwardRef(({bsPrefix:e,className:t,contentClassName:s,centered:r,size:l,fullscreen:i,children:w,scrollable:R,...v},N)=>{e=f(e,"modal");const m=`${e}-dialog`,c=typeof i=="string"?`${e}-fullscreen-${i}`:`${e}-fullscreen`;return n.jsx("div",{...v,ref:N,className:d(m,t,l&&`${e}-${l}`,r&&`${m}-centered`,R&&`${m}-scrollable`,i&&c),children:n.jsx("div",{className:d(`${e}-content`,s),children:w})})});q.displayName="ModalDialog";const G=q,J=o.forwardRef(({className:e,bsPrefix:t,as:s="div",...r},l)=>(t=f(t,"modal-footer"),n.jsx(s,{ref:l,className:d(e,t),...r})));J.displayName="ModalFooter";const Ue=J,Q=o.forwardRef(({bsPrefix:e,className:t,closeLabel:s="Close",closeButton:r=!1,...l},i)=>(e=f(e,"modal-header"),n.jsx(je,{ref:i,...l,className:d(t,e),closeLabel:s,closeButton:r})));Q.displayName="ModalHeader";const We=Q,ze=Ce("h4"),V=o.forwardRef(({className:e,bsPrefix:t,as:s=ze,...r},l)=>(t=f(t,"modal-title"),n.jsx(s,{ref:l,className:d(e,t),...r})));V.displayName="ModalTitle";const _e=V;function Ke(e){return n.jsx(K,{...e,timeout:null})}function Ze(e){return n.jsx(K,{...e,timeout:null})}const X=o.forwardRef(({bsPrefix:e,className:t,style:s,dialogClassName:r,contentClassName:l,children:i,dialogAs:w=G,"aria-labelledby":R,"aria-describedby":v,"aria-label":N,show:m=!1,animation:c=!0,backdrop:h=!0,keyboard:Y=!0,onEscapeKeyDown:T,onShow:P,onHide:y,container:ee,autoFocus:ae=!0,enforceFocus:te=!0,restoreFocus:oe=!0,restoreFocusOptions:ne,onEntered:le,onExit:j,onExiting:se,onEnter:C,onEntering:E,onExited:k,backdropClassName:B,manager:A,...re},de)=>{const[ie,ce]=o.useState({}),[ue,D]=o.useState(!1),b=o.useRef(!1),S=o.useRef(!1),g=o.useRef(null),[M,fe]=Ee(),me=ke(de,fe),O=U(y),ge=Be();e=f(e,"modal");const Me=o.useMemo(()=>({onHide:O}),[O]);function F(){return A||Fe({isRTL:ge})}function I(a){if(!_)return;const u=F().getScrollbarWidth()>0,L=a.scrollHeight>He(a).documentElement.clientHeight;ce({paddingRight:u&&!L?z():void 0,paddingLeft:!u&&L?z():void 0})}const $=U(()=>{M&&I(M.dialog)});Ae(()=>{W(window,"resize",$),g.current==null||g.current()});const he=()=>{b.current=!0},ye=a=>{b.current&&M&&a.target===M.dialog&&(S.current=!0),b.current=!1},H=()=>{D(!0),g.current=xe(M.dialog,()=>{D(!1)})},pe=a=>{a.target===a.currentTarget&&H()},we=a=>{if(h==="static"){pe(a);return}if(S.current||a.target!==a.currentTarget){S.current=!1;return}y==null||y()},Re=a=>{Y?T==null||T(a):(a.preventDefault(),h==="static"&&H())},ve=(a,u)=>{a&&I(a),C==null||C(a,u)},Ne=a=>{g.current==null||g.current(),j==null||j(a)},be=(a,u)=>{E==null||E(a,u),Ie(window,"resize",$)},Se=a=>{a&&(a.style.display=""),k==null||k(a),W(window,"resize",$)},$e=o.useCallback(a=>n.jsx("div",{...a,className:d(`${e}-backdrop`,B,!c&&"show")}),[c,B,e]),x={...s,...ie};x.display="block";const Te=a=>n.jsx("div",{role:"dialog",...a,style:x,className:d(t,e,ue&&`${e}-static`,!c&&"show"),onClick:h?we:void 0,onMouseUp:ye,"aria-label":N,"aria-labelledby":R,"aria-describedby":v,children:n.jsx(w,{...re,onMouseDown:he,className:r,contentClassName:l,children:i})});return n.jsx(De.Provider,{value:Me,children:n.jsx(Oe,{show:m,ref:me,backdrop:h,container:ee,keyboard:!0,autoFocus:ae,enforceFocus:te,restoreFocus:oe,restoreFocusOptions:ne,onEscapeKeyDown:Re,onShow:P,onHide:y,onEnter:ve,onEntering:be,onEntered:le,onExit:Ne,onExiting:se,onExited:Se,manager:F(),transition:c?Ke:void 0,backdropTransition:c?Ze:void 0,renderBackdrop:$e,renderDialog:Te})})});X.displayName="Modal";const Ge=Object.assign(X,{Body:Le,Header:We,Title:_e,Footer:Ue,Dialog:G,TRANSITION_DURATION:300,BACKDROP_TRANSITION_DURATION:150});export{Ge as M};
