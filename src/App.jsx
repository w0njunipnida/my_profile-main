import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── THEME ───────────────────────────────────────────────────────────────────
// Light/Dark 토글 가능한 MZ 테마
// Light: 흰 배경 + 라임 그린 + 딥 차콜 텍스트
// Dark : 거의 흰 배경이었던 걸 반전 (어두운 청회색)
const LIGHT = {
  bg:       '#f5f5f0',
  bgCard:   '#ffffff',
  bgMuted:  '#efefea',
  border:   'rgba(0,0,0,0.08)',
  text:     '#0a0a0a',
  textSub:  '#555550',
  textMute: '#999990',
  accent:   '#1a1a1a',
  lime:     '#9dff00',
  limeText: '#2a4a00',
};
const DARK = {
  bg:       '#111114',
  bgCard:   '#1a1a1e',
  bgMuted:  '#222226',
  border:   'rgba(255,255,255,0.08)',
  text:     '#f0f0ec',
  textSub:  '#aaaaaa',
  textMute: '#555555',
  accent:   '#f0f0ec',
  lime:     '#c8ff00',
  limeText: '#0a0a0a',
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const myProjects = [
  {
    id: 1, index: "01",
    title: "Eyewear\nShopping Mall",
    period: "2025.12.01 – 12.12",
    duration: "2주 · 100h · 팀",
    role: "Full-Stack Dev",
    description: "아이웨어 브랜드 커머스 플랫폼. Full-Stack의 기반을 완성한 첫 팀 프로젝트로, 데이터 흐름 설계부터 UI 구현까지 전 영역을 담당했습니다.",
    github: "https://github.com/jiwoong-0708/team3file.git",
    tags: ["HTML5", "CSS3", "Node.js", "Express", "MySQL"],
    accent: "#9dff00", shine: "157,255,0", ongoing: false
  },
  {
    id: 2, index: "02",
    title: "TopGun\nFlight Sim",
    period: "2026.01.26 – 02.02",
    duration: "1주 · 40h · 단독",
    role: "Creative Dev",
    description: "Three.js 기반 3D 공중전 시뮬레이션. 복잡한 비행 물리 로직을 구현하고 Firebase / Capacitor로 웹·앱 동시 배포까지 완성한 단독 프로젝트.",
    github: "https://github.com/w0njunipnida/dogfight-simulation.git",
    demo: "https://dogfight-32b50.web.app",
    tags: ["Three.js", "TypeScript", "Firebase", "Capacitor"],
    accent: "#ff6b35", shine: "255,107,53", ongoing: false
  },
  {
    id: 3, index: "03",
    title: "Accounting\nRPA System",
    period: "2026.02.27 – 03.09",
    duration: "10일 · 60h · 팀",
    role: "Automation Dev",
    description: "Samsung Brity RPA + Python(Pandas)로 구축한 회계 자동화 시스템. 반복 업무를 제거하고 처리 효율을 극대화한 기업형 솔루션.",
    github: "https://github.com/w0njunipnida/AAS_accounting_automation_system.git",
    tags: ["Brity RPA", "Python", "Pandas", "Openpyxl"],
    accent: "#00d4ff", shine: "0,212,255", ongoing: false
  },
  {
    id: 4, index: "04",
    title: "Logistics\nERP System",
    period: "2026.03.11 – 04.30",
    duration: "7주 · 280h · 팀",
    role: "Backend Dev",
    description: "Spring Boot + MyBatis 기반 기업형 물류 관리 ERP. MVC 아키텍처로 재고·입출고 데이터 무결성을 보장. Python 데이터 처리 및 RPA 연동 포함.",
    github: "https://github.com/san123452/ESS_ERP.git",
    tags: ["Java", "Spring Boot", "MyBatis", "MariaDB", "Python", "Brity RPA"],
    accent: "#bf5fff", shine: "191,95,255", ongoing: true
  }
];

const skills = [
  { name: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Spring",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Three.js",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", invertLight: true },
  { name: "MySQL",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MariaDB",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg" },
  { name: "Firebase",   icon: "/firebase.svg" },
  { name: "GitHub",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invertLight: true },
  { name: "Vercel",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", invertLight: true },
];

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);
  const T = dark ? DARK : LIGHT;
  return { T, dark, toggle: () => setDark(p => !p) };
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor({ T }) {
  const ringRef = useRef();
  const dotRef  = useRef();
  useEffect(() => {
    let mx=0,my=0,rx=0,ry=0,raf;
    const mv = e => { mx=e.clientX; my=e.clientY; gsap.to(dotRef.current,{x:mx,y:my,duration:0.04}); };
    const ov = e => {
      const t = e.target.closest('[data-cursor]')?.dataset.cursor;
      if(t==='link') gsap.to(ringRef.current,{scale:2.2,backgroundColor:T.lime,duration:0.3});
      else           gsap.to(ringRef.current,{scale:1,backgroundColor:'transparent',duration:0.3});
    };
    const tick=()=>{ rx+=(mx-rx)*0.09; ry+=(my-ry)*0.09; gsap.set(ringRef.current,{x:rx,y:ry}); raf=requestAnimationFrame(tick); };
    window.addEventListener('mousemove',mv);
    window.addEventListener('mouseover',ov);
    tick();
    return ()=>{ window.removeEventListener('mousemove',mv); window.removeEventListener('mouseover',ov); cancelAnimationFrame(raf); };
  },[T.lime]);
  return (
    <>
      <div ref={ringRef} style={{position:'fixed',top:-20,left:-20,width:36,height:36,borderRadius:'50%',border:`1.5px solid ${T.text}`,backgroundColor:'transparent',pointerEvents:'none',zIndex:9999,transform:'translate(-50%,-50%)',mixBlendMode:'multiply',opacity:0.5}}/>
      <div ref={dotRef}  style={{position:'fixed',top:0,left:0,width:6,height:6,borderRadius:'50%',backgroundColor:T.lime,pointerEvents:'none',zIndex:10000,transform:'translate(-50%,-50%)'}}/>
    </>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ T, dark, toggle }) {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>50); window.addEventListener('scroll',h); return()=>window.removeEventListener('scroll',h); },[]);
  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,zIndex:200,
      padding:'18px 6vw',display:'flex',justifyContent:'space-between',alignItems:'center',
      background: scrolled ? (dark?'rgba(17,17,20,0.85)':'rgba(245,245,240,0.85)') : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      transition:'background 0.4s,backdrop-filter 0.4s'
    }}>
      <span style={{fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'20px',color:T.text,letterSpacing:'2px'}}>
        W<span style={{color:T.lime}}>.</span>JEONG
      </span>
      <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
        {['About','Works','Contact'].map(n=>(
          <a key={n} href={`#${n.toLowerCase()}`} data-cursor="link"
            style={{fontSize:'12px',letterSpacing:'1px',color:T.textSub,textDecoration:'none',transition:'color 0.2s',fontWeight:500}}
            onMouseEnter={e=>e.target.style.color=T.text} onMouseLeave={e=>e.target.style.color=T.textSub}>{n}</a>
        ))}
        {/* 테마 토글 */}
        <button onClick={toggle} data-cursor="link" style={{
          width:36,height:20,borderRadius:10,border:`1.5px solid ${T.border}`,
          background: dark ? T.lime : T.bgMuted,
          cursor:'pointer',position:'relative',transition:'background 0.3s',padding:0
        }}>
          <span style={{
            position:'absolute',top:2,left: dark?'calc(100% - 18px)':'2px',
            width:14,height:14,borderRadius:'50%',
            background: dark ? T.limeText : T.textSub,
            transition:'left 0.3s',display:'block'
          }}/>
        </button>
      </div>
    </nav>
  );
}

// ─── SCROLL ZOOM INTRO ────────────────────────────────────────────────────────
function ScrollZoomIntro({ T }) {
  const secRef  = useRef();
  const zoomRef = useRef();
  const cardRef = useRef();
  const veilRef = useRef();

  useGSAP(()=>{
    gsap.from(zoomRef.current.querySelectorAll('.zc'),{y:110,opacity:0,duration:1.1,stagger:0.065,ease:'power4.out',delay:0.15});
    gsap.from(zoomRef.current.querySelector('.zsub'),{y:24,opacity:0,duration:0.85,delay:1,ease:'power3.out'});
    const tl = gsap.timeline({scrollTrigger:{trigger:secRef.current,start:'top top',end:'bottom bottom',scrub:1.4}});
    tl.to(zoomRef.current,{scale:22,opacity:0,duration:3,ease:'power2.in'})
      .to(veilRef.current,{opacity:0,duration:1.2},'-=2')
      .from(cardRef.current,{scale:0.75,opacity:0,y:50,duration:2,ease:'power3.out'},'-=0.6');
  },{scope:secRef});

  return (
    <section ref={secRef} style={{height:'310vh',position:'relative'}}>
      <div style={{position:'sticky',top:0,height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',perspective:'1400px',background:T.bg}}>
        {/* 도트 그리드 */}
        <div style={{position:'absolute',inset:0,backgroundImage:`radial-gradient(${T.textMute} 1px,transparent 1px)`,backgroundSize:'44px 44px',opacity:0.3}}/>

        {/* 줌인 텍스트 */}
        <div ref={zoomRef} style={{position:'absolute',textAlign:'center',zIndex:10,transformStyle:'preserve-3d'}}>
          <div style={{display:'flex',justifyContent:'center',fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'clamp(4.5rem,16vw,14rem)',fontWeight:900,letterSpacing:'-0.02em',lineHeight:0.88}}>
            {"WONJUN".split('').map((c,i)=>(
              <span key={i} className="zc" style={{display:'inline-block',color: i%2===0 ? T.text : T.lime}}>{c}</span>
            ))}
          </div>
          <p className="zsub" style={{marginTop:'28px',fontSize:'11px',letterSpacing:'5px',color:T.textMute,fontFamily:'var(--font-mono)'}}>SCROLL TO ENTER</p>
        </div>

        {/* 프로필 카드 */}
        <div ref={cardRef} style={{
          position:'absolute',zIndex:5,width:'min(780px,92vw)',
          border:`1px solid ${T.border}`,borderRadius:'22px',
          background:T.bgCard,
          boxShadow:`0 24px 80px rgba(0,0,0,${T===LIGHT?'0.12':'0.45'})`,
          padding:'clamp(20px,4vw,40px)',
          display:'grid',
          gridTemplateColumns:'auto 1fr 1fr',
          gap:'0 clamp(18px,3vw,32px)',
          alignItems:'start'
        }}>
          {/* 사진 */}
          <div style={{gridRow:'1 / 3', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
            <div style={{
              width:'clamp(90px,12vw,130px)',
              aspectRatio:'3/4',
              borderRadius:'14px',
              overflow:'hidden',
              border:`2px solid ${T.lime}`,
              flexShrink:0,
              boxShadow:`0 8px 28px rgba(0,0,0,${T===LIGHT?'0.12':'0.35'})`
            }}>
              <img
                src="/profile.jpg"
                alt="정원준"
                style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}
              />
            </div>
            {/* OPEN TO WORK 뱃지 — 사진 아래 */}
            <span style={{display:'inline-flex',alignItems:'center',gap:'5px',fontSize:'10px',
              color: T===LIGHT ? T.limeText : T.lime,
              background: T===LIGHT ? 'rgba(157,255,0,0.18)' : 'rgba(200,255,0,0.1)',
              border:`1px solid ${T===LIGHT?'rgba(100,180,0,0.28)':'rgba(200,255,0,0.22)'}`,
              padding:'3px 9px',borderRadius:'20px',fontFamily:'var(--font-mono)',whiteSpace:'nowrap'}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:T.lime,display:'inline-block',animation:'blink 1.5s ease-in-out infinite'}}/>
              OPEN TO WORK
            </span>
          </div>

          {/* 헤더 — 이름 */}
          <div style={{gridColumn:'2 / -1',borderBottom:`1px solid ${T.border}`,paddingBottom:'16px',marginBottom:'4px'}}>
            <p style={{margin:'0 0 6px',fontSize:'10px',letterSpacing:'3px',color:T.textMute}}>PROFILE</p>
            <div style={{display:'flex',alignItems:'baseline',gap:'12px',flexWrap:'wrap'}}>
              <h2 style={{margin:0,fontSize:'clamp(1.5rem,3.5vw,2.4rem)',fontWeight:800,color:T.text,letterSpacing:'-0.03em',lineHeight:1.15}}>정원준</h2>
              <span style={{fontSize:'clamp(0.8rem,1.5vw,1rem)',color:T.textMute,fontWeight:400,letterSpacing:'0.06em'}}>JEONG WONJUN</span>
            </div>
          </div>

          {/* 왼쪽 정보 */}
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <InfoRow label="BORN"      val="2000.08.28"                           T={T}/>
            <InfoRow label="LOCATION"  val="경기 평택"                              T={T}/>
            <InfoRow label="EDUCATION" val={"진위고 졸업\n한국교통대 기계항공 중퇴"}  T={T}/>
            <div>
              <p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>CERTIFICATES</p>
              {['운전면허 1종보통 · 2018.11.03','프로그래밍기능사 · 2026.04.17 예정','컴활 2급 · 취득 예정'].map(c=>(
                <p key={c} style={{margin:'0 0 2px',fontSize:'11px',color:T.textSub,fontFamily:'var(--font-mono)',lineHeight:1.7}}>{c}</p>
              ))}
            </div>
          </div>

          {/* 오른쪽 정보 */}
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div>
              <p style={{margin:'0 0 6px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>ROLE</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
                {['Full-Stack','Front-End','Back-End','ERP','Samsung Brity RPA'].map(r=>(
                  <span key={r} style={{fontSize:'10px',padding:'3px 8px',borderRadius:'5px',
                    background:'rgba(157,255,0,0.12)',
                    color: T===LIGHT ? T.limeText : '#7acc00',
                    border:'1px solid rgba(100,180,0,0.22)',
                    fontFamily:'var(--font-mono)',fontWeight:600}}>{r}</span>
                ))}
              </div>
            </div>
            <div>
              <p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>CONTACT</p>
              <p style={{margin:'0 0 2px',fontSize:'12px',color:T.textSub,fontFamily:'var(--font-mono)'}}>xpbpq9981@gmail.com</p>
              <p style={{margin:0,fontSize:'12px',color:T.textSub,fontFamily:'var(--font-mono)'}}>+82 010-3147-4751</p>
            </div>
          </div>
        </div>

        {/* 베일 */}
        <div ref={veilRef} style={{position:'absolute',inset:0,zIndex:8,pointerEvents:'none',
          background:`radial-gradient(ellipse at center,transparent 15%,${T.bg} 72%)`}}/>

        {/* 스크롤 인디케이터 */}
        <div style={{position:'absolute',bottom:'5vh',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',zIndex:20}}>
          <div style={{width:1,height:56,background:`linear-gradient(to bottom,${T.lime},transparent)`,animation:'scrollPulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:'9px',letterSpacing:'3px',color:T.textMute,fontFamily:'var(--font-mono)'}}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}

function InfoRow({label,val,T}) {
  return (
    <div>
      <p style={{margin:'0 0 4px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>{label}</p>
      <p style={{margin:0,fontSize:'13px',color:T.textSub,fontFamily:'var(--font-mono)',lineHeight:1.65,whiteSpace:'pre-line'}}>{val}</p>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About({ T }) {
  const ref = useRef();
  useGSAP(()=>{
    gsap.from(ref.current.querySelectorAll('.rev'),{y:45,opacity:0,duration:0.8,stagger:0.11,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 76%'}});
  },{scope:ref});
  return (
    <section id="about" ref={ref} style={{padding:'13vh 6vw',display:'grid',gridTemplateColumns:'1fr 1.1fr',gap:'6vw',alignItems:'center',borderTop:`1px solid ${T.border}`,background:T.bg}}>
      <div>
        <p className="rev" style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'24px'}}>ABOUT</p>
        <h2 className="rev" style={{fontSize:'clamp(2.2rem,4.5vw,4.5rem)',fontWeight:800,color:T.text,lineHeight:1.1,margin:0,letterSpacing:'-0.035em'}}>
          만드는 것에<br/><span style={{color:T.lime,WebkitTextStroke:`1px ${T===LIGHT?'rgba(80,160,0,0.3)':'transparent'}`}}>진심인</span><br/>개발자입니다.
        </h2>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
        <p className="rev" style={{fontSize:'16px',lineHeight:1.85,color:T.textSub,margin:0,borderLeft:`3px solid ${T.lime}`,paddingLeft:'20px'}}>
          단순히 동작하는 코드가 아니라, <strong style={{color:T.text}}>완성도 있는 제품</strong>을 만드는 것에 집중합니다.
          3D 시뮬레이션부터 ERP 시스템까지, 기술의 경계를 넓히며 성장하고 있습니다.
        </p>
        <div className="rev" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          {[{label:'Projects',value:'4+'},{label:'Stacks',value:'13+'},{label:'Location',value:'평택'},{label:'Status',value:'Open'}].map(item=>(
            <div key={item.label} style={{border:`1px solid ${T.border}`,borderRadius:'12px',padding:'16px 18px',background:T.bgMuted}}>
              <p style={{margin:'0 0 3px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>{item.label.toUpperCase()}</p>
              <p style={{margin:0,fontSize:'22px',fontWeight:700,color:T.text}}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function Skills({ T }) {
  const ref = useRef();
  useGSAP(()=>{
    gsap.from(ref.current.querySelectorAll('.si'),{scale:0.5,opacity:0,duration:0.5,stagger:0.045,ease:'back.out(1.7)',scrollTrigger:{trigger:ref.current,start:'top 78%'}});
  },{scope:ref});
  return (
    <section ref={ref} style={{padding:'10vh 6vw',borderTop:`1px solid ${T.border}`,background:T.bg}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'44px'}}>SKILLS & STACK</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(86px,1fr))',gap:'14px'}}>
        {skills.map(s=>(
          <div key={s.name} className="si"
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',padding:'20px 10px',borderRadius:'14px',
              border:`1px solid ${T.border}`,background:T.bgCard,
              transition:'border-color 0.25s,box-shadow 0.25s,transform 0.22s',cursor:'default'}}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor=T.lime;
              e.currentTarget.style.boxShadow=`0 6px 24px rgba(157,255,0,0.18)`;
              e.currentTarget.style.transform='translateY(-5px)';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor=T.border;
              e.currentTarget.style.boxShadow='none';
              e.currentTarget.style.transform='translateY(0)';
            }}>
            <img src={s.icon} alt={s.name} style={{
              width:36,height:36,objectFit:'contain',
              filter: (() => {
                // 라이트모드: 검정 아이콘(GitHub, Vercel, Three.js) → 짙은 회색으로
                if (T===LIGHT && s.invertLight) return 'invert(0.15) brightness(0.3)';
                // 다크모드: 검정 아이콘(GitHub, Vercel, Three.js) → 밝게 반전
                if (T===DARK && s.invertLight) return 'invert(1) brightness(1.1)';
                return 'none';
              })()
            }} onError={e=>{e.target.style.display='none';}}/>
            <span style={{fontSize:'11px',color:T.textSub,fontFamily:'var(--font-mono)',letterSpacing:'0.3px',textAlign:'center'}}>{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HOLO PROJECT CARD ────────────────────────────────────────────────────────
function HoloCard({ project, T }) {
  const cardRef  = useRef();
  const glareRef = useRef();
  const foilRef  = useRef();

  useGSAP(()=>{
    gsap.from(cardRef.current,{y:65,opacity:0,duration:0.85,ease:'power3.out',scrollTrigger:{trigger:cardRef.current,start:'top 88%'}});
  },{scope:cardRef});

  const onMove = e => {
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX-r.left, y = e.clientY-r.top;
    const dx=(x-r.width/2)/(r.width/2), dy=(y-r.height/2)/(r.height/2);
    gsap.to(cardRef.current,{rotationY:dx*13,rotationX:-dy*9,transformPerspective:900,ease:'power2.out',duration:0.3});
    const px=(x/r.width)*100, py=(y/r.height)*100;
    if(glareRef.current) glareRef.current.style.background=`radial-gradient(circle at ${px}% ${py}%,rgba(255,255,255,0.28) 0%,transparent 60%)`;
    if(foilRef.current){
      const hue=Math.round(((x/r.width)*360+(y/r.height)*120))%360;
      foilRef.current.style.background=`linear-gradient(${115+dx*30}deg,hsla(${hue},100%,65%,0.15) 0%,hsla(${(hue+70)%360},100%,60%,0.12) 33%,hsla(${(hue+160)%360},100%,65%,0.15) 66%,hsla(${(hue+250)%360},100%,60%,0.10) 100%)`;
      foilRef.current.style.opacity='1';
    }
  };
  const onLeave = () => {
    gsap.to(cardRef.current,{rotationY:0,rotationX:0,ease:'power3.out',duration:0.7});
    if(glareRef.current) glareRef.current.style.background='transparent';
    if(foilRef.current)  foilRef.current.style.opacity='0';
    cardRef.current.style.boxShadow='';
  };

  return (
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 20px 50px rgba(${project.shine},0.18), 0 0 0 1px rgba(${project.shine},0.25)`; }}
      style={{
        position:'relative',borderRadius:'18px',overflow:'hidden',cursor:'default',
        border:`1px solid ${T.border}`,
        background: T===LIGHT
          ? `linear-gradient(135deg,rgba(${project.shine},0.05) 0%,${T.bgCard} 60%)`
          : `linear-gradient(135deg,rgba(${project.shine},0.07) 0%,${T.bgCard} 60%)`,
        padding:'clamp(22px,3.2vw,36px)',
        transformStyle:'preserve-3d',willChange:'transform',
        boxShadow: T===LIGHT ? '0 2px 12px rgba(0,0,0,0.07)' : '0 2px 16px rgba(0,0,0,0.3)',
        transition:'box-shadow 0.3s'
      }}>
      {/* 홀로 레이어들 */}
      <div ref={foilRef} style={{position:'absolute',inset:0,opacity:0,transition:'opacity 0.2s',pointerEvents:'none',zIndex:2,borderRadius:'18px',mixBlendMode:'screen'}}/>
      <div ref={glareRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:3,borderRadius:'18px'}}/>

      <div style={{position:'relative',zIndex:4}}>
        {/* 상단 메타 */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'20px',flexWrap:'wrap',gap:'8px'}}>
          <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',padding:'3px 9px',borderRadius:'4px',border:`1px solid rgba(${project.shine},0.4)`,color:project.accent,background:`rgba(${project.shine},0.06)`}}>{project.period}</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',padding:'3px 9px',borderRadius:'4px',border:`1px solid ${T.border}`,color:T.textMute}}>{project.duration}</span>
            {project.ongoing && (
              <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',padding:'3px 9px',borderRadius:'4px',background:`rgba(${project.shine},0.12)`,color:project.accent,border:`1px solid rgba(${project.shine},0.3)`,display:'inline-flex',alignItems:'center',gap:'5px'}}>
                <span style={{width:5,height:5,borderRadius:'50%',background:project.accent,display:'inline-block',animation:'blink 1.2s ease-in-out infinite'}}/>IN PROGRESS
              </span>
            )}
          </div>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textMute}}>{project.index}</span>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'12px',marginBottom:'12px'}}>
          <h3 style={{fontSize:'clamp(1.5rem,2.8vw,2.4rem)',fontWeight:800,color:T.text,margin:0,letterSpacing:'-0.03em',lineHeight:1.1,whiteSpace:'pre-line'}}>{project.title}</h3>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:T.textMute,paddingTop:'6px',whiteSpace:'nowrap'}}>{project.role}</span>
        </div>

        <p style={{fontSize:'14px',lineHeight:1.8,color:T.textSub,margin:'0 0 20px',maxWidth:'440px'}}>{project.description}</p>

        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'20px'}}>
          {project.tags.map(t=>(
            <span key={t} style={{fontFamily:'var(--font-mono)',fontSize:'10px',padding:'3px 8px',borderRadius:'4px',background:T.bgMuted,color:T.textSub,border:`1px solid ${T.border}`}}>{t}</span>
          ))}
        </div>

        <div style={{display:'flex',gap:'18px',borderTop:`1px solid ${T.border}`,paddingTop:'18px'}}>
          <a href={project.github} target="_blank" rel="noreferrer" data-cursor="link" onClick={e=>e.stopPropagation()}
            style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:project.accent,textDecoration:'none',fontWeight:600,transition:'opacity 0.2s'}}
            onMouseEnter={e=>e.target.style.opacity='0.6'} onMouseLeave={e=>e.target.style.opacity='1'}>
            GitHub ↗
          </a>
          {project.demo&&(
            <a href={project.demo} target="_blank" rel="noreferrer" data-cursor="link" onClick={e=>e.stopPropagation()}
              style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:T.textSub,textDecoration:'none',transition:'color 0.2s'}}
              onMouseEnter={e=>e.target.style.color=T.text} onMouseLeave={e=>e.target.style.color=T.textSub}>
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects({ T }) {
  return (
    <section id="works" style={{padding:'10vh 6vw',borderTop:`1px solid ${T.border}`,background:T.bg}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'44px'}}>SELECTED WORKS</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,460px),1fr))',gap:'18px'}}>
        {myProjects.map(p=><HoloCard key={p.id} project={p} T={T}/>)}
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact({ T }) {
  const ref = useRef();
  useGSAP(()=>{
    gsap.from(ref.current.querySelector('.cta'),{y:70,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:ref.current,start:'top 72%'}});
  },{scope:ref});
  return (
    <section id="contact" ref={ref} style={{padding:'14vh 6vw 12vh',borderTop:`1px solid ${T.border}`,background:T.bg,textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'32px'}}>LET'S BUILD TOGETHER</p>
      <div style={{overflow:'hidden'}}>
        <a href="mailto:xpbpq9981@gmail.com" className="cta" data-cursor="link"
          style={{display:'block',fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'clamp(2.8rem,8vw,9rem)',fontWeight:900,color:T.text,textDecoration:'none',letterSpacing:'-0.03em',lineHeight:1,transition:'color 0.3s'}}
          onMouseEnter={e=>e.currentTarget.style.color=T.lime} onMouseLeave={e=>e.currentTarget.style.color=T.text}>
          GET IN TOUCH ↗
        </a>
      </div>
      <div style={{marginTop:'28px',display:'flex',flexDirection:'column',gap:'6px',alignItems:'center'}}>
        <p style={{margin:0,fontSize:'13px',color:T.textMute,fontFamily:'var(--font-mono)'}}>xpbpq9981@gmail.com</p>
        <p style={{margin:0,fontSize:'13px',color:T.textMute,fontFamily:'var(--font-mono)'}}>+82 010-3147-4751</p>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = ({T}) => (
  <footer style={{padding:'32px 6vw',borderTop:`1px solid ${T.border}`,background:T.bg,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textMute}}>© 2026 JEONG WONJUN</span>
    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textMute}}>PYEONGTAEK, KR</span>
  </footer>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { T, dark, toggle } = useTheme();
  return (
    <div style={{background:T.bg,minHeight:'100vh',cursor:'none',transition:'background 0.4s'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root{--font-mono:'JetBrains Mono',monospace;}
        *{box-sizing:border-box;}
        body{margin:0;overflow-x:hidden;}
        ::selection{background:#9dff00;color:#0a0a0a;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#9dff00;border-radius:2px;}
        @keyframes scrollPulse{0%,100%{opacity:.3;}50%{opacity:1;}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
      `}</style>
      <Cursor T={T}/>
      <Navbar T={T} dark={dark} toggle={toggle}/>
      <ScrollZoomIntro T={T}/>
      <About T={T}/>
      <Skills T={T}/>
      <Projects T={T}/>
      <Contact T={T}/>
      <Footer T={T}/>
    </div>
  );
}