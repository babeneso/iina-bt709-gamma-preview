const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/main.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync(__dirname + '/Info.json', 'utf8'));
assert(manifest.permissions.includes('file-system'), 'IINA requires file-system permission for gamma-factor');
assert(manifest.permissions.includes('show-osd'));
const prefs = { defaultGamma: 'gamma22' };
function player(locales = ["en-US"]) {
  const p = { 'video-params': null, vf: [{label:'other'}], 'gamma-factor': 1.15, 'icc-profile-auto': true };
  const handlers = {}, osd = [], alerts = [], timers = new Map();
  let roots = [], sequence = 0;
  let evaluating = true;
  const sidebarHandlers = {}, sidebarMessages = [];
  let syncCount = 0, shown = 0;
  const menu = {
    item(title, action, options = {}) { return { title, action, ...options, items: [], addSubMenuItem(item) { this.items.push(item); } }; },
    separator() { return {separator:true}; },
    removeAllItems() { roots = []; }, addItem(item) { roots.push(item); }, forceUpdate() { assert(!evaluating, "Never force a menu refresh during plugin initialization"); }
  };
  vm.runInNewContext(source, { require, iina: {
    mpv: { getNative: k => p[k], set: (k,v) => { p[k] = v; }, command(name,args) {
      assert.equal(name,'vf');
      if(args[0] === 'remove') p.vf = p.vf.filter(f => '@' + f.label !== args[1]);
      else p.vf.push({label:args[1].split(':')[0].slice(1), spec:args[1]});
    } }, utils: { preferredLocalizations: () => locales, ask: s => { alerts.push(s); return true; } }, menu, core: { osd: s => osd.push(s) }, event: { on: (k,f) => {handlers[k]=f;} },
    sidebar: { onMessage: (k,f) => { sidebarHandlers[k]=f; }, postMessage: (k,v) => sidebarMessages.push({k,v}), loadFile: file => assert.equal(file,'sidebar.html'), show: () => {shown++;} },
    preferences: { get: k => prefs[k], set: (k,v) => {prefs[k]=v;}, sync: () => {syncCount++;} }, console: { error: e => {throw Error(e);} }
  }, setTimeout: f => {timers.set(++sequence,f);return sequence;}, clearTimeout: id => timers.delete(id), setInterval() {} });
  evaluating = false;
  return { p, osd, alerts, sidebarHandlers, sidebarMessages, syncCount: () => syncCount, shown: () => shown, event: k => handlers[k](), items: () => roots,
    click: n => roots[n].action(), flush() { const tasks=[...timers.values()];timers.clear();tasks.forEach(f=>f()); },
    load(params) { handlers['mpv.start-file'](); p['video-params']=params; handlers['mpv.file-loaded'](); }
  };
}
const sdr = {primaries:'bt.709',gamma:'bt.1886'};
const a = player();
assert.equal(a.items()[0].selected,true);
a.load(sdr);
assert.equal(a.items()[2].selected,true);
assert.match(a.p.vf[1].spec,/gamma2.2/);
a.click(1);
assert.equal(a.p['gamma-factor'],2.4 / 1.961);
assert.equal(a.p.vf[1].spec,'@bt709-gamma-plugin:format=gamma=gamma2.4');
a.event('mpv.video-reconfig');
assert.equal(a.p.vf.length,2);
a.load({primaries:'bt.2020',gamma:'pq'});
assert.equal(a.p['gamma-factor'],1.15);
assert.deepEqual(a.p.vf,[{label:'other'}]);
assert.equal(a.items().length,2);
assert.equal(a.items()[0].enabled,false);
assert.equal(a.items()[1].title,'Show Details in Plugins Panel');
a.load(sdr);
assert.equal(a.items()[1].selected,true);
prefs.defaultGamma='gamma24';
const b=player(); b.load(sdr);
assert.equal(b.items()[3].selected,true);
assert.equal(a.items()[1].selected,true);
b.p['icc-profile-auto']=false; b.flush();
assert.equal(b.alerts.length,1);
b.event('mpv.video-reconfig');b.flush();
assert.equal(b.alerts.length,1);
b.click(0);
assert.equal(b.p['gamma-factor'],1);
assert.deepEqual(b.p.vf,[{label:'other'}]);
b.event('iina.window-will-close');
assert.equal(b.p['gamma-factor'],1.15);
prefs.defaultGamma='gamma22';b.load(sdr);
assert.equal(b.items()[2].selected,true);
const c=player(); c.p['icc-profile-auto']=false;c.p['icc-profile']='/custom.icc';c.load(sdr);c.flush();
assert.equal(c.alerts.length,0);
console.log('PASS: modes, SDR/HDR transitions, filter preservation, gamma restoration, window isolation, defaults, ICC reminders.');

const d=player();d.load(sdr);d.flush();
d.click(1);assert.equal(d.osd.length,0);
d.event('mpv.seek');d.event('mpv.playback-restart');d.flush();
assert.equal(d.osd.length,1);assert.match(d.osd[0],/1.961/);
d.click(2);d.click(3);d.flush();
assert.match(d.osd[d.osd.length-1],/Gamma 2.4/);
d.click(1);d.load({primaries:'bt.2020',gamma:'pq'});d.flush();
assert.equal(d.osd.length,2);
console.log('PASS: delayed OSD, latest selection wins, pending OSD cancelled on file change.');

const e=player();
assert.equal(Object.keys(e.sidebarHandlers).length,0);
e.event('iina.window-loaded');
assert.equal(typeof e.sidebarHandlers['get-playback-state'],'function');
assert.equal(typeof e.sidebarHandlers['choose-mode'],'function');
e.load(sdr);
e.sidebarHandlers['get-playback-state']();
assert.equal(e.sidebarMessages.at(-1).v.selected, prefs.defaultGamma);
const savedDefault=prefs.defaultGamma;
e.sidebarHandlers['choose-mode']('qt');
assert.equal(e.items()[1].selected,true);
assert.equal(prefs.defaultGamma,savedDefault);assert.equal(e.syncCount(),0);
e.click(3);assert.equal(e.sidebarMessages.at(-1).v.selected,'gamma24');
e.load({primaries:'bt.2020',gamma:'pq'});
assert.equal(e.sidebarMessages.at(-1).v.available,false);
e.sidebarHandlers['choose-mode']('mpv');
e.load(sdr);assert.equal(e.items()[3].selected,true);
e.click(4);assert.equal(e.shown(),1);
// A later sidebar opening must restore the real receiver if it was replaced.
e.sidebarHandlers['choose-mode']=()=>{throw Error('stale receiver');};
e.click(4);
e.sidebarHandlers['choose-mode']('gamma22');
assert.equal(e.items()[2].selected,true);
console.log('PASS: sidebar and menu share current mode; unsupported content guarded; default unchanged.');

assert.equal(manifest.preferenceDefaults.defaultGamma,'mpv');
delete prefs.defaultGamma;
const fresh=player();fresh.load(sdr);
assert.equal(fresh.items()[0].selected,true);
assert.equal(fresh.items().length,5);
assert.equal(fresh.items()[4].title,'Show Details in Plugins Panel');
assert.deepEqual(fresh.p.vf,[{label:'other'}]);
console.log('PASS: factory default mpv; no more than five menu entries.');

// Run the actual sidebar script and main entry together across a JSON bridge.
const html=fs.readFileSync(__dirname+'/sidebar.html','utf8');
const inputs=[...html.matchAll(/name="playbackGamma" value="([^"]+)"/g)].map(m=>({
  value:m[1], disabled:true, checked:m[1]==='na', parentElement:{hidden:m[1]!=='na'},
  addEventListener(name,fn){this[name]=fn;}
}));
const uiHandlers={};
const statusLabel={dataset:{i18n:"noVideo"},textContent:""};
const linked=player();linked.load(sdr);
linked.sidebarMessages.push=function(message){
  Array.prototype.push.call(this,message);
  if(uiHandlers[message.k])uiHandlers[message.k](JSON.parse(JSON.stringify(message.v)));
};
vm.runInNewContext(fs.readFileSync(__dirname+'/sidebar.js','utf8'),{
  window:{GammaI18n:require("./i18n.js"),GammaUI:{apply(){}},iina:{onMessage:(name,fn)=>{uiHandlers[name]=fn;},postMessage:(name,data)=>{
    linked.sidebarHandlers[name](JSON.parse(JSON.stringify(data)));
  }}},document:{readyState:'complete',querySelectorAll:()=>inputs,querySelector:()=>statusLabel},setTimeout(){throw Error('Unexpected retry');}
});
function assertMirror(){
  const visible=inputs.filter(i=>!i.parentElement.hidden);
  const items=linked.items().slice(0,-1);
  assert.equal(visible.length,items.length);
  if (!linked.sidebarMessages.at(-1).v.available) assert.equal(statusLabel.textContent,items[0].title);
  visible.forEach((input,index)=>{
    assert.equal(input.checked,items[index].selected);
    assert.equal(!input.disabled,items[index].enabled);
  });
}
assertMirror();
const quicktime=inputs.find(i=>i.value==='qt');quicktime.checked=true;quicktime.change();
assert.equal(linked.p['gamma-factor'],2.4 / 1.961);
assert.equal(linked.p.vf[1].spec,'@bt709-gamma-plugin:format=gamma=gamma2.4');assertMirror();
linked.click(3);assertMirror();
linked.load({primaries:'bt.2020',gamma:'pq'});assertMirror();
linked.event('mpv.end-file');assertMirror();
assert.equal(statusLabel.textContent,'No Video Playing');
linked.load(null);assertMirror();
assert.equal(statusLabel.textContent,'Not Applicable to This Video');
linked.load(sdr);assertMirror();
console.log('PASS: actual sidebar script mirrors visible menu, enabled state and selection in both directions.');

const keyboard=player();keyboard.load(sdr);
assert.deepEqual(keyboard.items().map(item=>item.keyBinding),
  ['Ctrl+Alt+0','Ctrl+Alt+1','Ctrl+Alt+2','Ctrl+Alt+3','Ctrl+Alt+g']);
for (const [index,factor] of [[0,1],[1,2.4 / 1.961],[2,1],[3,1]]) {
  keyboard.items().find(item=>item.keyBinding==='Ctrl+Alt+'+index).action();
  assert.equal(keyboard.items()[index].selected,true);
  assert.equal(keyboard.p['gamma-factor'],factor);
  const owned = keyboard.p.vf.filter(f => f.label === 'bt709-gamma-plugin');
  assert.equal(owned.length, index === 0 ? 0 : 1);
  if (index !== 0) assert.equal(owned[0].spec,
    '@bt709-gamma-plugin:format=gamma=' + (index === 2 ? 'gamma2.2' : 'gamma2.4'));
}
keyboard.items().find(item=>item.keyBinding==='Ctrl+Alt+g').action();
assert.equal(keyboard.shown(),1);
keyboard.load({primaries:'bt.2020',gamma:'pq'});
assert.equal(keyboard.items().filter(item=>item.keyBinding).length,1);
assert.equal(keyboard.items()[1].keyBinding,'Ctrl+Alt+g');
console.log('PASS: shortcut declarations, shared actions and unsupported-video menu.');

const i18n=require('./i18n.js');
for (const tag of ['zh-Hant','zh-Hant-TW','zh-TW','zh_Hant','zh-HK']) assert.equal(i18n.resolve([tag]),'zh-Hant');
for (const tag of ['en','en-US','en-GB','fr','zh-Hans','zh-CN']) assert.equal(i18n.resolve([tag]),'en');
const chinese=player(['zh-Hant-TW']);chinese.load(sdr);
assert.equal(chinese.items()[0].title,'BT.1886（mpv 預設）');
chinese.sidebarHandlers['get-playback-state']();
assert.equal(chinese.sidebarMessages.at(-1).v.locale,'zh-Hant');
chinese.click(1);chinese.flush();assert.match(chinese.osd.at(-1),/近似 QuickTime/);
chinese.p['icc-profile-auto']=false;chinese.flush();assert.match(chinese.alerts.at(-1),/ICC 色彩描述檔/);
chinese.load({primaries:'bt.2020',gamma:'pq'});assert.equal(chinese.items()[0].title,'此影片不適用');
assert.equal(chinese.items()[1].keyBinding,'Ctrl+Alt+g');
// Global language cache must work without any player APIs and preserve user defaults.
const globalPrefs={defaultGamma:'gamma22'};let synced=0;
vm.runInNewContext(fs.readFileSync(__dirname+'/global.js','utf8'),{require,iina:{
 utils:{preferredLocalizations:()=>['zh-Hant']},
 preferences:{set:(k,v)=>{globalPrefs[k]=v;},sync:()=>{synced++;}}
}});
assert.deepEqual(globalPrefs,{defaultGamma:'gamma22',_uiLocale:'zh-Hant'});assert.equal(synced,1);
assert.equal(manifest.global,'global.js');
assert.equal(manifest.identifier,'io.github.babeneso.iina-bt709-gamma-preview');
console.log('PASS: regional locales, translated menu/OSD/ICC alert, sidebar locale, global cache without player APIs.');

// Exercise shared page localization through the actual script files, including
// late injection of the native preference bridge and a mismatched WebKit locale.
for (const page of ['preferences','help','sidebar']) {
 const markup=fs.readFileSync(__dirname+'/'+page+'.html','utf8');
 const entries=[...markup.matchAll(/data-i18n(-html)?="([^"]+)"/g)].map(m=>({
  dataset:m[1]?{i18nHtml:m[2]}:{i18n:m[2]},textContent:'',innerHTML:''
 }));
 assert(entries.length>0);
 for (const element of entries) {
  const key=element.dataset.i18n || element.dataset.i18nHtml;
  for (const locale of ['en','zh-Hant']) assert.notEqual(i18n.text(locale,key),key);
 }
 assert.match(markup,/<link rel="stylesheet" href="ui.css">/);
 assert.match(markup,/<body class="plugin-page"/);
 assert.doesNotMatch(markup,/<style|style=/);
 for (const ref of [...markup.matchAll(/(?:src|href)="([^"]+)"/g)]) assert(fs.existsSync(__dirname+'/'+ref[1]));
 const document={readyState:'complete',documentElement:{lang:'en'},body:{dataset:{page}},
  querySelectorAll:selector=>entries.filter(e=>selector==='[data-i18n]'?e.dataset.i18n:e.dataset.i18nHtml)};
 const window={};const timers=[];
 const context=vm.createContext({window,document,navigator:{languages:['en-US']},setTimeout:fn=>timers.push(fn)});
 vm.runInContext(fs.readFileSync(__dirname+'/i18n.js','utf8'),context);
 vm.runInContext(fs.readFileSync(__dirname+'/ui.js','utf8'),context);
 if(page==='sidebar') window.GammaUI.apply('zh-Hant');
 else {
  assert.equal(timers.length,1);
  window.iina={preferences:{get:(key,callback)=>{assert.equal(key,'_uiLocale');callback('zh-Hant');}}};
  timers.shift()();
 }
 assert.equal(document.documentElement.lang,'zh-Hant-TW');
 for (const element of entries) {
  const key=element.dataset.i18n || element.dataset.i18nHtml;
  assert.equal(element.dataset.i18n?element.textContent:element.innerHTML,i18n.text('zh-Hant',key));
 }
 window.GammaUI.apply('en');assert.equal(document.documentElement.lang,'en');
 for (const element of entries) {
  const key=element.dataset.i18n || element.dataset.i18nHtml;
  assert.equal(element.dataset.i18n?element.textContent:element.innerHTML,i18n.text('en',key));
 }
 // HTML translation is confined to copy, never ancestors of bound controls.
 for (const element of entries.filter(e=>e.dataset.i18nHtml)) {
  for(const locale of ['en','zh-Hant']) assert.doesNotMatch(i18n.text(locale,element.dataset.i18nHtml),/<(?:input|script|iframe)\b/i);
 }
}
console.log('PASS: three pages, external assets, translation coverage, delayed preferences bridge, IINA locale precedence and language switching.');

// Unavailable labels must transition even when availability remains false.
for (const [locale, empty, unsupported] of [
  ['en', 'No Video Playing', 'Not Applicable to This Video'],
  ['zh-Hant', '未播放影片', '此影片不適用']
]) {
  const state = player([locale]);
  assert.equal(state.items()[0].title, empty);
  state.event('iina.window-loaded');
  state.sidebarHandlers['get-playback-state']();
  assert.equal(state.sidebarMessages.at(-1).v.unavailableKey, 'noVideo');
  state.load({primaries:'bt.2020',gamma:'pq'});
  assert.equal(state.items()[0].title, unsupported);
  assert.equal(state.sidebarMessages.at(-1).v.unavailableKey, 'notApplicable');
  state.event('mpv.end-file'); // stale HDR params must not keep unsupported label
  assert.equal(state.items()[0].title, empty);
  state.event('mpv.video-reconfig');
  assert.equal(state.items()[0].title, empty);
  state.load(null); // loaded audio-only media is not an idle player
  assert.equal(state.items()[0].title, unsupported);
  state.event('mpv.start-file');
  assert.equal(state.items()[0].title, empty);
  state.load(sdr);
  state.p.pause = true;
  state.event('mpv.video-reconfig');
  assert.equal(state.items().length, 5); // pausing is not absence of video
  state.event('mpv.end-file'); // stale SDR params must not re-enable modes
  assert.equal(state.items()[0].title, empty);
  assert.deepEqual(state.p.vf, [{label:'other'}]);
  state.load(sdr);
  state.event('iina.window-will-close');
  assert.equal(state.items()[0].title, empty);
}
console.log('PASS: English/Chinese idle, unsupported, audio-only, loading, paused and closed playback states.');
