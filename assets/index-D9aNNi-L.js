import"./auth-Tfpdhhiz.js";/* empty css                       */import{r as P}from"./guard-opDxWjIk.js";import"https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";import"https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";import"https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";(function(){const i="grammarProgress",t="data/roadmap.json";window.ProgressManager={roadmap:null,async init(){return await this.loadRoadmap(),this.migrateOldData(),this.getProgress()},async loadRoadmap(){if(this.roadmap)return this.roadmap;try{const s=await(await fetch(t)).json();return this.roadmap=s,s}catch(e){return console.error("Failed to load roadmap:",e),window.location.protocol==="file:"&&console.error("⚠️ CORS Error: You must use a local server (e.g., Live Server) to run this site. Opening files directly in the browser will not work."),null}},getProgress(){const e={completedTopics:[],topicAttempts:{},currentTopic:null,startedAt:new Date().toISOString(),lastVisit:new Date().toISOString(),streak:0,totalTimeEstimate:0},s=localStorage.getItem(i);if(!s)return this.saveProgress(e),e;try{const n=JSON.parse(s);return n.lastVisit=new Date().toISOString(),this.calculateStreak(n),this.saveProgress(n),n}catch(n){return console.error("Failed to parse progress data:",n),e}},saveProgress(e){try{localStorage.setItem(i,JSON.stringify(e))}catch(s){console.error("Failed to save progress:",s)}},markTopicComplete(e,s,n){const a=this.getProgress(),r=new Date().toISOString();a.topicAttempts[e]||(a.topicAttempts[e]={attempts:[],bestScore:0,firstCompletedAt:null,lastAttemptAt:null});const c=a.topicAttempts[e];c.attempts.push({score:s,percentage:Math.round(s/n*100),totalQuestions:n,attemptedAt:r,passed:s>=Math.ceil(n*.7)});const u=Math.round(s/n*100);return u>c.bestScore&&(c.bestScore=u),c.lastAttemptAt=r,!c.firstCompletedAt&&u>=70&&(c.firstCompletedAt=r),u>=70&&!a.completedTopics.includes(e)&&a.completedTopics.push(e),a.currentTopic=this.getNextTopicId(e),this.saveProgress(a),c},getTopicStatus(e){const n=this.getProgress().topicAttempts[e];if(!n||n.attempts.length===0){const r=this.isTopicUnlocked(e);return{status:r?"available":"locked",attempts:0,bestScore:0,unlocked:r}}return{status:n.bestScore>=70?"completed":"in-progress",attempts:n.attempts.length,bestScore:n.bestScore,lastAttempt:n.lastAttemptAt,unlocked:!0,allAttempts:n.attempts}},isTopicUnlocked(e){if(localStorage.getItem("DEV_MODE")==="true"||!this.roadmap)return!0;const s=this.getProgress();let n=!1,a=null;for(const r of this.roadmap.levels){for(const c of r.topics){if(c.id===e){n=!0;break}a=c.id}if(n)break}return a?s.completedTopics.includes(a):!0},getNextTopicId(e){if(!this.roadmap)return null;let s=!1;for(const n of this.roadmap.levels)for(const a of n.topics){if(s)return a.id;a.id===e&&(s=!0)}return null},getContinueTopic(){const e=this.getProgress();if(e.currentTopic)return e.currentTopic;if(e.completedTopics.length>0){const s=e.completedTopics[e.completedTopics.length-1],n=this.getNextTopicId(s);if(n)return n}return this.roadmap&&this.roadmap.levels.length>0?this.roadmap.levels[0].topics[0].id:null},getStats(){const e=this.getProgress(),s=this.getTotalTopics(),n=e.completedTopics.length,a=s>0?Math.round(n/s*100):0;let r=0,c=0;for(const l in e.topicAttempts){const d=e.topicAttempts[l];d.bestScore>0&&(r+=d.bestScore,c++)}const u=c>0?Math.round(r/c):0;let o=0;for(const l in e.topicAttempts)o+=e.topicAttempts[l].attempts.length;return{totalTopics:s,completedTopics:n,percentage:a,averageScore:u,totalAttempts:o,streak:e.streak,startedAt:e.startedAt,lastVisit:e.lastVisit}},getTotalTopics(){if(!this.roadmap)return 15;let e=0;for(const s of this.roadmap.levels)e+=s.topics.length;return e},calculateStreak(e){const s=new Date(e.lastVisit),n=new Date;s.setHours(0,0,0,0),n.setHours(0,0,0,0);const a=Math.floor((n-s)/(1e3*60*60*24));a!==0&&(a===1?e.streak=(e.streak||0)+1:e.streak=1)},getMilestoneMessage(e){return e>=100?"🎉 Congratulations! You've mastered English grammar!":e>=75?"🎯 Almost there! You've got this!":e>=50?"💪 More than halfway there!":e>=25?"🚀 You're making amazing progress!":e>0?"🌱 Great start! Keep going!":"👋 Welcome! Start your learning journey!"},getStreakMessage(e){return e>=30?"🏆 30-day streak! You're unstoppable!":e>=7?"⭐ 1 week streak! Amazing dedication!":e>=3?"🔥 3-day streak! You're consistent!":e>=1?"👋 Welcome back!":""},migrateOldData(){const e=localStorage.getItem("completedTopics");if(e)try{const s=JSON.parse(e),n=this.getProgress();for(const a of s)n.completedTopics.includes(a)||(n.completedTopics.push(a),n.topicAttempts[a]||(n.topicAttempts[a]={attempts:[{score:7,percentage:70,totalQuestions:10,attemptedAt:new Date().toISOString(),passed:!0}],bestScore:70,firstCompletedAt:new Date().toISOString(),lastAttemptAt:new Date().toISOString()}));this.saveProgress(n),localStorage.removeItem("completedTopics"),console.log("Migrated old progress data")}catch(s){console.error("Failed to migrate old data:",s)}},resetProgress(){confirm("Are you sure you want to reset all progress? This cannot be undone.")&&(localStorage.removeItem(i),localStorage.removeItem("completedTopics"),window.location.reload())},exportProgress(){const e=this.getProgress(),s=JSON.stringify(e,null,2),n=new Blob([s],{type:"application/json"}),a=URL.createObjectURL(n),r=document.createElement("a");r.href=a,r.download=`grammar-progress-${new Date().toISOString().split("T")[0]}.json`,r.click(),URL.revokeObjectURL(a)}},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{window.ProgressManager.init()}):window.ProgressManager.init()})();(function(){const i={roadmap:null,async init(){await this.loadRoadmap(),this.renderProgressBar()},async loadRoadmap(){try{const t=await fetch("data/roadmap.json");this.roadmap=await t.json(),window.ProgressManager&&await window.ProgressManager.init(),this.renderRoadmap()}catch(t){console.error("Error loading roadmap:",t),window.location.protocol==="file:"&&console.error("⚠️ CORS Error: You must use a local server (e.g., Live Server) to run this site. Opening files directly in the browser will not work.")}},renderRoadmap(){const t=document.getElementById("roadmap-container");if(!t||!this.roadmap)return;const e=this.roadmap.levels.map(s=>{const n=s.topics.map(a=>{const r=window.ProgressManager?window.ProgressManager.getTopicStatus(a.id):{status:"available",unlocked:!0};this.getStatusIcon(r);const c=!r.unlocked,u=c?"locked":"",o=window.LessonIndex&&window.LessonIndex[a.id]?window.LessonIndex[a.id].icon:"📚",l=r.bestScore>0?`<span class="rm-topic-score">${r.bestScore}%</span>`:"";return`
                        <a href="${c?"#":`#/learn/topic/${a.id}`}" 
                           class="rm-topic-link ${u}" 
                           data-topic-id="${a.id}"
                           ${c?'onclick="return false;"':""}>
                            <span class="rm-topic-icon">${o}</span>
                            <div class="rm-topic-info">
                                <span class="rm-topic-title">${a.title}</span>
                                <span class="rm-topic-time">${a.estimated_time||"15 min"}</span>
                            </div>
                            ${l}
                            ${c?'<span class="rm-lock-icon">🔒</span>':""}
                        </a>
                    `}).join("");return`
                    <div class="rm-roadmap-level">
                        <button class="rm-level-header" data-level="${s.id}">
                            <span class="rm-level-emoji">${s.emoji||"📖"}</span>
                            <span class="rm-level-title">${s.title}</span>
                            <span class="rm-level-toggle">▼</span>
                        </button>
                        <div class="rm-level-topics" data-level="${s.id}">
                            ${n}
                        </div>
                    </div>
                `}).join("");t.innerHTML=e,this.attachLevelToggleHandlers()},attachLevelToggleHandlers(){document.querySelectorAll(".rm-level-header").forEach(n=>{n.addEventListener("click",a=>{const r=n.dataset.level,c=document.querySelector(`.rm-level-topics[data-level="${r}"]`),u=n.querySelector(".rm-level-toggle");c.classList.contains("rm-expanded")?(c.classList.remove("rm-expanded"),u.textContent="▼",n.classList.remove("active")):(c.classList.add("rm-expanded"),u.textContent="▲",n.classList.add("active"))})});const e=document.querySelector('.rm-level-topics[data-level="1"]'),s=document.querySelector('.rm-level-header[data-level="1"] .rm-level-toggle');if(e&&!e.classList.contains("rm-expanded")){e.classList.add("rm-expanded"),s&&(s.textContent="▲");const n=document.querySelector('.rm-level-header[data-level="1"]');n&&n.classList.add("active")}},renderProgressBar(){const t=document.querySelector(".sidebar");if(!t||!window.ProgressManager)return;const e=window.ProgressManager.getStats(),s=window.ProgressManager.getMilestoneMessage(e.percentage);let n=t.querySelector(".progress-section");if(!n){n=document.createElement("div"),n.className="progress-section";const a=t.querySelector(".sidebar-header");a?a.after(n):t.prepend(n)}n.innerHTML=`
                <div class="progress-stats">
                    <div class="progress-label">Your Progress</div>
                    <div class="progress-percentage">${e.percentage}%</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${e.percentage}%"></div>
                </div>
                <div class="progress-details">
                    <span>${e.completedTopics} of ${e.totalTopics} topics</span>
                    ${e.streak>0?`<span class="streak-badge">🔥 ${e.streak} day${e.streak>1?"s":""}</span>`:""}
                </div>
                <div class="progress-message">${s}</div>
            `},getStatusIcon(t){switch(t.status){case"completed":return"✓";case"in-progress":return"▶";case"locked":return"○";default:return"○"}},updateProgress(){this.renderRoadmap(),this.renderProgressBar()}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{i.init()}):i.init(),window.RoadmapLoader=i})();(function(){function i(){const t=document.getElementById("continue-learning-container");if(!t||!window.ProgressManager)return;const e=window.ProgressManager.getStats();if(e.completedTopics===0){t.innerHTML="";return}const s=window.ProgressManager.getContinueTopic();if(!s){t.innerHTML=`
                <div class="continue-learning-section">
                    <h3>🎉 Congratulations!</h3>
                    <p>You've completed all topics! Amazing work!</p>
                    <div class="celebration-score">${e.percentage}%</div>
                </div>
            `;return}let n=s,a="15 min";if(window.RoadmapLoader&&window.RoadmapLoader.roadmap)for(const c of window.RoadmapLoader.roadmap.levels){const u=c.topics.find(o=>o.id===s);if(u){n=u.title,a=u.estimated_time;break}}const r=window.ProgressManager.getMilestoneMessage(e.percentage);t.innerHTML=`
            <div class="continue-learning-section">
                <h3>Keep Going! 🚀</h3>
                <p>${r}</p>
                <a href="#/topic/${s}" class="continue-btn">
                    <span>Continue Learning</span>
                    <span>→</span>
                </a>
                <div class="continue-topic-info">
                    <span>Next: <strong>${n}</strong></span>
                    <span>•</span>
                    <span>${a}</span>
                </div>
            </div>
        `}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(i,100)}):setTimeout(i,100),window.addEventListener("hashchange",()=>{(window.location.hash===""||window.location.hash==="#/")&&setTimeout(i,100)}),window.renderContinueLearning=i})();window.UZ_DICT={abbey:"abbatlik",achievements:"yutuqlar",across:"bo&#39;ylab",act:"harakat",action:"amal",add:"Qo’shish",adele:"adele",advanced:"Tajribali",affairs:"ishlar",afraid:"qo&#39;rqib",after:"Keyin",again:"Yana",aims:"maqsadlar",all:"barchasi",almost:"deyarli",already:"allaqachon",although:"garchi",always:"har doim",ancient:"qadimiy",ann:"Ann",announces:"e&#39;lon qiladi",announcing:"e&#39;lon qilish",another:"boshqa",answers:"Javoblar",anti:"qarshi",any:"ixtiyoriy",apple:"olma",apples:"olma",arena:"ArenaGenericName",arrival:"kelishi",arrived:"yetib keldi",arthur:"Artur",asking:"so&#39;rab",asks:"so&#39;raydi",aspect:"soniya",assessments:"baholashlar",ate:"yedi",attended:"qatnashdi",attending:"qatnashmoqda",aus:"aus",away:"uzoqda",awful:"dahshatli",back:"orqaga",badges:"nishonlar",badly:"yomon",bag:"paket",bank:"bank",basic:"Asosiy",battle:"jang",beatles:"bitlz",beautiful:"go&#39;zal",became:"aylandi",because:"chunki",become:"bo&#39;lish",becomes:"aylanadi",becoming:"bo&#39;lish",before:"Avval",begin:"boshlamoq",beginner:"Boshlang'ich",believe:"ishon",believed:"ishongan",believes:"ishonadi",believing:"ishongan",ben:"ben",better:"yaxshiroq",between:"orasida",big:"katta",blackboard:"doska",blew:"pufladi",blouse:"bluzka",blow:"puflash",blowing:"puflash",blown:"puflangan",boil:"qaynatish",boiling:"Qaynatish",boils:"furunkullar",book:"kitob",books:"Kitoblar",boschen:"boschen",bought:"sotib oldi",boy:"o'g'il bola",boys:"O'g'il bolalar",branches:"filiallari",break:"sindirmoq",breakfast:"nonushta",breaking:"sindirish",broke:"buzildi",broken:"Buzuq",burned:"yonib ketgan",bus:"avtobus",business:"Biznes",buy:"sotib olmoq",cake:"tort",called:"chaqirdi",cambridge:"Kembrij",came:"keldi",can:"-a olmoq",canteen:"Oslixona",carry:"olib yurmoq",cat:"mushuk",category:"kategoriya",ceremonies:"MAROSIMLAR",challenge:"qiyinchilik. ",challenges:"Qiyinchiliklar",champions:"chempionlar",changes:"o'zgarishlar",chief:"boshliq",child:"Bola",children:"bolalar",chinese:"Хитой",choose:"tanlash",christmas:"Rojdestvo",church:"cherkov",city:"shahar",classroom:"sinf",clock:"soat",close:"yopmoq",clothes:"kiyimlar",coat:"palto",coffee:"qahva",coin:"tanga",cold:"sovuq",college:"kollej",color:"Rang",come:"kelmoq",comes:"keladi",comic:"komiks",coming:"kelayotgan",common:"Umumiy",comrade:"o&#39;rtoq",confusing:"chalkash",connect:"Ulanmoq",const:"Const",cont:"davom",context:"Kontekst",contexts:"kontekstlar",contextual:"kontekstual",continues:"(Davom etadi)",continuous:"Davomiy",contract:"shartnoma",contrastive:"kontrastli",cooking:"Pishirish",coronation:"toj kiyish marosimi",correct:"To'g'ri",cotton:"paxta",country:"Mamlakat",course:"Kurs",crib:"beshik",ctx:"ctx",cutlet:"kotlet",data:"Ma’lumotlar",dates:"Sanalar",daughter:"qiz",day:"kun",days:"Kunlar",deduce:"xulosa qilmoq",degrees:"daraja",describes:"tasvirlaydi",dictionary:"lug'at",did:"qildi",didn:"qilmadi",diff:"DiffLanguage",differences:"farqlar",different:"boshqacha",dinner:"kechki ovqat",direction:"Yo'nalish",dirty:"iflos",disturb:"bezovta qilmoq",do:"qilmoq",doctor:"shifokor",does:"qiladi",doesn:"qilmaydi",dog:"it",doing:"qilish",don:"don",done:"tayyor",door:"eshik",drag:"sudrab tortmoq",drawing:"chizish",drawn:"chizilgan",draws:"chizadi",dress:"kiyinish",drew:"tortdi",drink:"ichmoq",drinking:"ichish",drinks:"ichimliklar",duration:"Davomiyligi",early:"erta",east:"Sharq",easy:"oson",eat:"yemoq",eaten:"yeb qo&#39;yilgan",eating:"Ovqatlanish ",eats:"yeydi",eb:"eb",ed:"ed",ef:"ef",elementary:"boshlang'ich",emphasizes:"ta&#39;kidlaydi",end:"oxiri",ends:"Tugaydi:",endurance:"chidamlilik",engineer:"muhandis",engineers:"muhandislar",england:"Angliya",english:"ingliz tili",enter:"Enter",evening:"kechqurun",events:"Yangiliklar",ever:"hech qachon",every:"har",everything:"Hammasi",exam:"Imtixon",example:"misol",examples:"misollar",exist:"mavjud",existed:"mavjud edi",experience:"tajriba",expertise:"mutaxassislik",explanation:"Izoh",face:"yuz",facts:"faktlar",false:"Yolgʻon",family:"oila",fan:"muxlis",fast:"tez",father:"ota",few:"Ozroq",fifty:"ellik",film:"Film",films:"filmlar",find:"topmoq",finded:"topildi",finding:"topish",finish:"tugatmoq",finished:"Yakunlandi",finishes:"tugaydi",finishing:"Tugatilmoqda",fire:"Olov",first:"birinchi",flag:"Bayroq",flowers:"gullar",flown:"uchib ketgan",fly:"uchmoq",flying:"uchish",focuses:"diqqat markazida",food:"oziq-ovqat",football:"futbol",foreign:"xorijiy",form:"forma",formula:"Formula",fortune:"boylik",found:"topdi",four:"to'rt",free:"tekin",freezes:"muzlaydi",freezing:"muzlash",french:"Fransuz",friend:"do'st",frozen:"muzlatilgan",future:"kelajak",game:"Oʻyin",garden:"bog'",general:"General",german:"Nemis",get:"olish",gets:"oladi",getting:"olish",girl:"qiz bola",girls:"Qizlar ",give:"bermoq",given:"berilgan",global:"Umumiy",globe:"globus",go:"bormoq",goal:"maqsad",goes:"ketadi",going:"ketayotgan",gone:"Ketdi",good:"Yaxshi",got:"bor",graduation:"bitiruv",great:"ajoyib",growing:"o&#39;sayotgan",grown:"yetishtirilgan",guess:"taxmin qilish",guest:"Mijoz",guitar:"gitara",gym:"sportzal",habit:"odat",habitual:"odatiy",had:"bor edi",hadn:"edi",hand:"qo'l",hands:"Qo'llar",happening:"sodir bo&#39;layotgan",happiest:"eng baxtli",happy:"baxtli",hard:"qiyin",harvest:"o&#39;rim-yig&#39;im",has:"ega",hasn:"bor",have:"bor",haven:"boshpana",having:"ega",he:"U",head:"bosh",hear:"eshitish",heard:"Eshitildi:",hearing:"eshitish",hello:"hello",help:"yordam bermoq",helped:"yordam berdi",her:"Uning",here:"bu yerda",hero:"qahramon",herr:"xonim",hidden:"yashirin",high:"yuqori",him:"uni",his:"Uning",hit:"urish",holiday:"Dam olish",holmes:"Xolms",home:"uy",horror:"dahshat",hot:"issiq",hours:"soatlar",how:"Qanday ?",humans:"odamlar",hungry:"och",icon:"belgi",id:"id",ii:"ikkinchi",iii:"III.",ill:"kasal",immersive:"immersiv",implication:"oqibat",impressions:"taassurotlar",information:"Ma'lumot ",ing:"ing",inside:"ichida",interesting:"qiziqarli",interpreting:"tarjima qilish",interrupted:"uzilib qoldi",interruption:"uzilish",into:"ichiga",isn:"emas",it:"u",item:"Element",ix:"ix",japan:"Yaponiya",jeans:"jinsi",job:"ish",john:"Jon",journalist:"jurnalist",june:"iyun",just:"shunchaki",keys:"kalitlar",kingdom:"Shohlik",kings:"qirollar",knew:"bilardi",knock:"taqillatish",knocked:"taqillatdi",knocking:"Taqillatish",knocks:"taqillatishlar",know:"bilish",known:"ma&#39;lum",knows:"biladi",landed:"qo&#39;ndi",last:"oxirgi",late:"kech",lately:"yaqinda",launch:"ishga tushirish",leading:"yetakchi",learn:"o'rganmoq",learned:"o&#39;rgangan",learning:"o&#39;rganish",learns:"o&#39;rganadi",leave:"ketmoq",leaves:"ketadi",leaving:"ketish",left:"chap",length:"uzunligi",lesson:"Dars",lessons:"Darslar",let:"ruxsat bering",letter:"harf",letters:"harflar",level:"Daraja",librarian:"kutubxonachi",library:"Kutubxona",lies:"yolg&#39;on",life:"hayot",lights:"chiroqlar",like:"yoqdi",likes:"yoqtirishlar",liking:"Yoqdi",listen:"eshitmoq",little:"oz",lived:"yashagan",lives:"yashaydi",living:"yashash",ll:"ll",local:"mahalliy",logic:"Mantiq",london:"London",long:"uzun",look:"qaramoq",looked:"qaradi",looking:"qarab",looks:"ko&#39;rinadi",losing:"yo&#39;qotish",lost:"yo'qotdi",lot:"ko&#39;p",lucas:"Lukas",lunch:"Tushlik",lust:"shahvat",made:"qilingan",magazine:"jurnal",make:"qilmoq",makes:"qiladi",making:"qilish",man:"erkak",many:"Ko'p",marie:"Mari",married:"Уйланган/турмушга чиққан",marry:"uylanmoq",mars:"Mars",mary:"Meri",master:"usta",mastery:"mahorat",matrix:"Katak",max:"Maks",may:"may",me:"Men",medical:"TIBBIYOT",medium:"o‘rta",meet:"uchrashish",meeting:"uchrashuv",meets:"uchrashadi",met:"uchrashdi",midnight:"yarim tun",milk:"sut",ministry:"vazirligi",minute:"daqiqa",minutes:"daqiqalar",miss:"sog'inmoq",mixed:"Aralash",mode:"usul",moment:"moment",mondays:"dushanba kunlari",money:"pul",month:"oy",months:"oylar",morning:"ertalab",most:"eng ko'p",mother:"ona",movie:"kino",mr:"Janob",much:"ko&#39;p",mud:"Loy",music:"Musiqa",my:"Mening",name:"ism",nasa:"NASA",near:"yaqin",never:"hech qachon",new:"yangi",news:"Yangiliklar",next:"keyingi",night:"kecha",nina:"Nina",no:"yo'q",nobody:"Hech kim",not:"emas",nothing:"hech narsa",noticed:"e&#39;tibor bergan",now:"hozir",nowadays:"hozirgi kunlarda",nuance:"nuans",occupy:"egallab olish",off:"o'ch",office:"idora",often:"tez-tez",oh:"oh",old:"Eski",older:"yoshi kattaroq",open:"ochmoq",operate:"ishlaydi",operated:"boshqariladigan",operates:"faoliyat yuritadi",operating:"faoliyat ko'rsatmoqda",opinion:"fikr",options:"Tanlovlar",our:"bizning",out:"tashqari",oven:"pech",over:"ustida",paid:"To’langan",pale:"rangpar",park:"park",part:"qismi",party:"partiya",past:"o&#39;tgan",paul:"Pol",people:"odamlar",perf:"mukammal",perfect:"Zo’r",periodic:"davriy",peter:"PETER",picked:"tanlangan",picture:"surat",pinocchio:"Pinokkio",place:"joy",plan:"reja",plans:"rejalar",play:"o'ynamoq",played:"o&#39;ynadi",playing:"o&#39;ynamoqda",plays:"o'ynaydi",pm:"kechki",pool:"basseyn",popular:"Ommabop",population:"Aholi",prediction:"bashorat qilish",predicts:"bashorat qiladi",prepare:"tayyorlamoq",pres:"pres",present:"hozir",president:"Prezident",prices:"narxlar",produce:"mahsulot",produced:"ishlab chiqarilgan",produces:"ishlab chiqaradi",progress:"progress",promise:"va&#39;da",promises:"va&#39;dalar",pulls:"tortadi",push:"itarmoq",put:"qo&#39;yish",queen:"malika",queens:"malikalar",question:"Savol",questions:"savollar",quick:"tez",quiet:"jim",quiz:"Test",quote:"iqtibos",race:"poyga",rain:"yomg'ir",rained:"yomg&#39;ir yog&#39;di",raining:"yomg'ir yog'moqda",rains:"yomg&#39;irlar",ran:"yugurdi",random:"tasodifiy",rapidly:"tez",raw:"RAW",ray:"nur",read:"o'qish",reading:"o'qish",reads:"o'qiydi",real:"haqiqiy",really:"haqiqatan",recent:"So‘nggi",recently:"yaqinda",regional:"mintaqaviy",regular:"oddiy",result:"natija",results:"natijalar",rise:"ko&#39;tarilish",risen:"ko'tarilgan",rises:"ko&#39;tariladi",rising:"yuksalish",rome:"Rim",room:"xona",rose:"ko'tarildi",rude:"qo&#39;pol",rule:"qoida",rules:"qoidalar",run:"yugurmoq",runner:"yuguruvchi",running:"yugurish",runs:"yugurishlar",said:"dedi",samuel:"Shomuil",saw:"ko'rdi",say:"demoq",saying:"aytish",says:"deydi",scale:"o'lchov",scenario:"Ssenariy",scenarios:"stsenariylar",schedules:"jadvallar",school:"maktab",sea:"dengiz",seaside:"dengiz bo&#39;yidagi",secret:"Maxfiy",see:"ko'rmoq",seeking:"izlash",seeks:"izlaydi",seem:"tuyuladi",seemed:"tuyulardi",seems:"ko&#39;rinadi",seen:"ko&#39;rgan",set:"Oʻrnatish",sets:"toʻplamlar",shall:"qiladi",sharp:"keskin",she:"u",sherlock:"Sherlok",shh:"jim bo&#39;ling",shifts:"smenalar",shine:"porlash",shines:"porlaydi",shining:"porlab turgan",short:"Qisqa",show:"ko'rsatmoq",side:"Yon",sightseeing:"diqqatga sazovor joylarni tomosha qilish",sign:"Imzo",signed:"imzoladi",signing:"imzolash",simple:"oddiy",since:"beri",sing:"ashula aytmoq",singing:"kuylash",sings:"qo&#39;shiq aytadi",sister:"opa",sitting:"o&#39;tirish",situation:"vaziyat",skate:"skat",skated:"konkida uchgan",skating:"konkida uchish",sleep:"uxlamoq",sleeping:"uxlash",sleeps:"uxlaydi",slept:"uxladi",slider:"chiziq",smelled:"hidladi",smoke:"tutun",snow:"qor",snowing:"qor yog&#39;moqda",snows:"qorlar",somebody:"kimdir",someone:"kimdir",song:"Qoʻshiq",songs:"Qo'shiqlar",sorry:"Uzr",soup:"sho'rva",source:"Manba",space:"Bo'sh joy",speak:"gapirmoq",speaking:"Gapirmoqda",speaks:"gapiradi",special:"maxsus",specific:"Maxsus",spoke:"gapirdi",spoken:"gapirgan",start:"boshlamoq",started:"boshladi",starts:"boshlanadi",state:"Davlat",states:"Davlatlar",station:"stantsiya",stay:"qoling",stayed:"qoldi",stays:"qoladi",steal:"o&#39;g&#39;irlash",still:"hali ham",stones:"toshlar",stop:"to'xtatmoq",stories:"hikoyalar",story:"hikoya",streak:"chiziq",strong:"Kuchli",student:"Talaba",students:"Talabalar",studied:"o&#39;rgangan",study:"O'qish",studying:"o&#39;qish",sub:"sub",subjects:"Subyektlar",success:"Muvaffaqiyatli",such:"bunday",suddenly:"birdan",sun:"quyosh",sunday:"yakshanba",sung:"kuylangan",swift:"tez",table:"jadval",take:"olmoq",taken:"olingan",takes:"oladi",taking:"olish",taught:"o&#39;rgatilgan",taylor:"taylor",tea:"choy",teach:"o&#39;rgatish",teacher:"o'qituvchi",teaching:"o&#39;qitish",team:"jamoa",tell:"aytmoq",telling:"aytib berish",tells:"aytib beradi",tennis:"tennis",tense:"zamon",tenses:"zamonlar",terrifying:"dahshatli",test:"test",tests:"testlar",text:"matn",th:"Pa",their:"ularning",them:"ularni",there:"u yerda",they:"Ular",thief:"o&#39;g&#39;ri",things:"narsalar",think:"o'ylamoq",three:"uch",through:"orqali",time:"vaqt",times:"takrorlanadigan",timetable:"jadval",timetables:"jadvallar",title:"sarlavha",today:"bugun",told:"aytdi",tom:"Tom",tomorrow:"ertaga",tonight:"bugun kechqurun",too:"ham",took:"oldi",tourists:"sayyohlar",train:"poyezd",travel:"Sayohat",traveled:"sayohat qildi",traveling:"sayohat qilish",travels:"sayohatlar",true:"to'g'ri",truth:"Haqiqat",tuesday:"seshanba",tv:"TV",twenty:"yigirma",twice:"ikki marta",uk:"Buyuk Britaniya",ultimate:"yakuniy",umbrella:"soyabon",understand:"tushunish",unfounded:"asossiz",unique:"Yagona",united:"birlashgan",university:"Universitet",up:"yuqoriga",us:"biz",usa:"AQSh",usage:"foydalanish",use:"Foydalaning",used:"ishlatilgan",uses:"foydalanish",usually:"odatda",ve:"ve",verb:"fe'l",verbs:"fe'llar",very:"Juda",vi:"oltinchi",vii:"vii",viii:"viii",visiting:"tashrif buyurish",visits:"tashriflar",vs:"va.",wake:"uyg&#39;onish",waked:"uyg&#39;otdi",walked:"yurdi",walking:"yurish",walks:"yuradi",wanted:"xohlagan",warming:"isitish",wash:"yuvmoq",washed:"yuvilgan",washing:"Yuvish",wasn:"emas edi",watch:"qo'l soat",water:"suv",we:"biz",wear:"kiymoq",wears:"kiyadi",weather:"Ob-havo",week:"hafta",weekend:"dam olish kunlari",went:"ketdi",west:"Gʻarb",westminster:"Vestminster",what:"nima",when:"Qachon",where:"qayerda",which:"qaysi",while:"esa",who:"kim",why:"Nima uchun?",wild:"yovvoyi",will:"-moq",willing:"tayyor",win:"yutmoq",window:"deraza",winning:"g&#39;alaba qozonish",wiser:"donoroq",without:"holda",woke:"uyg&#39;ongan",won:"yutdi",word:"so'z",words:"so'zlar",wore:"kiygan",work:"ish",worked:"ishlagan",working:"ishlash",works:"ishlaydi",world:"Dunyo",worn:"eskirgan",would:"bo&#39;lardi",write:"yozmoq",writes:"yozadi",writing:"yozish",written:"yozilgan",wrote:"yozdi",xp:"xp",year:"yil",years:"yillar",yes:"ha",yesterday:"kecha",yet:"hali",you:"Siz",your:"sizning",youth:"Yoshlar",zero:"nol"};window.GRAMMAR_INFO={ate:"Past Simple of eat",went:"Past Simple of go",studied:"Past Simple of study",played:"Past Simple of play",bought:"Past Simple of buy",eaten:"Past Participle of eat",gone:"Past Participle of go",done:"Past Participle of do",been:"Past Participle of be",seen:"Past Participle of see",better:"Comparative of good",worse:"Comparative of bad",bigger:"Comparative of big",faster:"Comparative of fast",best:"Superlative of good",worst:"Superlative of bad",biggest:"Superlative of big",fastest:"Superlative of fast",happiest:"Superlative of happy",eating:"Present Participle / Gerund of eat",going:"Present Participle / Gerund of go",studying:"Present Participle / Gerund of study",playing:"Present Participle / Gerund of play",becoming:"Present Participle / Gerund of become",breaking:"Present Participle / Gerund of break",cooking:"Present Participle / Gerund of cook",doing:"Present Participle / Gerund of do",drinking:"Present Participle / Gerund of drink",finding:"Present Participle / Gerund of find",finishing:"Present Participle / Gerund of finish",flying:"Present Participle / Gerund of fly",getting:"Present Participle / Gerund of get",growing:"Present Participle / Gerund of grow",knowing:"Present Participle / Gerund of know",learning:"Present Participle / Gerund of learn",leaving:"Present Participle / Gerund of leave",making:"Present Participle / Gerund of make",operating:"Present Participle / Gerund of operate",reading:"Present Participle / Gerund of read",running:"Present Participle / Gerund of run",singing:"Present Participle / Gerund of sing",sitting:"Present Participle / Gerund of sit",skating:"Present Participle / Gerund of skate",sleeping:"Present Participle / Gerund of sleep",snowing:"Present Participle / Gerund of snow",speaking:"Present Participle / Gerund of speak",staying:"Present Participle / Gerund of stay",taking:"Present Participle / Gerund of take",teaching:"Present Participle / Gerund of teach",telling:"Present Participle / Gerund of tell",traveling:"Present Participle / Gerund of travel",visiting:"Present Participle / Gerund of visit",walking:"Present Participle / Gerund of walk",washing:"Present Participle / Gerund of wash",watching:"Present Participle / Gerund of watch",working:"Present Participle / Gerund of work",writing:"Present Participle / Gerund of write",eats:"3rd person singular of eat",goes:"3rd person singular of go",studies:"3rd person singular of study",plays:"3rd person singular of play",becomes:"3rd person singular of become",breaks:"3rd person singular of break",boils:"3rd person singular of boil",comes:"3rd person singular of come",does:"3rd person singular of do",exists:"3rd person singular of exist",finishes:"3rd person singular of finish",focuses:"3rd person singular of focus",freezes:"3rd person singular of freeze",gets:"3rd person singular of get",happens:"3rd person singular of happen",knows:"3rd person singular of know",learns:"3rd person singular of learn",leaves:"3rd person singular of leave",makes:"3rd person singular of make",meets:"3rd person singular of meet",operates:"3rd person singular of operate",predicts:"3rd person singular of predict",produces:"3rd person singular of produce",promises:"3rd person singular of promise",pulls:"3rd person singular of pull",rains:"3rd person singular of rain",reads:"3rd person singular of read",rises:"3rd person singular of rise",runs:"3rd person singular of run",says:"3rd person singular of say",seeks:"3rd person singular of seek",seems:"3rd person singular of seem",shines:"3rd person singular of shine",sings:"3rd person singular of sing",sleeps:"3rd person singular of sleep",snows:"3rd person singular of snow",speaks:"3rd person singular of speak",starts:"3rd person singular of start",stays:"3rd person singular of stay",tells:"3rd person singular of tell",travels:"3rd person singular of travel",uses:"3rd person singular of use",visits:"3rd person singular of visit",walks:"3rd person singular of walk",wears:"3rd person singular of wear",writes:"3rd person singular of write"};(function(){const i=document.getElementById("sidebar-toggle"),t=document.getElementById("sidebar");if(i&&t){i.addEventListener("click",()=>{t.classList.toggle("open"),i.classList.toggle("active")});const o=document.createElement("div");o.className="sidebar-resizer",t.appendChild(o);let l=!1;if(o.addEventListener("mousedown",p=>{l=!0,o.classList.add("active"),document.body.style.cursor="col-resize",document.body.style.userSelect="none"}),document.addEventListener("mousemove",p=>{if(!l)return;const f=p.clientX;f>200&&f<600&&(t.style.width=`${f}px`,document.documentElement.style.setProperty("--sidebar-width",`${f}px`))}),document.addEventListener("mouseup",()=>{l=!1,o.classList.remove("active"),document.body.style.cursor="default",document.body.style.userSelect="auto"}),t.querySelector(".sidebar-content")){let p=!1,f,h;t.addEventListener("mousedown",g=>{g.target!==o&&(p=!0,t.classList.add("grabbing"),f=g.pageY-t.offsetTop,h=t.scrollTop)}),t.addEventListener("mouseleave",()=>{p=!1,t.classList.remove("grabbing")}),t.addEventListener("mouseup",()=>{p=!1,t.classList.remove("grabbing")}),t.addEventListener("mousemove",g=>{if(!p)return;g.preventDefault();const y=(g.pageY-t.offsetTop-f)*2;t.scrollTop=h-y})}}document.querySelectorAll(".level-header").forEach(o=>{const l=o.getAttribute("data-level"),d=document.querySelector(`.level-topics[data-level="${l}"]`);l==="basics"&&(o.classList.add("active"),d.classList.add("expanded")),o.addEventListener("click",()=>{o.classList.contains("active")?(o.classList.remove("active"),d.classList.remove("expanded")):(o.classList.add("active"),d.classList.add("expanded"))})});function s(){const o=window.location.hash;document.querySelectorAll(".topic-link").forEach(d=>{if(d.getAttribute("href")===o){d.classList.add("active");const p=d.closest(".level-topics"),f=p.getAttribute("data-level");document.querySelector(`.level-header[data-level="${f}"]`).classList.add("active"),p.classList.add("expanded")}else d.classList.remove("active")})}window.addEventListener("hashchange",s),s();const n=document.getElementById("dict-toggle-top"),a=document.getElementById("dict-toggle");n&&a&&(n.checked=a.checked,n.addEventListener("change",()=>{a.checked=n.checked,a.dispatchEvent(new Event("change"))}),a.addEventListener("change",()=>{n.checked=a.checked}));function r(){const o=document.querySelectorAll(".topic-link"),l=document.querySelectorAll(".topic-status.complete"),d=o.length,p=l.length,f=d>0?Math.round(p/d*100):0,h=document.querySelector(".progress-text"),g=document.querySelector(".progress-ring");if(h&&(h.textContent=`${f}%`),g){const y=2*Math.PI*16,m=y-f/100*y;g.style.strokeDashoffset=m}["basics","core","advanced"].forEach(y=>{const m=document.querySelectorAll(`.level-topics[data-level="${y}"] .topic-link`),k=document.querySelectorAll(`.level-topics[data-level="${y}"] .topic-status.complete`),b=document.querySelector(`.level-header[data-level="${y}"] .level-progress`);b&&(b.textContent=`${k.length}/${m.length}`)})}r();const c=document.getElementById("search-input");c&&c.addEventListener("input",o=>{const l=o.target.value.toLowerCase(),d=document.querySelectorAll(".topic-link");if(l.length===0){d.forEach(p=>{p.style.display="flex"});return}d.forEach(p=>{if(p.querySelector(".topic-name").textContent.toLowerCase().includes(l)){p.style.display="flex";const h=p.closest(".level-topics"),g=h.getAttribute("data-level");document.querySelector(`.level-header[data-level="${g}"]`).classList.add("active"),h.classList.add("expanded")}else p.style.display="none"})}),document.querySelectorAll(".topic-link").forEach(o=>{o.addEventListener("click",()=>{window.innerWidth<=768&&(t.classList.remove("open"),i.classList.remove("active"))})}),window.updateLayoutProgress=r})();(function(){class i{constructor(e,s={}){this.questions=e,this.currentIndex=0,this.userAnswers=[],this.score=0,this.passThreshold=s.passThreshold||70,this.showExplanations=s.showExplanations!==!1,this.allowRetry=s.allowRetry!==!1,this.onComplete=s.onComplete||null,this.isComplete=!1,this.container=null}init(e){if(this.container=document.getElementById(e),!this.container){console.error(`Container ${e} not found`);return}this.render()}render(){if(!this.container)return;const e=this.questions[this.currentIndex],s=this.currentIndex+1,n=this.questions.length;this.container.innerHTML=`
                <div class="quiz-question">
                    <div class="quiz-progress">
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width: ${s/n*100}%"></div>
                        </div>
                        <div class="quiz-progress-text">Question ${s} of ${n}</div>
                    </div>
                    
                    <div class="quiz-question-content">
                        ${this.renderQuestion(e)}
                    </div>
                    
                    <div id="quiz-feedback" class="quiz-feedback"></div>
                    
                    <div class="quiz-actions">
                        ${this.renderActions()}
                    </div>
                </div>
            `,this.attachEventListeners()}renderQuestion(e){return e.type==="fill-blank"?this.renderFillBlank(e):this.renderMultipleChoice(e)}renderMultipleChoice(e){const s=e.options.map((n,a)=>`
                <button class="quiz-option" data-index="${a}">
                    <span class="option-letter">${String.fromCharCode(65+a)}</span>
                    <span class="option-text">${n}</span>
                </button>
            `).join("");return`
                <h3 class="quiz-question-text">${e.question}</h3>
                ${e.hint?`<p class="quiz-hint">💡 ${e.hint}</p>`:""}
                <div class="quiz-options">
                    ${s}
                </div>
            `}renderFillBlank(e){return`
                <h3 class="quiz-question-text">${e.question}</h3>
                ${e.hint?`<p class="quiz-hint">💡 ${e.hint}</p>`:""}
                <div class="quiz-fill-blank">
                    <input 
                        type="text" 
                        class="quiz-input" 
                        id="quiz-answer-input"
                        placeholder="Type your answer..."
                        autocomplete="off"
                    >
                </div>
            `}renderActions(){const e=this.userAnswers[this.currentIndex]!==void 0,s=this.currentIndex===this.questions.length-1;return e?s?`
                        <button class="quiz-btn quiz-btn-success" id="quiz-finish-btn">
                            See Results
                        </button>
                    `:`
                        <button class="quiz-btn quiz-btn-primary" id="quiz-next-btn">
                            Next Question →
                        </button>
                    `:`
                    <button class="quiz-btn quiz-btn-primary" id="quiz-check-btn" disabled>
                        Check Answer
                    </button>
                `}attachEventListeners(){if(this.questions[this.currentIndex].type==="fill-blank"){const r=document.getElementById("quiz-answer-input");r&&(r.addEventListener("input",()=>this.onInputChange()),r.addEventListener("keypress",c=>{c.key==="Enter"&&this.checkAnswer()}),r.focus())}else this.container.querySelectorAll(".quiz-option").forEach(c=>{c.addEventListener("click",()=>this.selectOption(c))});const s=document.getElementById("quiz-check-btn");s&&s.addEventListener("click",()=>this.checkAnswer());const n=document.getElementById("quiz-next-btn");n&&n.addEventListener("click",()=>this.nextQuestion());const a=document.getElementById("quiz-finish-btn");a&&a.addEventListener("click",()=>this.finish())}onInputChange(){const e=document.getElementById("quiz-answer-input"),s=document.getElementById("quiz-check-btn");e&&s&&(s.disabled=e.value.trim().length===0)}selectOption(e){this.container.querySelectorAll(".quiz-option").forEach(a=>a.classList.remove("selected")),e.classList.add("selected");const n=document.getElementById("quiz-check-btn");n&&(n.disabled=!1)}checkAnswer(){const e=this.questions[this.currentIndex];let s,n;if(e.type==="fill-blank"){const r=document.getElementById("quiz-answer-input");s=r.value.trim().toLowerCase(),n=(Array.isArray(e.correct)?e.correct:[e.correct]).some(u=>u.toLowerCase()===s),r.disabled=!0}else{const r=this.container.querySelector(".quiz-option.selected");if(!r)return;s=parseInt(r.getAttribute("data-index")),n=s===e.correct,this.container.querySelectorAll(".quiz-option").forEach((u,o)=>{u.disabled=!0,o===e.correct?u.classList.add("correct"):o===s&&!n&&u.classList.add("incorrect")})}this.userAnswers[this.currentIndex]={answer:s,correct:n},n&&this.score++,this.showFeedback(n,e);const a=this.container.querySelector(".quiz-actions");a&&(a.innerHTML=this.renderActions(),this.attachEventListeners())}showFeedback(e,s){const n=document.getElementById("quiz-feedback");if(!n)return;const a=e?this.getPositiveFeedback():this.getEncouragingFeedback();n.className=`quiz-feedback ${e?"correct":"incorrect"}`,n.innerHTML=`
                <div class="feedback-icon">${e?"✅":"💡"}</div>
                <div class="feedback-content">
                    <div class="feedback-title">${a}</div>
                    ${this.showExplanations?`<div class="feedback-explanation">${s.explanation}</div>`:""}
                </div>
            `,n.style.display="flex"}getPositiveFeedback(){const e=["Excellent!","Perfect!","Well done!","Great job!","Correct!","You got it!","Brilliant!","Fantastic!"];return e[Math.floor(Math.random()*e.length)]}getEncouragingFeedback(){const e=["Not quite, but you're learning!","Good try! Here's why:","Almost there! Let's see:","Keep going! Here's the key:","Learning moment!","Good effort! Here's the answer:"];return e[Math.floor(Math.random()*e.length)]}nextQuestion(){this.currentIndex<this.questions.length-1&&(this.currentIndex++,this.render())}finish(){this.isComplete=!0;const e=Math.round(this.score/this.questions.length*100),s=e>=this.passThreshold;this.container.innerHTML=`
                <div class="quiz-results">
                    <div class="results-icon">${s?"🎉":"📚"}</div>
                    <h2 class="results-title">${s?"Congratulations!":"Keep Practicing!"}</h2>
                    <div class="results-score">
                        <div class="score-circle">
                            <svg width="120" height="120">
                                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" stroke-width="8" fill="none"/>
                                <circle cx="60" cy="60" r="50" stroke="${s?"#10b981":"#facc15"}" stroke-width="8" fill="none" 
                                        stroke-dasharray="314" stroke-dashoffset="${314-e/100*314}" 
                                        transform="rotate(-90 60 60)" class="score-ring"/>
                            </svg>
                            <div class="score-text">${e}%</div>
                        </div>
                        <p class="score-detail">${this.score} out of ${this.questions.length} correct</p>
                    </div>
                    
                    <div class="results-message">
                        ${this.getResultsMessage(s,e)}
                    </div>
                    
                    <div class="results-actions">
                        ${this.allowRetry&&!s?`
                            <button class="quiz-btn quiz-btn-secondary" id="quiz-retry-btn">
                                🔄 Try Again
                            </button>
                        `:""}
                        ${s?`
                            <button class="quiz-btn quiz-btn-success" id="quiz-continue-btn">
                                Continue Learning →
                            </button>
                        `:""}
                    </div>
                </div>
            `;const n=document.getElementById("quiz-retry-btn");n&&n.addEventListener("click",()=>this.retry()),this.onComplete&&this.onComplete({score:this.score,total:this.questions.length,percentage:e,passed:s})}getResultsMessage(e,s){return s===100?"<p>Perfect score! You've mastered this topic! 🌟</p>":e?"<p>Great work! You've demonstrated a solid understanding of this topic.</p>":`<p>You need ${this.passThreshold}% to pass. Review the material and try again!</p>`}retry(){this.currentIndex=0,this.userAnswers=[],this.score=0,this.isComplete=!1,this.render()}getProgress(){return{currentQuestion:this.currentIndex+1,totalQuestions:this.questions.length,score:this.score,percentage:Math.round(this.score/this.questions.length*100)}}}window.QuizEngine=i})();(function(){window.TopicLoader={currentTopic:null,currentQuestionIndex:0,userAnswers:[],async loadTopic(t){try{let e=null;window.LessonIndex&&window.LessonIndex[t]&&(e=window.LessonIndex[t].file);let s;if(e?s=await fetch(e):(s=await fetch(`data/topics/${t}.json`),s.ok||(s=await fetch(`data/lessons/${t}.json`))),!s.ok)throw new Error(`Topic not found: ${t}`);const n=await s.json();this.currentTopic=n,n.step_1_context?this.renderLesson(n):this.renderTopic(n),this.updateSidebarActive(t),window.scrollTo(0,0)}catch(e){console.error("Error loading topic:",e),window.location.protocol==="file:"?this.renderError("⚠️ You must use a local server (e.g., VS Code Live Server) to run this site. Opening files directly in the browser will not work."):this.renderError(e.message)}},renderLesson(t){const e=document.getElementById("main-content");e&&(window.LessonRenderer?(e.innerHTML='<div id="lesson-container"></div>',window.LessonRenderer.render(t,"lesson-container")):(console.error("LessonRenderer not found!"),e.innerHTML="<p>Error: Lesson renderer not loaded.</p>"))},initQuiz(t){console.log("[TopicLoader] initQuiz called for topic:",t.id);const e=t.practice&&t.practice.questions;if(console.log("[TopicLoader] Questions found:",e?e.length:0),!window.QuizEngine){console.error("[TopicLoader] QuizEngine not found on window!");return}if(!e||e.length===0){console.log("[TopicLoader] No quiz data found for topic:",t.id);return}const s=document.getElementById("quiz-container");if(console.log("[TopicLoader] Quiz container found:",!!s),!s){console.error("[TopicLoader] Quiz container not found");return}console.log("[TopicLoader] Creating QuizEngine with",e.length,"questions");const n=new QuizEngine(e,{onComplete:a=>{this.handleQuizCompletion(t,a)}});console.log("[TopicLoader] QuizEngine created, calling init()"),n.init("quiz-container"),console.log("[TopicLoader] Quiz initialization complete")},handleQuizCompletion(t,e){const s=e.score,n=e.total,a=e.percentage,r=e.passed;if(window.ProgressManager){const c=window.ProgressManager.markTopicComplete(t.id,s,n);window.RoadmapLoader&&window.RoadmapLoader.updateProgress(),r&&this.showCelebration(t,a,c)}},showCelebration(t,e,s){this.createConfetti();const n=document.createElement("div");n.className="celebration-modal";const a=s.attempts.length===1,r=e===s.bestScore;let c="";a?c=`🎉 Congratulations! You've completed ${t.title}!`:r&&s.attempts.length>1?c="🌟 New Best Score! You're improving!":c="✅ Great work! Keep practicing!";const u=window.ProgressManager.getStats(),o=window.ProgressManager.getMilestoneMessage(u.percentage);n.innerHTML=`
                <h2>${c}</h2>
                <div class="celebration-score">${e}%</div>
                <p>${o}</p>
                <div class="celebration-actions">
                    <button class="celebration-btn primary" onclick="this.closest('.celebration-modal').remove()">
                        Continue Learning →
                    </button>
                    <button class="celebration-btn secondary" onclick="location.reload()">
                        🔄 Retake Quiz
                    </button>
                </div>
            `,document.body.appendChild(n),setTimeout(()=>{n.parentElement&&n.remove()},1e4)},createConfetti(){const t=document.createElement("div");t.className="confetti-container",document.body.appendChild(t);for(let e=0;e<50;e++){const s=document.createElement("div");s.className="confetti",s.style.left=Math.random()*100+"%",s.style.animationDelay=Math.random()*.5+"s",t.appendChild(s)}setTimeout(()=>{t.remove()},3500)},renderTopic(t){const e=document.getElementById("main-content");e&&(e.innerHTML=`
                <div class="topic-page">
                    ${this.renderBreadcrumb(t)}
                    ${this.renderHeader(t)}
                    ${this.renderIntro(t)}
                    ${this.renderWhenToUse(t)}
                    ${this.renderForms(t)}
                    ${this.renderAdverbs(t)}
                    ${this.renderMistakes(t)}
                    ${this.renderPractice(t)}
                    ${this.renderFooter(t)}
                </div>
            `,setTimeout(()=>{this.initQuiz(t)},100))},renderBreadcrumb(t){const e={basics:"Level 1: Basics",core:"Level 2: Core",advanced:"Level 3: Advanced"};return`
                <nav class="breadcrumb">
                    <a href="#/">Home</a>
                    <span class="breadcrumb-separator">›</span>
                    <a href="#/roadmap">Grammar Roadmap</a>
                    <span class="breadcrumb-separator">›</span>
                    <a href="#/roadmap/${t.level}">${e[t.level]||t.level}</a>
                    <span class="breadcrumb-separator">›</span>
                    <span class="breadcrumb-current">${t.title}</span>
                </nav>
            `},renderHeader(t){return`
                <header class="topic-header">
                    <h1 class="topic-title">${t.title}</h1>
                    <p class="topic-goal">${t.summary}</p>
                    <div class="topic-meta">
                        <span class="meta-item">
                            <span>⏱️</span>
                            <span>${t.estimated_time||"15 min"}</span>
                        </span>
                        <span class="meta-item">
                            <span>📘</span>
                            <span>${t.level}</span>
                        </span>
                    </div>
                </header>
            `},renderIntro(t){if(!t.examples||t.examples.length===0)return"";const e=t.examples[0];return`
                <section class="intro-section">
                    <div class="intro-example">${e.sentence}</div>
                    <div class="intro-explanation">
                        <strong>Translation:</strong> ${e.translation_uz}<br>
                        ${e.note?`<em>${e.note}</em>`:""}
                    </div>
                </section>
            `},renderRule(t){return t.rule?`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">📐</span>
                        <span>The Rule</span>
                    </h2>
                    <div class="rule-card">
                        <span class="rule-label">Grammar Rule</span>
                        <p class="rule-text">${t.rule.text}</p>
                        ${t.rule.visual?`<div class="rule-formula">${t.rule.visual}</div>`:""}
                    </div>
                </section>
            `:""},renderExamples(t){return!t.examples||t.examples.length===0?"":`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">✅</span>
                        <span>Examples</span>
                    </h2>
                    <div class="examples-grid">
                        ${t.examples.map(s=>`
                <div class="example-card">
                    <div class="example-sentence">${s.sentence}</div>
                    <div class="example-translation">${s.translation_uz}</div>
                    ${s.note?`<div class="example-note">💡 ${s.note}</div>`:""}
                </div>
            `).join("")}
                    </div>
                </section>
            `},renderMistakes(t){return!t.common_mistakes||t.common_mistakes.length===0?"":`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">⚠️</span>
                        <span>Common Mistakes</span>
                    </h2>
                    <div class="mistakes-grid">
                        ${t.common_mistakes.map(s=>`
                <div class="mistake-card">
                    <div class="mistake-comparison">
                        <div class="mistake-wrong">
                            <div class="mistake-wrong-label">❌ Wrong</div>
                            <div class="mistake-wrong-text">${s.wrong}</div>
                        </div>
                        <div class="mistake-arrow">→</div>
                        <div class="mistake-right">
                            <div class="mistake-right-label">✅ Right</div>
                            <div class="mistake-right-text">${s.right}</div>
                        </div>
                    </div>
                    <div class="mistake-explanation">${s.explanation}</div>
                </div>
            `).join("")}
                    </div>
                </section>
            `},renderWhenToUse(t){return!t.when_to_use||t.when_to_use.length===0?"":`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">💡</span>
                        <span>When to Use</span>
                    </h2>
                    <div class="use-cases-grid">
                        ${t.when_to_use.map(s=>`
                <div class="use-case-card">
                    <h3 class="use-case-title">${s.title}</h3>
                    <p class="use-case-explanation">${s.explanation}</p>
                    <ul class="use-case-examples">
                        ${s.examples.map(n=>`<li>${n}</li>`).join("")}
                    </ul>
                </div>
            `).join("")}
                    </div>
                </section>
            `},renderForms(t){if(!t.forms)return"";let e="";return t.forms.affirmative&&(e+=this.renderFormSection(t.forms.affirmative)),t.forms.negative&&(e+=this.renderFormSection(t.forms.negative)),t.forms.question&&(e+=this.renderFormSection(t.forms.question)),e},renderFormSection(t){const e=t.examples.map(s=>`
                <div class="example-card">
                    <div class="example-sentence">${s.sentence}</div>
                    <div class="example-translation">${s.translation_uz}</div>
                    ${s.note?`<div class="example-note">💡 ${s.note}</div>`:""}
                </div>
            `).join("");return`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">${t.title.substring(0,2)}</span>
                        <span>${t.title.substring(3)}</span>
                    </h2>
                    <div class="rule-card">
                        <span class="rule-label">Rule</span>
                        <p class="rule-text">${t.rule}</p>
                        ${t.visual?`<div class="rule-formula">${t.visual}</div>`:""}
                    </div>
                    <div class="examples-grid">
                        ${e}
                    </div>
                </section>
            `},renderAdverbs(t){if(!t.adverbs_of_frequency)return"";const e=t.adverbs_of_frequency,s=e.list.map(n=>`
                <div class="adverb-card">
                    <div class="adverb-header">
                        <span class="adverb-word">${n.adverb}</span>
                        <span class="adverb-percentage">${n.percentage}</span>
                    </div>
                    <div class="adverb-example">${n.example}</div>
                    <div class="adverb-translation">${n.translation_uz}</div>
                </div>
            `).join("");return`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">⏰</span>
                        <span>${e.title}</span>
                    </h2>
                    <div class="adverbs-intro">
                        <p>${e.explanation}</p>
                        <div class="adverbs-position">
                            <strong>Position:</strong> ${e.position}
                        </div>
                    </div>
                    <div class="adverbs-grid">
                        ${s}
                    </div>
                    ${e.special_note?`
                        <div class="adverbs-note">
                            <strong>⚠️ Special Note:</strong> ${e.special_note}
                        </div>
                    `:""}
                </section>
            `},renderPractice(t){return!t.practice||!t.practice.questions?"":`
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">✍️</span>
                        <span>Quick Practice</span>
                    </h2>
                    <div id="quiz-container"></div>
                </section>
            `},renderFooter(t){return`
                <footer class="topic-footer">
            <div class="completion-status">
                <div class="completion-icon">🎯</div>
                <div class="completion-text">
                    <h3>Great work!</h3>
                    <p>Complete the practice to mark this topic as done</p>
                </div>
            </div>
                    ${t.next_topic?`
                        <a href="#/topic/${t.next_topic}" class="next-topic-link">
                            <span>Next Topic</span>
                            <span>→</span>
                        </a>
                    `:""}
                </footer>
        `},initializePractice(){if(!this.currentTopic.practice||!this.currentTopic.practice.questions)return;this.currentQuestionIndex=0,this.userAnswers=[],this.renderQuestion();const t=document.getElementById("check-answer"),e=document.getElementById("next-question");t&&t.addEventListener("click",()=>this.checkAnswer()),e&&e.addEventListener("click",()=>this.nextQuestion())},renderQuestion(){const t=document.getElementById("practice-container");if(!t)return;const e=this.currentTopic.practice.questions,s=e[this.currentQuestionIndex],n=s.options.map((r,c)=>`
        < button class="option-button" data - index="${c}" >
            ${r}
                </button >
        `).join("");t.innerHTML=`
        < div class="practice-question" >
                    <div class="question-number">Question ${this.currentQuestionIndex+1} of ${e.length}</div>
                    <div class="question-text">${s.question}</div>
                    <div class="question-options">
                        ${n}
                    </div>
                    <div id="question-feedback"></div>
                </div >
        `,t.querySelectorAll(".option-button").forEach(r=>{r.addEventListener("click",()=>this.selectOption(r))})},selectOption(t){document.getElementById("practice-container").querySelectorAll(".option-button").forEach(a=>a.classList.remove("selected")),t.classList.add("selected");const n=document.getElementById("check-answer");n&&(n.disabled=!1)},checkAnswer(){const t=document.getElementById("practice-container"),e=t.querySelector(".option-button.selected");if(!e)return;const s=parseInt(e.getAttribute("data-index")),n=this.currentTopic.practice.questions[this.currentQuestionIndex],a=s===n.correct;this.userAnswers.push(a),t.querySelectorAll(".option-button").forEach((l,d)=>{l.disabled=!0,d===n.correct?l.classList.add("correct"):d===s&&!a&&l.classList.add("incorrect")});const c=document.getElementById("question-feedback");c.className=`question - feedback ${a?"feedback-correct":"feedback-incorrect"} `,c.innerHTML=`
        < strong > ${a?"✅ Correct!":"❌ Incorrect"}</strong > <br>
            ${n.explanation}
            `,this.updateScore();const u=document.getElementById("check-answer"),o=document.getElementById("next-question");u.style.display="none",this.currentQuestionIndex<this.currentTopic.practice.questions.length-1?o.style.display="block":this.finishPractice()},nextQuestion(){this.currentQuestionIndex++,this.renderQuestion();const t=document.getElementById("check-answer"),e=document.getElementById("next-question");t.style.display="block",t.disabled=!0,e.style.display="none"},updateScore(){const t=document.getElementById("practice-score");if(t){const e=this.userAnswers.filter(n=>n).length,s=this.currentTopic.practice.questions.length;t.textContent=`${e}/${s}`}},finishPractice(){const t=this.userAnswers.filter(a=>a).length,e=this.currentTopic.practice.questions.length,s=Math.round(t/e*100);s>=70&&this.markTopicComplete(this.currentTopic.id);const n=document.getElementById("next-question");n.textContent=s>=70?"🎉 Practice Complete!":"🔄 Try Again",n.style.display="block",s>=70?n.onclick=()=>{this.currentTopic.next_topic&&(window.location.hash=`#/topic/${this.currentTopic.next_topic}`)}:n.onclick=()=>{this.currentQuestionIndex=0,this.userAnswers=[],this.renderQuestion(),document.getElementById("check-answer").style.display="block",n.style.display="none"}},markTopicComplete(t){let e=JSON.parse(localStorage.getItem("completedTopics")||"[]");e.includes(t)||(e.push(t),localStorage.setItem("completedTopics",JSON.stringify(e)),this.updateCompletionUI(t),window.updateLayoutProgress&&window.updateLayoutProgress())},updateCompletionUI(t){const e=document.querySelector(`.topic-link[href="#/topic/${t}"]`);if(e){const s=e.querySelector(".topic-status");s&&(s.textContent="✓",s.classList.remove("incomplete"),s.classList.add("complete"))}},updateSidebarActive(t){document.querySelectorAll(".topic-link").forEach(s=>{s.getAttribute("href")===`#/topic/${t}`?s.classList.add("active"):s.classList.remove("active")})},renderError(t){const e=document.getElementById("main-content");e&&(e.innerHTML=`
            <div class="topic-page">
                <div style="text-align: center; padding: 4rem 2rem;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">😕</h1>
                    <h2>Topic Not Found</h2>
                    <p style="color: var(--text-muted); margin: 1rem 0 2rem 0;">${t}</p>
                    <a href="#/" class="cta-button">Go Home</a>
                </div>
            </div>
            `)}},JSON.parse(localStorage.getItem("completedTopics")||"[]").forEach(t=>{window.TopicLoader&&window.TopicLoader.updateCompletionUI(t)})})();(function(){const i="grammarDailyPractice",t="data/quizzes.json";window.DailyPractice={allQuestions:[],quizzes:null,async init(){return await this.loadQuizzes(),this},async loadQuizzes(){if(this.quizzes)return this.quizzes;try{const s=await(await fetch(t)).json();return this.quizzes=s.quizzes,this.allQuestions=[],this.quizzes.forEach(n=>{n.questions.forEach(a=>{this.allQuestions.push({...a,topicId:n.topic,quizId:n.id})})}),this.quizzes}catch(e){return console.error("Failed to load quizzes:",e),null}},async getQuestions(e=5){if(await this.init(),this.allQuestions.length===0)return console.error("No questions available"),[];const s=this.getWeightedQuestions(),n=this.weightedShuffle(s);return n.slice(0,Math.min(e,n.length))},async getMixedQuestions(e=10){if(await this.init(),this.allQuestions.length===0)return[];const s=[...this.allQuestions].sort(()=>Math.random()-.5);return s.slice(0,Math.min(e,s.length))},getWeightedQuestions(){const e=[];return this.allQuestions.forEach(s=>{let n=50;if(window.ProgressManager){const a=window.ProgressManager.getTopicStatus(s.topicId);a.bestScore>0?n=Math.max(10,100-a.bestScore):n=60}e.push({question:s,weight:n})}),e},weightedShuffle(e){let s=e.reduce((r,c)=>r+c.weight,0);const n=[],a=[...e];for(;a.length>0&&n.length<a.length;){let r=Math.random()*s,c=0;for(let u=0;u<a.length;u++)if(c+=a[u].weight,r<=c){n.push(a[u].question),s-=a[u].weight,a.splice(u,1);break}}return n},getData(){const e={lastCompleted:null,streak:0,history:[]},s=localStorage.getItem(i);if(!s)return e;try{return JSON.parse(s)}catch{return e}},saveData(e){localStorage.setItem(i,JSON.stringify(e))},isCompletedToday(){const e=this.getData();if(!e.lastCompleted)return!1;const s=new Date().toDateString(),n=new Date(e.lastCompleted).toDateString();return s===n},markCompleted(e,s){const n=this.getData(),a=new Date,r=a.toISOString();if(n.lastCompleted){const c=new Date(n.lastCompleted),u=Math.floor((a-c)/(1e3*60*60*24));if(u===0){const o=n.history.find(l=>new Date(l.date).toDateString()===a.toDateString());o&&e>o.score&&(o.score=e)}else u===1?(n.streak++,n.history.unshift({date:r,score:e,total:s})):(n.streak=1,n.history.unshift({date:r,score:e,total:s}))}else n.streak=1,n.history.unshift({date:r,score:e,total:s});return n.lastCompleted=r,n.history=n.history.slice(0,30),this.saveData(n),n},getStreak(){const e=this.getData();if(e.lastCompleted){const s=new Date(e.lastCompleted);if(Math.floor((new Date-s)/(1e3*60*60*24))>1)return 0}return e.streak},getStreakMessage(e){return e>=30?"🏆 30-day streak! You're unstoppable!":e>=14?"⭐ 2-week streak! Amazing dedication!":e>=7?"🔥 1-week streak! Keep it up!":e>=3?"💪 3-day streak! You're building a habit!":e>=1?"✨ Great start! Come back tomorrow!":"👋 Start your daily practice streak!"},getTodaySummary(){const e=this.getData();return this.isCompletedToday()?e.history.find(n=>new Date(n.date).toDateString()===new Date().toDateString()):null}}})();(function(){const i="grammarAchievements",t={firstQuiz:{id:"first-quiz",name:"First Steps",icon:"🎯",desc:"Complete your first quiz",color:"#10b981"},perfectScore:{id:"perfect-score",name:"Perfectionist",icon:"💯",desc:"Score 100% on any quiz",color:"#f59e0b"},fiveQuizzes:{id:"five-quizzes",name:"Getting Started",icon:"📚",desc:"Complete 5 quizzes",color:"#3b82f6"},weekStreak:{id:"week-streak",name:"Dedicated",icon:"🔥",desc:"7-day practice streak",color:"#ef4444"},monthStreak:{id:"month-streak",name:"Unstoppable",icon:"🏆",desc:"30-day practice streak",color:"#8b5cf6"},dailyChamp:{id:"daily-champ",name:"Daily Champion",icon:"⚡",desc:"Complete daily practice 10 times",color:"#06b6d4"},speedster:{id:"speedster",name:"Speedster",icon:"🚀",desc:"Complete a quiz in under 1 minute",color:"#ec4899"},consistent:{id:"consistent",name:"Consistent",icon:"📈",desc:"Score 80%+ on 10 quizzes",color:"#14b8a6"}};window.Achievements={badges:t,getUnlocked(){const e=localStorage.getItem(i);if(!e)return[];try{return JSON.parse(e)}catch{return[]}},save(e){localStorage.setItem(i,JSON.stringify(e))},isUnlocked(e){return this.getUnlocked().includes(e)},unlock(e){if(this.isUnlocked(e))return!1;const s=this.getUnlocked();s.push(e),this.save(s);const n=Object.values(t).find(a=>a.id===e);return n&&this.showToast(n),!0},showToast(e){const s=document.querySelector(".achievement-toast");s&&s.remove();const n=document.createElement("div");n.className="achievement-toast fade-in-up",n.innerHTML=`
                <div class="toast-icon" style="background: ${e.color}">${e.icon}</div>
                <div class="toast-content">
                    <div class="toast-title">Achievement Unlocked!</div>
                    <div class="toast-name">${e.name}</div>
                    <div class="toast-desc">${e.desc}</div>
                </div>
            `,document.body.appendChild(n),setTimeout(()=>{n.classList.add("fade-out"),setTimeout(()=>n.remove(),300)},4e3)},checkAchievements(e){e.totalQuizzes>=1&&this.unlock("first-quiz"),e.totalQuizzes>=5&&this.unlock("five-quizzes"),e.lastScore===100&&this.unlock("perfect-score"),e.streak>=7&&this.unlock("week-streak"),e.streak>=30&&this.unlock("month-streak"),e.dailyCompletions>=10&&this.unlock("daily-champ"),e.highScoreCount>=10&&this.unlock("consistent"),e.fastestQuiz&&e.fastestQuiz<60&&this.unlock("speedster")},renderBadges(){const e=this.getUnlocked();return e.length===0?"":`
                <div class="badges-section">
                    <h3 class="badges-title">Your Achievements</h3>
                    <div class="badges-grid">
                        ${Object.values(t).map(n=>{const a=e.includes(n.id);return`
                    <div class="badge ${a?"unlocked":"locked"}" 
                         title="${n.name}: ${n.desc}">
                        <span class="badge-icon" ${a?`style="background: ${n.color}"`:""}>
                            ${a?n.icon:"🔒"}
                        </span>
                    </div>
                `}).join("")}
                    </div>
                </div>
            `},getStats(){const e={totalQuizzes:0,lastScore:0,streak:0,dailyCompletions:0,highScoreCount:0,fastestQuiz:null};if(window.ProgressManager){const s=window.ProgressManager.getProgress();e.totalQuizzes=Object.keys(s.topicAttempts||{}).length,Object.values(s.topicAttempts||{}).forEach(n=>{n.bestScore>=80&&e.highScoreCount++,n.bestScore===100&&(e.lastScore=100)})}if(window.DailyPractice){const s=window.DailyPractice.getData();e.streak=window.DailyPractice.getStreak(),e.dailyCompletions=(s.history||[]).length}return e},init(){const e=this.getStats();this.checkAchievements(e)}},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>window.Achievements.init(),500)}):setTimeout(()=>window.Achievements.init(),500)})();window.LessonIndex={"present-simple":{file:"data/lessons/present-simple.json",title:"Present Simple",level:"Beginner",icon:"🌅"},"past-simple":{file:"data/lessons/past-simple.json",title:"Past Simple",level:"Beginner",icon:"📜"},"present-continuous":{file:"data/lessons/present-continuous.json",title:"Present Continuous",level:"Beginner",icon:"🏃"},"future-simple":{file:"data/lessons/future-simple.json",title:"Future Simple",level:"Beginner",icon:"🚀"},articles:{file:"data/lessons/articles.json",title:"Articles: A, An, The",level:"Beginner",icon:"🅰️"},"be-verb":{file:"data/lessons/be-verb.json",title:"Be Verb: Am, Is, Are",level:"Beginner",icon:"👤"},"there-is-are":{file:"data/lessons/there-is-are.json",title:"There Is & There Are",level:"Beginner",icon:"🏠"},possessives:{file:"data/lessons/possessives.json",title:"Possessives: My, Your, His, Her",level:"Beginner",icon:"🔑"},prepositions:{file:"data/lessons/prepositions.json",title:"Prepositions: In, On, At",level:"Beginner",icon:"📍"},comparatives:{file:"data/lessons/comparatives.json",title:"Comparatives: Bigger, Better",level:"Beginner",icon:"⚖️"},superlatives:{file:"data/lessons/superlatives.json",title:"Superlatives: The Biggest, The Best",level:"Beginner",icon:"🏆"},"modal-can-could":{file:"data/lessons/modal-can-could.json",title:"Modal Verbs: Can & Could",level:"Beginner",icon:"⚡"},"past-continuous":{file:"data/lessons/past-continuous.json",title:"Past Continuous",level:"Intermediate",icon:"⏳"},"present-perfect":{file:"data/lessons/present-perfect.json",title:"Present Perfect",level:"Intermediate",icon:"✔️"},"future-continuous":{file:"data/lessons/future-continuous.json",title:"Future Continuous",level:"Intermediate",icon:"🔮"},"past-perfect":{file:"data/lessons/past-perfect.json",title:"Past Perfect",level:"Intermediate",icon:"🕰️"},"going-to-vs-will":{file:"data/lessons/going-to-vs-will.json",title:"Going to vs Will",level:"Intermediate",icon:"🎯"},"modal-should":{file:"data/lessons/modal-should.json",title:"Modal Verbs: Should & Ought to",level:"Intermediate",icon:"💡"},"modal-must":{file:"data/lessons/modal-must.json",title:"Modal Verbs: Must & Have to",level:"Intermediate",icon:"🚨"},"modal-might-may":{file:"data/lessons/modal-might-may.json",title:"Modal Verbs: Might & May",level:"Intermediate",icon:"🤔"},"modal-would":{file:"data/lessons/modal-would.json",title:"Modal Verbs: Would",level:"Intermediate",icon:"🎭"},"modal-perfect":{file:"data/lessons/modal-perfect.json",title:"Modal Perfect",level:"Intermediate",icon:"🔍"},"wh-questions":{file:"data/lessons/wh-questions.json",title:"Wh-Questions",level:"Intermediate",icon:"❓"},"yes-no-questions":{file:"data/lessons/yes-no-questions.json",title:"Yes/No Questions",level:"Intermediate",icon:"✅"},"question-tags":{file:"data/lessons/question-tags.json",title:"Question Tags",level:"Intermediate",icon:"🏷️"},conjunctions:{file:"data/lessons/conjunctions.json",title:"Conjunctions",level:"Intermediate",icon:"🔗"},"relative-clauses":{file:"data/lessons/relative-clauses.json",title:"Relative Clauses",level:"Intermediate",icon:"🧩"},"passive-voice":{file:"data/lessons/passive-voice.json",title:"Passive Voice",level:"Intermediate",icon:"🔄"},"reported-speech":{file:"data/lessons/reported-speech.json",title:"Reported Speech",level:"Intermediate",icon:"💬"},"countable-uncountable":{file:"data/lessons/countable-uncountable.json",title:"Countable vs Uncountable Nouns",level:"Intermediate",icon:"🔢"},quantifiers:{file:"data/lessons/quantifiers.json",title:"Quantifiers",level:"Intermediate",icon:"📊"},"first-conditional":{file:"data/lessons/first-conditional.json",title:"First Conditional",level:"Intermediate",icon:"🌦️"},"present-perfect-continuous":{file:"data/lessons/present-perfect-continuous.json",title:"Present Perfect Continuous",level:"Advanced"}};(function(){window.LessonRenderer={render(i,t){const e=document.getElementById(t);if(!e){console.error("Container not found:",t);return}e.innerHTML=`
                <div class="lesson-container fade-in">
                    ${this.renderMeta(i.meta)}
                    ${this.renderContext(i.step_1_context)}
                    ${this.renderExplanation(i.step_2_explanation)}
                    ${this.renderExercises(i.step_3_interactive_exercises)}
                    ${this.renderFooter(i)}
                </div>
            `,requestAnimationFrame(()=>{this.initializeExercises()})},renderFooter(i){return`
                <footer class="lesson-footer">
                    <div class="completion-message">
                        <div class="completion-icon">🎯</div>
                        <div class="completion-text">
                            <h3>Great work!</h3>
                            <p>You've demonstrated a solid understanding of this topic.</p>
                        </div>
                    </div>
                    <button class="continue-learning-btn" data-next-topic="${this.getNextTopic(i.meta.topic)}">
                        Continue Learning →
                    </button>
                </footer>
            `},getNextTopic(i){const t=["be-verb","present-simple","present-continuous","past-simple","future-simple","articles","there-is-are","possessives","prepositions","comparatives","superlatives","modal-can-could","past-continuous","present-perfect","future-continuous","past-perfect","going-to-vs-will","modal-should","modal-must","modal-might-may","modal-would","modal-perfect","wh-questions","yes-no-questions","question-tags","conjunctions","relative-clauses","passive-voice","reported-speech","countable-uncountable","quantifiers","first-conditional","present-perfect-continuous"],e=i.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").replace(/^-|-$/g,""),s=t.findIndex(n=>e===n);return s>=0&&s<t.length-1?t[s+1]:t[0]},renderMeta(i){return`
                <div class="lesson-meta fade-in">
                    <span class="lesson-level level-${i.level.toLowerCase()}">${i.level}</span>
                    <h1 class="lesson-title">${i.topic}</h1>
                </div>
            `},renderContext(i){return`
                <section class="lesson-section context-section slide-up" style="animation-delay: 0.1s">
                    <div class="section-header">
                        <span class="section-number">1</span>
                        <h2>Context: Explore</h2>
                    </div>
                    <div class="context-story">
                        <p>${this.highlightGrammar(i.text,i.highlight_indices)}</p>
                    </div>
                    <div class="context-hint">
                        <span class="hint-icon">🚀</span>
                        <span>Discover the patterns above. How do the highlighted words feel?</span>
                    </div>
                </section>
            `},highlightGrammar(i,t){let e=i;return t.forEach(s=>{const n=s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),a=new RegExp(`\\b${n}\\b`,"gi");e=e.replace(a,`<mark class="grammar-highlight" title="Grammar Pattern">${s}</mark>`)}),e},renderExplanation(i){const t=i.simple_rule_uz?`<p class="simple-rule-uz" style="color: #c4b5fd; font-size: 1.05em; margin-top: 1rem; background: rgba(139, 92, 246, 0.15); padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">🇺🇿 ${i.simple_rule_uz}</p>`:"",e=i.formula_uz?`<div class="formula-content-uz" style="color: #c4b5fd; font-size: 1em; margin-top: 1rem; background: rgba(139, 92, 246, 0.15); padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">🇺🇿 ${i.formula_uz}</div>`:"",s=i.common_mistake_uz?`<p style="color: #c4b5fd; font-size: 1em; margin-top: 1rem; background: rgba(139, 92, 246, 0.15); padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">🇺🇿 ${i.common_mistake_uz}</p>`:"";return`
                <section class="lesson-section explanation-section slide-up" style="animation-delay: 0.2s">
                    <div class="section-header">
                        <span class="section-number">2</span>
                        <h2>The Logic: Mastery</h2>
                    </div>
                    
                    <div class="rule-card">
                        <div class="rule-icon">💎</div>
                        <p class="simple-rule">${i.simple_rule}</p>
                        ${t}
                    </div>

                    <div class="formula-box">
                        <div class="formula-label">Golden Formula</div>
                        <div class="formula-content">${i.formula}</div>
                        ${e}
                    </div>

                    <div class="mistake-alert">
                        <div class="alert-icon">⚡</div>
                        <div class="alert-content">
                            <strong>Expert Warning:</strong>
                            <p>${i.common_mistake}</p>
                            ${s}
                        </div>
                    </div>
                </section>
            `},renderExercises(i){return`
                <section class="lesson-section exercises-section slide-up" style="animation-delay: 0.3s">
                    <div class="section-header">
                        <span class="section-number">3</span>
                        <h2>Challenge: Prove Your Mastery</h2>
                    </div>
                    <div class="exercises-grid">
                        ${i.map((e,s)=>e.type==="multiple_choice"?this.renderMultipleChoice(e,s):e.type==="error_correction"?this.renderErrorCorrection(e,s):"").join("")}
                    </div>
                </section>
            `},renderMultipleChoice(i,t){const e=i.options.map((s,n)=>`
                <button class="option-btn" data-exercise="${t}" data-option="${s}">
                    <span class="option-letter">${String.fromCharCode(65+n)}</span>
                    <span class="option-text">${s}</span>
                </button>
            `).join("");return`
                <div class="exercise-card mc-card" data-exercise="${t}">
                    <div class="exercise-type">Mastery Choice</div>
                    <div class="exercise-question">${i.question}</div>
                    <div class="exercise-options">
                        ${e}
                    </div>
                    <div class="exercise-feedback" style="display: none;"></div>
                    <div class="exercise-data" style="display: none;"
                         data-correct="${i.correct_answer}"
                         data-explanation="${this.escapeHtml(i.explanation_for_failure)}"
                         data-explanation-uz="${i.explanation_for_failure_uz?this.escapeHtml(i.explanation_for_failure_uz):""}">
                    </div>
                </div>
            `},renderErrorCorrection(i,t){return`
                <div class="exercise-card ec-card" data-exercise="${t}">
                    <div class="exercise-type">Error Analysis</div>
                    <div class="exercise-instruction">Identify and neutralize the error:</div>
                    <div class="incorrect-sentence">
                        <span class="error-icon">❌</span>
                        <span class="sentence-text">${i.incorrect_sentence}</span>
                    </div>
                    <button class="reveal-btn" style="padding: 0.8rem 1.5rem; font-size: 1rem;" 
                            data-exercise="${t}">
                        Reveal Truth
                    </button>
                    <div class="correction-reveal" style="display: none;">
                        <hr style="border-color: rgba(255,255,255,0.1); margin: 1.5rem 0;">
                        <div class="corrected-sentence">
                            <span class="correct-icon">✨</span>
                            <span class="sentence-text">${i.corrected_sentence}</span>
                        </div>
                        <div class="error-analysis" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05);">
                            <strong style="color: #818cf8;">Mastery Insight:</strong> ${i.error_analysis}
                            ${i.error_analysis_uz?`<p style="color: #c4b5fd; font-size: 1em; margin-top: 1rem; background: rgba(139, 92, 246, 0.15); padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">🇺🇿 ${i.error_analysis_uz}</p>`:""}
                        </div>
                    </div>
                </div>
            `},initializeExercises(){document.querySelectorAll(".option-btn").forEach(s=>{s.addEventListener("click",n=>this.handleMultipleChoice(n))}),document.querySelectorAll(".reveal-btn[data-exercise]").forEach(s=>{s.addEventListener("click",n=>this.handleReveal(n))}),document.querySelectorAll(".lesson-footer .continue-learning-btn").forEach(s=>{s.addEventListener("click",n=>{const a=n.currentTarget.dataset.nextTopic;a&&(window.location.hash=`#/learn/topic/${a}`)})})},handleMultipleChoice(i){const t=i.currentTarget,e=t.dataset.exercise,s=t.dataset.option,n=document.querySelector(`.mc-card[data-exercise="${e}"]`),a=n.querySelector(".exercise-data"),r=a.dataset.correct,c=a.dataset.explanation,u=n.querySelector(".exercise-feedback");n.querySelectorAll(".option-btn").forEach(l=>l.disabled=!0);const o=s===r;if(t.classList.add(o?"correct":"incorrect"),o)u.innerHTML=`<div class="feedback-correct">🌟 <strong>Perfect Mastery!</strong> You've cracked the pattern.</div>`;else{const l=a.dataset.explanationUz;u.innerHTML=`
                    <div class="feedback-incorrect">
                        🛸 <strong>Pattern Anomaly:</strong> ${c}
                        ${l?`<p style="color: #c4b5fd; font-size: 1em; margin-top: 1rem; background: rgba(139, 92, 246, 0.15); padding: 0.75rem 1rem; border-radius: 8px; border-left: 3px solid #8b5cf6;">🇺🇿 ${l}</p>`:""}
                        <div class="correct-answer-reveal" style="border-color: rgba(239, 68, 68, 0.3);">
                            The correct cosmic alignment is: <strong style="color: white; font-size: 1.2rem;">${r}</strong>
                        </div>
                    </div>
                `}u.style.display="block"},handleReveal(i){const t=i.currentTarget,e=t.dataset.exercise,n=document.querySelector(`.ec-card[data-exercise="${e}"]`).querySelector(".correction-reveal");n.style.display="block",t.style.display="none"},escapeHtml(i){const t=document.createElement("div");return t.textContent=i,t.innerHTML}}})();(function(){async function i(){const l=(window.location.hash||"#/").substring(1),d=l.split("/").filter(p=>p);d.length===0||d[0]===""?await t("home"):d[0]==="learn"?(await t("learn"),e(d.slice(1))):d[0]==="topic"||d[0]==="daily"||d[0]==="mixed"?window.location.hash="#/learn/"+l.replace(/^\//,""):s(d)}async function t(o){if(document.querySelectorAll(".route-section").forEach(l=>{l.classList.remove("active")}),o==="home"){const l=document.getElementById("home-view");l&&l.classList.add("active")}else if(o==="learn"){const l=document.getElementById("learn-view");l&&window.ViewLoader&&(l.classList.add("active"),await window.ViewLoader.load("learn"))}}function e(o){if(o.length===0||o[0]==="")n();else if(o[0]==="topic"&&o[1]){const l=o[1];window.TopicLoader&&window.TopicLoader.loadTopic(l)}else if(o[0]==="daily")a();else if(o[0]==="mixed"){const l=parseInt(o[1])||10;r(l)}else n()}function s(o){const l=o[0],d=document.getElementById(`${l}-view`);d&&(document.querySelectorAll(".route-section").forEach(p=>{p.classList.remove("active")}),d.classList.add("active"))}function n(){const o=document.getElementById("main-content");if(!o)return;const l=window.DailyPractice&&window.DailyPractice.isCompletedToday(),d=window.DailyPractice?window.DailyPractice.getStreak():0;if(o.innerHTML=`
            <div class="welcome-screen fade-in">
                <h1>Welcome to English Grammar Master 👋</h1>
                <p class="welcome-subtitle">Learn grammar step by step with extreme clarity</p>
                
                <!-- Quick Practice Section -->
                <div class="quick-practice-section">
                    <a href="#/learn/daily" class="practice-card daily ${l?"completed":""}">
                        <span class="icon">⚡</span>
                        <span class="title">Daily Practice</span>
                        <span class="desc">5 questions • 2 min</span>
                    </a>
                    <a href="#/learn/mixed" class="practice-card mixed">
                        <span class="icon">🎲</span>
                        <span class="title">Mixed Quiz</span>
                        <span class="desc">10 questions • 5 min</span>
                    </a>
                </div>
                
                ${d>0?`
                <div class="streak-badge">
                    <span class="fire">🔥</span>
                    <span>${d} day${d>1?"s":""} streak!</span>
                </div>
                `:""}

                <!-- Continue Learning Section -->
                <div id="continue-learning-container"></div>

                <!-- Badges Section -->
                <div id="badges-container"></div>
                
                <div class="welcome-cards">
                    <div class="welcome-card">
                        <div class="card-icon">🎯</div>
                        <h3>Clear Learning Path</h3>
                        <p>Follow our structured roadmap from basics to advanced</p>
                    </div>
                    <div class="welcome-card">
                        <div class="card-icon">📝</div>
                        <h3>Practice as You Learn</h3>
                        <p>Instant feedback with every topic</p>
                    </div>
                    <div class="welcome-card">
                        <div class="card-icon">📖</div>
                        <h3>Built-in Dictionary</h3>
                        <p>Click any word for instant translation</p>
                    </div>
                </div>
                
                <div class="cta-section fade-in-up">
                    <h2>Ready to start?</h2>
                    <a href="#/learn/topic/present-simple" class="cta-button btn-animated hover-lift">Start with Present Simple →</a>
                </div>
            </div>
        `,window.renderContinueLearning&&setTimeout(window.renderContinueLearning,100),window.Achievements){const h=document.getElementById("badges-container");h&&(h.innerHTML=window.Achievements.renderBadges())}const p=document.querySelector(".welcome-screen");p&&p.classList.add("fade-in"),document.querySelectorAll(".topic-link").forEach(h=>h.classList.remove("active"))}async function a(){const o=document.getElementById("main-content");if(!o)return;if(window.DailyPractice&&window.DailyPractice.isCompletedToday()){const d=window.DailyPractice.getTodaySummary(),p=window.DailyPractice.getStreak();o.innerHTML=`
                <div class="practice-page fade-in">
                    <div class="practice-header">
                        <h1>⚡ Daily Practice</h1>
                        <p class="subtitle">You've already completed today's practice!</p>
                    </div>
                    
                    <div class="practice-results">
                        <div class="score-circle ${d.score>=4?"pass":"fail"}">
                            ${d.score}/${d.total}
                            <span class="score-label">Today's Score</span>
                        </div>
                        
                        <div class="streak-update">
                            <div class="streak-badge">
                                <span class="fire">🔥</span>
                                <span>${p} day${p>1?"s":""} streak!</span>
                            </div>
                            <p>${window.DailyPractice.getStreakMessage(p)}</p>
                        </div>
                        
                        <div class="actions">
                            <a href="#/learn" class="btn btn-secondary">← Back to Home</a>
                            <a href="#/learn/mixed" class="btn btn-primary">Try Mixed Quiz</a>
                        </div>
                    </div>
                </div>
            `;return}if(o.innerHTML=`
            <div class="practice-page">
                <div class="practice-header">
                    <h1>⚡ Daily Practice</h1>
                    <p class="subtitle">5 questions focused on your weak areas</p>
                </div>
                <div style="text-align: center; padding: 2rem;">Loading questions...</div>
            </div>
        `,!window.DailyPractice){o.innerHTML="<p>Error: Daily practice not available</p>";return}const l=await window.DailyPractice.getQuestions(5);if(l.length===0){o.innerHTML="<p>No questions available</p>";return}o.innerHTML=`
            <div class="practice-page">
                <div class="practice-header">
                    <h1>⚡ Daily Practice</h1>
                    <p class="subtitle">5 questions focused on your weak areas</p>
                </div>
                <div id="quiz-container"></div>
            </div>
        `,window.QuizEngine&&new QuizEngine(l,{onComplete:p=>{const f=window.DailyPractice.markCompleted(p.score,p.total);c(p,f.streak)}}).init("quiz-container")}async function r(o){const l=document.getElementById("main-content");if(!l)return;if(l.innerHTML=`
            <div class="practice-page">
                <div class="practice-header">
                    <h1>🎲 Mixed Quiz</h1>
                    <p class="subtitle">${o} random questions from all topics</p>
                </div>
                <div style="text-align: center; padding: 2rem;">Loading questions...</div>
            </div>
        `,!window.DailyPractice){l.innerHTML="<p>Error: Quiz system not available</p>";return}const d=await window.DailyPractice.getMixedQuestions(o);if(d.length===0){l.innerHTML="<p>No questions available</p>";return}l.innerHTML=`
            <div class="practice-page">
                <div class="practice-header">
                    <h1>🎲 Mixed Quiz</h1>
                    <p class="subtitle">${d.length} random questions from all topics</p>
                </div>
                <div id="quiz-container"></div>
            </div>
        `,window.QuizEngine&&new QuizEngine(d,{onComplete:f=>{u(f)}}).init("quiz-container")}function c(o,l){const d=document.getElementById("main-content");if(!d)return;const p=o.percentage>=70,f=window.DailyPractice?window.DailyPractice.getStreakMessage(l):"";let h="";if(l>=30?h="month-plus":l>=7&&(h="week-plus"),d.innerHTML=`
            <div class="practice-page fade-in">
                <div class="practice-header">
                    <h1>⚡ Daily Practice Complete!</h1>
                </div>
                
                <div class="practice-results">
                    <div class="score-circle ${p?"pass celebrate":"fail shake"}">
                        ${o.score}/${o.total}
                        <span class="score-label">${o.percentage}%</span>
                    </div>
                    
                    <div class="streak-update fade-in-up">
                        <div class="streak-badge ${h}">
                            <span class="fire">🔥</span>
                            <span>${l} day${l>1?"s":""} streak!</span>
                        </div>
                        <p>${f}</p>
                    </div>
                    
                    <div class="actions fade-in-up">
                        <a href="#/learn" class="btn btn-secondary hover-lift">← Back to Home</a>
                        <a href="#/learn/mixed" class="btn btn-primary hover-lift">Try Mixed Quiz</a>
                    </div>
                </div>
            </div>
        `,window.Achievements){const g=window.Achievements.getStats();g.lastScore=o.percentage,window.Achievements.checkAchievements(g)}}function u(o){const l=document.getElementById("main-content");if(!l)return;const d=o.percentage>=70;if(l.innerHTML=`
            <div class="practice-page fade-in">
                <div class="practice-header">
                    <h1>🎲 Mixed Quiz Complete!</h1>
                </div>
                
                <div class="practice-results">
                    <div class="score-circle ${d?"pass celebrate":"fail shake"}">
                        ${o.score}/${o.total}
                        <span class="score-label">${o.percentage}%</span>
                    </div>
                    
                    <p class="fade-in-up" style="margin: 1.5rem 0; font-size: 1.1rem;">
                        ${d?"🎉 Great job!":"💪 Keep practicing!"}
                    </p>
                    
                    <div class="actions fade-in-up">
                        <a href="#/learn" class="btn btn-secondary hover-lift">← Back to Home</a>
                        <a href="#/learn/mixed" class="btn btn-primary hover-lift">Try Again</a>
                    </div>
                </div>
            </div>
        `,window.Achievements){const p=window.Achievements.getStats();p.lastScore=o.percentage,window.Achievements.checkAchievements(p)}}window.showDailyPractice=a,window.showMixedQuiz=r,window.addEventListener("hashchange",i),window.addEventListener("load",i)})();let I=localStorage.getItem("dict_enabled")==="true";document.addEventListener("DOMContentLoaded",()=>{const i=document.getElementById("dict-toggle");i&&(i.checked=I,window.DICTIONARY_MODE_ON=I)});function T(i,t="info"){const e=document.getElementById("toast-container");if(!e)return;const s=document.createElement("div");s.className=`toast ${t}`,s.innerHTML=`<span>${i}</span>`,e.appendChild(s),setTimeout(()=>{s.style.animation="slideOutLeft 0.3s ease forwards",setTimeout(()=>s.remove(),300)},4e3),s.onclick=()=>s.remove()}class A{constructor(){this.data=JSON.parse(localStorage.getItem("tense_master_progress"))||{xp:0,level:1,streak:0,lastLogin:null,badges:[],completedLessons:[]},this.initStreak()}save(){localStorage.setItem("tense_master_progress",JSON.stringify(this.data)),this.updateUI()}addXP(t){this.data.xp+=t;const e=Math.floor(this.data.xp/250)+1;e>this.data.level&&(this.data.level=e,this.handleLevelUp()),this.save()}completeLesson(t){this.data.completedLessons.includes(t)||(this.data.completedLessons.push(t),this.addXP(20),this.checkBadges(),this.save())}initStreak(){const t=new Date().toDateString(),e=this.data.lastLogin;if(e===t)return;const s=new Date;s.setDate(s.getDate()-1),e===s.toDateString()?this.data.streak++:e!==null?this.data.streak=1:(this.data.streak=1,this.addXP(2)),this.data.lastLogin=t,this.save()}checkBadges(){[{id:"tense_master",label:"Tense Master",check:()=>this.data.completedLessons.length>=12},{id:"aspect_analyst",label:"Aspect Analyst",check:()=>this.data.completedLessons.some(e=>e.includes("matrix"))},{id:"detective_pro",label:"Detective Pro",check:()=>this.data.xp>=500},{id:"quiz_whiz",label:"Quiz Whiz",check:()=>this.data.completedLessons.filter(e=>e.startsWith("quiz-")).length>=5},{id:"streak_star",label:"Streak Star",check:()=>this.data.streak>=3},{id:"mastery_novice",label:"Mastery Initiate",check:()=>this.data.completedLessons.some(e=>e.startsWith("mixed-mastery"))},{id:"mastery_elite",label:"Mastered Elite",check:()=>this.data.completedLessons.filter(e=>e.startsWith("mixed-mastery")).length>=5},{id:"reading_scholar",label:"Context Scholar",check:()=>this.data.completedLessons.filter(e=>e.startsWith("reading-")).length>=3},{id:"endurance_hero",label:"Endurance Hero",check:()=>this.data.completedLessons.some(e=>e.includes("random-30"))},{id:"present_expert",label:"Present Expert",check:()=>["mixed-mastery-present-tenses-1","mixed-mastery-present-tenses-2","mixed-mastery-present-tenses-3"].every(e=>this.data.completedLessons.includes(e))},{id:"detective_legend",label:"Case Closed",check:()=>this.data.completedLessons.filter(e=>e.startsWith("detective-")).length>=3},{id:"xp_titan",label:"XP Titan",check:()=>this.data.xp>=2500}].forEach(e=>{e.check()&&!this.data.badges.includes(e.id)&&(this.data.badges.push(e.id),this.handleBadgeUnlock(e.label),this.save())})}handleLevelUp(){T(`🎉 LEVEL UP! You are now Level ${this.data.level}`,"level-up")}handleBadgeUnlock(t){T(`🏆 NEW BADGE: ${t}`,"badge-unlock")}openBadgesModal(){this.renderBadges(),document.getElementById("badges-modal").classList.remove("hidden")}closeBadgesModal(){document.getElementById("badges-modal").classList.add("hidden")}renderBadges(){const t=document.getElementById("badges-grid"),e=[{id:"tense_master",label:"Tense Architect",icon:"🎓",desc:"Build your foundation: 12 lessons complete!"},{id:"aspect_analyst",label:"Aspect Visionary",icon:"🔍",desc:"Unlock the secrets: Explore the Matrix!"},{id:"detective_pro",label:"Sherlock of Verbs",icon:"🕵️",desc:"Case Solved: 500 XP Milestone reached!"},{id:"quiz_whiz",label:"Quiz Dynamo",icon:"⚡",desc:"Unstoppable: 5 Quizzes conquered!"},{id:"streak_star",label:"Rising Phoenix",icon:"🔥",desc:"Consistency is Power: 3-day Streak!"},{id:"mastery_novice",label:"Mastery Initiate",icon:"🥇",desc:"First Step to Greatness: Finish a Mastery Test!"},{id:"mastery_elite",label:"Titan of Tenses",icon:"🎖️",desc:"Legendary Status: 5 Mastery Tests cleared!"},{id:"reading_scholar",label:"Story Sovereign",icon:"📖",desc:"Master of Context: 3 Stories solved!"},{id:"endurance_hero",label:"Endurance Legend",icon:"🔋",desc:"Limit Breaker: Random 30 Challenge won!"},{id:"present_expert",label:"Present Overlord",icon:"⚛️",desc:"Temporal Master: 104 Present questions cleared!"},{id:"detective_legend",label:"Justice Bringer",icon:"⚖️",desc:"No Mystery Left: All Cases closed!"},{id:"xp_titan",label:"Ethereal Titan",icon:"💎",desc:"Peak Performance: 2,500 XP achieved!"}];t.innerHTML=e.map(s=>{const n=this.data.badges.includes(s.id);return`
                <div class="badge-item ${n?"unlocked":"locked"}" title="${s.desc}">
                    <div class="badge-icon">${n?s.icon:"🔒"}</div>
                    <div class="badge-label">${s.label}</div>
                    <div style="font-size: 0.65rem; opacity: 0.7; margin-top: 4px;">${s.desc}</div>
                </div>
            `}).join("")}updateUI(){const t=document.getElementById("xp-bar-fill"),e=document.getElementById("level-count"),s=document.getElementById("streak-count");if(t){const n=this.data.xp%250/2.5;t.style.width=`${n}%`}e&&(e.innerText=`Level ${this.data.level}`),s&&(s.innerText=`🔥 ${this.data.streak} day streak`),this.data.completedLessons.forEach(n=>{const a=document.querySelector(`[data-lesson-id="${n}"] .checkmark`);a&&a.classList.remove("hidden")}),this.checkBadges()}}const x=new A,z=document.getElementById("time-slider"),S=document.getElementById("dynamic-sentence"),$=document.getElementById("time-label"),M=document.body,C={eat:{simple:{past:'I <span class="highlight xray-verb">ate</span> an apple <span class="xray-trigger">yesterday</span>.',present:'I <span class="highlight xray-verb">eat</span> an apple <span class="xray-trigger">every day</span>.',future:'I <span class="xray-aux">will</span> <span class="highlight xray-verb">eat</span> an apple <span class="xray-trigger">tomorrow</span>.'},continuous:{past:'I <span class="xray-aux">was</span> <span class="highlight xray-verb">eating</span> an apple.',present:'I <span class="xray-aux">am</span> <span class="highlight xray-verb">eating</span> an apple <span class="xray-trigger">now</span>.',future:'I <span class="xray-aux">will be</span> <span class="highlight xray-verb">eating</span> an apple <span class="xray-trigger">at 5 pm</span>.'},perfect:{past:'I <span class="xray-aux">had</span> <span class="highlight xray-verb">eaten</span> the apple.',present:'I <span class="xray-aux">have</span> <span class="highlight xray-verb">eaten</span> the apple.',future:'I <span class="xray-aux">will have</span> <span class="highlight xray-verb">eaten</span> the apple <span class="xray-trigger">by lunch</span>.'},"perfect-continuous":{past:'I <span class="xray-aux">had been</span> <span class="highlight xray-verb">eating</span> for ten minutes.',present:'I <span class="xray-aux">have been</span> <span class="highlight xray-verb">eating</span> since morning.',future:'I <span class="xray-aux">will have been</span> <span class="highlight xray-verb">eating</span> for one hour.'}},play:{simple:{past:'We <span class="highlight xray-verb">played</span> football <span class="xray-trigger">yesterday</span>.',present:'We <span class="highlight xray-verb">play</span> football <span class="xray-trigger">every day</span>.',future:'We <span class="xray-aux">will</span> <span class="highlight xray-verb">play</span> football <span class="xray-trigger">tomorrow</span>.'},continuous:{past:'We <span class="xray-aux">were</span> <span class="highlight xray-verb">playing</span> football.',present:'We <span class="xray-aux">are</span> <span class="highlight xray-verb">playing</span> football <span class="xray-trigger">now</span>.',future:'We <span class="xray-aux">will be</span> <span class="highlight xray-verb">playing</span> football <span class="xray-trigger">at 4 pm</span>.'},perfect:{past:'We <span class="xray-aux">had</span> <span class="highlight xray-verb">played</span> the game.',present:'We <span class="xray-aux">have</span> <span class="highlight xray-verb">played</span> the game.',future:'We <span class="xray-aux">will have</span> <span class="highlight xray-verb">played</span> the game <span class="xray-trigger">by evening</span>.'},"perfect-continuous":{past:'We <span class="xray-aux">had been</span> <span class="highlight xray-verb">playing</span> for two hours.',present:'We <span class="xray-aux">have been</span> <span class="highlight xray-verb">playing</span> since morning.',future:'We <span class="xray-aux">will have been</span> <span class="highlight xray-verb">playing</span> for three hours.'}},study:{simple:{past:'She <span class="highlight xray-verb">studied</span> English <span class="xray-trigger">yesterday</span>.',present:'She <span class="highlight xray-verb">studies</span> English <span class="xray-trigger">every day</span>.',future:'She <span class="xray-aux">will</span> <span class="highlight xray-verb">study</span> English <span class="xray-trigger">tomorrow</span>.'},continuous:{past:'She <span class="xray-aux">was</span> <span class="highlight xray-verb">studying</span> English.',present:'She <span class="xray-aux">is</span> <span class="highlight xray-verb">studying</span> English <span class="xray-trigger">now</span>.',future:'She <span class="xray-aux">will be</span> <span class="highlight xray-verb">studying</span> English <span class="xray-trigger">tonight</span>.'},perfect:{past:'She <span class="xray-aux">had</span> <span class="highlight xray-verb">studied</span> before the test.',present:'She <span class="xray-aux">has</span> <span class="highlight xray-verb">studied</span> English.',future:'She <span class="xray-aux">will have</span> <span class="highlight xray-verb">studied</span> everything <span class="xray-trigger">by Monday</span>.'},"perfect-continuous":{past:'She <span class="xray-aux">had been</span> <span class="highlight xray-verb">studying</span> for total three hours.',present:'She <span class="xray-aux">has been</span> <span class="highlight xray-verb">studying</span> since 9 am.',future:'She <span class="xray-aux">will have been</span> <span class="highlight xray-verb">studying</span> for five hours.'}},go:{simple:{past:'They <span class="highlight xray-verb">went</span> to school <span class="xray-trigger">yesterday</span>.',present:'They <span class="highlight xray-verb">go</span> to school <span class="xray-trigger">at 8 am</span>.',future:'They <span class="xray-aux">will</span> <span class="highlight xray-verb">go</span> to school <span class="xray-trigger">tomorrow</span>.'},continuous:{past:'They <span class="xray-aux">were</span> <span class="highlight xray-verb">going</span> to school.',present:'They <span class="xray-aux">are</span> <span class="highlight xray-verb">going</span> to school <span class="xray-trigger">now</span>.',future:'They <span class="xray-aux">will be</span> <span class="highlight xray-verb">going</span> to school <span class="xray-trigger">soon</span>.'},perfect:{past:'They <span class="xray-aux">had</span> <span class="highlight xray-verb">gone</span> to school.',present:'They <span class="xray-aux">have</span> <span class="highlight xray-verb">gone</span> to school.',future:'They <span class="xray-aux">will have</span> <span class="highlight xray-verb">gone</span> to school <span class="xray-trigger">by noon</span>.'},"perfect-continuous":{past:'They <span class="xray-aux">had been</span> <span class="highlight xray-verb">going</span> to school for months.',present:'They <span class="xray-aux">have been</span> <span class="highlight xray-verb">going</span> to school since 2022.',future:'They <span class="xray-aux">will have been</span> <span class="highlight xray-verb">going</span> to school for ten years.'}}};let B="eat",D="simple";document.getElementById("verb-select");function _(i,t){const e=C[i][t],s=t.toUpperCase().replace("-"," ");return{PAST:{bgClass:"state-past",text:e.past,label:`PAST ${s}`},PRESENT:{bgClass:"state-present",text:e.present,label:`PRESENT ${s}`},FUTURE:{bgClass:"state-future",text:e.future,label:`FUTURE ${s}`}}}function L(){if(!z||!S||!$)return;const i=parseInt(z.value);let t;const e=_(B,D);i<34?t=e.PAST:i<67?t=e.PRESENT:t=e.FUTURE,S.innerHTML=t.text,$.textContent=t.label,M.className=t.bgClass}typeof z<"u"&&z&&(z.addEventListener("input",L),L());class H{constructor(){this.scenarios=typeof SCENARIO_DATA<"u"?SCENARIO_DATA:[],this.currentIndex=0,this.shuffledIndices=[],this.init()}init(){this.scenarios.length&&(this.shuffle(),this.render())}shuffle(){this.shuffledIndices=[...Array(this.scenarios.length).keys()];for(let t=this.shuffledIndices.length-1;t>0;t--){const e=Math.floor(Math.random()*(t+1));[this.shuffledIndices[t],this.shuffledIndices[e]]=[this.shuffledIndices[e],this.shuffledIndices[t]]}}render(){const t=this.scenarios[this.shuffledIndices[this.currentIndex]],e=document.getElementById("scenario-area");e&&(e.innerHTML=`
      <div class="scenario-card">
        <div class="scenario-visual">💡</div>
        <h3>${t.title}</h3>
        <p class="scenario-text">${t.text}</p>
        <p class="question">${t.question}</p>

        <div class="options quiz-options">
          ${t.options.map((s,n)=>`
            <button class="quiz-opt-btn" onclick="scenarioManager.checkAnswer(${n})">
              <span class="opt-letter">${String.fromCharCode(65+n)}</span>
              <span>${s.text}</span>
            </button>
          `).join("")}
        </div>

        <div id="scenario-feedback" class="feedback hidden"></div>
      </div>
    `)}checkAnswer(t){const e=this.scenarios[this.shuffledIndices[this.currentIndex]],s=document.getElementById("scenario-feedback");document.querySelectorAll("#scenario-area .quiz-opt-btn").forEach(r=>r.disabled=!0);const a=e.options[t].correct;s.classList.remove("hidden"),s.className=`feedback ${a?"correct":"wrong"}`,a?(s.innerHTML="<strong>✅ Correct!</strong>",x.addXP(20),x.completeLesson(`scenario-${e.id}`)):s.innerHTML="<strong>❌ Not quite.</strong>",s.innerHTML+=`
      <button class="why-btn" onclick="scenarioManager.toggleWhy()">Explain Why?</button>
      <div id="scenario-why" class="why-text hidden">${e.explanation}</div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <button class="next-btn" onclick="scenarioManager.nextScenario()">Next Scenario ➔</button>
      </div>
    `}toggleWhy(){const t=document.getElementById("scenario-why");t&&t.classList.toggle("hidden")}nextScenario(){this.currentIndex=(this.currentIndex+1)%this.scenarios.length,this.showScenario()}}new H;const j={past_vs_perfect:{labelA:"Past Simple",labelB:"Present Perfect",sideA:{text:'I <span class="highlight-red">lost</span> my keys.',nuance:"Context: Finished event (e.g., yesterday).",nuanceUz:"Kontekst: Tugallangan voqea (masalan, kecha).",story:'<strong>Story:</strong> "It happened in 2010. I lost them walking home, but I bought new ones the next day. It is an old memory."',storyUz:`<strong>Hikoya:</strong> "Bu 2010-yilda sodir bo'lgan. Uyga qaytayotganda ularni yo'qotib qo'ydim, lekin ertasi kuni yangisini sotib oldim. Bu shunchaki eski xotira."`,implication:"<strong>Implication:</strong> I might have them now. It is just history.",implicationUz:"<strong>Ma'nosi:</strong> Hozir ular menda bo'lishi mumkin. Bu shunchaki tarix.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">have lost</span> my keys.',nuance:"Context: Recent / Effect on NOW.",nuanceUz:"Kontekst: Yaqinda sodir bo'lgan / HOZIRGA ta'siri.",story:'<strong>Story:</strong> "I am standing at my front door right now. I search my pockets... empty. I cannot get inside!"',storyUz:`<strong>Hikoya:</strong> "Hozirgina eshigim oldida turibman. Cho'ntaklarimni qidiryapman... bo'sh. Ichkariga kira olmayman!"`,implication:"<strong>Implication:</strong> I definitely do NOT have them now.",implicationUz:"<strong>Ma'nosi:</strong> Hozir ular menda EMASLIGI aniq.",color:"#3b82f6"}},simple_vs_continuous:{labelA:"Present Simple",labelB:"Present Continuous",sideA:{text:'I <span class="highlight-red">live</span> in London.',nuance:"Context: Permanent state / General truth.",nuanceUz:"Kontekst: Doimiy holat / Umumiy haqiqat.",story:'<strong>Story:</strong> "I was born here. My house is here. I will probably die here. It is my permanent home."',storyUz:`<strong>Hikoya:</strong> "Men shu yerda tug'ilganman. Uyim shu yerda. Ehtimol shu yerda vafot etarman. Bu mening doimiy uyim."`,implication:"<strong>Implication:</strong> This is my normal reality.",implicationUz:"<strong>Ma'nosi:</strong> Bu mening kundalik voqeligim.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">am living</span> in London.',nuance:"Context: Temporary situation.",nuanceUz:"Kontekst: Vaqtinchalik holat.",story:'<strong>Story:</strong> "I usually live in Paris, but I am in London for a 3-month internship. After that, I go back."',storyUz:'<strong>Hikoya:</strong> "Odatda Parijda yashayman, lekin hozir 3 oylik amaliyot uchun Londondaman. Undan keyin qaytib ketaman."',implication:"<strong>Implication:</strong> This is just for now. It will change.",implicationUz:"<strong>Ma'nosi:</strong> Bu shunchaki hozir uchun. Keyin o'zgaradi.",color:"#3b82f6"}},past_vs_continuous:{labelA:"Past Simple",labelB:"Past Continuous",sideA:{text:'I <span class="highlight-red">read</span> a book last night.',nuance:"Context: Completed action.",nuanceUz:"Kontekst: Tugallangan harakat.",story:'<strong>Story:</strong> "I sat down at 8pm. I finished the book at 10pm. Then I went to sleep. The action is 100% done."',storyUz:`<strong>Hikoya:</strong> "Soat 8 da o'tirdim. 10 da kitobni tugatdim. Keyin uxlashga yotdim. Harakat 100% bajarilgan."`,implication:"<strong>Implication:</strong> I finished the whole book.",implicationUz:"<strong>Ma'nosi:</strong> Men butun kitobni o'qib bo'ldim.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">was reading</span> a book last night.',nuance:"Context: Action in progress at a specific time.",nuanceUz:"Kontekst: Ma'lum bir vaqtda davom etayotgan harakat.",story:'<strong>Story:</strong> "At 9pm, I was in the middle of page 50. Then the phone rang and interrupted me."',storyUz:`<strong>Hikoya:</strong> "Soat 9 da men 50-betning o'rtasida edim. Keyin telefon jiringladi va meni chalg'itdi."`,implication:"<strong>Implication:</strong> I was busy doing it. I might not have finished.",implicationUz:`<strong>Ma'nosi:</strong> Men band edim. Balki tugatmagandirman."`,color:"#3b82f6"}},perfect_vs_continuous:{labelA:"Present Perfect",labelB:"Present Perfect Continuous",sideA:{text:'I <span class="highlight-red">have painted</span> the room.',nuance:"Context: Result-focused.",nuanceUz:"Kontekst: Natijaga yo'naltirilgan.",story:'<strong>Story:</strong> "Look! The walls are blue. The paint is dry. I am putting the brushes away. Good job!"',storyUz:`<strong>Hikoya:</strong> "Qarang! Devorlar ko'k rangda. Bo'yoq qurigan. Cho'tkalarni olib qo'yapman. Yaxshi ish bo'ldi!"`,implication:"<strong>Implication:</strong> The job is finished. Focus on the result.",implicationUz:"<strong>Ma'nosi:</strong> Ish tugadi. Diqqat natijada.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">have been painting</span> the room.',nuance:"Context: Action-focused / Duration.",nuanceUz:"Kontekst: Harakatga yo'naltirilgan / Davomiylik.",story:'<strong>Story:</strong> "I have paint on my clothes. I am sweating. Half the wall is still white. I started 2 hours ago and I am still going!"',storyUz:`<strong>Hikoya:</strong> "Kiyimlarimda bo'yoq bor. Terlayapman. Devorning yarmi hali ham oq. 2 soat oldin boshlaganman va hali ham davom etyapman!"`,implication:"<strong>Implication:</strong> Focus on the activity/effort. It might not be done.",implicationUz:"<strong>Ma'nosi:</strong> Diqqat harakat/harakatda. U hali tugallanmagan bo'lishi mumkin.",color:"#3b82f6"}},past_simple_vs_perfect:{labelA:"Past Simple",labelB:"Past Perfect",sideA:{text:'When I arrived, the train <span class="highlight-red">left</span>.',nuance:"Context: Sequence of events (Event A -> Event B).",nuanceUz:"Kontekst: Voqealar ketma-ketligi (A voqea -> B voqea).",story:'<strong>Story:</strong> "I stepped onto the platform. The conductor saw me. Then, the train started moving. I hopped on!"',storyUz:`<strong>Hikoya:</strong> "Men platformaga chiqdim. Konduktor meni ko'rdi. Keyin poyezd yura boshladi. Men sakrab chiqdim!"`,implication:"<strong>Implication:</strong> I caught the train.",implicationUz:"<strong>Ma'nosi:</strong> Men poyezdga ulgurdim.",color:"#ef4444"},sideB:{text:'When I arrived, the train <span class="highlight-blue">had left</span>.',nuance:'Context: The "Past of the Past" (Event B happened before Event A).',nuanceUz:`Kontekst: "O'tmishning o'tmishi" (B voqea A dan oldin sodir bo'lgan).`,story:'<strong>Story:</strong> "I stepped onto the platform. It was empty. The train had already gone 5 minutes ago."',storyUz:`<strong>Hikoya:</strong> "Men platformaga chiqdim. U bo'sh edi. Poyezd 5 daqiqa oldin ketib qolgan edi."`,implication:"<strong>Implication:</strong> I missed the train.",implicationUz:"<strong>Ma'nosi:</strong> Men poyezdni o'tkazib yubordim.",color:"#3b82f6"}},present_perfect_vs_past:{labelA:"Present Perfect",labelB:"Past Perfect",sideA:{text:'I <span class="highlight-red">have visited</span> Paris.',nuance:"Context: View from NOW.",nuanceUz:"Kontekst: HOZIRGI vaqtdan nazar.",story:'<strong>Story:</strong> "Ask me for travel tips! I know Paris. It is part of my life experience as I stand here today."',storyUz:`<strong>Hikoya:</strong> "Mendan sayohat bo'yicha maslahat so'rang! Parijni bilaman. Bu bugun shu yerda turganimdek, hayotiy tajribamning bir qismi."`,implication:"<strong>Focus:</strong> Present knowledge/experience.",implicationUz:"<strong>Diqqat:</strong> Hozirgi bilim/tajriba.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">had visited</span> Paris (before 2010).',nuance:"Context: View from a PAST MOMENT.",nuanceUz:"Kontekst: O'TMISHDAGI bir vaqtdan nazar.",story:'<strong>Story:</strong> "In 2010, I moved to London. Before that move, I had already seen Paris twice."',storyUz:`<strong>Hikoya:</strong> "2010-yilda Londonga ko'chdim. Undan oldin Parijni ikki marta ko'rgan edim."`,implication:"<strong>Focus:</strong> A timeline before a past date.",implicationUz:"<strong>Diqqat:</strong> O'tmishdagi sanadan oldingi vaqt chizig'i.",color:"#3b82f6"}},perfect_cont_vs_past_cont:{labelA:"Present Perf. Cont.",labelB:"Past Perf. Cont.",sideA:{text:'I <span class="highlight-red">have been working</span> hard.',nuance:"Context: Up to NOW.",nuanceUz:"Kontekst: HOZIRGACHA.",story:'<strong>Story:</strong> "Hi! Sorry I look messy. I just put down my tools. I have been fixing the car all morning."',storyUz:`<strong>Hikoya:</strong> "Salom! Uzr, ko'rinishim bir oz abgor. Hozirgina asboblarni qo'ydim. Ertalabdan beri mashinani tuzatyapman."`,implication:"<strong>Effect:</strong> Why I am tired NOW.",implicationUz:`<strong>Ta'siri:</strong> Nima uchun HOZIR charchaganman."`,color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">had been working</span> hard.',nuance:"Context: Up to a PAST MOMENT.",nuanceUz:"Kontekst: O'TMISHDAGI bir vaqtgacha.",story:'<strong>Story:</strong> "When you saw me yesterday, I looked messy because I had been fixing the car all morning."',storyUz:`<strong>Hikoya:</strong> "Kecha meni ko'rganingizda, ko'rinishim abgor edi, chunki ertalabdan beri mashinani tuzatayotgan edim."`,implication:"<strong>Effect:</strong> Why I WAS tired THEN.",implicationUz:`<strong>Ta'siri:</strong> Nima uchun O'SHANDA charchagan edim."`,color:"#3b82f6"}},will_vs_going_to:{labelA:"Will (Future Simple)",labelB:"Going To",sideA:{text:'I <span class="highlight-red">will help</span> you.',nuance:"Context: Instant Decision / Offer.",nuanceUz:"Kontekst: Tezkor qaror / Taklif.",story:`<strong>Story:</strong> "Oh, your bag looks heavy! Don't worry, I will carry it for you." (I decided just now).`,storyUz:`<strong>Hikoya:</strong> "Oh, sumkangiz og'ir ko'rinadi! Xavotir olmang, men yordamlashib yuboraman." (Hozirgina qaror qildim).`,implication:"<strong>Implication:</strong> Spontaneous offer.",implicationUz:"<strong>Ma'nosi:</strong> O'z-o'zidan paydo bo'lgan taklif.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">am going to help</span> him.',nuance:"Context: Prior Plan.",nuanceUz:"Kontekst: Oldindan qilingan reja.",story:'<strong>Story:</strong> "I promised John yesterday. I am going to help him move house tomorrow. It is on my calendar."',storyUz:`<strong>Hikoya:</strong> "Kecha Johnga va'da bergan edim. Ertaga unga ko'chishga yordamlashmoqchiman. Bu mening rejamda bor."`,implication:"<strong>Implication:</strong> Pre-meditated plan.",implicationUz:"<strong>Ma'nosi:</strong> Oldindan rejalashtirilgan ish.",color:"#3b82f6"}},will_vs_present_cont:{labelA:"Will",labelB:"Present Continuous",sideA:{text:'I <span class="highlight-red">will meet</span> him.',nuance:"Context: Prediction or Promise.",nuanceUz:"Kontekst: Bashorat yoki va'da.",story:`<strong>Story:</strong> "Yeah, I will probably meet him later. Or maybe not. I haven't called him yet."`,storyUz:`<strong>Hikoya:</strong> "Ha, ehtimol u bilan keyinroq uchrasharman. Balki yo'qdir. Hali unga qo'ng'iroq qilmadim."`,implication:"<strong>Implication:</strong> Uncertain or distant future.",implicationUz:"<strong>Ma'nosi:</strong> Noaniq yoki uzoq kelajak.",color:"#ef4444"},sideB:{text:'I <span class="highlight-blue">am meeting</span> him at 5.',nuance:"Context: Fixed Arrangement.",nuanceUz:"Kontekst: Aniq kelishuv.",story:'<strong>Story:</strong> "I have a table booked at the cafe for 5pm. I am meeting him there. It is 100% happening."',storyUz:`<strong>Hikoya:</strong> "Soat 5 ga kafeda joy buyurtma qilganman. U bilan o'sha yerda uchrashyapman. Bu 100% sodir bo'ladi."`,implication:"<strong>Implication:</strong> Fixed appointment.",implicationUz:"<strong>Ma'nosi:</strong> Aniq belgilangan uchrashuv.",color:"#3b82f6"}}},E=document.getElementById("contrast-pair-selector"),U=document.getElementById("label-a"),R=document.getElementById("sentence-a"),O=document.getElementById("nuance-a"),Q=document.getElementById("story-a"),N=document.getElementById("implication-a"),G=document.getElementById("label-b"),F=document.getElementById("sentence-b"),W=document.getElementById("nuance-b"),Y=document.getElementById("story-b"),K=document.getElementById("implication-b");function V(){const i=E.value,t=j[i];U.innerText=t.labelA,R.innerHTML=t.sideA.text,O.innerHTML=`
        <div class="lang-en">${t.sideA.nuance}</div>
        <div class="lang-uz">${t.sideA.nuanceUz||""}</div>
    `,Q.innerHTML=`
        <div class="lang-en">${t.sideA.story}</div>
        <div class="lang-uz">${t.sideA.storyUz||""}</div>
    `,N.innerHTML=`
        <div class="lang-en">${t.sideA.implication}</div>
        <div class="lang-uz">${t.sideA.implicationUz||""}</div>
    `,G.innerText=t.labelB,F.innerHTML=t.sideB.text,W.innerHTML=`
        <div class="lang-en">${t.sideB.nuance}</div>
        <div class="lang-uz">${t.sideB.nuanceUz||""}</div>
    `,Y.innerHTML=`
        <div class="lang-en">${t.sideB.story}</div>
        <div class="lang-uz">${t.sideB.storyUz||""}</div>
    `,K.innerHTML=`
        <div class="lang-en">${t.sideB.implication}</div>
        <div class="lang-uz">${t.sideB.implicationUz||""}</div>
    `,x.completeLesson(`contrast-${i}`)}E&&V();document.getElementById("matrix-detail");document.getElementById("detail-title");document.getElementById("detail-desc");class X{constructor(){this.data=typeof WILD_DATA<"u"?WILD_DATA:[],this.grid=document.getElementById("wild-grid"),this.currentFilter="all",this.init()}init(){this.render()}filter(t){this.currentFilter=t,document.querySelectorAll(".filter-btn").forEach(s=>{const n=s.innerText.toLowerCase(),a=t==="all"&&n==="all"||t!=="all"&&n.includes(t.toLowerCase());s.classList.toggle("active",a)}),this.render(),x.addXP(2)}render(){if(!this.grid)return;const t=this.currentFilter==="all"?this.data:this.data.filter(e=>e.category.toLowerCase()===this.currentFilter.toLowerCase());this.grid.innerHTML=t.map(e=>`
            <div class="wild-card">
                <div class="wild-header">
                    <span>${e.icon} ${e.category}</span>
                    <span style="opacity: 0.6; font-size: 0.8rem;">${e.source}</span>
                </div>
                ${e.videoId?`
                    <div class="wild-video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${e.videoId}?rel=0" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div style="text-align: right; padding: 0.5rem 1rem 0 0;">
                        <a href="https://www.youtube.com/watch?v=${e.videoId}" target="_blank" class="yt-link">
                            <span style="font-size: 0.8rem;">📺 Watch on YouTube</span>
                        </a>
                    </div>
                `:`
                    <div class="wild-visual-placeholder">🎵 Quotes & Clips</div>
                `}
                <div class="wild-body">
                    <p class="wild-quote">"${e.quote}"</p>
                    <div class="wild-tense-tag">${e.tense}</div>
                </div>
                <div class="wild-footer">
                    <strong>Nuance:</strong> ${e.explanation}
                </div>
            </div>
        `).join("")}}class Z{constructor(){this.data=typeof NUANCE_DATA<"u"?NUANCE_DATA:{},this.displayArea=document.getElementById("nuance-display-area"),this.currentRegion="US",this.init()}init(){this.render()}selectRegion(t){this.currentRegion=t,document.querySelectorAll(".region-btn").forEach(s=>{s.classList.toggle("active",s.innerText.includes(t))}),this.render(),x.addXP(5),x.completeLesson(`nuance-${t.toLowerCase()}`)}render(){if(!this.displayArea)return;const t=this.data[this.currentRegion];this.displayArea.innerHTML=`
            <div class="nuance-header-area">
                <h3 class="nuance-region-title">${t.flag} ${t.name} English</h3>
                <p class="nuance-region-subtitle">Key tense habits and regional shortcuts.</p>
            </div>
            ${t.scenarios.map(e=>`
                <div class="nuance-entry" style="--accent-color: ${e.color}">
                    <h4 class="nuance-situation">Situation: ${e.situation}</h4>
                    <p class="nuance-example">"${e.example}"</p>
                    <div class="nuance-rule-box">
                        <strong>The Rule:</strong> ${e.rule}
                    </div>
                </div>
            `).join("")}
        `}}new X;new Z;class J{constructor(){this.tests=typeof MIXED_QUIZ_DATA<"u"?MIXED_QUIZ_DATA:[],this.currentTest=null,this.currentIndex=0,this.score=0,this.results=[],this.container=document.getElementById("mixed-quiz-area")}start(t){this.currentTest=this.tests.find(e=>e.id===t),this.currentTest&&(this.currentIndex=0,this.score=0,this.results=[],this.container.classList.remove("hidden"),this.container.scrollIntoView({behavior:"smooth",block:"center"}),this.showQuestion())}startRandom(t){const e=typeof MASTERY_POOL<"u"?MASTERY_POOL:[];if(e.length===0){T("Mastery pool is still loading...","info");return}const n=[...e].sort(()=>.5-Math.random()).slice(0,Math.min(t,e.length));this.currentTest={id:`random-${t}`,title:`Random ${t} Challenge`,questions:n},this.currentIndex=0,this.score=0,this.results=[],this.container.classList.remove("hidden"),document.getElementById("reading-area").classList.add("hidden"),this.container.scrollIntoView({behavior:"smooth",block:"center"}),this.showQuestion()}showQuestion(){const t=this.currentTest.questions[this.currentIndex];this.container.innerHTML=`
            <div class="quiz-card glass-card">
                <div style="margin-bottom: 1.5rem; color: var(--pulsar-gold); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700;">
                Question ${this.currentIndex+1} of ${this.currentTest.questions.length} • Mixed Mastery
            </div>
                <p class="quiz-question">${t.q}</p>
            <div class="quiz-options">
                ${t.options.map((e,s)=>`
                    <button class="quiz-opt-btn" onclick="mixedQuiz.checkAnswer(${s})">
                        <span class="opt-letter">${String.fromCharCode(65+s)}</span>
                        <span>${e}</span>
                    </button>
                `).join("")}
            </div>
                <div id="mixed-feedback" class="quiz-feedback hidden"></div>

                <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; text-align: center;">
                    <button class="early-submit-btn" onclick="mixedQuiz.showResults()">End Assessment & Submit</button>
                </div>
            </div>
        `}checkAnswer(t){const e=this.currentTest.questions[this.currentIndex],s=document.querySelectorAll("#mixed-quiz-area .quiz-opt-btn"),n=document.getElementById("mixed-feedback");s.forEach((r,c)=>{r.disabled=!0,c===e.correct?r.classList.add("correct"):c===t&&r.classList.add("wrong")});const a=t===e.correct;a&&this.score++,this.results.push({tense:e.tense,correct:a}),n.innerHTML=`
        <p>${a?"⚡ Correct Mastery!":"❌ Study harder!"}</p>
        <div class="why-text">${e.why}</div>
        <button class="next-btn" onclick="mixedQuiz.next()">Next ➔</button>
    `,n.classList.remove("hidden"),x.addXP(a?e.diff==="hard"?12:8:2)}next(){this.currentIndex++,this.currentIndex<this.currentTest.questions.length?this.showQuestion():this.showResults()}showResults(){const t=this.score*20,e=Math.round(this.score/this.currentTest.questions.length*100),s={};this.results.forEach(n=>{s[n.tense]||(s[n.tense]={total:0,correct:0}),s[n.tense].total++,n.correct&&s[n.tense].correct++}),this.container.innerHTML=`
            <div class="quiz-card result-card">
                <h3>Assessment Complete!</h3>
                <div style="font-size: 3rem; margin: 1rem 0;">${e}%</div>
                <p>Final Score: ${this.score} / ${this.currentTest.questions.length}</p>
                <p>XP Earned: +${t}</p>
                
                <div class="tense-report">
                    <h4>Tense Balance Report:</h4>
                    ${Object.entries(s).map(([n,a])=>`
                        <div class="report-item">
                            <span>${n}</span>
                            <span class="${a.correct===a.total?"report-check":"report-cross"}">
                                ${a.correct}/${a.total} ${a.correct===a.total?"✓":"✗"}
                            </span>
                        </div>
                    `).join("")}
                </div>

                <button class="close-btn" style="margin-top: 1.5rem;" onclick="mixedQuiz.close()">Submit Final Report</button>
            </div>
        `,x.addXP(t),x.completeLesson(`mixed-mastery-${this.currentTest.id}`),e===100&&T("🎖️ GRANDMASTER! Perfect score on mixed assessment!","success")}close(){this.container.classList.add("hidden")}}class ee{constructor(){this.data=typeof READING_MASTERY_DATA<"u"?READING_MASTERY_DATA:[],this.container=document.getElementById("reading-area"),this.currentSet=null,this.currentIndex=0,this.score=0}open(){this.data.length!==0&&(this.currentSet=this.data[0],this.currentIndex=0,this.score=0,this.container.classList.remove("hidden"),document.getElementById("mixed-quiz-area").classList.add("hidden"),this.container.scrollIntoView({behavior:"smooth",block:"center"}),this.render())}render(){const t=this.currentSet.questions[this.currentIndex];this.container.innerHTML=`
            <div class="reading-card glass-card">
                <div class="reading-context">
                    <h4 style="color: var(--pulsar-gold); text-transform: uppercase; letter-spacing: 0.1rem;">${this.currentSet.title}</h4>
                    <p style="font-size: 1.05rem; line-height: 1.8;">${this.currentSet.context}</p>
                </div>
                <div class="reading-question-box">
                    <div style="margin-bottom: 1rem; color: var(--pulsar-gold); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700;">
                    Phase ${this.currentIndex+1} of ${this.currentSet.questions.length}
                </div>
                    <p class="quiz-question">${t.q}</p>
                    <div class="quiz-options">
                        ${t.options.map((e,s)=>`
                            <button class="quiz-opt-btn" onclick="readingMastery.check(${s})">
                                <span class="opt-letter">${String.fromCharCode(65+s)}</span>
                                <span>${e}</span>
                            </button>
                        `).join("")}
                    </div>
                    <div id="reading-feedback" class="quiz-feedback hidden"></div>

                    <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; text-align: center;">
                        <button class="early-submit-btn" onclick="readingMastery.finish()">Finish Reading Early</button>
                    </div>
                </div>
            </div>
        `}check(t){const e=this.currentSet.questions[this.currentIndex],s=document.querySelectorAll("#reading-area .quiz-opt-btn"),n=document.getElementById("reading-feedback");s.forEach((r,c)=>{r.disabled=!0,c===e.correct?r.classList.add("correct"):c===t&&r.classList.add("wrong")});const a=t===e.correct;a&&this.score++,n.innerHTML=`
            <p>${a?"✅ Deep Insight!":"❌ Missed a detail."}</p>
            <div class="why-text">${e.why}</div>
            <button class="next-btn" onclick="readingMastery.next()">Continue Reader ➔</button>
        `,n.classList.remove("hidden"),x.addXP(a?15:4)}next(){this.currentIndex++,this.currentIndex<this.currentSet.questions.length?this.render():this.finish()}finish(){const t=this.score*25;this.container.innerHTML=`
            <div class="quiz-card result-card">
                <h3>Reading Mastery Complete!</h3>
                <p>Final Insight: ${this.score} / ${this.currentSet.questions.length}</p>
                <p>XP Earned: +${t}</p>
                <button class="close-btn" onclick="readingMastery.close()">Close Library</button>
            </div>
        `,x.addXP(t),x.completeLesson(`reading-${this.currentSet.id}`)}close(){this.container.classList.add("hidden")}}new J;new ee;(function(){const i=new Set(["CODE","PRE","INPUT","TEXTAREA","BUTTON","A","NAV"]),t=new Set(["a","an","the","of","to","in","on","at","for","with","by","from","about","as","and","or","but"]),e=window.matchMedia&&window.matchMedia("(pointer: coarse)").matches;function s(h){if(!h||typeof h!="string")return h;const g=document.createElement("textarea");return g.innerHTML=h,g.value}function n(h){return(h||"").toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g,"").replace(/[^a-z]/g,"")}function a(h){if(!h||!window.UZ_DICT)return null;if(window.UZ_DICT.hasOwnProperty(h))return window.UZ_DICT[h];const g=["ing","ed","es","s"];for(const v of g)if(h.endsWith(v)){const y=h.slice(0,-v.length);if(window.UZ_DICT.hasOwnProperty(y))return window.UZ_DICT[y];if(y.length>2&&y[y.length-1]===y[y.length-2]){const m=y.slice(0,-1);if(window.UZ_DICT.hasOwnProperty(m))return window.UZ_DICT[m]}}return null}function r(h){for(;h;){if(h.nodeType===1&&i.has(h.tagName))return!0;h=h.parentElement}return!1}function c(h,g){let v=null;if(document.caretRangeFromPoint)v=document.caretRangeFromPoint(h,g);else if(document.caretPositionFromPoint){const q=document.caretPositionFromPoint(h,g);q&&(v=document.createRange(),v.setStart(q.offsetNode,q.offset),v.setEnd(q.offsetNode,q.offset))}if(!v||!v.startContainer)return"";const y=v.startContainer;if(y.nodeType!==Node.TEXT_NODE)return"";const m=y.textContent||"";let k=v.startOffset;k>0&&!/[A-Za-z]/.test(m[k])&&/[A-Za-z]/.test(m[k-1])&&k--;let b=k,w=k;for(;b>0&&/[A-Za-z]/.test(m[b-1]);)b--;for(;w<m.length&&/[A-Za-z]/.test(m[w]);)w++;return m.slice(b,w)}const u=document.createElement("div");u.id="dict-tooltip",u.className="translation-tooltip",document.body.appendChild(u);function o(h,g,v,y,m){let b=`<span class="tooltip-translation">${s(y||"")||"Tarjima topilmadi"}</span>`;m&&(b+=`<span class="tooltip-grammar">📘 ${m}</span>`),b+=`<span class="tooltip-original">${v}</span>`,u.innerHTML=b,u.style.left=`${h}px`,u.style.top=`${g}px`,u.style.display="flex",requestAnimationFrame(()=>{const w=u.getBoundingClientRect();w.right>window.innerWidth-10&&(u.style.left=`${window.innerWidth-w.width-10}px`),w.top<10&&(u.style.top=`${g+25}px`)})}const l=document.createElement("div");l.id="dict-sheet",l.innerHTML=`
        <div class="top">
            <div class="pill">EN → UZ</div>
            <button class="close" aria-label="Close">✕</button>
        </div>
        <div class="content"></div>
    `,document.body.appendChild(l);const d=l.querySelector(".content");l.querySelector(".close").addEventListener("click",()=>f());function p(h,g,v){const y=s(g||"");let m=y?`<div class="uz">${y}</div>`:'<div class="missing">Tarjima topilmadi</div>';v&&(m+=`<div class="tooltip-grammar" style="margin-top:8px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">📘 ${v}</div>`),m+=`<div class="en">${h}</div>`,d.innerHTML=m,l.classList.add("show")}function f(){u.style.display="none",l.classList.remove("show"),document.querySelectorAll(".dict-word-highlight").forEach(h=>{const g=h.parentNode;g&&(g.replaceChild(document.createTextNode(h.textContent),h),g.normalize())})}document.addEventListener("keydown",h=>{h.key==="Escape"&&f()}),window.addEventListener("scroll",f,{passive:!0}),document.addEventListener("click",h=>{if(document.querySelectorAll(".dict-word-highlight").forEach(w=>{const q=w.parentNode;q&&(q.replaceChild(document.createTextNode(w.textContent),w),q.normalize())}),!window.DICTIONARY_MODE_ON){f();return}if(r(h.target))return;const g=h.clientX||0,v=h.clientY||0,y=c(g,v),m=n(y);if(!m||m.length>25||t.has(m)){f();return}const k=a(m),b=window.GRAMMAR_INFO?.[m];e?p(m,k,b):o(g,v-10,m,k,b)},!0)})();P();
