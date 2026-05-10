import { useState, useEffect, useRef } from "react";

// ─── DATABASE (mirrors .txt files) ──────────────────────────────────────────
const initialProducts = [
  { id: 291, name: "apple",      price: 125.0, quantity: 15,  minStock: 5,  expiry: "2026-12-12" },
  { id: 290, name: "watermelon", price: 15.0,  quantity: 100, minStock: 60, expiry: "2026-12-12" },
  { id: 1,   name: "tomato",     price: 25.0,  quantity: 10,  minStock: 1,  expiry: "2026-12-12" },
  { id: 2,   name: "banana",     price: 90.0,  quantity: 60,  minStock: 10, expiry: "2026-10-10" },
];
const initialEmployees = [
  { id: 931240291, name: "Moody", password: "1010", type: "Ceo" },
  { id: 931240292, name: "Yasoz", password: "2020", type: "HR"  },
];
const initialOffers = [
  { productName: "tomato",  originalPrice: 25.0, discount: 10.0, finalPrice: 22.5 },
  { productName: "banana",  originalPrice: 90.0, discount: 15.0, finalPrice: 76.5 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const today = new Date();
today.setHours(0,0,0,0);

function getStatus(p) {
  const exp = new Date(p.expiry);
  const diff = (exp - today) / 86400000;
  if (exp < today)   return "EXPIRED";
  if (diff <= 3)     return "NEAR EXPIRY";
  if (p.quantity <= p.minStock) return "LOW STOCK";
  return "AVAILABLE";
}

function statusColor(s) {
  if (s === "EXPIRED")     return "#ff4d6d";
  if (s === "NEAR EXPIRY") return "#ffaa00";
  if (s === "LOW STOCK")   return "#ff9f43";
  return "#2ecc71";
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, []);
  const isErr = msg.startsWith("❌");
  return (
    <div style={{
      position:"fixed",top:28,right:28,zIndex:9999,
      background: isErr?"#ff4d6d":"#00d4aa",
      color:"#fff",fontFamily:"'Space Mono',monospace",
      padding:"14px 22px",borderRadius:10,fontWeight:700,
      boxShadow:"0 8px 32px rgba(0,0,0,.35)",
      animation:"slideIn .25s ease",letterSpacing:".5px",fontSize:14
    }}>
      {msg}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,       setScreen]       = useState("login");   // login | main | admin | inventory | marketing | sales | history
  const [role,         setRole]         = useState(null);
  const [loggedUser,   setLoggedUser]   = useState(null);
  const [products,     setProducts]     = useState(initialProducts);
  const [employees,    setEmployees]    = useState(initialEmployees);
  const [offers,       setOffers]       = useState(initialOffers);
  const [sessionHistory, setHistory]   = useState([]);
  const [toast,        setToast]        = useState(null);
  const [adminPass,    setAdminPass]    = useState("1234");

  const notify = (msg) => setToast(msg);
  const go     = (s)   => setScreen(s);

  function login(username, password, r) {
    let valid = false;
    if (r === "admin" && username === "admin" && password === adminPass) valid = true;
    if (r === "user"  && username === "user"  && password === "1111")    valid = true;
    if (!valid) { notify("❌ INVALID CREDENTIALS"); return; }
    setRole(r); setLoggedUser(username);
    setHistory(h => [...h, `LOGIN → ${username}`]);
    notify("✔ LOGIN SUCCESSFUL"); go("main");
  }

  function logout() { setRole(null); setLoggedUser(null); go("login"); }

  return (
    <div style={{minHeight:"100vh",background:"#0a0c10",fontFamily:"'Space Mono',monospace",color:"#e0e6ef",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px} ::-webkit-scrollbar-track{background:#111} ::-webkit-scrollbar-thumb{background:#00d4aa;border-radius:3px}
        @keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes fadeUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .btn{cursor:pointer;border:none;border-radius:8px;font-family:'Space Mono',monospace;font-weight:700;transition:all .18s;letter-spacing:.5px}
        .btn:hover{filter:brightness(1.15);transform:translateY(-1px)}
        .btn:active{transform:translateY(0);filter:brightness(.95)}
        .card{background:#12151e;border:1.5px solid #1e2535;border-radius:14px;padding:24px;animation:fadeUp .3s ease}
        .inp{background:#0e1118;border:1.5px solid #1e2535;border-radius:8px;color:#e0e6ef;padding:11px 14px;font-family:'Space Mono',monospace;font-size:13px;width:100%;outline:none;transition:border .2s}
        .inp:focus{border-color:#00d4aa}
        .tag{display:inline-block;border-radius:5px;padding:3px 9px;font-size:11px;font-weight:700}
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
        table{width:100%;border-collapse:collapse;font-size:13px}
        th{background:#0e1118;color:#00d4aa;text-align:left;padding:10px 14px;border-bottom:1.5px solid #1e2535}
        td{padding:10px 14px;border-bottom:1px solid #1a1f2e;vertical-align:middle}
        tr:hover td{background:#13161f}
        .section-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;color:#00d4aa;margin-bottom:6px}
      `}</style>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      {screen === "login"     && <LoginScreen     onLogin={login} />}
      {screen === "main"      && <MainMenu        role={role} user={loggedUser} go={go} onLogout={logout} />}
      {screen === "admin"     && <AdminPanel       employees={employees} setEmployees={setEmployees} adminPass={adminPass} setAdminPass={setAdminPass} notify={notify} go={go} />}
      {screen === "inventory" && <InventoryPanel   products={products}   setProducts={setProducts}   notify={notify}      go={go} />}
      {screen === "marketing" && <MarketingPanel   products={products}   offers={offers}             setOffers={setOffers} notify={notify} go={go} />}
      {screen === "sales"     && <SalesPanel       products={products}   setProducts={setProducts}   offers={offers} history={sessionHistory} setHistory={setHistory} notify={notify} go={go} />}
      {screen === "history"   && <HistoryPanel     history={sessionHistory} go={go} />}
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [un, setUn] = useState(""); const [pw, setPw] = useState(""); const [role, setRole] = useState("admin");
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 50% 0%,#0d2a22 0%,#0a0c10 60%)"}}>
      <div style={{width:420,animation:"fadeUp .4s ease"}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:13,letterSpacing:5,color:"#00d4aa",marginBottom:6,opacity:.7}}>WELCOME TO</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:52,letterSpacing:6,color:"#fff",lineHeight:1}}>HYPER<span style={{color:"#00d4aa"}}>MARKET</span></div>
          <div style={{fontSize:11,letterSpacing:4,color:"#555",marginTop:4}}>MANAGEMENT SYSTEM</div>
        </div>
        <div className="card" style={{borderColor:"#1e3530"}}>
          <div style={{marginBottom:16,fontSize:12,color:"#555",letterSpacing:2}}>SIGN IN</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input className="inp" placeholder="Username"  value={un}   onChange={e=>setUn(e.target.value)} />
            <input className="inp" placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
            <div style={{display:"flex",gap:8}}>
              {["admin","user"].map(r=>(
                <button key={r} className="btn" onClick={()=>setRole(r)} style={{flex:1,padding:"10px",fontSize:12,background:role===r?"#00d4aa":"#1a1f2e",color:role===r?"#0a0c10":"#8899aa"}}>
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
            <button className="btn" onClick={()=>onLogin(un,pw,role)} style={{padding:"13px",fontSize:14,background:"#00d4aa",color:"#0a0c10",marginTop:4}}>
              LOGIN →
            </button>
          </div>
          <div style={{marginTop:18,fontSize:11,color:"#333",borderTop:"1px solid #1a1f2e",paddingTop:14}}>
            <span style={{color:"#555"}}>admin / 1234 &nbsp;|&nbsp; user / 1111</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN MENU ───────────────────────────────────────────────────────────────
function MainMenu({ role, user, go, onLogout }) {
  const adminItems = [
    { label:"Admin Panel",      icon:"👤", screen:"admin",     desc:"Employees & passwords" },
    { label:"Market Inventory", icon:"📦", screen:"inventory", desc:"Products & stock" },
    { label:"Marketing / Offers",icon:"🏷️",screen:"marketing", desc:"Create & view offers" },
  ];
  const userItems = [
    { label:"Shop Now",        icon:"🛒", screen:"sales",   desc:"Browse & order products" },
    { label:"Purchase History",icon:"📋", screen:"history", desc:"Your session activity" },
  ];
  const items = role === "admin" ? adminItems : userItems;
  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"48px 24px"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:48}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:42,letterSpacing:4,color:"#fff"}}>HYPER<span style={{color:"#00d4aa"}}>MARKET</span></div>
          <div style={{fontSize:12,color:"#555",letterSpacing:3}}>MANAGEMENT SYSTEM</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:12,color:"#00d4aa",marginBottom:4}}>{role?.toUpperCase()} SESSION</div>
          <div style={{fontSize:13,color:"#8899aa",marginBottom:12}}>{user}</div>
          <button className="btn" onClick={onLogout} style={{padding:"8px 18px",fontSize:11,background:"#1a1f2e",color:"#ff4d6d",border:"1px solid #ff4d6d33"}}>LOGOUT</button>
        </div>
      </div>
      {/* Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18}}>
        {items.map(item=>(
          <button key={item.screen} className="btn" onClick={()=>go(item.screen)} style={{
            background:"#12151e",border:"1.5px solid #1e2535",borderRadius:16,padding:"32px 28px",
            textAlign:"left",color:"#e0e6ef",transition:"all .2s",cursor:"pointer"
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#00d4aa";e.currentTarget.style.background="#0f1a18"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e2535";e.currentTarget.style.background="#12151e"}}>
            <div style={{fontSize:32,marginBottom:12}}>{item.icon}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,marginBottom:6}}>{item.label}</div>
            <div style={{fontSize:12,color:"#555",fontFamily:"'Space Mono',monospace"}}>{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
function AdminPanel({ employees, setEmployees, adminPass, setAdminPass, notify, go }) {
  const [tab, setTab]       = useState("list");
  const [form, setForm]     = useState({id:"",name:"",password:"",type:""});
  const [delId, setDelId]   = useState("");
  const [pwForm, setPwForm] = useState({old:"",nw:""});

  function addEmployee() {
    if (!form.id||!form.name||!form.password||!form.type){notify("❌ Fill all fields");return;}
    const emp = {id:parseInt(form.id),name:form.name,password:form.password,type:form.type};
    setEmployees(e=>[...e,emp]);
    setForm({id:"",name:"",password:"",type:""});
    notify("✔ Employee added");
  }
  function deleteEmployee() {
    const id = parseInt(delId);
    setEmployees(e=>e.filter(x=>x.id!==id));
    setDelId(""); notify("✔ Employee deleted");
  }
  function changePass() {
    if (pwForm.old!==adminPass){notify("❌ Wrong password");return;}
    setAdminPass(pwForm.nw); setPwForm({old:"",nw:""}); notify("✔ Password updated");
  }
  const tabs = ["list","add","delete","password"];
  return (
    <PanelShell title="ADMIN PANEL" icon="👤" go={go} back="main">
      <Tabs tabs={tabs} active={tab} setActive={setTab} />
      {tab==="list" && (
        <div className="card">
          <div className="section-title" style={{marginBottom:16}}>EMPLOYEES</div>
          <table><thead><tr><th>ID</th><th>Name</th><th>Type</th></tr></thead>
            <tbody>{employees.map(e=>(
              <tr key={e.id}><td style={{color:"#00d4aa"}}>{e.id}</td><td>{e.name}</td><td><span className="tag" style={{background:"#0e2430",color:"#00bcd4"}}>{e.type}</span></td></tr>
            ))}{employees.length===0&&<tr><td colSpan={3} style={{color:"#555",textAlign:"center",padding:24}}>No employees</td></tr>}</tbody>
          </table>
        </div>
      )}
      {tab==="add" && (
        <div className="card"><div className="section-title" style={{marginBottom:18}}>ADD EMPLOYEE</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {["id","name","password","type"].map(f=>(
              <div key={f}><div style={{fontSize:11,color:"#555",marginBottom:4,letterSpacing:1}}>{f.toUpperCase()}</div>
                <input className="inp" value={form[f]} onChange={e=>setForm(x=>({...x,[f]:e.target.value}))} placeholder={f} />
              </div>
            ))}
            <button className="btn" onClick={addEmployee} style={{padding:"12px",background:"#00d4aa",color:"#0a0c10",marginTop:6}}>ADD EMPLOYEE</button>
          </div>
        </div>
      )}
      {tab==="delete" && (
        <div className="card"><div className="section-title" style={{marginBottom:18}}>DELETE EMPLOYEE</div>
          <input className="inp" placeholder="Employee ID" value={delId} onChange={e=>setDelId(e.target.value)} style={{marginBottom:14}} />
          <button className="btn" onClick={deleteEmployee} style={{padding:"12px",width:"100%",background:"#ff4d6d",color:"#fff"}}>DELETE</button>
        </div>
      )}
      {tab==="password" && (
        <div className="card"><div className="section-title" style={{marginBottom:18}}>CHANGE PASSWORD</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input className="inp" type="password" placeholder="Old Password" value={pwForm.old} onChange={e=>setPwForm(x=>({...x,old:e.target.value}))} />
            <input className="inp" type="password" placeholder="New Password" value={pwForm.nw}  onChange={e=>setPwForm(x=>({...x,nw:e.target.value}))} />
            <button className="btn" onClick={changePass} style={{padding:"12px",background:"#00d4aa",color:"#0a0c10"}}>UPDATE PASSWORD</button>
          </div>
        </div>
      )}
    </PanelShell>
  );
}

// ─── INVENTORY PANEL ─────────────────────────────────────────────────────────
function InventoryPanel({ products, setProducts, notify, go }) {
  const [tab, setTab]    = useState("list");
  const [search, setSearch] = useState("");
  const [form, setForm]  = useState({id:"",name:"",price:"",quantity:"",minStock:"",expiry:""});
  const [delId, setDelId] = useState("");
  const [dmgForm, setDmgForm] = useState({id:"",qty:""});

  const alerts = products.filter(p=>getStatus(p)!=="AVAILABLE");

  function addProduct() {
    if (!form.id||!form.name||!form.price||!form.quantity||!form.minStock||!form.expiry){notify("❌ Fill all fields");return;}
    const p={id:parseInt(form.id),name:form.name,price:parseFloat(form.price),quantity:parseInt(form.quantity),minStock:parseInt(form.minStock),expiry:form.expiry};
    setProducts(ps=>[...ps,p]); setForm({id:"",name:"",price:"",quantity:"",minStock:"",expiry:""}); notify("✔ Product added");
  }
  function deleteProduct() {
    const id=parseInt(delId);
    if(!products.find(p=>p.id===id)){notify("❌ Product not found");return;}
    setProducts(ps=>ps.filter(p=>p.id!==id)); setDelId(""); notify("✔ Product deleted");
  }
  function damagedProduct() {
    const id=parseInt(dmgForm.id); const qty=parseInt(dmgForm.qty);
    const p=products.find(x=>x.id===id);
    if(!p){notify("❌ Product not found");return;}
    if(p.quantity<qty){notify("❌ Not enough quantity");return;}
    setProducts(ps=>ps.map(x=>x.id===id?{...x,quantity:x.quantity-qty}:x));
    notify(`✔ Damaged items removed. Remaining: ${p.quantity-qty}`);
    setDmgForm({id:"",qty:""});
  }
  const filtered = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||String(p.id).includes(search));
  const tabs = ["list","add","delete","damaged"];
  return (
    <PanelShell title="INVENTORY" icon="📦" go={go} back="main">
      {alerts.length>0&&(
        <div style={{marginBottom:18,display:"flex",flexWrap:"wrap",gap:8}}>
          {alerts.map(p=>(
            <div key={p.id} style={{background:"#1a0e00",border:`1px solid ${statusColor(getStatus(p))}44`,borderRadius:8,padding:"8px 14px",fontSize:12}}>
              <span style={{color:statusColor(getStatus(p)),marginRight:6}}>⚠</span>
              <span style={{color:"#ccc"}}>{getStatus(p)}: </span>
              <span style={{color:"#fff",fontWeight:700}}>{p.name}</span>
              {getStatus(p)==="LOW STOCK"&&<span style={{color:"#777"}}> (qty: {p.quantity})</span>}
            </div>
          ))}
        </div>
      )}
      <Tabs tabs={tabs} active={tab} setActive={setTab} />
      {tab==="list"&&(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div className="section-title">PRODUCTS</div>
            <input className="inp" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} style={{width:200}} />
          </div>
          <table><thead><tr><th>ID</th><th>Name</th><th>Price</th><th>Qty</th><th>Min</th><th>Expiry</th><th>Status</th></tr></thead>
            <tbody>{filtered.map(p=>{const s=getStatus(p);return(
              <tr key={p.id}>
                <td style={{color:"#00d4aa"}}>{p.id}</td><td style={{fontWeight:700}}>{p.name}</td>
                <td style={{color:"#ffaa00"}}>${p.price.toFixed(2)}</td>
                <td>{p.quantity}</td><td style={{color:"#555"}}>{p.minStock}</td>
                <td style={{color:"#8899aa",fontSize:12}}>{p.expiry}</td>
                <td><span className="tag" style={{background:statusColor(s)+"22",color:statusColor(s)}}>{s}</span></td>
              </tr>
            );})}
            {filtered.length===0&&<tr><td colSpan={7} style={{color:"#555",textAlign:"center",padding:24}}>No products found</td></tr>}</tbody>
          </table>
        </div>
      )}
      {tab==="add"&&(
        <div className="card"><div className="section-title" style={{marginBottom:18}}>ADD PRODUCT</div>
          <div className="grid2" style={{gap:12}}>
            {[["id","ID"],["name","Name"],["price","Price ($)"],["quantity","Quantity"],["minStock","Min Stock"],["expiry","Expiry (yyyy-mm-dd)"]].map(([f,label])=>(
              <div key={f}><div style={{fontSize:11,color:"#555",marginBottom:4,letterSpacing:1}}>{label}</div>
                <input className="inp" value={form[f]} placeholder={label} onChange={e=>setForm(x=>({...x,[f]:e.target.value}))} /></div>
            ))}
          </div>
          <button className="btn" onClick={addProduct} style={{padding:"12px",width:"100%",background:"#00d4aa",color:"#0a0c10",marginTop:16}}>ADD PRODUCT</button>
        </div>
      )}
      {tab==="delete"&&(
        <div className="card"><div className="section-title" style={{marginBottom:18}}>DELETE PRODUCT</div>
          <input className="inp" placeholder="Product ID" value={delId} onChange={e=>setDelId(e.target.value)} style={{marginBottom:14}} />
          <button className="btn" onClick={deleteProduct} style={{padding:"12px",width:"100%",background:"#ff4d6d",color:"#fff"}}>DELETE</button>
        </div>
      )}
      {tab==="damaged"&&(
        <div className="card"><div className="section-title" style={{marginBottom:18}}>REPORT DAMAGED</div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <input className="inp" placeholder="Product ID"       value={dmgForm.id}  onChange={e=>setDmgForm(x=>({...x,id:e.target.value}))} />
            <input className="inp" placeholder="Damaged Quantity" value={dmgForm.qty} onChange={e=>setDmgForm(x=>({...x,qty:e.target.value}))} />
            <button className="btn" onClick={damagedProduct} style={{padding:"12px",background:"#ff9f43",color:"#0a0c10"}}>REPORT DAMAGE</button>
          </div>
        </div>
      )}
    </PanelShell>
  );
}

// ─── MARKETING PANEL ─────────────────────────────────────────────────────────
function MarketingPanel({ products, offers, setOffers, notify, go }) {
  const [tab, setTab]   = useState("list");
  const [selId, setSelId] = useState("");
  const [discount, setDiscount] = useState("");
  const [days, setDays] = useState("");

  function createOffer() {
    const id=parseInt(selId); const disc=parseFloat(discount);
    const p=products.find(x=>x.id===id);
    if(!p){notify("❌ Product not found");return;}
    if(isNaN(disc)||disc<0||disc>100){notify("❌ Invalid discount");return;}
    const offer={productName:p.name,originalPrice:p.price,discount:disc,finalPrice:p.price-(p.price*disc/100)};
    setOffers(o=>[...o,offer]); setSelId(""); setDiscount(""); setDays(""); notify("✔ Offer created");
  }
  return (
    <PanelShell title="MARKETING" icon="🏷️" go={go} back="main">
      <Tabs tabs={["list","create"]} active={tab} setActive={setTab} />
      {tab==="list"&&(
        <div className="card"><div className="section-title" style={{marginBottom:16}}>ACTIVE OFFERS</div>
          {offers.length===0?<div style={{color:"#555",textAlign:"center",padding:24}}>No offers yet</div>:(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
              {offers.map((o,i)=>(
                <div key={i} style={{background:"#0e1118",border:"1.5px solid #1e3530",borderRadius:12,padding:"18px 20px"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:2,color:"#fff",marginBottom:8}}>{o.productName.toUpperCase()}</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{fontSize:12,color:"#555",textDecoration:"line-through"}}>${o.originalPrice.toFixed(2)}</span>
                    <span style={{fontSize:20,fontWeight:700,color:"#00d4aa"}}>${o.finalPrice.toFixed(2)}</span>
                  </div>
                  <div className="tag" style={{background:"#ff4d6d22",color:"#ff4d6d",fontSize:13}}>{o.discount}% OFF</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {tab==="create"&&(
        <div className="card"><div className="section-title" style={{marginBottom:16}}>CREATE OFFER</div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:"#555",marginBottom:8,letterSpacing:1}}>SELECT PRODUCT</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>
              {products.map(p=>(
                <button key={p.id} className="btn" onClick={()=>setSelId(String(p.id))} style={{
                  padding:"8px 14px",fontSize:12,
                  background:selId===String(p.id)?"#00d4aa":"#1a1f2e",
                  color:selId===String(p.id)?"#0a0c10":"#8899aa"
                }}>{p.name} — ${p.price}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1}}><div style={{fontSize:11,color:"#555",marginBottom:4,letterSpacing:1}}>DISCOUNT %</div>
                <input className="inp" value={discount} placeholder="e.g. 20" onChange={e=>setDiscount(e.target.value)} /></div>
              <div style={{flex:1}}><div style={{fontSize:11,color:"#555",marginBottom:4,letterSpacing:1}}>DAYS</div>
                <input className="inp" value={days} placeholder="e.g. 7" onChange={e=>setDays(e.target.value)} /></div>
            </div>
            {selId&&discount&&(()=>{
              const p=products.find(x=>x.id===parseInt(selId));
              const disc=parseFloat(discount);
              if(p&&!isNaN(disc)&&disc>0&&disc<=100){
                const final=p.price-(p.price*disc/100);
                return <div style={{marginTop:14,background:"#0e1a18",border:"1px solid #00d4aa33",borderRadius:8,padding:"12px 16px",fontSize:13}}>
                  <span style={{color:"#555"}}>Preview: </span>
                  <span style={{color:"#fff",fontWeight:700}}>{p.name}</span>
                  <span style={{color:"#555"}}> → </span>
                  <span style={{color:"#ff4d6d",textDecoration:"line-through"}}>${p.price.toFixed(2)}</span>
                  <span style={{color:"#fff"}}> → </span>
                  <span style={{color:"#00d4aa",fontWeight:700}}>${final.toFixed(2)}</span>
                </div>;
              }
              return null;
            })()}
          </div>
          <button className="btn" onClick={createOffer} style={{padding:"12px",width:"100%",background:"#00d4aa",color:"#0a0c10"}}>CREATE OFFER</button>
        </div>
      )}
    </PanelShell>
  );
}

// ─── SALES PANEL ─────────────────────────────────────────────────────────────
// Mirrors updated SalesModule.makeOrder() + MarketingModule.getOfferForProduct()
// Offers are looked up by product name (case-insensitive) and applied at checkout
function SalesPanel({ products, setProducts, offers, history, setHistory, notify, go }) {
  const [cart, setCart]       = useState([]);
  const [qty, setQty]         = useState({});
  const [invoice, setInvoice] = useState(null);

  // mirrors MarketingModule.getOfferForProduct(productName)
  function getOfferForProduct(name) {
    return offers.find(o => o.productName.toLowerCase() === name.toLowerCase()) || null;
  }

  function addToCart(p) {
    const q = parseInt(qty[p.id]) || 1;
    if (q < 1 || q > p.quantity) { notify("❌ Invalid quantity"); return; }
    setCart(c => {
      const ex = c.find(x => x.id === p.id);
      if (ex) return c.map(x => x.id === p.id ? { ...x, qty: x.qty + q } : x);
      return [...c, { ...p, qty: q }];
    });
    notify(`✔ Added ${p.name} ×${q}`);
  }
  function removeFromCart(id) { setCart(c => c.filter(x => x.id !== id)); }

  // mirrors makeOrder() offer logic exactly
  function checkout() {
    if (cart.length === 0) { notify("❌ Cart is empty"); return; }
    const items = []; let grandTotal = 0;
    for (const item of cart) {
      const prod = products.find(p => p.id === item.id);
      if (!prod || prod.quantity < item.qty) { notify(`❌ Not enough stock for ${item.name}`); return; }
      const offer      = getOfferForProduct(item.name);
      const original   = item.price;
      const discount   = offer ? offer.discount : 0;
      const finalPrice = offer ? original - (original * discount / 100) : original;
      const sub        = finalPrice * item.qty;
      grandTotal += sub;
      items.push({ name: item.name, qty: item.qty, original, discount, finalPrice, sub, hasOffer: !!offer });
    }
    setProducts(ps => ps.map(p => { const ci = cart.find(x => x.id === p.id); return ci ? { ...p, quantity: p.quantity - ci.qty } : p; }));
    setHistory(h => [...h, ...items.map(i => `BUY → ${i.name} ×${i.qty} = $${i.sub.toFixed(2)}`)]);
    setInvoice({ items, total: grandTotal, time: new Date().toLocaleTimeString() });
    setCart([]); setQty({});
  }

  if (invoice) return (
    <PanelShell title="INVOICE" icon="🧾" go={go} back="main">
      <div className="card" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3, marginBottom: 4 }}>PURCHASE COMPLETE</div>
        <div style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>{invoice.time}</div>
        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Original</th><th>Discount</th><th>Final</th><th>Subtotal</th></tr></thead>
          <tbody>{invoice.items.map((it, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 700 }}>{it.name}</td>
              <td>{it.qty}</td>
              <td style={{ color: it.hasOffer ? "#888" : "#e0e6ef", textDecoration: it.hasOffer ? "line-through" : "none" }}>${it.original.toFixed(2)}</td>
              <td>{it.hasOffer ? <span className="tag" style={{ background: "#ff4d6d22", color: "#ff4d6d" }}>{it.discount}% OFF</span> : <span style={{ color: "#333" }}>—</span>}</td>
              <td style={{ color: "#00d4aa" }}>${it.finalPrice.toFixed(2)}</td>
              <td style={{ color: "#00d4aa", fontWeight: 700 }}>${it.sub.toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{ borderTop: "1.5px solid #1e2535", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#555" }}>TOTAL</span>
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#00d4aa" }}>${invoice.total.toFixed(2)}</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: "#555" }}>Thank you for shopping! 🛍️</div>
        <button className="btn" onClick={() => setInvoice(null)} style={{ marginTop: 20, padding: "12px 32px", background: "#00d4aa", color: "#0a0c10" }}>SHOP MORE</button>
      </div>
    </PanelShell>
  );

  return (
    <PanelShell title="SHOP" icon="🛒" go={go} back="main">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
        {/* Products */}
        <div>
          <div className="section-title" style={{ marginBottom: 16 }}>AVAILABLE PRODUCTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 14 }}>
            {products.filter(p => p.quantity > 0).map(p => {
              const offer = getOfferForProduct(p.name);
              const finalPrice = offer ? p.price - (p.price * offer.discount / 100) : p.price;
              return (
                <div key={p.id} style={{ background: "#12151e", border: `1.5px solid ${offer ? "#ff4d6d44" : "#1e2535"}`, borderRadius: 12, padding: "18px", position: "relative" }}>
                  {offer && (
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <span className="tag" style={{ background: "#ff4d6d", color: "#fff", fontSize: 10 }}>{offer.discount}% OFF</span>
                    </div>
                  )}
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, letterSpacing: 2, marginBottom: 6 }}>{p.name.toUpperCase()}</div>
                  {offer ? (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "#555", textDecoration: "line-through", marginRight: 8 }}>${p.price.toFixed(2)}</span>
                      <span style={{ fontSize: 22, fontWeight: 700, color: "#00d4aa" }}>${finalPrice.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#00d4aa", marginBottom: 8 }}>${p.price.toFixed(2)}</div>
                  )}
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>In stock: {p.quantity}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="inp" type="number" min={1} max={p.quantity} placeholder="Qty" value={qty[p.id] || ""} onChange={e => setQty(q => ({ ...q, [p.id]: e.target.value }))} style={{ width: 70, textAlign: "center" }} />
                    <button className="btn" onClick={() => addToCart(p)} style={{ flex: 1, background: "#00d4aa", color: "#0a0c10", padding: "8px", fontSize: 12 }}>ADD</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Cart */}
        <div className="card" style={{ position: "sticky", top: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>CART {cart.length > 0 && <span style={{ fontSize: 14, color: "#555" }}>({cart.length})</span>}</div>
          {cart.length === 0 ? <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: 20 }}>Cart is empty</div> : (
            <>
              {cart.map(item => {
                const offer = getOfferForProduct(item.name);
                const finalPrice = offer ? item.price - (item.price * offer.discount / 100) : item.price;
                return (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1f2e" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name}
                        {offer && <span className="tag" style={{ background: "#ff4d6d22", color: "#ff4d6d", marginLeft: 6, fontSize: 10 }}>{offer.discount}%</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#555" }}>×{item.qty} @ ${finalPrice.toFixed(2)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "#00d4aa", fontWeight: 700 }}>${(finalPrice * item.qty).toFixed(2)}</span>
                      <button className="btn" onClick={() => removeFromCart(item.id)} style={{ background: "#1a1f2e", color: "#ff4d6d", padding: "4px 8px", fontSize: 12 }}>✕</button>
                    </div>
                  </div>
                );
              })}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 4px", fontWeight: 700 }}>
                <span style={{ color: "#555" }}>TOTAL</span>
                <span style={{ color: "#00d4aa", fontFamily: "'Bebas Neue',sans-serif", fontSize: 22 }}>
                  ${cart.reduce((s, i) => {
                    const o = getOfferForProduct(i.name);
                    const fp = o ? i.price - (i.price * o.discount / 100) : i.price;
                    return s + fp * i.qty;
                  }, 0).toFixed(2)}
                </span>
              </div>
              <button className="btn" onClick={checkout} style={{ width: "100%", padding: "12px", background: "#00d4aa", color: "#0a0c10", marginTop: 12, fontSize: 14 }}>CHECKOUT →</button>
            </>
          )}
        </div>
      </div>
    </PanelShell>
  );
}

// ─── HISTORY PANEL ───────────────────────────────────────────────────────────
function HistoryPanel({ history, go }) {
  return (
    <PanelShell title="HISTORY" icon="📋" go={go} back="main">
      <div className="card">
        <div className="section-title" style={{marginBottom:16}}>SESSION ACTIVITY</div>
        {history.length===0?<div style={{color:"#555",textAlign:"center",padding:24}}>No activity yet</div>:(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[...history].reverse().map((h,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:"#0e1118",borderRadius:8,border:"1px solid #1a1f2e"}}>
                <span style={{fontSize:16}}>{h.startsWith("LOGIN")?"🔑":"🛒"}</span>
                <span style={{fontSize:13,color:"#e0e6ef"}}>{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PanelShell>
  );
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function PanelShell({ title, icon, go, back, children }) {
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 24px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
        <button className="btn" onClick={()=>go(back)} style={{background:"#1a1f2e",color:"#8899aa",padding:"8px 16px",fontSize:12}}>← BACK</button>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:4,color:"#fff",lineHeight:1}}>{icon} {title}</div>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>{children}</div>
    </div>
  );
}

function Tabs({ tabs, active, setActive }) {
  return (
    <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
      {tabs.map(t=>(
        <button key={t} className="btn" onClick={()=>setActive(t)} style={{
          padding:"8px 18px",fontSize:12,letterSpacing:1,textTransform:"uppercase",
          background:active===t?"#00d4aa":"#12151e",
          color:active===t?"#0a0c10":"#555",
          border:active===t?"none":"1.5px solid #1e2535"
        }}>{t}</button>
      ))}
    </div>
  );
}
