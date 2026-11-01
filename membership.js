/* Physical AI Academy membership, v1. Free access; only authenticated members persist progress. */
(function (global) {
  'use strict';
  const config = {
    url: 'https://gtxqappprshwfbmiaomp.supabase.co',
    key: 'sb_publishable_NLYqj44MGZx7BK2H3H7WwQ_HYZZrATr'
  };
  const state = { ready:false, user:null, loading:true, message:'', error:'', syncing:false, emailSent:false, pendingEmail:'' };
  let client=null, listener=()=>{}, generation=0, saveChain=Promise.resolve();
  const explain = e => e && e.message ? e.message : String(e || 'Unexpected error');
  const announce = () => {try{listener();}catch(e){console.warn('UI refresh error',e);}};
  const fail = e => {state.error=explain(e);state.message='';announce();};
  function create(){
    if(!global.supabase || typeof global.supabase.createClient !== 'function'){
      throw new Error('Authentication library unavailable. Refresh the page or check your network connection.');
    }
    client = global.supabase.createClient(config.url,config.key,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'implicit',storageKey:'physical-ai-academy-auth'}
    });
  }
  async function handleSession(nextUser){
    const ticket=++generation;
    state.user=nextUser||null;
    state.loading=!!nextUser;
    state.error='';
    announce();
    try {
      let progress=null;
      if(nextUser){
        const {data,error}=await client.from('academy_progress').select('progress').eq('user_id',nextUser.id).maybeSingle();
        if(error)throw error;
        progress=data?.progress||null;
      }
      if(ticket===generation){state.loading=false;state.ready=true;listener(progress,nextUser||null);}
    }catch(e){if(ticket===generation){state.loading=false;state.ready=true;fail(e);listener(null,nextUser||null);}}
  }
  async function init(onChange){
    listener=onChange;
    try{
      create();
      const {data:{subscription}}=client.auth.onAuthStateChange((event,session)=>{
        if(event==='INITIAL_SESSION')return;
        if(event==='TOKEN_REFRESHED')return;
        // Defer database queries until after the Auth callback has returned.
        setTimeout(()=>handleSession(session?.user||null),0);
      });
      const {data:{session},error}=await client.auth.getSession();
      if(error)throw error;
      await handleSession(session?.user||null);
      return subscription;
    } catch(e){
      state.loading=false;state.ready=true;fail(e);listener(null,null);
    }
  }
  async function requestEmail(email){
    if(!client)throw new Error('Sign-in service unavailable.');
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Enter a valid email address.');
    state.error='';state.message='';state.pendingEmail=email;
    const {error}=await client.auth.signInWithOtp({
      email,
      options:{shouldCreateUser:true,emailRedirectTo:'https://physical-ai-academy.vercel.app/'}
    });
    if(error)throw error;
    state.emailSent=true;
    state.message='Check your email for the sign-in link. If you receive a verification code, enter it below.';
    announce();
  }
  async function verifyCode(code){
    if(!client)throw new Error('Sign-in service unavailable.');
    const token=String(code||'').trim();
    if(!state.pendingEmail || !/^\d{6,8}$/.test(token))throw new Error('Request an email sign-in, then enter the code from that email.');
    const {error}=await client.auth.verifyOtp({email:state.pendingEmail,token,type:'email'});
    if(error)throw error;
    state.message='Signed in successfully.';
    state.emailSent=false;
    announce();
  }
  async function google(){
    if(!client)throw new Error('Sign-in service unavailable.');
    const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:'https://physical-ai-academy.vercel.app/'}});
    if(error)throw error;
  }
  async function signOut(){
    if(!client)throw new Error('Sign-in service unavailable.');
    await saveChain.catch(()=>{});
    const {error}=await client.auth.signOut();
    if(error)throw error;
    state.message='Signed out. Your cloud progress remains private.';
    announce();
  }
  function persist(progress){
    if(!client||!state.user||state.loading)return Promise.resolve(false);
    const userId=state.user.id;
    const payload=JSON.parse(JSON.stringify(progress));
    saveChain=saveChain.catch(()=>{}).then(async()=>{
      if(!state.user||state.user.id!==userId) return false;
      state.syncing=true;state.error='';announce();
      const {error}=await client.from('academy_progress').upsert({
        user_id:userId,progress:payload,updated_at:new Date().toISOString()
      },{onConflict:'user_id'});
      state.syncing=false;
      if(error){fail(error);return false;}
      announce();return true;
    });
    return saveChain;
  }
  async function deleteProgress(){
    if(!client||!state.user)throw new Error('Sign in to delete your progress.');
    await saveChain.catch(()=>{});
    const {error}=await client.from('academy_progress').delete().eq('user_id',state.user.id);
    if(error)throw error;
    return true;
  }
  async function saveExperiment(run){
    if(!client||!state.user)throw new Error('Sign in to save training experiments.');
    const {data,error}=await client.from('academy_training_runs').insert({...run,user_id:state.user.id}).select('id').single();
    if(error)throw error;
    return data;
  }
  async function listExperiments(){
    if(!client||!state.user)return [];
    const {data,error}=await client.from('academy_training_runs').select('id,experiment_name,belt,robot,simulator,learning_method,policy_model,dataset,outcome,created_at').order('created_at',{ascending:false}).limit(100);
    if(error)throw error;
    return data||[];
  }
  global.AcademyMembers={state,init,requestEmail,verifyCode,google,signOut,persist,deleteProgress,saveExperiment,listExperiments,report:fail};
})(window);
