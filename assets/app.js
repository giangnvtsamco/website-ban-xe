const LOGO='/assets/logo.webp',DAI_MAX=5376,MIEN='https://vinfastsamcobinhtan.com';
const MD=window.MAC_DINH;
let XE=MD.xe,MAU=MD.mau,GOI=MD.goi,BAI=MD.bai;
let SDT=MD.cauhinh.sdt,SDT_HIEN=MD.cauhinh.sdtHien,DIACHI=MD.cauhinh.diachi,DIACHI_EN=MD.cauhinh.diachiEn,TRA_MIN=MD.cauhinh.traMin;
const MAP='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('1135 Quốc lộ 1A, Tân Tạo, Bình Tân, TP. Hồ Chí Minh');
/* Gộp dữ liệu từ Sheet vào dữ liệu mặc định. Thiếu gì thì giữ mặc định, nên web không bao giờ trống. */
function gop(d){
  if(!d||!Array.isArray(d.xe)) return;
  const moi=[];
  MD.xe.forEach(g=>{
    const r=d.xe.find(v=>v.id===g.id);
    if(!r){moi.push(g);return;}
    if(r.hien===false) return;
    const pb=(r.pb||[]).filter(p=>p[0]&&p[1]>0);
    moi.push({...g,ten:r.ten||g.ten,loi:r.loi||g.loi,loiEn:r.loiEn||g.loiEn,laiThu:r.laiThu!==undefined?r.laiThu:g.laiThu,traMin:r.traMin||g.traMin,sac:r.sac||g.sac,sacEn:r.sacEn||g.sacEn,tnds:r.tnds||g.tnds,thuTu:r.thuTu,pb:pb.length?pb:g.pb});
  });
  moi.sort((a,b)=>(a.thuTu||99)-(b.thuTu||99));
  if(moi.length) XE=moi;
  const mau={...MD.mau};
  Object.entries(d.mau||{}).forEach(([k,v])=>{if(v.ds&&v.ds.length&&mau[k])mau[k]={l:v.l||mau[k].l,ds:v.ds};});
  MAU=mau;
  if(d.goi&&Object.keys(d.goi).length) GOI=d.goi;
  if(!GOI[CH.g]) CH.g=Object.keys(GOI)[0];
  if(Array.isArray(d.bai)&&d.bai.length) BAI=d.bai;
  const c=d.cauhinh||{};
  SDT=c.sdt||MD.cauhinh.sdt;SDT_HIEN=c.sdtHien||MD.cauhinh.sdtHien;DIACHI=c.diachi||MD.cauhinh.diachi;DIACHI_EN=c.diachiEn||MD.cauhinh.diachiEn;TRA_MIN=c.traMin||MD.cauhinh.traMin;
}
async function call(fn,...args){
  if(!window.API_URL) throw 'chua-co-api';
  const res=await fetch(window.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({fn,args}),redirect:'follow',credentials:'omit'});
  const j=await res.json();
  if(!j.ok) throw j.error;
  return j.data;
}
const TX={
 vi:{banDo:'Bản đồ',bt:'BÌNH TÂN',giamt:'Ưu đãi',gxe2:'Giá xe',nguon:'Nguồn',cheS:'Sáng',cheT:'Tối',cheA:'Tự động',tieu:'SAMCO Bình Tân',tin:'Tin tức',mau:'Màu xe',laiThu:'Lái thử',tuvan:'Tư vấn',nhucau:'Nhu cầu',ngay:'Ngày mong muốn',tatca:'Tất cả xe',tg:'Tính trả góp',gxe:'Giá sau ưu đãi',tratruoc:'Trả trước',vay2:'Số tiền vay',nam:'Thời hạn vay',namd:'năm',bandau:'Cần chuẩn bị ban đầu',laist:'Lãi suất năm',thang1:'Tháng đầu trả',tuThang:'Từ tháng',tongLai:'Tổng lãi',tgn:'Minh họa theo một gói mẫu, ngân hàng có nhiều lựa chọn khác. Gốc trả đều, lãi tính trên dư nợ giảm dần. Lãi suất sau',tgn2:'tháng là tạm tính, điều chỉnh theo thị trường.',xemLich:'Xem bảng trả từng tháng',thangC:'Tháng',gocC:'Gốc',laiC:'Lãi',traC:'Phải trả',kkd:'Không kinh doanh',kd:'Kinh doanh',coBh:'Mua bảo hiểm thân vỏ',khongMua:'Không mua',toiThieu:'mức tối thiểu',tndsT:'Bảo hiểm dân sự',lk:'Link riêng',cp:'Sao chép link',dacp:'Đã sao chép',kcp:'Chưa sao chép được',goi:'Gọi ngay',home:'Trang chủ',xe:'Ô tô',lh:'Liên hệ',mua:'Mua ngay',tit:'Bảng giá',thue:'Thuế trước bạ',gtri:'Giá trị xe',bh:'Bảo hiểm thân vỏ',phi:'Phí đăng ký, biển số',tong:'Tổng tạm tính',lienhe:'Liên hệ',tu:'Từ',
  nho:'Tạm tính. Ưu đãi theo điều kiện chương trình. Chưa gồm phí đăng ký và bảo hiểm thân vỏ.',sacc:'Ưu đãi sạc theo chính sách VinFast',vay:'Hỗ trợ vay tối đa, trả góp linh hoạt',ntcn:'Hỗ trợ đăng ký các nền tảng công nghệ: Be, Grab',qua:'Nhận ngay nhiều quà tặng giá trị khi mua xe',soLuong:'Mua từ 50 xe, vui lòng liên hệ',hang:'Tải trên 600 kg, thùng hàng 2.600 lít',
  moi:'Liên hệ với chúng tôi hôm nay để đến trải nghiệm xe VinFast.',ttkh:'Thông tin khách hàng',ttp:'Vui lòng để lại số điện thoại, chúng tôi sẽ liên hệ Quý khách.',ten:'Tên khách hàng',sdt:'Số điện thoại',dong:'Dòng xe quan tâm',gui:'GỬI',
  e1:'Vui lòng nhập tên.',e2:'Vui lòng nhập số điện thoại 10 chữ số.',e3:'Vui lòng kiểm tra email.',ok:'Cảm ơn Quý khách.',okn:'Chúng tôi sẽ liên hệ sớm.',e4:'Chưa gửi được. Vui lòng gọi ',dangGui:'ĐANG GỬI',dongy:'Khi gửi, Quý khách đồng ý để SAMCO Bình Tân liên hệ tư vấn.',k1:'Không tìm thấy trang',moTa:'Đại lý VinFast SAMCO Bình Tân: bảng giá, tính trả góp, đăng ký lái thử ô tô điện VinFast tại TP.HCM.',xemxe:'Xem xe',tp:'TP.HCM, Việt Nam',tam:'Ảnh tạm'},
 en:{banDo:'Map',bt:'BINH TAN',giamt:'Promotion',gxe2:'Car price',nguon:'Source',cheS:'Light',cheT:'Dark',cheA:'Auto',tieu:'SAMCO Binh Tan',tin:'News',mau:'Colour',laiThu:'Test drive',tuvan:'Consultation',nhucau:'Request',ngay:'Preferred date',tatca:'All cars',tg:'Instalment calculator',gxe:'Price after promotion',tratruoc:'Down payment',vay2:'Loan amount',nam:'Loan term',namd:'years',bandau:'Upfront cost',laist:'Annual interest',thang1:'First month',tuThang:'From month',tongLai:'Total interest',tgn:'Illustration using a sample package; banks offer other options. Equal principal, interest on the reducing balance. The rate after',tgn2:'months is an estimate and follows the market.',xemLich:'View monthly schedule',thangC:'Month',gocC:'Principal',laiC:'Interest',traC:'Payment',kkd:'Private use',kd:'Commercial use',coBh:'Include body insurance',khongMua:'Not included',toiThieu:'minimum',tndsT:'Civil liability insurance',lk:'Direct link',cp:'Copy link',dacp:'Copied',kcp:'Could not copy',goi:'Call now',home:'Home',xe:'Cars',lh:'Contact',mua:'Buy now',tit:'Price list',thue:'Registration tax',gtri:'Value',bh:'Body insurance',phi:'Registration & plate fee',tong:'Estimated total',lienhe:'Contact us',tu:'From',
  nho:'Estimate in VND. Promotion subject to conditions. Excludes registration fees and body insurance.',sacc:'Charging offer per VinFast policy',vay:'Loan support, flexible instalments',ntcn:'Registration support for Be, Grab',qua:'Valuable gifts with your purchase',soLuong:'Buying 50 cars or more? Please contact us',hang:'Payload over 600 kg, 2,600 L cargo space',
  moi:'Contact us today to experience VinFast.',ttkh:'Customer information',ttp:'Please leave your phone number and we will contact you.',ten:'Full name',sdt:'Phone number',dong:'Model of interest',gui:'SEND',
  e1:'Please enter your name.',e2:'Please enter a 10-digit phone number.',e3:'Please check your email.',ok:'Thank you.',okn:'We will contact you soon.',e4:'Could not send. Please call ',dangGui:'SENDING',dongy:'By sending, you agree that SAMCO Binh Tan may contact you.',k1:'Page not found',moTa:'VinFast SAMCO Binh Tan dealership: prices, instalment calculator and test drive booking in Ho Chi Minh City.',xemxe:'View cars',tp:'Ho Chi Minh City, Vietnam',tam:'Temp image'}
};
let lang='vi',route='#/';
try{const l=localStorage.getItem('samco-lang');if(l==='en'||l==='vi')lang=l;}catch(e){}
let tg={i:0,m:0,tra:30,nam:5,xe:''};
let CH={g:Object.keys(GOI)[0]};
const T=k=>TX[lang][k];
const TIEN=n=>n.toLocaleString(lang==='en'?'en-US':'de-DE');
const LOI=x=>lang==='en'?x.loiEn:x.loi;
const TPB=p=>lang==='en'&&p[4]?p[4]:p[0];
const MAU_EN={'Trắng':'White','Xám':'Grey','Bạc':'Silver','Đen':'Black','Đỏ':'Red','Vàng':'Yellow','Xanh dương':'Blue','Xanh mint':'Mint green','Xanh rêu':'Moss green','Hồng':'Pink','Be':'Beige','Nâu':'Brown','Cam':'Orange','Tím':'Purple'};
const VIETHOA=s=>s.charAt(0).toUpperCase()+s.slice(1);
function MT(s){
  if(lang!=='en') return s;
  if(s.includes(' nóc ')){const [a,b]=s.split(' nóc ');return MAU_EN[a]+' with '+MAU_EN[VIETHOA(b)].toLowerCase()+' roof';}
  return MAU_EN[s]||s;
}
const CHU_DC=()=>lang==='en'?DIACHI_EN:DIACHI;
const ESC=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TNDS=x=>x.phi?x.tnds:0;
const BO=(x,i=0)=>x.pb[i][2]||x.id;
const RONG=(bo,m)=>(MAU[bo].l/DAI_MAX*.9/m.f*100).toFixed(1);
const SW=m=>m.noc?`linear-gradient(${m.noc} 42%,${m.hex} 42%)`:m.hex;
const GIA=(x,i=0)=>x.pb[i][1];
const PCT=(x,i=0)=>x.pb[i][3]||0;
const GIAM=(x,i=0)=>Math.round(GIA(x,i)*PCT(x,i)/100);
const NET=(x,i=0)=>GIA(x,i)-GIAM(x,i);
const TONG=(x,i=0)=>NET(x,i)+TNDS(x);
function LICH(goc,thang,g){
  const G=GOI[g],moi=goc/thang,out=[];let du=goc;
  for(let t=1;t<=thang;t++){const lai=du*(t<=G.n?G.r1:G.r2)/100/12;out.push({t,du,goc:moi,lai,tra:moi+lai});du-=moi;}
  return out;
}

const ANH=(bo,m)=>`/assets/xe/${bo}/${m.k}.webp`;
function anhXe(x,i=0,mi=0,chinh=false){
  const bo=BO(x,i),m=MAU[bo].ds[mi];
  return `<div class="carbox"><img class="car" ${chinh?'id="anhChinh"':''} src="${ANH(bo,m)}" ${chinh?'':'loading="lazy"'} style="width:${RONG(bo,m)}%" alt="VinFast ${ESC(x.ten)} ${ESC(MT(m.ten))}"></div>`;
}
function hangMau(x){
  const bo=BO(x,tg.i),ds=MAU[bo].ds;
  if(ds.length<2) return `<p class="mauTen">${ESC(MT(ds[0].ten))}</p>`;
  return `<div class="maus">${ds.map((m,i)=>`<button type="button" data-mau="${i}" class="${i===tg.m?'on':''}" style="background:${SW(m)}" aria-label="${ESC(MT(m.ten))}" title="${ESC(MT(m.ten))}"></button>`).join('')}</div><p class="mauTen" id="mauTen">${ESC(MT(ds[tg.m].ten))}</p>`;
}
const ICGOI=`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#1fc404"/><path d="M16.5 11.5l4 .8 2.2 7-3 2.6c1.6 3.3 3.900 5.700 7.200 7.300l2.700-3 6.900 2.300.8 4c-.5 2.100-2.500 3.700-4.700 3.500C21.900 36.400 12 26.500 13 16.200c.2-2.200 1.400-4 3.500-4.700z" fill="#fff"/></svg>`;
const ICZALO=`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#0068ff"/><text x="24" y="29" font-family="Arial,sans-serif" font-weight="700" font-size="14" fill="#fff" text-anchor="middle">Zalo</text></svg>`;
const ICMAP=`<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#e03c17"/><path d="M24 9a12 12 0 0 0-12 12c0 8 12 19 12 19s12-11 12-19A12 12 0 0 0 24 9z" fill="#fff"/><circle cx="24" cy="21" r="5" fill="#e03c17"/></svg>`;
const nutGoi=()=>`<a href="tel:${SDT}" aria-label="${T('goi')}">${ICGOI}</a>`;
const nutZalo=()=>`<a href="https://zalo.me/${SDT}" target="_blank" rel="noopener" aria-label="Zalo">${ICZALO}</a>`;
const nutMap=()=>`<a href="${MAP}" target="_blank" rel="noopener" aria-label="${T('banDo')}">${ICMAP}</a>`;

function bang(x,i=0){
  const lh=`<td class="lh">${T('lienhe')}</td>`;
  return `<table class="bang">
   <tr><td>${T('thue')}</td>${x.phi?'<td>0</td>':lh}</tr>
   <tr><td>${T('gtri')}</td><td>${TIEN(GIA(x,i))}</td></tr>
   ${PCT(x,i)?`<tr><td>${T('giamt')} (${PCT(x,i)}%)</td><td>-${TIEN(GIAM(x,i))}</td></tr>`:''}
   <tr><td>${T('tndsT')}</td>${x.phi?`<td>${TIEN(TNDS(x))}</td>`:lh}</tr>
   <tr class="t"><td>${T('tong')}</td>${x.phi?`<td>${TIEN(TONG(x,i))}</td>`:lh}</tr></table>
   <p class="nho">${T('nho')}</p>`;
}
function bangTraGop(x){
  const g=NET(x,tg.i),tr=Math.round(g*tg.tra/100),vay=g-tr,G=GOI[CH.g],L=LICH(vay,tg.nam*12,CH.g);
  const so=n=>lang==='en'?String(n):String(n).replace('.',',');
  const moBang=document.getElementById('lich');const mo=moBang&&moBang.open;
  const sau=L[G.n];
  return `<table class="bang">
   <tr><td>${PCT(x,tg.i)?T('gxe'):T('gxe2')}</td><td>${TIEN(g)}</td></tr>
   <tr><td>${T('tratruoc')} (${tg.tra}%)</td><td>${TIEN(tr)}</td></tr>
   <tr><td>${T('vay2')}</td><td>${TIEN(vay)}</td></tr>
   <tr><td>${T('laist')}</td><td>${so(G.r1)}% → ${so(G.r2)}%</td></tr>
   <tr class="thang"><td>${T('thang1')}</td><td>${TIEN(Math.round(L[0].tra))}</td></tr>
   ${sau?`<tr><td>${T('tuThang')} ${G.n+1}</td><td>${TIEN(Math.round(sau.tra))}</td></tr>`:''}
   <tr><td>${T('tongLai')}</td><td>${TIEN(Math.round(L.reduce((s,r)=>s+r.lai,0)))}</td></tr></table>
   <p class="nho">${T('tgn')} ${G.n} ${T('tgn2')}</p>
   <details id="lich" ${mo?'open':''}><summary>${T('xemLich')}</summary><div class="tw"><table class="bang lichb"><tr><td><b>${T('thangC')}</b></td><td><b>${T('gocC')}</b></td><td><b>${T('laiC')}</b></td><td><b>${T('traC')}</b></td></tr>${L.map(r=>`<tr><td>${r.t}</td><td>${TIEN(Math.round(r.goc))}</td><td>${TIEN(Math.round(r.lai))}</td><td>${TIEN(Math.round(r.tra))}</td></tr>`).join('')}</table></div></details>`;
}
function bhDong(x,i){
  const b=x.bhPb?x.bhPb[x.pb[i][0]]:x.bh; if(!b) return '';
  const so=n=>(n*1000).toLocaleString(lang==='en'?'en-US':'de-DE');
  return lang==='en'?`<li>Warranty ${b[0]} years/${so(b[1])} km, battery ${b[2]} years/${so(b[3])} km</li>`:`<li>Bảo hành xe ${b[0]} năm/${so(b[1])} km, pin ${b[2]} năm/${so(b[3])} km</li>`;
}
function diem(x,i=0){
  const sac=x.sac?(lang==='vi'?x.sac:x.sacEn):T('sacc');
  const dong3=x.hangTxt?(lang==='vi'?x.hangTxt:x.hangEn):x.thuongMai?T('hang'):T('ntcn');
  return `<ul class="diem">${bhDong(x,i)}<li>${sac}</li><li>${T('vay')}</li><li>${dong3}</li><li>${T('qua')}</li><li>${T('soLuong')}</li></ul>`;
}
const pillMua=x=>`<a class="pill" style="background:${x.nut};color:${x.chu}" href="#/lien-he/${x.id}">${T('mua')}</a>`;
const pillLai=x=>x.laiThu?`<a class="pill vien" href="#/lien-he/${x.id}/lai-thu">${T('laiThu')}</a>`:'';

function oMau(x){
  const cung=tg.xe===x.id,ds=MAU[BO(x,cung?tg.i:0)].ds;
  return ds.map((m,i)=>`<option value="${ESC(m.ten)}" ${cung&&i===tg.m?'selected':''}>${ESC(MT(m.ten))}</option>`).join('');
}
/* Nội dung bài lấy từ Sheet, luôn thoát ký tự trước khi hiện để an toàn. */
function KHOI(s){
  const dong=t=>ESC(t).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,(m,a,h)=>`<a class="link" href="${h}"${h[0]==='/'?'':' target="_blank" rel="noopener"'}>${a}</a>`);
  return String(s||'').split(/\n\s*\n/).map(k=>{
    k=k.trim(); if(!k) return '';
    const h=k.split('\n');
    if(h.every(l=>l.includes(' | '))) return `<table class="bang">${h.map(l=>{const t=l.startsWith('= ');const [a,b]=l.replace(/^= /,'').split(' | ');return `<tr${t?' class="t"':''}><td>${dong(a)}</td><td>${dong(b)}</td></tr>`}).join('')}</table>`;
    if(k.startsWith('~ ')) return `<p class="nho">${dong(k.slice(2))}</p>`;
    return `<p>${dong(k).replace(/\n/g,'<br>')}</p>`;
  }).join('');
}
const B=(b,k)=>lang==='en'?b[k+'En']:b[k];
const V={
 home(){
  return `<section class="wrap home">
    <img class="logo zoomlogo" src="${LOGO}" alt="VinFast">
    <div class="rule"></div><div class="samco">SAMCO</div><div class="bt">${T('bt')}</div>
    <a class="pill" href="#/o-to">${T('xemxe')}</a></section>`;
 },
 xe(){
  return `<div class="wrap"><section class="luoi">${XE.map(x=>`<a class="o" href="#/o-to/${x.id}">
      ${anhXe(x)}<span class="ten">${ESC(x.ten)}</span><p>${ESC(LOI(x))}</p><span class="gia">${T('tu')} ${TIEN(GIA(x))}</span></a>`).join('')}</section></div>`;
 },
 ct(id){
  const k=XE.findIndex(v=>v.id===id); if(k<0) return V.xe();
  const x=XE[k],tr=XE[(k+XE.length-1)%XE.length],sau=XE[(k+1)%XE.length];
  if(tg.xe!==x.id) tg.tra=x.traMin||TRA_MIN;
  tg.xe=x.id;
  return `<div class="wrap">
    <div class="ke"><a href="#/o-to/${tr.id}">‹ ${ESC(tr.ten)}</a><a href="#/o-to">${T('tatca')}</a><a href="#/o-to/${sau.id}">${ESC(sau.ten)} ›</a></div>
    <section class="x1" id="xe-${x.id}">
      <div class="trai">${anhXe(x,tg.i,tg.m,true)}<div id="mauBox">${hangMau(x)}</div><span class="ten">${ESC(x.ten)}</span><div class="nut">${pillMua(x)}${pillLai(x)}</div></div>
      <div><h3>${T('tit')}</h3>
        ${x.pb.length>1?`<div class="pbs" id="pbs">${x.pb.map((p,i)=>`<button type="button" data-pb="${i}" class="${i===tg.i?'on':''}">${ESC(TPB(p))}</button>`).join('')}</div>`:''}
        <div id="bangBox">${bang(x,tg.i)}</div><div id="diemBox">${diem(x,tg.i)}</div><div class="ico">${nutGoi()}${nutZalo()}</div></div>
    </section>
    <section class="tg"><h3>${T('tg')}</h3>
      <div class="seg tuy" id="segGoi">${Object.entries(GOI).map(([k,G])=>`<button type="button" data-goi="${k}" class="${CH.g===k?'on':''}">${lang==='en'?G.tenEn:G.ten}</button>`).join('')}</div>
      <div class="keo"><label for="kTra"><span>${T('tratruoc')}</span><span id="kTraV">${tg.tra}%</span></label><input id="kTra" type="range" min="${x.traMin||TRA_MIN}" max="90" step="1" value="${tg.tra}"></div>
      <div class="keo"><label for="kNam"><span>${T('nam')}</span><span id="kNamV">${tg.nam} ${T('namd')}</span></label><input id="kNam" type="range" min="1" max="8" step="1" value="${tg.nam}"></div>
      <div id="tgBox">${bangTraGop(x)}</div>
    </section>
    <div class="linkx tg" style="padding-top:18px"><span>${T('lk')}: <b>vinfastsamcobinhtan.com/${x.duong}</b></span><button type="button" id="bCp" data-link="https://vinfastsamcobinhtan.com/${x.duong}">${T('cp')}</button></div>
  </div>`;
 },
 lh(id,loai){
  const chon=XE.find(v=>v.id===id)||XE[0],laiOn=loai==='lai-thu'&&chon.laiThu;
  const form=`<form class="form" id="fm" novalidate>
    <h3>${T('ttkh')}</h3><p>${T('ttp')}</p>
    <div class="f"><label>${T('nhucau')}</label><div class="seg" id="seg"><button type="button" data-l="tv" class="${laiOn?'':'on'}">${T('tuvan')}</button><button type="button" data-l="lt" class="${laiOn?'on':''}" ${chon.laiThu?'':'disabled'}>${T('laiThu')}</button></div></div>
    <div class="f"><label>${T('ten')} <i>*</i></label><input id="fT" type="text" autocomplete="name"></div>
    <div class="f"><label>${T('sdt')} <i>*</i></label><input id="fS" type="tel" inputmode="numeric" autocomplete="tel"></div>
    <div class="f"><label>Email</label><input id="fE" type="email" autocomplete="email"></div>
    <div class="f"><label>${T('dong')}</label><select id="fX">${XE.map(x=>`<option value="${x.id}" ${x.id===chon.id?'selected':''}>${ESC(x.ten)}</option>`).join('')}</select></div>
    <div class="f"><label>${T('mau')}</label><select id="fM">${oMau(chon)}</select></div>
    <div class="f" id="boxNgay" style="display:${laiOn?'block':'none'}"><label>${T('ngay')}</label><input id="fN" type="date" min="${new Date().toISOString().slice(0,10)}"></div>
    <input class="an-go" id="fW" tabindex="-1" autocomplete="off" aria-hidden="true">
    <p class="err" id="fErr"></p><button class="nutgui">${T('gui')}</button><p class="dongy">${T('dongy')}</p></form>`;
  const dc=`<div class="diachi"><b>SAMCO ${T('bt')}</b>${CHU_DC()}<br>${T('tp')}<br><a href="tel:${SDT}">Mobile: ${SDT_HIEN}</a></div>`;
  const cr=`<div class="cr">Copyright © 2026 NetWeb. All rights reserved.</div>`;
  return `<section class="wrap lh1"><img class="logo" src="${LOGO}" alt="VinFast"><div class="rule"></div><div class="samco">SAMCO</div>
     <div class="ico">${nutGoi()}${nutZalo()}${nutMap()}</div>${dc}${cr}${form}</section>`;
 },
 tin(){
  return `<div class="wrap"><section class="tinds">${BAI.map(b=>{const x=XE.find(v=>v.id===b.xe)||XE[0];return `<a class="tin" href="#/tin-tuc/${b.slug}">
    ${anhXe(x)}<div><span class="loai">${B(b,'loai')} · ${b.ngay}</span><h3>${B(b,'tieu')}</h3><p>${B(b,'tom')}</p></div></a>`}).join('')}</section></div>`;
 },
 bai(slug){
  const b=BAI.find(v=>v.slug===slug); if(!b) return V.tin();
  const x=XE.find(v=>v.id===b.xe)||XE[0];
  return `<article class="wrap bv"><a class="lui" href="#/tin-tuc">‹ ${T('tin')}</a>
    <span class="loai">${B(b,'loai')} · ${b.ngay}</span><h1>${B(b,'tieu')}</h1>${anhXe(x)}${KHOI(lang==='en'?b.ndEn:b.nd)}
    ${/^https?:/.test(b.nguon||'')?`<p class="nho">${T('nguon')}: <a class="link" href="${ESC(b.nguon)}" target="_blank" rel="noopener">VinFast</a></p>`:''}
    <div class="ico">${nutGoi()}${nutZalo()}</div></article>`;
 },
 kt(){
  return `<section class="kt"><h1>${T('k1')}</h1><a class="pill" href="#/o-to">${T('xemxe')}</a></section>`;
 }
};

const app=document.getElementById('app');
document.documentElement.classList.toggle('anim','IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches);
let io;
function theoDoi(){
  if(io) io.disconnect();
  if(!('IntersectionObserver' in window)) return;
  io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('on',e.isIntersecting)),{threshold:.15});
  document.querySelectorAll('.car').forEach(c=>io.observe(c));
}
/* route nội bộ dạng #/o-to/vf3, địa chỉ thật dạng /vf3/ */
function DG(r){
  const p=r.replace(/^#\/?/,'').split('/').filter(Boolean);
  if(!p.length) return '/';
  if(p[0]==='o-to'&&p[1]){const x=XE.find(v=>v.id===p[1]);return '/'+(x?x.duong:p[1])+'/';}
  return '/'+p.join('/')+'/';
}
function TU(path){
  const s=path.split('/').filter(Boolean);
  if(!s.length) return '#/';
  if(['o-to','tin-tuc','lien-he'].includes(s[0])) return '#/'+s.join('/');
  const x=XE.find(v=>v.duong===s[0]);
  return x?'#/o-to/'+x.id:'#/khong-thay';
}
const DOIHREF=h=>h.replace(/href="(#\/[^"]*)"/g,(m,r)=>`href="${DG(r)}"`);
function nav(k){
  document.getElementById('nav').innerHTML=DOIHREF([['#/','home','home'],['#/o-to','xe','xe'],['#/tin-tuc','tin','tin'],['#/lien-he','lh','lh']].map(n=>`<a href="${n[0]}" class="${n[2]===k?'on':''}">${T(n[1])}</a>`).join(''));
}
function ve(){
  const p=route.replace(/^#\/?/,'').split('/');
  let k='home',h;
  if(p[0]==='o-to'){k='xe';h=p[1]?V.ct(p[1]):V.xe();}
  else if(p[0]==='tin-tuc'){k='tin';h=p[1]?V.bai(p[1]):V.tin();}
  else if(p[0]==='lien-he'){k='lh';h=V.lh(p[1],p[2]);}
  else if(p[0]==='khong-thay'){k='';h=V.kt();}
  else h=V.home();
  nav(k); app.innerHTML=DOIHREF(h); document.documentElement.lang=lang;
  document.getElementById('blt').textContent=lang==='vi'?'EN':'VI';
  const xeHien=p[0]==='o-to'&&XE.find(v=>v.id===p[1]);
  const baiHien=p[0]==='tin-tuc'&&BAI.find(v=>v.slug===p[1]);
  document.title=(xeHien?'VinFast '+xeHien.ten+' | ':baiHien?B(baiHien,'tieu')+' | ':'')+T('tieu');
  const mt=document.querySelector('meta[name="description"]');if(mt)mt.content=baiHien?B(baiHien,'tom'):xeHien?`VinFast ${xeHien.ten}: ${LOI(xeHien)}. ${T('tu')} ${TIEN(GIA(xeHien))} VND. SAMCO ${T('bt')}.`:T('moTa');
  const cn=document.querySelector('link[rel="canonical"]');if(cn)cn.href=MIEN+(p[0]==='lien-he'?'/lien-he/':DG(route));
  document.getElementById('bl').setAttribute('aria-label',lang==='en'?'Change language':'Đổi ngôn ngữ');
  document.querySelectorAll('#che button').forEach(b=>{const n=T({light:'cheS',dark:'cheT',auto:'cheA'}[b.dataset.che]);b.title=n;b.setAttribute('aria-label',n);});
  const gG=document.getElementById('gG'),gZ=document.getElementById('gZ');
  gG.href='tel:'+SDT;gG.textContent=T('goi');gZ.href='https://zalo.me/'+SDT;gZ.textContent='Zalo';
  theoDoi();
  const fm=p[0]==='lien-he'&&p[1]&&document.getElementById('fm');
  if(fm) fm.scrollIntoView(); else scrollTo(0,0);
}
const MQ=matchMedia('(prefers-color-scheme:dark)');
let che='auto';
try{const l=localStorage.getItem('samco-che');if(l==='light'||l==='dark'||l==='auto')che=l;}catch(e){}
function apDungChe(){
  document.documentElement.setAttribute('data-theme',che==='auto'?(MQ.matches?'dark':'light'):che);
  document.querySelectorAll('#che button').forEach(b=>b.classList.toggle('on',b.dataset.che===che));
}
apDungChe();
if(MQ.addEventListener) MQ.addEventListener('change',apDungChe);
document.getElementById('che').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b) return;
  che=b.dataset.che;apDungChe();
  try{localStorage.setItem('samco-che',che);}catch(err){}
});
document.getElementById('bl').onclick=()=>{lang=lang==='vi'?'en':'vi';try{localStorage.setItem('samco-lang',lang);}catch(e){}ve();};
document.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href^="/"]');
  if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
  e.preventDefault();
  const dich=a.getAttribute('href');
  route=TU(dich);
  if(route.startsWith('#/o-to/')) tg={i:0,m:0,tra:30,nam:5,xe:''};
  history.pushState(null,'',dich);
  ve();
});
addEventListener('popstate',()=>{route=TU(location.pathname);tg={i:0,m:0,tra:30,nam:5,xe:''};ve();});
function rung(c){c.classList.remove('rung');void c.getBoundingClientRect();c.classList.add('rung');}
document.addEventListener('pointerover',e=>{const c=e.target.closest&&e.target.closest('.car');if(c&&e.pointerType==='mouse'&&!c.classList.contains('rung'))rung(c);});
document.addEventListener('pointerdown',e=>{const c=e.target.closest&&e.target.closest('.car');if(c)rung(c);});
document.addEventListener('animationend',e=>{if(e.animationName==='rung')e.target.classList.remove('rung');});
function doiAnh(x){
  const bo=BO(x,tg.i),m=MAU[bo].ds[tg.m],a=document.getElementById('anhChinh');
  a.src=ANH(bo,m);a.style.width=RONG(bo,m)+'%';a.alt='VinFast '+x.ten+' '+MT(m.ten);rung(a);
}
function capNhatGia(){
  const x=xeHienTai(); if(!x) return;
  document.getElementById('bangBox').innerHTML=bang(x,tg.i);
  document.getElementById('tgBox').innerHTML=bangTraGop(x);
}
function xeHienTai(){return XE.find(v=>v.id===route.split('/')[2]);}
function toast(s){const e=document.getElementById('toast');e.textContent=s;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1800);}
document.addEventListener('click',async e=>{
  const pb=e.target.closest&&e.target.closest('[data-pb]');
  if(pb){
    tg.i=+pb.dataset.pb;const x=xeHienTai();
    document.getElementById('bangBox').innerHTML=bang(x,tg.i);
    document.getElementById('diemBox').innerHTML=diem(x,tg.i);
    document.getElementById('tgBox').innerHTML=bangTraGop(x);
    document.querySelectorAll('[data-pb]').forEach(b=>b.classList.toggle('on',b===pb));
    tg.m=0;doiAnh(x);document.getElementById('mauBox').innerHTML=hangMau(x);
    return;
  }
  const bg=e.target.closest&&e.target.closest('[data-goi]');
  if(bg){
    CH.g=bg.dataset.goi;tg.nam=GOI[CH.g].nam;
    document.querySelectorAll('[data-goi]').forEach(b=>b.classList.toggle('on',b===bg));
    document.getElementById('kNam').value=tg.nam;
    document.getElementById('kNamV').textContent=tg.nam+' '+T('namd');
    capNhatGia();return;
  }
  const mb=e.target.closest&&e.target.closest('[data-mau]');
  if(mb){
    tg.m=+mb.dataset.mau;const x=xeHienTai();
    doiAnh(x);
    document.querySelectorAll('[data-mau]').forEach(b=>b.classList.toggle('on',b===mb));
    document.getElementById('mauTen').textContent=MT(MAU[BO(x,tg.i)].ds[tg.m].ten);
    return;
  }
  const s=e.target.closest&&e.target.closest('#seg button');
  if(s&&!s.disabled){
    document.querySelectorAll('#seg button').forEach(b=>b.classList.toggle('on',b===s));
    document.getElementById('boxNgay').style.display=s.dataset.l==='lt'?'block':'none';
    return;
  }
  const cp=e.target.closest&&e.target.closest('#bCp');
  if(cp){
    try{await navigator.clipboard.writeText(cp.dataset.link);toast(T('dacp'));}
    catch(err){toast(T('kcp'));}
  }
});
document.addEventListener('input',e=>{
  if(e.target.id!=='kTra'&&e.target.id!=='kNam')return;
  if(e.target.id==='kTra'){tg.tra=+e.target.value;document.getElementById('kTraV').textContent=tg.tra+'%';}
  else{tg.nam=+e.target.value;document.getElementById('kNamV').textContent=tg.nam+' '+T('namd');}
  document.getElementById('tgBox').innerHTML=bangTraGop(xeHienTai());
});
document.addEventListener('change',e=>{
  if(e.target.id!=='fX')return;
  const x=XE.find(v=>v.id===e.target.value),[tv,lt]=document.querySelectorAll('#seg button');
  document.getElementById('fM').innerHTML=oMau(x);
  lt.disabled=!x.laiThu;
  if(!x.laiThu){lt.classList.remove('on');tv.classList.add('on');document.getElementById('boxNgay').style.display='none';}
});
let moForm=Date.now();
document.addEventListener('submit',async e=>{
  if(e.target.id!=='fm')return;e.preventDefault();
  const q=i=>document.getElementById(i),err=q('fErr');err.textContent='';
  const ten=q('fT').value.trim(),sdt=q('fS').value.replace(/[\s.-]/g,''),m=q('fE').value.trim();
  if(!ten){err.textContent=T('e1');return;}
  if(!/^0\d{9}$/.test(sdt)){err.textContent=T('e2');return;}
  if(m&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)){err.textContent=T('e3');return;}
  const nut=e.target.querySelector('.nutgui'),lt=q('seg').querySelector('button.on').dataset.l==='lt';
  nut.disabled=true;nut.textContent=T('dangGui');
  try{
    await call('guiDangKy',{ten,sdt,email:m,xe:q('fX').value,mau:q('fM').value,nhuCau:lt?'Lái thử':'Tư vấn',ngay:lt?q('fN').value:'',web:q('fW').value,giay:Math.round((Date.now()-moForm)/1000)});
    e.target.outerHTML=`<div class="xong">${T('ok')}<br>${T('okn')}</div>`;
  }catch(er){
    err.innerHTML=`${T('e4')}<a href="tel:${SDT}"><b>${SDT_HIEN}</b></a>.`;
    nut.disabled=false;nut.textContent=T('gui');
  }
});
/* Lấy dữ liệu mới nhất từ Sheet. Lưu lại để lần sau mở nhanh. Lỗi thì vẫn dùng dữ liệu sẵn có. */
function veLai(){
  if(route.startsWith('#/lien-he')) return;
  const x=xeHienTai();
  if(x&&tg.i>=x.pb.length) tg.i=0;
  if(x&&tg.m>=MAU[BO(x,tg.i)].ds.length) tg.m=0;
  const cu=document.getElementById('lich');const mo=cu&&cu.open;
  const y=scrollY;ve();scrollTo(0,y);
  const moi=document.getElementById('lich');if(moi&&mo)moi.open=true;
}
async function lamMoi(){
  let cu='';
  try{const r=JSON.parse(localStorage.getItem('samco-du-lieu')||'null');if(r&&Date.now()-r.t<7*864e5){cu=JSON.stringify(r.d);gop(r.d);}}catch(e){}
  route=TU(location.pathname);ve();
  try{
    const d=await call('getData'),moi=JSON.stringify(d);
    try{localStorage.setItem('samco-du-lieu',JSON.stringify({t:Date.now(),d}));}catch(e){}
    if(moi!==cu){gop(d);route=TU(location.pathname);veLai();}
  }catch(e){}
}
lamMoi();
