let items=[
{id:1,name:'دوربین عکاسی Canon',cat:'دیجیتال',price:180000,deposit:2000000,icon:'📷',owner:'سارا محمدی',rating:'۴.۹',vip:true,desc:'دوربین سالم و تمیز، مناسب پروژه‌های عکاسی. همراه با کیف و باتری اضافه.'},
{id:2,name:'ماشین حساب مهندسی',cat:'آموزشی',price:35000,deposit:300000,icon:'🧮',owner:'علی رضایی',rating:'۵.۰',vip:false,desc:'ماشین حساب مهندسی سالم، مناسب امتحانات و کلاس‌ها.'},
{id:3,name:'دریل شارژی',cat:'ابزار',price:90000,deposit:800000,icon:'🛠️',owner:'مهدی کریمی',rating:'۴.۸',vip:true,desc:'دریل شارژی به همراه دو باتری و سری‌های مختلف.'},
{id:4,name:'راکت بدمینتون',cat:'ورزشی',price:50000,deposit:400000,icon:'🏸',owner:'نگار احمدی',rating:'۴.۷',vip:false,desc:'یک جفت راکت سالم، مناسب استفاده دانشجویی.'},
{id:5,name:'تبلت طراحی',cat:'دیجیتال',price:120000,deposit:1200000,icon:'✍️',owner:'آرمان صالحی',rating:'۴.۹',vip:false,desc:'تبلت طراحی با قلم، مناسب طراحی و یادداشت‌برداری.'},
{id:6,name:'کتاب مرجع فیزیک',cat:'آموزشی',price:25000,deposit:150000,icon:'📚',owner:'هستی نوری',rating:'۴.۶',vip:false,desc:'چاپ تمیز و بدون یادداشت‌نویسی.'}
];let selectedItem=null,pendingAction=null,filter='همه',rentals=[];
const money=n=>Number(n).toLocaleString('fa-IR')+' تومان';
function renderItems(){let q=document.getElementById('searchInput').value.trim();let arr=items.filter(x=>(filter==='همه'||x.cat===filter)&&(!q||x.name.includes(q)||x.desc.includes(q)));arr.sort((a,b)=>Number(b.vip)-Number(a.vip));document.getElementById('itemGrid').innerHTML=arr.map(x=>`<article class="card"><div class="item-img">${x.icon}<span class="badge ${x.vip?'vip':''}">${x.vip?'⭐ VIP':'دانشجویی'}</span></div><div class="card-body"><div class="card-title"><h3>${x.name}</h3><div class="price">${money(x.price)}<small>/ روز</small></div></div><div class="meta"><span>▦ ${x.cat}</span><span>🛡 ودیعه ${money(x.deposit)}</span></div><div class="card-foot"><div><div class="rating">★ ${x.rating}</div><div class="owner">${x.owner}</div></div><button class="btn btn-primary" onclick="showDetail(${x.id})">مشاهده و اجاره</button></div></div></article>`).join('')||'<div class="empty">موردی پیدا نشد.</div>'}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>showPage(b.dataset.page)));
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='myrentals')renderRentals()}
document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.cat;renderItems()}));
function openModal(id){document.getElementById(id).classList.add('show')}function closeModal(id){document.getElementById(id).classList.remove('show')}
function showDetail(id){selectedItem=items.find(x=>x.id===id);document.getElementById('detailTitle').textContent=selectedItem.name;document.getElementById('detailBody').innerHTML=`<div style="font-size:65px;text-align:center;background:#f1f5ff;padding:20px;border-radius:14px">${selectedItem.icon}</div><p>${selectedItem.desc}</p><div class="stats"><div class="stat"><strong>${money(selectedItem.price)}</strong><span>اجاره روزانه</span></div><div class="stat"><strong>${money(selectedItem.deposit)}</strong><span>ودیعه امن</span></div></div><div class="form-grid"><div class="field"><label>مدت اجاره (روز)</label><input id="days" type="number" min="1" value="2"></div><div class="field"><label>تاریخ بازگشت</label><input id="returnDate" type="date"></div></div><div class="notice green">🛡 ودیعه تا زمان بازگشت کالا نزد سامانه امانی می‌ماند. پس از تأیید سلامت کالا، به اجاره‌کننده بازگردانده می‌شود.</div><div class="field"><label>عکس وضعیت کالا هنگام تحویل (اختیاری در پیش‌نمایش)</label><input id="beforePhoto" type="file" accept="image/*"></div><button class="btn btn-primary" style="width:100%;margin-top:15px" onclick="rentItem()">درخواست اجاره و پرداخت ودیعه</button>`;openModal('detailModal')}
function rentItem(){let days=Math.max(1,Number(document.getElementById('days').value)||1);let total=selectedItem.price*days+selectedItem.deposit;pendingAction={type:'rent',item:selectedItem,days,total};closeModal('detailModal');document.getElementById('paySummary').innerHTML=`<b>خلاصه پرداخت برای ${selectedItem.name}</b><br>اجاره ${days} روز: ${money(selectedItem.price*days)}<br>ودیعه قابل استرداد: ${money(selectedItem.deposit)}<hr>مبلغ پرداخت نمایشی: <b>${money(total)}</b>`;openModal('payModal')}
function vipPay(plan,price){pendingAction={type:'vip',plan,price};document.getElementById('paySummary').innerHTML=`فعال‌سازی جایگاه VIP ${plan}<br>مبلغ: <b>${money(price)}</b><br><small>در این نمونه، آگهی اول شما به‌صورت نمایشی ویژه می‌شود.</small>`;openModal('payModal')}
function completePayment(){if(!pendingAction)return;if(pendingAction.type==='rent'){let r={...pendingAction,id:Date.now(),status:'در انتظار تحویل',before:false,after:false};rentals.push(r);toast('پرداخت نمایشی موفق بود؛ درخواست اجاره ثبت شد.');}else{toast('پرداخت نمایشی موفق بود؛ VIP فعال شد.');if(items.length)items[0].vip=true;}pendingAction=null;closeModal('payModal');renderItems();renderRentals()}
function renderRentals(){let el=document.getElementById('rentalList');if(!rentals.length){el.className='empty';el.innerHTML='هنوز اجاره‌ای ثبت نکرده‌اید. از بازار کالا یک مورد انتخاب کنید.';return}el.className='';el.innerHTML=rentals.map(r=>`<div class="panel" style="margin:12px 0"><div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><h3>${r.item.icon} ${r.item.name}</h3><span class="muted">مدت: ${r.days} روز · وضعیت: ${r.status}</span></div><b style="color:var(--primary)">${money(r.total)}</b></div><div class="steps"><div class="step done"><b>پرداخت</b>ودیعه در امانت</div><div class="step ${r.before?'done':''}"><b>عکس قبل از تحویل</b>${r.before?'ثبت شده':'در انتظار ثبت'}</div><div class="step ${r.after?'done':''}"><b>عکس بعد از تحویل</b>${r.after?'ثبت شده':'در انتظار ثبت'}</div><div class="step"><b>تسویه ودیعه</b>پس از تأیید</div></div><div class="form-grid"><div class="field"><label>ثبت عکس قبل از تحویل</label><input type="file" accept="image/*" onchange="photoStep(${r.id},'before',this)"></div><div class="field"><label>ثبت عکس بعد از تحویل</label><input type="file" accept="image/*" onchange="photoStep(${r.id},'after',this)"></div></div><div class="notice gold">در صورت تأخیر، جریمه نمونه ${money(Math.ceil(r.item.price*.05))} به ازای هر روز تأخیر محاسبه می‌شود.</div><button class="btn btn-outline" onclick="finishRental(${r.id})">ثبت بازگشت کالا و درخواست آزادسازی ودیعه</button></div>`).join('')}
function photoStep(id,step,input){if(!input.files.length)return;let r=rentals.find(x=>x.id===id);r[step]=true;toast('عکس در پیش‌نمایش ثبت شد.');renderRentals()}
function finishRental(id){let r=rentals.find(x=>x.id===id);if(!r.before||!r.after){toast('برای تکمیل، عکس قبل و بعد از تحویل را ثبت کنید.');return}r.status='بازگشت ثبت شد؛ آماده بررسی ودیعه';renderRentals();toast('درخواست آزادسازی ودیعه ثبت شد.')}
function addItem(){let name=document.getElementById('newName').value.trim(),price=Number(document.getElementById('newPrice').value),deposit=Number(document.getElementById('newDeposit').value);if(!name||!price||!deposit){toast('نام کالا، اجاره روزانه و ودیعه را کامل کنید.');return}let file=document.getElementById('newPhoto').files[0];let x={id:Date.now(),name,cat:document.getElementById('newCat').value,price,deposit,icon:'📦',owner:'علی رضایی',rating:'جدید',vip:false,desc:document.getElementById('newDesc').value||'آگهی جدید دانشجویی'};items.unshift(x);closeModal('addModal');renderItems();toast('آگهی با موفقیت ثبت شد.');['newName','newPrice','newDeposit','newDesc','newPhoto'].forEach(id=>document.getElementById(id).value='')}
function selectPay(el){document.querySelectorAll('.pay-method').forEach(x=>x.classList.remove('selected'));el.classList.add('selected')}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');let c=document.getElementById('profileContent');let map={myads:'آگهی‌های ثبت‌شده شما در این بخش نمایش داده می‌شوند. برای ثبت آگهی از دکمه بالای صفحه استفاده کنید.',reviews:'<div class="notice green">★★★★★ سارا محمدی: تحویل به‌موقع و کالای کاملاً سالم. تجربه عالی!</div><div class="notice">★★★★☆ مهدی کریمی: ارتباط خوب و پاسخ‌گویی سریع.</div>',wallet:'<div class="stat"><strong>۰ تومان</strong><span>موجودی کیف پول نمایشی</span></div><p class="muted">تراکنش‌ها و بازگشت ودیعه پس از تأیید در این قسمت نمایش داده می‌شوند.</p>',security:'<div class="notice green">✓ تأیید هویت دانشگاهی<br>✓ ودیعه امانی تا پایان اجاره<br>✓ ثبت مستندات تصویری قبل و بعد از تحویل<br>✓ امتیازدهی دوطرفه پس از تکمیل اجاره</div>'};c.innerHTML=map[b.dataset.tab]}));
function toast(msg){let t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)}
renderItems();
/* لایه امکانات افزوده */
let favorites = new Set(JSON.parse(localStorage.getItem('rentik_favorites')||'[]'));
let sortMode='default', activeReviewRental=null, reviewScore=5;
let extraMessages=[];
function saveFavorites(){localStorage.setItem('rentik_favorites',JSON.stringify([...favorites]))}
function enhancedRenderItems(){
 const q=document.getElementById('searchInput').value.trim();
 let arr=items.filter(x=>(filter==='همه'||x.cat===filter)&&(!q||x.name.includes(q)||x.desc.includes(q)));
 if(sortMode==='cheap')arr.sort((a,b)=>a.price-b.price);
 else if(sortMode==='expensive')arr.sort((a,b)=>b.price-a.price);
 else if(sortMode==='rating')arr.sort((a,b)=>parseFloat(b.rating)-parseFloat(a.rating));
 else arr.sort((a,b)=>Number(b.vip)-Number(a.vip));
 document.getElementById('itemGrid').innerHTML=arr.map(x=>`<article class="card"><div class="item-img">${x.icon}<span class="badge ${x.vip?'vip':''}">${x.vip?'⭐ VIP':'دانشجویی'}</span><button class="favorite-btn ${favorites.has(x.id)?'on':''}" title="علاقه‌مندی" onclick="toggleFavorite(${x.id})">${favorites.has(x.id)?'♥':'♡'}</button></div><div class="card-body"><div class="card-title"><h3>${x.name}</h3><div class="price">${money(x.price)}<small>/ روز</small></div></div><div class="meta"><span>▦ ${x.cat}</span><span>🛡 ودیعه ${money(x.deposit)}</span></div><div class="card-foot"><div><div class="rating">★ ${x.rating}</div><div class="owner">${x.owner}</div></div><div class="quick-actions"><button class="btn btn-light" title="پیام به صاحب کالا" onclick="openChat('${x.owner}')">پیام</button><button class="btn btn-primary" onclick="showDetail(${x.id})">اجاره</button></div></div></div></article>`).join('')||'<div class="empty">موردی پیدا نشد.</div>';
}
renderItems=enhancedRenderItems;
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);saveFavorites();renderItems();toast(favorites.has(id)?'به علاقه‌مندی‌ها اضافه شد.':'از علاقه‌مندی‌ها حذف شد.')}
function openChat(owner){document.getElementById('chatTitle').textContent='گفت‌وگو با '+owner;document.getElementById('chatBox').innerHTML='<div class="bubble">سلام! برای هماهنگی زمان و محل تحویل کالا در خدمتت هستم.</div>';openModal('chatModal')}
function sendChat(){let inp=document.getElementById('chatInput');if(!inp.value.trim())return;let box=document.getElementById('chatBox');box.innerHTML+=`<div class="bubble mine">${escapeText(inp.value)}</div>`;inp.value='';box.scrollTop=box.scrollHeight;toast('پیام در نمونه نمایشی ارسال شد.')}
function escapeText(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function submitReport(){if(!document.getElementById('reportText').value.trim()){toast('لطفاً شرح مشکل را بنویسید.');return}closeModal('reportModal');document.getElementById('reportText').value='';toast('گزارش شما ثبت نمایشی شد؛ تیم پشتیبانی بررسی می‌کند.')}
function submitReview(){if(!activeReviewRental)return;activeReviewRental.reviewed=true;closeModal('reviewModal');toast('امتیاز و نظر شما ثبت شد. ممنون از مشارکتت!');renderRentals()}
document.querySelectorAll('#reviewStars span').forEach(s=>s.addEventListener('click',()=>{reviewScore=Number(s.dataset.v);document.querySelectorAll('#reviewStars span').forEach(x=>x.classList.toggle('selected',Number(x.dataset.v)<=reviewScore))}));
const oldFinishRental=finishRental;
finishRental=function(id){let r=rentals.find(x=>x.id===id);if(!r.before||!r.after){toast('برای تکمیل، عکس قبل و بعد از تحویل را ثبت کنید.');return}r.status='بازگشت ثبت شد؛ آماده بررسی ودیعه';renderRentals();toast('درخواست آزادسازی ودیعه ثبت شد.');activeReviewRental=r;setTimeout(()=>{document.getElementById('reviewStars').querySelectorAll('span').forEach(x=>x.classList.toggle('selected',Number(x.dataset.v)<=5));openModal('reviewModal')},350)}
const oldRenderRentals=renderRentals;
renderRentals=function(){oldRenderRentals();document.querySelectorAll('#rentalList .panel').forEach((p,i)=>{if(!p.querySelector('.report-action')){let b=document.createElement('button');b.className='btn btn-danger report-action';b.style.marginRight='8px';b.textContent='گزارش مشکل';b.onclick=()=>openModal('reportModal');p.appendChild(b)}})}
/* ابزار مرتب‌سازی و اعلان‌ها */
const tools=document.createElement('div');tools.className='extra-tools';tools.innerHTML='<span class="muted" style="font-size:13px;font-weight:800">مرتب‌سازی:</span><select id="sortSelect"><option value="default">ویژه‌ها در ابتدا</option><option value="cheap">ارزان‌ترین اجاره</option><option value="expensive">گران‌ترین اجاره</option><option value="rating">بالاترین امتیاز</option></select><button class="icon-btn" onclick="showFavorites()">♥ علاقه‌مندی‌های من</button><button class="icon-btn" onclick="openModal(\'reportModal\')">⚑ مرکز گزارش مشکل</button>';
document.querySelector('.filters').after(tools);
document.getElementById('sortSelect').addEventListener('change',e=>{sortMode=e.target.value;renderItems()});
function showFavorites(){let saved=filter;filter='همه';renderItems();let q=document.getElementById('searchInput');q.value='';let arr=items.filter(x=>favorites.has(x.id));document.getElementById('itemGrid').innerHTML=arr.length?arr.map(x=>`<article class="card"><div class="item-img">${x.icon}<span class="badge vip">♥ ذخیره‌شده</span></div><div class="card-body"><h3>${x.name}</h3><p class="price">${money(x.price)} / روز</p><button class="btn btn-primary" onclick="showDetail(${x.id})">مشاهده و اجاره</button></div></article>`).join(''):'<div class="empty">هنوز کالایی ذخیره نکرده‌ای.</div>';toast('فهرست علاقه‌مندی‌ها')}
const notif=document.createElement('div');notif.className='notif-wrap';notif.innerHTML='<button class="icon-btn" onclick="document.getElementById(\'notifMenu\').classList.toggle(\'show\')">🔔 <span style="color:#e45e68">●</span></button><div class="notif-menu" id="notifMenu"><b>اعلان‌ها</b><div class="notif-item">🎉 به رنتیک خوش آمدی! آگهی‌های جدید را ببین.</div><div class="notif-item">🛡 ودیعه پس از تأیید بازگشت کالا آزاد می‌شود.</div><div class="notif-item">⭐ با ثبت نظر، به اعتماد جامعه دانشگاهی کمک کن.</div></div>';
document.querySelector('.top-actions').prepend(notif);
const trust=document.createElement('div');trust.className='trust-row';trust.innerHTML='<div class="trust-card"><span>🛡️</span><div><b>ودیعه امانی</b><small>بازگشت پس از تأیید</small></div></div><div class="trust-card"><span>📸</span><div><b>مستندسازی تحویل</b><small>عکس قبل و بعد</small></div></div><div class="trust-card"><span>⭐</span><div><b>اعتبار دوطرفه</b><small>نظر پس از اجاره</small></div></div><div class="trust-card"><span>⚖️</span><div><b>مرکز حل اختلاف</b><small>ثبت و پیگیری گزارش</small></div></div>';
document.querySelector('.hero').after(trust);
/* آپلود عکس برای آگهی و برای قبل و بعد از تحویل */
function readImage(file,cb){var fr=new FileReader();fr.onerror=function(){cb(null)};fr.onload=function(){var img=new Image();img.onerror=function(){cb(fr.result)};img.onload=function(){var s=Math.min(1,900/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*s));c.height=Math.max(1,Math.round(img.height*s));c.getContext('2d').drawImage(img,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',0.82))};img.src=fr.result};fr.readAsDataURL(file)}
function photoTag(d){return '<img class="item-photo" alt="" src="'+d+'">'}
addItem=function(){
 var name=document.getElementById('newName').value.trim(),price=Number(document.getElementById('newPrice').value),deposit=Number(document.getElementById('newDeposit').value);
 if(!name||!price||!deposit){toast('نام کالا، اجاره روزانه و ودیعه را کامل کنید.');return}
 var file=document.getElementById('newPhoto').files[0];
 var finish=function(d){
  items.unshift({id:Date.now(),name:name,cat:document.getElementById('newCat').value,price:price,deposit:deposit,icon:d?photoTag(d):'📦',owner:'علی رضایی',rating:'جدید',vip:false,desc:document.getElementById('newDesc').value||'آگهی جدید دانشجویی'});
  closeModal('addModal');
  filter='همه';document.querySelectorAll('.chip').forEach(function(c){c.classList.toggle('active',c.dataset.cat==='همه')});
  document.getElementById('searchInput').value='';sortMode='default';var ss=document.getElementById('sortSelect');if(ss)ss.value='default';
  showPage('home');renderItems();toast('آگهی با موفقیت ثبت شد.');
  ['newName','newPrice','newDeposit','newDesc','newPhoto'].forEach(function(id){document.getElementById(id).value=''});
 };
 if(file)readImage(file,finish);else finish(null);
};
var _rentItem=rentItem;
rentItem=function(){
 var f=document.getElementById('beforePhoto');f=f&&f.files[0];
 _rentItem();
 if(f)readImage(f,function(d){if(pendingAction&&pendingAction.type==='rent')pendingAction.before=d});
};
var _completePayment=completePayment;
completePayment=function(){
 var pa=pendingAction,wasRent=!!pa&&pa.type==='rent',bp=wasRent?pa.before:null;
 _completePayment();
 if(wasRent){if(typeof bp==='string')rentals[rentals.length-1].before=bp;showPage('myrentals')}
};
photoStep=function(id,step,input){
 if(!input.files.length)return;
 var r=rentals.find(function(x){return x.id===id});
 readImage(input.files[0],function(d){r[step]=d||true;toast(step==='before'?'عکس قبل از تحویل ثبت شد.':'عکس بعد از تحویل ثبت شد.');renderRentals()});
};
var _renderRentals2=renderRentals;
renderRentals=function(){
 _renderRentals2();
 document.querySelectorAll('#rentalList .panel').forEach(function(p,i){
  var r=rentals[i];if(!r)return;var html='';
  if(typeof r.before==='string')html+='<figure><img src="'+r.before+'" alt=""><figcaption>قبل از تحویل</figcaption></figure>';
  if(typeof r.after==='string')html+='<figure><img src="'+r.after+'" alt=""><figcaption>بعد از تحویل</figcaption></figure>';
  if(html){var t=document.createElement('div');t.className='thumbs';t.innerHTML=html;p.querySelector('.form-grid').after(t)}
 });
};
function myAdsHtml(){
 var mine=items.filter(function(x){return x.owner==='علی رضایی'});
 if(!mine.length)return '<div class="empty">هنوز آگهی‌ای ثبت نکرده‌اید. از دکمه «ثبت آگهی» بالای صفحه شروع کنید.</div>';
 return '<div class="grid">'+mine.map(function(x){return '<article class="card"><div class="item-img">'+x.icon+'</div><div class="card-body"><h3>'+x.name+'</h3><p class="price">'+money(x.price)+' <small>/ روز</small></p></div></article>'}).join('')+'</div>';
}
document.querySelectorAll('.tab').forEach(function(b){b.addEventListener('click',function(){if(b.dataset.tab==='myads')document.getElementById('profileContent').innerHTML=myAdsHtml()})});
var _showPage=showPage;
showPage=function(id){_showPage(id);if(id==='profile'){var t=document.querySelector('.tab.active');if(t&&t.dataset.tab==='myads')document.getElementById('profileContent').innerHTML=myAdsHtml()}};
renderItems();
(function(){
 /* spring easing, generated so the motion really bounces like iOS */
 try{if(window.CSS&&CSS.supports&&CSS.supports('transition-timing-function','linear(0,1)')){var z=.62,w=11,wd=w*Math.sqrt(1-z*z),pts=[],n=44;for(var i=0;i<=n;i++){var t=i/n,v=i===n?1:1-Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t));pts.push(Math.round(v*1000)/1000)}document.documentElement.style.setProperty('--spring','linear('+pts.join(', ')+')')}}catch(e){}
 /* sheets: open, animated close, tap outside to dismiss */
 window.openModal=function(id){var m=document.getElementById(id);if(!m)return;m.classList.remove('closing');m.classList.add('show')};
 window.closeModal=function(id){var m=document.getElementById(id);if(!m||!m.classList.contains('show')||m.classList.contains('closing'))return;m.classList.add('closing');setTimeout(function(){if(m.classList.contains('closing'))m.classList.remove('show','closing')},280)};
 document.querySelectorAll('.modal-back').forEach(function(m){m.addEventListener('mousedown',function(e){if(e.target===m)window.closeModal(m.id)})});
 /* sliding segmented control */
 function makeSegment(c){
  if(!c||c.dataset.seg)return;c.dataset.seg='1';
  var pill=document.createElement('span');pill.className='seg-pill';c.insertBefore(pill,c.firstChild);
  var first=true;
  function place(){var a=c.querySelector('button.active');if(!a||!a.offsetWidth){pill.style.opacity='0';return}
   if(first)pill.style.transition='none';
   pill.style.opacity='1';pill.style.width=a.offsetWidth+'px';pill.style.transform='translateX('+a.offsetLeft+'px)';
   if(first){void pill.offsetWidth;pill.style.transition='';first=false}}
  new MutationObserver(place).observe(c,{attributes:true,subtree:true,attributeFilter:['class']});
  if(window.ResizeObserver)new ResizeObserver(place).observe(c);
  window.addEventListener('resize',place);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
  place();
 }
 makeSegment(document.querySelector('.nav'));makeSegment(document.querySelector('.profile-tabs'));
 /* mobile tab bar */
 var tb=document.getElementById('tabbar');
 tb.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){window.showPage(b.dataset.page)})});
 var _sp=window.showPage;
 window.showPage=function(id){_sp(id);tb.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.dataset.page===id)})};
 /* staggered cards, calm re-renders when only a heart changes */
 var _ri=window.renderItems;
 window.renderItems=function(){var g=document.getElementById('itemGrid');if(g)g.classList.toggle('no-anim',!!window.__keepAnim);_ri();document.querySelectorAll('#itemGrid .card').forEach(function(c,i){c.style.setProperty('--i',i)})};
 var _tf=window.toggleFavorite;
 window.toggleFavorite=function(id){window.__keepAnim=true;_tf(id);window.__keepAnim=false;var b=document.querySelector('#itemGrid .favorite-btn[onclick="toggleFavorite('+id+')"]');if(b&&favorites.has(id))b.classList.add('pop')};
 /* header shadow on scroll */
 window.addEventListener('scroll',function(){document.querySelector('.topbar').classList.toggle('scrolled',window.scrollY>6)},{passive:true});
 /* Persian photo picker instead of the browser's English file input */
 function enhanceFiles(){
  document.querySelectorAll('input[type=file]:not([data-enh])').forEach(function(inp){
   inp.dataset.enh='1';
   var lab=document.createElement('label');lab.className='filepick';
   inp.parentNode.insertBefore(lab,inp);
   var pv=document.createElement('img');pv.className='pick-preview';pv.alt='';
   var nm=document.createElement('span');nm.className='pick-name';nm.textContent='عکسی انتخاب نشده';
   var bt=document.createElement('span');bt.className='pick-btn';bt.textContent='انتخاب عکس';
   lab.appendChild(pv);lab.appendChild(nm);lab.appendChild(bt);lab.appendChild(inp);
   inp.addEventListener('change',function(){var f=inp.files&&inp.files[0];lab.classList.toggle('has',!!f);if(f){nm.textContent=f.name;pv.src=URL.createObjectURL(f)}else{nm.textContent='عکسی انتخاب نشده'}});
  });
 }
 new MutationObserver(enhanceFiles).observe(document.body,{childList:true,subtree:true});
 enhanceFiles();
 window.renderItems();
})();