/* Physical AI Academy — curriculum expansion engine. Vendor-neutral educational material. */
(function(){
"use strict";
const D=window.__ACADEMY_DATA__;
const codes={white:"wh",yellow:"ye",orange:"or",green:"gr",blue:"bl",brown:"br",black:"bl"};
const grade={white:5,yellow:8,orange:10,green:12,blue:15,brown:18,black:20};
const minutes={white:45,yellow:55,orange:65,green:65,blue:75,brown:85,black:95};
let issues=[];
const safe=(s)=>String(s||"").trim();
function extend(belt,existingAdd,items,scenarios,labs){
 const old=D.lessons.filter(x=>x.belt===belt);
 if(old.length!==4)issues.push(belt+": original lessons "+old.length);
 old.forEach((l,i)=>{
   const blocks=existingAdd[i]||[];
   blocks.forEach(pair=>l.blocks.push({heading:pair[0],body:pair[1]}));
   l.minutes+=20;
 });
 items.forEach((it,i)=>{
   const [title,goal,blocks,example,trap,task,question,options,answer,why,refs,code]=it;
   if(!title||!goal||blocks?.length<3||!question||options?.length!==3||!(answer>=0&&answer<3))throw new Error("Invalid lesson "+belt+" "+(i+1));
   D.lessons.push({id:codes[belt]+"-"+String(i+5).padStart(2,"0"),belt,title,minutes:minutes[belt]+(i%3)*5,
    objectives:goal,blocks:blocks.map(v=>({heading:v[0],body:v[1]})),example,trap,task,question,options,answer,why,refs,code:code||null});
 });
 D.exams[belt].scenarios=scenarios||[];
 const lab=D.labs.find(l=>l.belt===belt);
 if(lab&&labs){
   lab.steps=[...lab.steps,...labs.steps];
   lab.criteria=labs.criteria;
   lab.deliverable=labs.deliverable||lab.deliverable;
   lab.duration=labs.duration||lab.duration;
 }
}
function finish(){
 const names={white:"7–10 hours",yellow:"9–12 hours",orange:"12–15 hours",green:"12–16 hours",blue:"15–20 hours",brown:"18–24 hours",black:"20–30 hours"};
 D.belts.forEach(b=>{
  b.duration=names[b.id];
  const ex=D.exams[b.id],lessonQ=D.lessons.filter(l=>l.belt===b.id).map(l=>({question:l.question,options:l.options,answer:l.answer,why:l.why}));
  const candidates=[...ex.questions,...lessonQ,...(ex.scenarios||[])];
  const seen=new Set();const unique=candidates.filter(q=>{const k=q.question.toLowerCase().replace(/[^a-z0-9]+/g," ");if(seen.has(k))return false;seen.add(k);return true;});
  const target=grade[b.id];
  if(unique.length<target)throw new Error("Question bank too small for "+b.id+": "+unique.length+" < "+target);
  // Spread existing examination questions, lesson checks and applied scenarios across the exam.
  const original=unique.slice(0,5),remainder=unique.slice(5),chosen=[];
  let idx=0;
  while(chosen.length<target){
   if(idx<original.length)chosen.push(original[idx]);
   if(chosen.length<target&&idx<remainder.length)chosen.push(remainder[idx]);
   idx++;if(idx>=Math.max(original.length,remainder.length))break;
  }
  for(const q of unique)if(chosen.length<target&&!chosen.includes(q))chosen.push(q);
  ex.questions=chosen.slice(0,target);
  ex.passing=Math.ceil(target*(b.id==="black"?.85:.8));
  ex.passPercent=b.id==="black"?85:80;
  delete ex.scenarios;
  const qSet=new Set(ex.questions.map(q=>q.question));
  if(qSet.size!==target)throw new Error("Duplicate exam question in "+b.id);
 });
 const expected=D.belts.length*10;
 if(D.lessons.length!==expected)throw new Error("Expected "+expected+" lessons, got "+D.lessons.length);
 D.sources.push(
 {id:"iso10218",name:"ISO 10218-1:2025 — Industrial robot safety",org:"ISO",url:"https://www.iso.org/standard/73933.html",about:"Official scope and requirements for safety of industrial robots; standards text may require purchase."},
 {id:"nist",name:"Robot performance test methods",org:"NIST",url:"https://www.nist.gov/programs-projects/department-homeland-security-response-robot-performance-standards",about:"Measurable robotic capability assessment and reproducible test methods."},
 {id:"simreal",name:"Simulation to Reality",org:"NVIDIA learning",url:"https://docs.nvidia.com/learning/physical-ai/getting-started-with-isaac-lab/latest/robot-learning-fundamentals/08-simulation-to-reality.html",about:"Distinguish simulated success and measured physical transfer."}
 );
 const terms=[
 ["Observability","Degree to which hidden system state can be inferred from available measurements."],
 ["Controllability","Ability to drive a dynamical system between states using allowed inputs."],
 ["Jacobian","Matrix mapping small joint-rate changes to task-space velocity."],
 ["Singularity","Configuration where a mapping loses rank, limiting achievable motion or making inversion unstable."],
 ["Frame graph","Connected coordinate frames with explicit transforms and time information."],
 ["Odometry","Incremental estimate of robot motion from wheels, IMU or other sensors; prone to drift."],
 ["Covariance","Statistical description of uncertainty and correlation between estimated quantities."],
 ["Actuator saturation","Output limit beyond which a controller cannot produce the requested force, torque or speed."],
 ["Contact constraint","Physical condition governing whether bodies touch, separate or slip."],
 ["Friction cone","Set of admissible contact forces that avoid tangential sliding under a friction model."],
 ["Trajectory","Time-parameterized sequence of configurations, states or motions."],
 ["Configuration space","Space of generalized coordinates specifying robot configurations."],
 ["Manipulability","Metric characterizing how joint velocities can produce end-effector velocities."],
 ["Reachability","Set of states or positions attainable under given constraints."],
 ["Latency","Delay between sensing, computation, communication and actuation."],
 ["DDS","Data Distribution Service, the middleware abstraction used by ROS 2 communication."],
 ["TF2","ROS 2 system for time-stamped coordinate transforms between frames."],
 ["Safety-rated stop","Stop function meeting relevant safety requirements and validated for the application."],
 ["Emergency stop","Protective stop function designed as part of the machinery safety architecture, not delegated solely to an AI model."],
 ["Reward hacking","Policy behavior that optimizes a specified reward while violating intended objectives."],
 ["Offline reinforcement learning","Policy learning from previously collected interaction data without new environmental experience during training."],
 ["Behavior cloning","Supervised imitation of demonstrated state/action pairs."],
 ["Distribution shift","Difference between deployment input conditions and training/evaluation data distributions."],
 ["OOD","Out-of-distribution observations: inputs unlike those used for model training."],
 ["System identification","Estimating unknown system parameters from measured inputs and responses."],
 ["Domain randomization","Training using plausible variations in simulation to increase robustness to uncertainty."],
 ["Sensor fusion","Combining multiple sources of measurement to estimate system state."],
 ["SLAM","Simultaneous localization and mapping; joint estimation of pose and environmental map."],
 ["Partial observability","Situation where current measurements do not uniquely determine the full system state."],
 ["Dataset leakage","Unintended overlap or information flow between training and evaluation sets."],
 ["Safety case","Structured argument supported by evidence that safety claims hold under defined conditions."],
 ["Operational design domain","Specified operating conditions and environments for which a system is designed and evaluated."],
 ["VLA","Vision–language–action model that predicts robot actions from visual observations and task language."],
 ["Policy","Mapping from observations or states to actions or action distributions."],
 ["Sim-to-real gap","Differences between simulation and physical hardware that affect performance transfer."],
 ["PPR","Product–Process–Resource: related yet distinct representations of what is made, how, and with what resources."]
 ];
 const exists=new Set(D.glossary.map(x=>x.term.toLowerCase()));terms.forEach(([term,definition])=>{if(!exists.has(term.toLowerCase()))D.glossary.push({term,definition})});
 D.glossary.sort((a,b)=>a.term.localeCompare(b.term));
 D.version="2.0.0";D.updated="2026-11-01";
 D.assessmentPolicy={examQuestions:grade,requirements:"All ten lesson knowledge checks, exam pass, and completed practical-lab self-assessment per belt. Not an external certification.",blackPass:85,otherPass:80};
 window.PAUpgradeSummary={lessons:D.lessons.length,examQuestions:Object.fromEntries(D.belts.map(b=>[b.id,D.exams[b.id].questions.length])),glossary:D.glossary.length,issues};
}
window.PAUpgrade={extend,finish};
})();