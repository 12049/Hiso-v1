// بيانات تجريبية بسيطة
const lessons = [
  {id:1,title:"مقدمة في الرياضيات",subject:"math",level:"beginner",teacher:"أحمد",desc:"أساسيات الأعداد والعمليات"},
  {id:2,title:"قواعد اللغة العربية",subject:"arabic",level:"intermediate",teacher:"سارة",desc:"النحو والصرف بطريقة مبسطة"},
  {id:3,title:"مفاهيم في العلوم",subject:"science",level:"advanced",teacher:"ليلى",desc:"مبادئ العلوم والتجارب"}
];

const library = [
  {id:1,type:"كتاب",title:"الرياضيات للمبتدئين"},
  {id:2,type:"مقال",title:"كيف تتعلم بسرعة"},
  {id:3,type:"فيديو",title:"تجارب علمية ممتعة"}
];

const tests = [
  {id:1,title:"اختبار رياضيات 1",questions:5,time:10,quiz:[
    {q:"2+2=?",choices:["3","4","5"],a:1},
    {q:"5-2=?",choices:["2","3","4"],a:1},
    {q:"3*3=?",choices:["6","9","12"],a:1},
    {q:"10/2=?",choices:["4","5","6"],a:1},
    {q:"1+1=?",choices:["1","2","3"],a:1}
  ]}
];

const teachers = [
  {id:1,name:"أحمد علي",subject:"رياضيات",bio:"خبرة 5 سنوات في تدريس الرياضيات"},
  {id:2,name:"سارة محمد",subject:"لغة عربية",bio:"متخصصة في النحو والبلاغة"}
];

// عناصر واجهة
document.addEventListener('DOMContentLoaded',()=>{
  // تحديث آخر التحديثات في الصفحة الرئيسية
  const updatesEl = document.getElementById('latest-updates');
  if(updatesEl){
    lessons.slice(0,3).forEach(l=>{
      const li = document.createElement('li');
      li.textContent = ${l.title} — ${l.desc};
      updatesEl.appendChild(li);
    });
  }

  // صفحة الدروس
  const lessonsGrid = document.getElementById('lessons-grid');
  if(lessonsGrid){
    renderLessons(lessons);
    // فلترة وبحث
    document.getElementById('search-lessons').addEventListener('input',applyFilters);
    document.getElementById('filter-subject').addEventListener('change',applyFilters);
    document.getElementById('filter-level').addEventListener('change',applyFilters);
  }

  // المكتبة
  const libGrid = document.getElementById('library-grid');
  if(libGrid){
    renderLibrary(library);
    document.getElementById('library-search').addEventListener('input',e=>{
      const q = e.target.value.trim().toLowerCase();
      renderLibrary(library.filter(it=>it.title.toLowerCase().includes(q)));
    });
  }

  // الاختبارات
  const testsList = document.getElementById('tests-list');
  if(testsList){
    tests.forEach(t=>{
      const card = document.createElement('div');
      card.className='test-card';
      card.innerHTML = <h3>${t.title}</h3><p class="small">الأسئلة: ${t.questions} • الوقت: ${t.time} دقيقة</p><button class="btn btn-primary" data-id="${t.id}">ابدأ الاختبار</button>;
      testsList.appendChild(card);
    });
    testsList.addEventListener('click',e=>{
      const btn = e.target.closest('button[data-id]');
      if(btn) startTest(btn.dataset.id);
    });
  }

  // المعلمين
  const teachersGrid = document.getElementById('teachers-grid');
  if(teachersGrid){
    teachers.forEach(t=>{
      const card = document.createElement('div');
      card.className='teacher-card';
      card.innerHTML = <div style="height:90px;background:linear-gradient(135deg,var(--primary),#7dd3fc);border-radius:8px;margin-bottom:8px;display:flex;align-items:center;justify-content:center;color:#fff">${t.name[0]}</div><h4>${t.name}</h4><p class="small">${t.subject}</p><p class="small">${t.bio}</p><a class="btn btn-outline" href="mailto:teacher@example.com?subject=تواصل%20مع%20${encodeURIComponent(t.name)}">تواصل مع المعلم</a>;
      teachersGrid.appendChild(card);
    });
  }

  // Theme toggle
  document.querySelectorAll('[id^="toggle-theme"]').forEach(btn=>{
    btn.addEventListener('click',toggleTheme);
  });

  // Quiz modal close
  const closeQuiz = document.getElementById('close-quiz');
  if(closeQuiz) closeQuiz.addEventListener('click',()=>document.getElementById('quiz-modal').classList.add('hidden'));
});

// دوال العرض
function renderLessons(list){
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML='';
  list.forEach(l=>{
    const card = document.createElement('article');
    card.className='lesson-card';
    card.innerHTML = `
      <div class="lesson-thumb">${l.title}</div>
      <h3>${l.title}</h3>
      <p class="small">${l.desc}</p>
      <div class="lesson-meta">
        <span class="small">${l.teacher}</span>
        <div>
          <button class="btn btn-outline" data-action="fav" data-id="${l.id}">☆</button>
          <button class="btn btn-primary" data-action="start" data-id="${l.id}">ابدأ</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  grid.addEventListener('click',e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    if(action==='fav') toggleFavorite(id,btn);
    if(action==='start') alert('فتح الدرس: ' + id);
  });
}

function applyFilters(){
  const q = document.getElementById('search-lessons').value.trim().toLowerCase();
  const subject = document.getElementById('filter-subject').value;
  const level = document.getElementById('filter-level').value;
  const filtered = lessons.filter(l=>{
    return (q? (l.title.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)) : true)
      && (subject? l.subject===subject : true)
      && (level? l.level===level : true);
  });
  renderLessons(filtered);
}

function renderLibrary(list){
  const grid = document.getElementById('library-grid');
  grid.innerHTML='';
  list.forEach(it=>{
    const el = document.createElement('div');
    el.className='lib-item';
    el.innerHTML = <strong>${it.title}</strong><div class="small">${it.type}</div><div><button class="btn btn-outline" data-id="${it.id}" data-action="fav-lib">☆ حفظ</button><button class="btn btn-primary" data-action="open" data-id="${it.id}">فتح</button></div>;
    grid.appendChild(el);
  });
  grid.addEventListener('click',e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);
    if(action==='fav-lib') {
      const favs = JSON.parse(localStorage.getItem('favLib')||'[]');
      if(!favs.includes(id)) favs.push(id);
      localStorage.setItem('favLib',JSON.stringify(favs));
      btn.textContent='✓';
    }
    if(action==='open') alert('فتح مورد المكتبة: ' + id);
  });
}

// المفضلة
function toggleFavorite(id,btn){
  const favs = JSON.parse(localStorage.getItem('favLessons')||'[]');
  const idx = favs.indexOf(id);
  if(idx===-1){ favs.push(id); btn.textContent='★'; }
  else { favs.splice(idx,1); btn.textContent='☆'; }
  localStorage.setItem('favLessons',JSON.stringify(favs));
}

// اختبار بسيط
function startTest(id){
  const t = tests.find(x=>x.id==id);
  if(!t) return;
  const modal = document.getElementById('quiz-modal');
  const area = document.getElementById('quiz-area');
  modal.classList.remove('hidden');
  let current = 0;
  const answers = [];
  renderQuestion();

  function renderQuestion(){
    const q = t.quiz[current];
    area.innerHTML = <h3>${t.title} — سؤال ${current+1} من ${t.quiz.length}</h3><p>${q.q}</p><div id="choices"></div><div style="margin-top:12px"><button class="btn btn-outline" id="next-btn">${current===t.quiz.length-1?'إنهاء':'التالي'}</button></div>;
    const choices = document.getElementById('choices');
    q.choices.forEach((c,i)=>{
      const b = document.createElement('button');
      b.className='btn';
      b.style.marginInline='6px';
      b.textContent = c;
      b.addEventListener('click',()=> {
        answers[current]=i;
        Array.from(choices.children).forEach(ch=>ch.classList.remove('selected'));
        b.classList.add('selected');
      });
      choices.appendChild(b);
    });
    document.getElementById('next-btn').addEventListener('click',()=>{
      if(typeof answers[current] === 'undefined') { alert('اختر إجابة'); return; }
      if(current < t.quiz.length-1){ current++; renderQuestion(); }
      else finishQuiz();
    });
  }

  function finishQuiz(){
    modal.classList.add('hidden');
    let score=0;
    t.quiz.forEach((q,i)=>{ if(answers[i]===q.a) score++; });
    const percent = Math.round((score / t.quiz.length) * 100);
    alert(النتيجة: ${score}/${t.quiz.length} — ${percent}%\nتحليل: ${percent>=80?'ممتاز':'بحاجة لتحسين'});
  }
}

// Theme
function toggleTheme(){
  document.body.classList.toggle('dark');
}
