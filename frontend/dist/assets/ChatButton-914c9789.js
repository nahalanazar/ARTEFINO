import{P as x,G as m,r as b,H as y,u as F,I as j,j as e,S}from"./index-54d6a279.js";const w=({userId:l})=>{const{setSelectedChat:a,chats:r,setChats:d}=m(),[h,o]=b.useState(""),[u]=y(),p=F(),c=j(),g=async f=>{var i,n;try{o(!0);const t=await u(f);if(console.log("response from access chat: ",t),t.data){const{data:s}=t;r.find(C=>C._id===s._id)||(d([s,...r]),a(s)),a(s),o(!1),p("/chat")}else t.error.data&&(c({title:"Follow each other to access the chat",description:(t==null?void 0:t.error.data.error)||"An error occurred",status:"error",duration:5e3,isClosable:!0,position:"top-right"}),o(!1))}catch(t){console.log("error:",t),c({title:"Follow each other to access the chat",description:((n=(i=t.response)==null?void 0:i.data)==null?void 0:n.message)||"An error occurred",status:"error",duration:5e3,isClosable:!0,position:"top-right"}),console.log("hi",t.message),o(!1)}};return e.jsx(e.Fragment,{children:e.jsx("button",{className:"followButton",style:{color:"white",backgroundColor:"#007BFF",fontSize:16,fontFamily:"Roboto",fontWeight:"700",padding:"8px 16px",border:"none",borderRadius:"4px",cursor:"pointer"},onClick:()=>g(l),children:h?e.jsx(S,{size:"sm",borderWidth:"6px",ml:"auto",display:"flex"}):e.jsx(e.Fragment,{children:"Message"})})})};w.propTypes={userId:x.string.isRequired};export{w as C};
