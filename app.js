const $ = id => document.getElementById(id);
function demoToast(msg){const t=$('toast');if(!t)return;t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function goAI(prompt){sessionStorage.setItem('airaPrompt',prompt);location.href='ai.html'}
function runSearch(){const from=$('from')?.value||'New Delhi',to=$('to')?.value||'Mumbai';demoToast(`Searching ${from} → ${to}...`)}
function setAuth(mode){
  const login= $('loginTab'), signup=$('signupTab');
  if(!login)return;
  login.classList.toggle('active',mode==='login');signup.classList.toggle('active',mode==='signup');
  $('loginForm').hidden=mode!=='login';$('signupForm').hidden=mode!=='signup';
}
function login(){demoToast('Login successful — welcome to Travel!');setTimeout(()=>location.href='index.html',900)}
function signup(){demoToast('Account created — welcome to Travel!');setTimeout(()=>location.href='index.html',900)}
function showTab(id,btn){document.querySelectorAll('.result-tab').forEach(x=>x.classList.remove('active-tab'));document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));$(id).classList.add('active-tab');btn.classList.add('active')}
function resetTrip(){sessionStorage.removeItem('airaPrompt');$('resultTitle').textContent='Your trip workspace';$('resultSubtitle').textContent='Your itinerary, flights, hotels and package appear here.';buildTrip('Jaipur',3,'family')}
function sendSuggestion(text){$('chatInput').value=text;sendChat()}
function addMessage(text,user=false){
  const box=$('messages');const wrap=document.createElement('div');wrap.className='message '+(user?'user':'bot');
  wrap.innerHTML=user?`<div><p>${escapeHtml(text)}</p><time>Now</time></div>`:`<span class="avatar">✦</span><div><strong>Aira AI</strong><p>${text}</p><time>Now</time></div>`;
  box.appendChild(wrap);box.scrollTop=box.scrollHeight;
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function parseTrip(text){
  const lower=text.toLowerCase();
  const cities=['Jaipur','Goa','Manali','Mumbai','Delhi','Bengaluru','Bangalore','Kashmir','Udaipur','Agra','Kerala','Rishikesh','Ooty','Dubai','Paris'];
  let city=cities.find(c=>lower.includes(c.toLowerCase()))||'Jaipur';
  let d=(lower.match(/(\d+)\s*(?:day|days|night|nights)/)||[])[1]; d=d?Math.min(14,Math.max(1,+d)):3;
  let group=lower.includes('friend')?'friends':lower.includes('business')?'business':lower.includes('solo')?'solo':'family';
  let budget=lower.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i); budget=budget?Number(budget[1].replace(/,/g,'')):null;
  return {city,days:d,group,budget};
}
function buildTrip(city,days,group){
  $('resultTitle').textContent=`${days} days in ${city}`;
  $('resultSubtitle').textContent=`Aira's plan for ${group} travel · itinerary, flights, hotels and estimated package`;
  $('mapDestination').textContent=city;
  const dayNames=['Arrival & local highlights','Culture, food & must-see places','Markets & hidden gems','Adventure & scenic spots','Day trip & experiences','Relaxation & local favourites','Explore like a local','Slow morning & premium experiences'];
  const places={
    Jaipur:['Amber Fort','City Palace + Jantar Mantar','Hawa Mahal + Johari Bazaar','Nahargarh Fort','Albert Hall Museum','Patrika Gate'],
    Goa:['Baga Beach','Panaji + Fontainhas','Dudhsagar Falls','Old Goa','Anjuna Market','Sunset cruise'],
    Manali:['Mall Road','Solang Valley','Old Manali','Rohtang/Atal Tunnel','Vashisht Hot Springs','Naggar Castle']
  };
  const arr=places[city]||['City centre','Top landmarks','Local market','Scenic viewpoint','Food & culture','Free exploration'];
  $('dayList').innerHTML=Array.from({length:days},(_,i)=>`<article class="day-card"><div class="day">DAY ${i+1} · ${i===0?'MORNING':'DAY PLAN'}</div><h3>${arr[i%arr.length]}</h3><p><b>${dayNames[i%dayNames.length]}</b><br>${i===0?'Check in, settle down and start with an easy local experience.':'Smart route planned around travel time, opening hours, food stops and breaks.'}</p></article>`).join('');
}
function sendChat(){
  const input=$('chatInput');if(!input||!input.value.trim())return;
  const text=input.value.trim();input.value='';addMessage(text,true);
  const trip=parseTrip(text);
  setTimeout(()=>{
    buildTrip(trip.city,trip.days,trip.group);
    const budgetText=trip.budget?` around ₹${trip.budget.toLocaleString('en-IN')}`:' with a balanced budget';
    addMessage(`Perfect — I've created a ${trip.days}-day ${trip.city} plan for ${trip.group}${budgetText}. I also prepared your itinerary, flight options, hotel choices and a recommended package. You can switch between the tabs on the right.`);
  },500);
}
document.addEventListener('DOMContentLoaded',()=>{
  const params=new URLSearchParams(location.search);if(params.get('mode')==='signup')setAuth('signup');
  if(location.pathname.endsWith('ai.html')){
    const prompt=sessionStorage.getItem('airaPrompt');
    buildTrip('Jaipur',3,'family');
    if(prompt){sessionStorage.removeItem('airaPrompt');$('chatInput').value=prompt;setTimeout(sendChat,300)}
  }
});
