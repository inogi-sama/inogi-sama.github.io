/* Shared behavior for the seven original Visily screens. No backend or build step. */
(() => {
  'use strict';
  const page = document.body.dataset.page;
  const routes = {login:'index.html',dashboard:'dashboard.html','new-research':'new-research.html','research-progress':'research-progress.html','evidence-review':'evidence-review.html','insights-dashboard':'insights-dashboard.html',report:'report.html'};
  const titles = {login:'Sign In',dashboard:'Dashboard','new-research':'New Research','research-progress':'Research Progress','evidence-review':'Evidence Review','insights-dashboard':'Insights',report:'Report'};
  document.title = `${titles[page]} · Domel Intelligence`;
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clean = e => (e.textContent || '').replace(/\s+/g,' ').trim();
  const textNodes = label => $$('[data-type="TEXT"],button,span').filter(e => clean(e) === label && !$$('span,button,[data-type="TEXT"]',e).some(c=>clean(c)===label));
  const controls = label => [...new Set(textNodes(label).map(e=>e.closest('button')||e))];
  const go = (key, query='') => { location.href = routes[key]+query; };
  const read = (key,fallback=null) => { try{return JSON.parse(localStorage.getItem('domel.'+key)) ?? fallback;}catch{return fallback;} };
  const save = (key,value) => {try{localStorage.setItem('domel.'+key,JSON.stringify(value));return true;}catch{toast('Browser storage is unavailable. Changes will last only on this page.');return false;}};
  const state = read('research',{});
  function toast(message){document.querySelector('.domel-toast')?.remove();const box=document.createElement('div');box.className='domel-toast';box.role='status';box.textContent=message;document.body.append(box);setTimeout(()=>box.remove(),4200);}
  function bind(el,action,label){if(!el)return;el.dataset.wired='true';el.dataset.clickable='true';if(el.tagName!=='BUTTON'&&el.tagName!=='A'){if(!el.hasAttribute('role'))el.role='button';el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});}if(label)el.setAttribute('aria-label',label);el.addEventListener('click',e=>{e.preventDefault();action(e);});}
  function on(label,fn){controls(label).forEach(e=>bind(e,fn));}
  function link(label,key,query=''){controls(label).forEach(e=>{if(e.tagName==='BUTTON'){e.dataset.route=key;bind(e,()=>go(key,query));}else{const a=document.createElement('a');a.className=e.className;a.dataset.route=key;a.href=routes[key]+query;a.textContent=clean(e);e.replaceWith(a);}});}
  function modal(title,message,extra){const d=document.createElement('dialog');d.className='domel-dialog';const h=document.createElement('h2');h.textContent=title;const p=document.createElement('p');p.textContent=message;d.append(h,p);if(extra)extra(d);const close=document.createElement('button');close.textContent='Close';close.addEventListener('click',()=>d.close());d.append(close);document.body.append(d);d.addEventListener('close',()=>d.remove());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});d.showModal();close.focus();return d;}
  function setText(label,value){textNodes(label).forEach(e=>e.textContent=value);}
  function keyboardInput(input,label){if(!input)return;input.setAttribute('aria-label',label);input.name=label.toLowerCase().replaceAll(' ','-');}
  function screenContainer(label){const e=textNodes(label)[0];return e?.closest('[data-type="CONTAINER"]');}
  function selectFor(input,options,label){if(!input)return null;const s=document.createElement('select');s.className=input.className+' domel-select';s.setAttribute('aria-label',label);options.forEach(v=>{const o=new Option(v,v);s.add(o);});s.value=options.includes(input.value)?input.value:options[0];input.parentElement.querySelector('img[data-icon*="chevron-down"]')?.remove();input.replaceWith(s);return s;}
  // Preserve the desktop artboards, scale to laptop widths and allow panning on phones.
  function resize(){const width=Math.max(1024,innerWidth);document.documentElement.style.setProperty('--page-scale',Math.min(1,width/1440));}
  resize();addEventListener('resize',resize);
  $$('img').forEach(e=>{if(!e.hasAttribute('alt'))e.alt='';});
  $$('input').forEach((e,i)=>keyboardInput(e,e.placeholder||`Field ${i+1}`));
  link('Dashboard','dashboard');link('New Research','new-research');link('Reports','report');link('Insights','insights-dashboard');
  link('Projects','dashboard');link('Industrial Motors 2024','research-progress');link('Market Insights','insights-dashboard');
  on('Sign Out',()=>{try{localStorage.removeItem('domel.session');sessionStorage.removeItem('domel.session');}catch{}go('login');});
  $$('button[data-route]').forEach(b=>{if(!b.closest('[data-type="PAGE"]> [data-type="CONTAINER"]:first-child'))return;const active=b.dataset.route===page;b.classList.add(active?'nav-active':'nav-inactive');if(active)b.setAttribute('aria-current','page');});
  on('Help Center',()=>modal('Help Center','Explore the demo: sign in → create research → research progress → review evidence → insights → report.\n\nUse the page switcher at the bottom right to visit all seven screens. Research, sources and metrics are sample data; no live research service is connected.'));
  on('Settings',()=>modal('Workspace Settings','Domel Intelligence · local frontend demo\nDrafts, review decisions and research configuration are saved in this browser. No account service is connected.',d=>{const b=document.createElement('button');b.textContent='Clear demo data';b.style.marginRight='12px';b.onclick=()=>{for(const key of Object.keys(localStorage)){if(key.startsWith('domel.'))localStorage.removeItem(key);}toast('Demo data cleared.');d.close();};d.append(b);}));
  ['Privacy Policy','Terms of Service','Terms of Use','Security Audit','Contact Support','Report Issue','Research Methodology','Data Sources','System Status','API Status'].forEach(label=>on(label,()=>modal(label,'This is a frontend demonstration based on the supplied Visily screens. No live account, research API or external document service is connected. Research settings and review history stay in this browser.')));
  const toolbar=document.createElement('nav');toolbar.className='domel-toolbar';toolbar.setAttribute('aria-label','Demo page navigation');const badge=document.createElement('span');badge.textContent='Frontend demo';toolbar.append(badge);const switcher=document.createElement('select');switcher.setAttribute('aria-label','Go to page');Object.keys(routes).forEach(key=>switcher.add(new Option(titles[key],key)));switcher.value=page;switcher.onchange=()=>go(switcher.value);toolbar.append(switcher);document.body.append(toolbar);
  $$('input[placeholder="Search research, competitors..."]').forEach(input=>{input.addEventListener('keydown',e=>{if(e.key==='Enter')go('dashboard','?q='+encodeURIComponent(input.value));});});
  if(page==='login'){
    const inputs=$$('input');const email=inputs[0],password=inputs[1];email.type='email';email.autocomplete='username';password.type='password';password.autocomplete='current-password';password.placeholder='Enter demo password';keyboardInput(email,'Email Address');keyboardInput(password,'Password');
    const eye=$$('button').find(b=>b.querySelector('[data-icon*="eye"]'));bind(eye,()=>{password.type=password.type==='password'?'text':'password';eye.setAttribute('aria-pressed',String(password.type==='text'));},'Show or hide password');
    let remember=false;const check=document.querySelector('[data-role="CHECKBOX_BUTTON"]');if(check){check.role='checkbox';check.setAttribute('aria-label','Keep me signed in');check.setAttribute('aria-checked','false');bind(check,()=>{remember=!remember;check.setAttribute('aria-checked',String(remember));check.textContent=remember?'✓':'';});}
    function signIn(){email.required=true;password.required=true;if(!email.reportValidity()||!password.reportValidity())return;const session=JSON.stringify({email:email.value,expiresAt:Date.now()+30*86400000});try{(remember?localStorage:sessionStorage).setItem('domel.session',session);}catch{}go('dashboard');}
    on('Sign In to Dashboard',signIn);inputs.forEach(e=>e.addEventListener('keydown',ev=>{if(ev.key==='Enter')signIn();}));
    on('Forgot password?',()=>modal('Demo sign in','Use any valid email address and any non-empty demo password. This frontend does not verify a real account.'));
    on('Request access from your',()=>modal('Request access','This demo is open to explore. Enter any valid email address and a demo password to continue.'));on('administrator',()=>modal('Request access','Use any valid email and a demo password to explore this frontend.'));
    const panel=document.querySelector('[data-type="PAGE"]> [data-type="CONTAINER"]:nth-child(2)');if(panel){panel.classList.add('domel-login-panel');textNodes('Precision Intelligence for Industrial Success').forEach(e=>e.classList.add('text-heading'));}
    const banner=document.createElement('aside');banner.className='domel-banner';banner.textContent='Demo: use any valid email and a demo password. ';const a=document.createElement('a');a.href=routes.dashboard;a.textContent='Explore dashboard →';banner.append(a);document.body.append(banner);
  }
  if(page==='new-research'){
    const hint=textNodes('e.g., European HVAC Motor Market 2024 Analysis')[0];const titleCard=hint?.closest('[data-type="CONTAINER"]')?.parentElement?.closest('[data-type="CONTAINER"]');
    const title=document.createElement('input');title.className='domel-field';title.id='research-title';title.placeholder='e.g., European HVAC Motor Market 2024 Analysis';keyboardInput(title,'Research Project Title');if(titleCard){titleCard.replaceChildren(title);}
    const company=$$('input').find(e=>e.value==='Domel Electric Motors');keyboardInput(company,'Target Company');
    const industry=selectFor($$('input').find(e=>e.value==='Industrial Automation & Robotics'),['Industrial Automation & Robotics','Consumer Appliances','Automotive','Medical Devices','Raw Materials','Corporate Strategy'],'Industry Segment');
    const timeRange=selectFor($$('input').find(e=>e.value==='Last 5 Years (Standard)'),['Last 5 Years (Standard)','Last 12 Months','Last 3 Years','Last 10 Years'],'Analysis Time Range');
    const question=document.querySelector('textarea');question.value=question.value.trim();keyboardInput(question,'Primary Research Question');
    const focus=$$('input').find(e=>e.placeholder.startsWith('Add focus area'));const competitor=$$('input').find(e=>e.placeholder==='Type competitor name...');
    let keywords=['Energy Efficiency','Noise Reduction','Supply Chain'],competitors=['Emerson Electric','Nidec Corporation','ABB'];
    const draft=read('draft',{});if(draft.title)title.value=draft.title;if(draft.company)company.value=draft.company;if(draft.industry)industry.value=draft.industry;if(draft.timeRange)timeRange.value=draft.timeRange;if(draft.question)question.value=draft.question;keywords=draft.keywords||keywords;competitors=draft.competitors||competitors;
    function capture(){return {title:title.value.trim(),company:company.value.trim(),industry:industry.value,timeRange:timeRange.value,question:question.value.trim(),keywords,competitors,options:$$('[role="switch"]').map(e=>e.getAttribute('aria-checked')==='true')};}
    function chips(host,list){host.replaceChildren();list.forEach(value=>{const b=document.createElement('button');b.className='domel-chip';b.textContent=value+' ×';b.setAttribute('aria-label','Remove '+value);b.onclick=()=>{list.splice(list.indexOf(value),1);chips(host,list);};host.append(b);});}
    const focusHost=document.createElement('div');focusHost.className='domel-chip-list';const focusCard=screenContainer('Focus Areas & Keywords');if(focusCard){focusHost.style.cssText='position:absolute;top:310px;left:44px;width:626px;max-height:38px;overflow:auto';focusCard.querySelector('[data-role="CONTAINER_CHILDREN_WRAPPER"]').append(focusHost);['Energy Efficiency','Noise Reduction','Supply Chain'].forEach(v=>textNodes(v).forEach(e=>e.closest('[data-type="CONTAINER"]')?.remove()));chips(focusHost,keywords);}
    function addFocus(){const v=focus.value.trim();if(v&&!keywords.includes(v)){keywords.push(v);chips(focusHost,keywords);focus.value='';}}
    const plus=$$('button').find(b=>b.querySelector('[data-icon*="plus"]')&&b.className.includes('top-[363px]'));bind(plus,addFocus,'Add focus area');focus.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addFocus();}});
    const competitorHost=document.createElement('div');competitorHost.style.cssText='position:absolute;top:86px;left:32px;width:651px;height:166px;overflow:auto;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:start';
    const competitorCard=screenContainer('Competitive Benchmarking');['Emerson Electric','Nidec Corporation','ABB'].forEach(name=>screenContainer(name)?.remove());competitorCard?.querySelector('[data-role="CONTAINER_CHILDREN_WRAPPER"]')?.append(competitorHost);
    function drawCompetitors(){competitorHost.replaceChildren();competitors.forEach(name=>{const b=document.createElement('button');b.className='domel-chip';b.style.cssText='padding:20px 12px;text-align:left;border:1px solid #d4d6da;background:#f6f7f9';b.textContent=name+' ×';b.setAttribute('aria-label','Remove competitor '+name);b.onclick=()=>{competitors=competitors.filter(v=>v!==name);drawCompetitors();};competitorHost.append(b);});}drawCompetitors();
    function addCompetitor(){const v=competitor.value.trim();if(!v){competitor.focus();return;}if(!competitors.includes(v))competitors.push(v);competitor.value='';drawCompetitors();toast(`${v} added to benchmark list.`);}
    on('Add Competitor',addCompetitor);competitor.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addCompetitor();}});
    ['Automated Source Verification','Patent Database Integration','Competitor Website Monitoring'].forEach((label,i)=>{const e=textNodes(label)[0];if(!e)return;e.role='switch';e.tabIndex=0;e.setAttribute('aria-label',label);e.setAttribute('aria-checked',String(draft.options?.[i]??true));e.style.background='transparent';e.style.opacity=e.getAttribute('aria-checked')==='true'?'1':'.45';bind(e,()=>{const checked=e.getAttribute('aria-checked')!=='true';e.setAttribute('aria-checked',String(checked));e.style.opacity=checked?'1':'.45';});});
    on('Save as Draft',()=>{if(save('draft',capture()))toast('Draft saved. Return to New Research to continue.');});
    on('Start AI Research',()=>{title.required=true;question.required=true;if(!title.reportValidity()||!question.reportValidity())return;const data={...capture(),startedAt:Date.now(),progress:45,paused:false,id:'RES-DEMO'};save('research',data);save('draft',capture());go('research-progress');});
  }
  if(page==='dashboard'){
    const fifth=textNodes('RES-005')[0];if(fifth){const wrapper=fifth.parentElement;const row=document.createElement('div');row.dataset.type='CONTAINER';row.style.cssText='position:absolute;left:0;top:336px;width:1120px;height:72px';const children=[...wrapper.children].filter(e=>{const m=e.className?.match?.(/top-\[(\d+)px\]/);return m&&Number(m[1])>=336;});wrapper.append(row);for(const child of children){const top=Number(child.className.match(/top-\[(\d+)px\]/)[1]);child.style.top=(top-336)+'px';row.append(child);}}
    const rowIds=['RES-001','RES-002','RES-003','RES-004','RES-005'];const rows=rowIds.map(id=>screenContainer(id)).filter(Boolean);rows.forEach((row,i)=>{const destination=['research-progress','report','evidence-review','new-research','report'][i];bind(row,e=>{if(e.target.closest('button'))return;go(destination);},'Open project '+rowIds[i]);$$('button',row).forEach(b=>bind(b,e=>{e.stopPropagation();go(destination);},'Open project'));});
    const title=textNodes('High-Efficiency Servo Motor Competitive Matrix')[0];if(state.title&&title)title.textContent=state.title;
    link('View All','report');link('View Intelligence Feed','insights-dashboard');
    const search=$$('input').find(i=>i.placeholder==='Search projects...');const empty=document.createElement('p');empty.className='domel-empty';empty.hidden=true;empty.textContent='No projects match your search.';if(rows[0]){empty.style.cssText='position:absolute;left:30px;top:60px';rows[0].parentElement.append(empty);}
    let filter='All';function applyFilter(){const term=(search?.value||'').toLowerCase();let count=0;rows.forEach(row=>{const visible=clean(row).toLowerCase().includes(term)&&(filter==='All'||clean(row).includes(filter));row.style.visibility=visible?'visible':'hidden';if(visible)count++;});empty.hidden=count>0;}
    if(search){search.value=new URLSearchParams(location.search).get('q')||'';search.addEventListener('input',applyFilter);applyFilter();}
    on('Filter',()=>modal('Filter projects','Choose a project status.',d=>{['All','In Progress','Completed','Review Required','Scheduled'].forEach(value=>{const b=document.createElement('button');b.textContent=value;b.style.margin='0 8px 12px 0';b.onclick=()=>{filter=value;applyFilter();d.close();};d.append(b);});}));
  }
  if(page==='research-progress'){
    setText('Analyzing: High-Efficiency BLDC Motors 2024','Analyzing: '+(state.title||'High-Efficiency BLDC Motors 2024'));
    let progress=Math.max(45,state.progress||45),paused=Boolean(state.paused);const percent=textNodes('45%')[0];const stage=textNodes('Current Stage: Information Extraction')[0];const estimate=textNodes('Estimated completion: 4 mins')[0];const pause=controls('Pause Research')[0];
    const bar=document.querySelector('[data-role="SLIDER_TRACK_PROGRESS"]');
    function update(){if(percent)percent.textContent=progress+'%';if(stage)stage.textContent=progress>=100?'Current Stage: Complete':paused?'Current Stage: Paused':'Current Stage: '+(progress<65?'Information Extraction':progress<85?'Competitive Analysis':'Strategic Insights');if(estimate)estimate.textContent=progress>=100?'Demo research complete':paused?'Demo paused':'Demo simulation in progress';if(pause){pause.querySelector('span').textContent=paused?'Resume Research':'Pause Research';pause.disabled=progress>=100;}if(bar)bar.style.width=progress+'%';save('research',{...state,progress,paused});}
    const interruption=screenContainer('Connection Interrupted');
    on('Retry Stage',()=>{if(interruption)interruption.hidden=true;paused=false;toast('Demo extraction resumed.');update();});
    if(pause)bind(pause,()=>{paused=!paused;update();});
    link('View Source List','evidence-review');link('Generate Insights Dashboard','insights-dashboard');
    update();setInterval(()=>{if(!paused&&progress<100){progress=Math.min(100,progress+5);update();if(progress===100)toast('Demo research complete. Open the Insights dashboard to continue.');}},1800);
    const banner=document.createElement('aside');banner.className='domel-banner';banner.textContent='Simulated research · ';const a=document.createElement('a');a.href=routes['evidence-review'];a.textContent='Review evidence →';banner.append(a);document.body.append(banner);
  }
  if(page==='evidence-review'){
    const evidenceId=new URLSearchParams(location.search).get('insight')||'thermal';const reviews=read('reviews',{});const status=textNodes('Pending Review')[0];if(reviews[evidenceId]&&status)status.textContent=reviews[evidenceId].decision;
    function review(decision){reviews[evidenceId]={decision,date:new Date().toISOString()};save('reviews',reviews);if(status)status.textContent=decision;toast('Evidence '+decision.toLowerCase()+'. Review saved.');modal('Evidence '+decision,'Your review has been saved in this browser.',d=>{const links=document.createElement('p');links.className='domel-progress-links';[['Back to Insights','insights-dashboard'],['View Report','report']].forEach(([label,key])=>{const a=document.createElement('a');a.textContent=label+' →';a.href=routes[key];links.append(a);});d.append(links);});}
    on('Accept',()=>review('Accepted'));on('Reject',()=>review('Rejected'));
    on('Review History',()=>modal('Review History',Object.values(reviews).map(r=>`${r.decision} · ${new Date(r.date).toLocaleString()}`).join('\n')||'No review decisions yet. Accept or reject the sample evidence.'));
    on('Open Source',()=>modal('Source Preview','Technical Specification Sheet — BLDC X-Series v4.2\n\nThis screen contains a sample source excerpt from the original Visily design. No original PDF was included with the HTML export.'));
    on('Filter Sources',()=>modal('Supporting Sources','All three sample sources are available in this screen: Technical Specification Sheet, Market Analysis Q3 and Internal Patent Audit.'));
  }
  if(page==='insights-dashboard'){
    const evidenceButtons=controls('View Evidence');const categories=['Industry Trend','Competitor Activity','Opportunity'];const cards=evidenceButtons.map(b=>b.closest('[data-type="CONTAINER"]'));evidenceButtons.forEach((b,i)=>bind(b,()=>go('evidence-review','?insight='+['thermal','nidec','medical'][i])));
    const tabs=['All Insights','Industry Trends','Competitor Activity','Opportunities'];tabs.forEach((label,index)=>controls(label).filter(e=>e.tagName==='BUTTON').forEach(button=>bind(button,()=>{tabs.forEach(t=>controls(t).filter(e=>e.tagName==='BUTTON').forEach(b=>b.classList.toggle('domel-tabs-active',t===label)));cards.forEach((card,i)=>{if(card)card.style.visibility=index===0||categories[i]===categories[index-1]?'visible':'hidden';});})));
    link('Export Report','report');link('Manage Sources','evidence-review');link('Refine Parameters','new-research');
    on('Load Historical Insights',()=>modal('Historical Insights','No historical insight dataset was included in this frontend export. The three supplied insight cards are available in All Insights.'));
    on('Filter Views',()=>modal('Filter Views','Use the All Insights, Industry Trends, Competitor Activity and Opportunities tabs to filter the sample insights.'));
    ['Efficiency','Adoption'].forEach(label=>on(label,()=>{['Efficiency','Adoption'].forEach(t=>controls(t).forEach(e=>e.classList.toggle('domel-tabs-active',t===label)));toast(label+' series selected. Chart is a static design preview.');}));
  }
  if(page==='report'){
    if(state.title)setText('The Future of High-Efficiency Electric Drive Systems',state.title);
    const sections={'Comprehensive View':'EXECUTIVE SUMMARY','Market Dynamics':'Global Market Trajectory','Competitive Benchmark':'Competitive Benchmarking','Source Repository':'Source Traceability'};
    Object.entries(sections).forEach(([label,target])=>on(label,()=>{textNodes(target)[0]?.scrollIntoView({behavior:'smooth',block:'start'});Object.keys(sections).forEach(t=>controls(t).forEach(b=>b.classList.toggle('domel-tabs-active',t===label)));}));
    on('Print',()=>window.print());on('Export PDF',()=>{toast('Choose “Save as PDF” in the print dialog.');setTimeout(()=>window.print(),250);});
    on('Share',()=>modal('Share Report','This report is running locally. Copy its local address to revisit it on this computer; it becomes shareable after hosting.',d=>{const input=document.createElement('input');input.className='domel-field';input.value=location.href;input.readOnly=true;input.setAttribute('aria-label','Report address');d.append(input);const copy=document.createElement('button');copy.textContent='Copy address';copy.style.marginRight='12px';copy.onclick=async()=>{try{await navigator.clipboard.writeText(input.value);toast('Report address copied.');}catch{input.select();toast('Select and copy the address.');}};d.append(copy);}));
    link('Verify All','evidence-review');link('View Source','evidence-review');on('Audit Log',()=>modal('Audit Log',Object.entries(read('reviews',{})).map(([id,r])=>`${id}: ${r.decision} · ${new Date(r.date).toLocaleString()}`).join('\n')||'No evidence reviews recorded. Open Verify All to review sources.'));
    on('View Detailed Business Cases',()=>modal('Business Cases','Sample opportunities: ultra-quiet medical respirator blowers, solar tracker DC gear motors and EU e-bike mid-drive systems. These are design sample entries.'));
    on('Review Technical Roadmap',()=>modal('Technical Roadmap','Sample R&D areas: rare-earth-free rotors, direct-drive wind turbine technology and predictive maintenance sensors.'));
  }
  // Give every remaining exported icon-button an explicit accessible demo action.
  $$('button:not([data-wired])').forEach((b,i)=>{const icon=b.querySelector('[data-icon]')?.dataset.icon||'';if(!clean(b))bind(b,()=>toast('This control is a static design element.'),icon.replace(/^Lucide_|_Outlined$/g,'').replaceAll('-',' ')||`Demo control ${i+1}`);});
})();
