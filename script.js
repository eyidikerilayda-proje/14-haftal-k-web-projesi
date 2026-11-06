// Ne Yapalım? uygulama mantığı (games.js önce yüklenmelidir)
(function(){
var KEY="neYapalim.v1";
var app=document.getElementById("app");
var S=load(),sel=null,onlyFit=true,err={},confirming=false,tab="setup";

function fresh(){return{stage:"setup",players:[],options:[],counts:[],current:0,phase:"pick",tie:null}}
function isStrArr(a){return Array.isArray(a)&&a.every(function(x){return typeof x==="string"})}
function load(){
 try{
  var s=JSON.parse(localStorage.getItem(KEY));
  if(s&&["setup","vote","result"].indexOf(s.stage)>-1&&isStrArr(s.players)&&isStrArr(s.options)&&Array.isArray(s.counts)&&s.counts.length===s.options.length&&typeof s.current==="number"&&(s.phase==="pick"||s.phase==="done")&&(s.tie===null||typeof s.tie==="number")){return s}
 }catch(e){}
 return fresh();
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function h(tag,attrs){
 var el=document.createElement(tag);
 for(var k in (attrs||{})){
  var v=attrs[k];
  if(k==="on"){for(var ev in v)el.addEventListener(ev,v[ev])}
  else if(k==="text"){el.textContent=v}
  else if(v===true){el.setAttribute(k,"")}
  else if(v!==false&&v!=null){el.setAttribute(k,v)}
 }
 for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c)el.appendChild(typeof c==="string"?document.createTextNode(c):c)}
 return el;
}
function go(){save();render()}

function addItem(list,key,val){
 val=val.trim();
 if(!val){err[key]="Boş bırakılamaz.";return render()}
 if(val.length>30){err[key]="En fazla 30 karakter.";return render()}
 err[key]="";S[list].push(val);
 if(list==="options")S.counts.push(0);
 go();
}
function removeItem(list,i){S[list].splice(i,1);if(list==="options")S.counts.splice(i,1);go()}

function adder(list,key,ph,label){
 var inp=h("input",{type:"text",placeholder:ph,maxlength:"40","aria-label":label});
 var add=function(){addItem(list,key,inp.value)};
 inp.addEventListener("keydown",function(e){if(e.key==="Enter")add()});
 return h("div",null,h("div",{class:"row"},inp,h("button",{class:"pri",on:{click:add}},"Ekle")),h("p",{class:"err",text:err[key]||""}));
}
function chips(list){
 return h.apply(null,["ul",{class:"chips"}].concat(S[list].map(function(t,i){
  return h("li",null,h("span",{text:t}),h("button",{"aria-label":t+" sil",on:{click:function(){removeItem(list,i)}}},"×"));
 })));
}

function sugg(title,t,n){
 var list=GAMES.filter(function(g){return g.t===t&&(!onlyFit||n<2||(n>=g.a&&n<=g.b))});
 var box=h("div",null);
 if(!list.length)box.appendChild(h("p",{class:"hint",text:"Bu kişi sayısına uygun öneri yok."}));
 list.forEach(function(g){
  var added=S.options.indexOf(g.n)>-1;
  box.appendChild(h("div",{class:"game"},h("b",{text:g.n}),h("small",{text:g.a===g.b?g.a+" kişi":g.a+"–"+g.b+" kişi"}),h("p",{text:g.d}),
   h("button",{disabled:added,on:{click:function(){addItem("options","o",g.n)}}},added?"Eklendi":"Seçeneklere ekle")));
 });
 return box;
}
function tabBar(){
 var defs=[["setup","Kurulum"],["games","Oyun önerileri"],["acts","Etkinlik önerileri"]];
 return h.apply(null,["div",{class:"tabs",role:"tablist"}].concat(defs.map(function(d){
  return h("button",{role:"tab","aria-selected":tab===d[0]?"true":"false",on:{click:function(){tab=d[0];render();window.scrollTo(0,0)}}},d[1]);
 })));
}
function suggTab(t){
 var n=S.players.length;
 return h("div",null,
  h("div",{class:"info"},
   h("p",{text:S.options.length?"Seçeneklerin ("+S.options.length+"): "+S.options.join(", "):"Henüz seçenek eklemedin."}),
   h("button",{on:{click:function(){tab="setup";render();window.scrollTo(0,0)}}},"Kuruluma dön")),
  h("p",{class:"sub",text:n>=2?n+" kişiye uygun öneriler gösteriliyor.":"Katılımcı ekleyince liste kişi sayına göre daralır."}),
  h("button",{on:{click:function(){onlyFit=!onlyFit;render()}}},onlyFit?"Hepsini göster":"Sadece uygun olanlar"),
  sugg("",t,n));
}
function setup(){
 if(confirming)return confirmView();
 return h("div",null,
  h("h1",null,"Ne ",h("span",null,"yapalım"),"?"),
  h("p",{class:"sub"},"Katılımcıları ve seçenekleri ekle, telefonu elden ele verip oyla."),
  tabBar(),
  tab==="setup"?setupForm():suggTab(tab==="games"?"o":"e"));
}
function confirmView(){
 return h("div",{class:"center"},h("h1",null,"Hazır mısınız?"),
  h("p",{class:"sub",text:S.players.length+" katılımcı, "+S.options.length+" seçenek"}),
  h("p",{text:"Katılımcılar: "+S.players.join(", ")}),
  h("p",{text:"Seçenekler: "+S.options.join(", ")}),
  h("p",{class:"hint"},"Başlayınca liste kilitlenir. Değiştirmek için şimdi geri dön."),
  h("button",{class:"pri big",on:{click:function(){confirming=false;start()}}},"Başlat"),
  h("button",{class:"big",on:{click:function(){confirming=false;render()}}},"Listeyi düzenle"));
}
function setupForm(){
 var ok=S.players.length>=2&&S.options.length>=2;
 var n=S.players.length;
 var filt=h("section",null,h("h2",null,"Öneriler"),
  h("p",{class:"sub",text:n>=2?n+" kişiye uygun oyunlar ve etkinlikler gösteriliyor.":"Önce katılımcı ekle, liste kişi sayına göre daralsın."}),
  h("button",{on:{click:function(){onlyFit=!onlyFit;render()}}},onlyFit?"Hepsini göster":"Sadece uygun olanlar"));
 return h("div",null,
  h("section",null,h("h2",null,"Katılımcılar"),adder("players","p","İsim yaz","Katılımcı adı"),chips("players")),
  h("section",null,h("h2",null,"Seçenekler"),adder("options","o","Örn. Bowling","Seçenek"),chips("options")),
  h("button",{class:"pri big",disabled:!ok,on:{click:function(){confirming=true;render();window.scrollTo(0,0)}}},"Oylamayı başlat"),
  h("p",{class:"hint",text:ok?"Başlamadan önce son bir kontrol ekranı gelir.":"En az 2 katılımcı ve 2 seçenek gerekli."}),
  h("footer",null,"Veriler sadece bu telefonun tarayıcısında saklanır. Oylama tek cihazdan yapılır."));
}
function start(){S.stage="vote";S.counts=S.options.map(function(){return 0});S.current=0;S.phase="pick";S.tie=null;sel=null;go()}
function reset(){confirming=false;tab="setup";S=fresh();sel=null;err={};go()}

function vote(){
 var n=S.players.length;
 var top=h("div",{class:"top"},h("span",{class:"hint",text:S.current+" / "+n+" kişi oy kullandı"}),
  h("button",{class:"link",on:{click:function(){if(confirm("Oylama sıfırlansın mı?"))reset()}}},"Sıfırla"));
 if(S.phase==="done"){
  var last=S.current+1>=n;
  return h("div",null,top,h("div",{class:"center"},h("div",{class:"tick"},"✓"),h("h1",null,"Oy kullanıldı"),
   h("p",{class:"sub"},last?"Herkes oy verdi.":"Telefonu sıradakine ver."),
   h("button",{class:"pri big",on:{click:function(){
    if(last){S.stage="result"}else{S.current++;S.phase="pick"}
    sel=null;go();
   }}},last?"Sonucu göster":"Sıradaki oy verecek")));
 }
 var box=h("div",null,top,h("h2",{text:"Sıra "+S.players[S.current]+" kişisinde"}),h("p",{class:"sub"},"Seçimini yap, sonra oyunu ver."));
 var btns=S.options.map(function(o,i){
  var b=h("button",{class:"opt","aria-pressed":sel===i?"true":"false",on:{click:function(){sel=i;render()}}},o);
  return b;
 });
 btns.forEach(function(b){box.appendChild(b)});
 box.appendChild(h("button",{class:"pri big",disabled:sel===null,on:{click:function(){
  S.counts[sel]++;S.phase="done";sel=null;go();
 }}},"Oyumu ver"));
 return box;
}

function result(){
 var max=Math.max.apply(null,S.counts);
 var tied=[];S.counts.forEach(function(c,i){if(c===max)tied.push(i)});
 var win=tied.length===1?tied[0]:S.tie;
 var box=h("div",null);
 if(win===null){
  box.appendChild(h("div",{class:"center"},h("h1",null,"Beraberlik!"),
   h("p",{class:"sub",text:tied.map(function(i){return S.options[i]}).join(", ")+" aynı oyu aldı."}),
   h("button",{class:"pri big",on:{click:function(){S.tie=tied[Math.floor(Math.random()*tied.length)];go()}}},"Kura çek")));
 }else{
  box.appendChild(h("div",{class:"winner"},h("span",null,tied.length>1?"Kura sonucu":"Kazanan"),h("b",{text:S.options[win]})));
 }
 var total=S.counts.reduce(function(a,b){return a+b},0)||1;
 S.options.map(function(o,i){return i}).sort(function(a,b){return S.counts[b]-S.counts[a]}).forEach(function(i){
  box.appendChild(h("div",{class:"bar"+(i===win?" win":"")},
   h("div",{class:"t"},h("span",{text:S.options[i]}),h("span",{text:S.counts[i]+" oy"})),
   h("div",{class:"b"},h("i",{style:"width:"+Math.round(S.counts[i]/total*100)+"%"}))));
 });
 box.appendChild(h("button",{class:"big",on:{click:reset}},"Yeni oylama"));
 return box;
}

function render(){
 app.textContent="";
 app.appendChild(S.stage==="vote"?vote():S.stage==="result"?result():setup());
}
render();
})();
