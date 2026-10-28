import assert from 'node:assert/strict';
import vm from 'node:vm';
import {lessons,modules} from './public/content.js';
import {Shell,webExperiment,pathOf} from './public/engine.js';
let checks=0;function ok(v,msg){assert.ok(v,msg);checks++;}
ok(lessons.length===40,'40 lessons');ok(modules.length===10,'10 chapters');
for(const l of lessons){ok(l.concept.length>=2&&l.hints.length>0,l.id+' material');const qs=l.quiz?[l.quiz]:l.config.questions;ok(qs?.length>0,l.id+' quiz');for(const q of qs)ok(q.answer>=0&&q.answer<q.options.length,l.id+' answer index');
 if(l.type==='terminal'){const s=new Shell();for(const line of l.solution){const out=s.run(line);ok(!out.startsWith('error:'),l.id+' '+line+': '+out);}for(const t of l.tasks)ok(s.check(t.rule),l.id+' objective '+t.label);if(l.config.flag)ok(Object.values(s.files).some(f=>f.content.includes(l.config.flag))||s.run('curl http://lab.local/archive/report.txt').includes(l.config.flag),l.id+' flag');}
 if(l.type==='code'){const ctx=vm.createContext({});vm.runInContext(l.solution[0],ctx,{timeout:1000});for(const test of l.config.tests){ctx.input=structuredClone(test.input);const value=vm.runInContext('solve(input)',ctx,{timeout:1000});assert.deepEqual(JSON.parse(JSON.stringify(value)),test.expected,l.id+' test');checks++;}}
 if(l.type==='web'){const r=webExperiment(l.config.kind,l.config.example);ok(r.vulnerable,l.id+' reproduce');ok(webExperiment(l.config.kind,l.config.example,true).blocked,l.id+' fix');ok(!webExperiment(l.config.kind,l.config.initial).vulnerable,l.id+' ordinary input');}}
const s=new Shell();ok(s.run('nmap example.com').startsWith('error:'),'external nmap rejected');ok(s.run('curl https://example.com').startsWith('error:'),'external curl rejected');ok(s.run('echo bad > /etc/passwd').startsWith('error:'),'system write rejected');ok(s.run('echo "unterminated').startsWith('error:'),'quote error');s.run('mkdir notes');s.run('echo "a b" > notes/x');s.run('echo second >> notes/x');ok(s.run('cat notes/x')==='a b\nsecond\n','redirect and append');s.run('cd notes');ok(s.run('pwd')==='/home/learner/notes\n','cd');s.run('cd ~');ok(s.cwd==='/home/learner','home');ok(s.run('cat /var/log/auth.log | grep Failed | wc -l')==='3\n','pipe count');ok(s.run('ls -a').includes('.env'),'hidden');ok(!s.run('ls').includes('.env'),'hidden default');ok(s.run('find /home/learner -name "*.txt"').includes('welcome.txt'),'glob');ok(s.run('curl -I http://lab.local/').includes('HTTP/1.1 200'),'HEAD');ok(!s.run('curl -I http://lab.local/').includes('Training Web'),'HEAD no body');ok(s.run('curl http://lab.local/missing').includes('Not Found'),'404');ok(s.run('base64 -d encoded.txt').includes('ZERO{encoding'),'base64');const saved=new Shell(s.snapshot());ok(saved.run('cat notes/x')==='a b\nsecond\n','snapshot');ok(pathOf('/public/../private/note.txt')==='/private/note.txt','normalization');console.log(`${checks} checks passed. All 40 lessons have valid content; all terminal, code and web solutions pass.`);
// Guided labs: execute the exact target handlers, including negative cases.
const {readFileSync}=await import('node:fs');
const {guidedLabs,cleanGuided}=await import('./public/guided.js');
const logic=readFileSync(new URL('./public/labs/logic.js',import.meta.url),'utf8');
const context=vm.createContext({});vm.runInContext(logic+'\nthis.api={createTrainingStore,invoiceRequest,checkoutRequest};',context);
const {createTrainingStore,invoiceRequest,checkoutRequest}=context.api;
const store=createTrainingStore();
assert.equal(invoiceRequest(store,'1001',false).body.owner,'learner');
assert.equal(invoiceRequest(store,'1002',false).body.owner,'demo-aya');
assert.equal(invoiceRequest(store,'1002',true).status,403);
assert.equal(invoiceRequest(store,'1001',true).status,200);
assert.equal(invoiceRequest(store,'9999',true).status,404);
assert.equal(invoiceRequest(store,'toString',false).status,404);
assert.equal(checkoutRequest(store,{product:'notebook',quantity:1,unitPrice:1},false).body.total,1);
assert.equal(checkoutRequest(store,{product:'notebook',quantity:1,unitPrice:1},true).body.total,3200);
assert.equal(checkoutRequest(store,{product:'notebook',quantity:2,unitPrice:3200},true).body.total,6400);
for(const quantity of [0,-1,11,1.5,'1'])assert.equal(checkoutRequest(store,{product:'notebook',quantity,unitPrice:1},false).status,400);
assert.equal(store.orders.length,3);
assert.equal(guidedLabs.length,3);
for(const l of guidedLabs){assert.equal(l.stages.length,5);assert.equal(l.hints.length,3);assert.ok(l.options[l.answer]);}
assert.equal(cleanGuided({xss:{done:true,note:'memo'}}).xss.done,true);
assert.equal(cleanGuided({xss:{done:'true'}}).xss.done,false);
const html=readFileSync(new URL('./public/labs/target.html',import.meta.url),'utf8');
assert.ok(html.includes("connect-src 'none'"));
assert.ok(html.includes(logic), "target embeds exact tested handlers");
const scripts=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)];
for(const script of scripts)new vm.Script(script[1]);
console.log('Guided lab handlers, validation, state import and target script syntax passed.');
