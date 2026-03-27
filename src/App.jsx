import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── DATA ────────────────────────────────────────────────────────────────────
const myProjects = [
  {
    id: 1, index: "01",
    title: "Eyewear\nShopping Mall",
    year: "2024", role: "Full-Stack Dev",
    description: "아이웨어 브랜드 커머스 플랫폼. Full-Stack의 기반을 완성한 첫 팀 프로젝트로, 데이터 흐름 설계부터 UI 구현까지 전 영역을 담당했습니다.",
    github: "https://github.com/jiwoong-0708/team3file.git",
    tags: ["HTML5", "CSS3", "Node.js", "Express", "MySQL"],
    accent: "#c8ff00", shine: "120,255,0"
  },
  {
    id: 2, index: "02",
    title: "TopGun\nFlight Sim",
    year: "2024", role: "Creative Dev",
    description: "Three.js 기반 3D 공중전 시뮬레이션. 복잡한 비행 물리 로직을 구현하고 Firebase / Capacitor로 웹·앱 동시 배포까지 완성했습니다.",
    github: "https://github.com/w0njunipnida/dogfight-simulation.git",
    demo: "https://dogfight-32b50.web.app",
    tags: ["Three.js", "TypeScript", "Firebase", "Capacitor"],
    accent: "#ff6b35", shine: "255,107,53"
  },
  {
    id: 3, index: "03",
    title: "Accounting\nRPA System",
    year: "2024", role: "Automation Dev",
    description: "Samsung Brity RPA + Python(Pandas)로 구축한 회계 자동화 시스템. 반복 업무를 제거하고 처리 효율을 극대화한 기업형 솔루션.",
    github: "https://github.com/w0njunipnida/AAS_accounting_automation_system.git",
    tags: ["Brity RPA", "Python", "Pandas", "Openpyxl"],
    accent: "#00d4ff", shine: "0,212,255"
  },
  {
    id: 4, index: "04",
    title: "Logistics\nERP System",
    year: "2025", role: "Backend Dev",
    description: "Spring Boot + MyBatis 기반 기업형 물류 관리 ERP. MVC 아키텍처로 재고·입출고 데이터 무결성을 보장하는 현재 진행 중인 프로젝트.",
    github: "https://github.com/san123452/ESS_ERP.git",
    tags: ["Java", "Spring Boot", "MyBatis", "MariaDB"],
    accent: "#bf5fff", shine: "191,95,255"
  }
];

// 스킬 아이콘 - devicons CDN
const skills = [
  { name: "Java",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Spring",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Node.js",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Three.js",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
  { name: "MySQL",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MariaDB",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg" },
  { name: "Firebase",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Git",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
];

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const ringRef = useRef();
  const dotRef  = useRef();
  useEffect(() => {
    let mx=0,my=0,rx=0,ry=0,raf;
    const mv = e => { mx=e.clientX; my=e.clientY; gsap.to(dotRef.current,{x:mx,y:my,duration:0.04}); };
    const ov = e => {
      const t = e.target.closest('[data-cursor]')?.dataset.cursor;
      if(t==='link')    gsap.to(ringRef.current,{scale:2.2,backgroundColor:'#c8ff00',duration:0.3});
      else if(t==='card') gsap.to(ringRef.current,{scale:0.4,backgroundColor:'rgba(255,255,255,0.9)',duration:0.2});
      else              gsap.to(ringRef.current,{scale:1,backgroundColor:'transparent',duration:0.3});
    };
    const tick=()=>{ rx+=(mx-rx)*0.09; ry+=(my-ry)*0.09; gsap.set(ringRef.current,{x:rx,y:ry}); raf=requestAnimationFrame(tick); };
    window.addEventListener('mousemove',mv);
    window.addEventListener('mouseover',ov);
    tick();
    return ()=>{ window.removeEventListener('mousemove',mv); window.removeEventListener('mouseover',ov); cancelAnimationFrame(raf); };
  },[]);
  return (
    <>
      <div ref={ringRef} style={{position:'fixed',top:-20,left:-20,width:40,height:40,borderRadius:'50%',border:'1.5px solid rgba(255,255,255,0.55)',backgroundColor:'transparent',pointerEvents:'none',zIndex:9999,transform:'translate(-50%,-50%)',mixBlendMode:'difference'}}/>
      <div ref={dotRef}  style={{position:'fixed',top:0,left:0,width:5,height:5,borderRadius:'50%',backgroundColor:'#c8ff00',pointerEvents:'none',zIndex:10000,transform:'translate(-50%,-50%)'}}/>
    </>
  );
}

// ─── NOISE ────────────────────────────────────────────────────────────────────
const Noise = () => (
  <div style={{position:'fixed',inset:0,zIndex:2,pointerEvents:'none',opacity:0.032,
    backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{ const h=()=>setScrolled(window.scrollY>50); window.addEventListener('scroll',h); return()=>window.removeEventListener('scroll',h); },[]);
  return (
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,padding:'22px 6vw',display:'flex',justifyContent:'space-between',alignItems:'center',
      background:scrolled?'rgba(13,13,15,0.8)':'transparent',backdropFilter:scrolled?'blur(24px)':'none',transition:'background 0.5s,backdrop-filter 0.5s'}}>
      <span style={{fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'22px',color:'#fff',letterSpacing:'2px'}}>
        W<span style={{color:'#c8ff00'}}>.</span>JEONG
      </span>
      <div style={{display:'flex',gap:'30px'}}>
        {['About','Works','Contact'].map(n=>(
          <a key={n} href={`#${n.toLowerCase()}`} data-cursor="link"
            style={{fontSize:'12px',letterSpacing:'1px',color:'rgba(255,255,255,0.4)',textDecoration:'none',transition:'color 0.2s'}}
            onMouseEnter={e=>e.target.style.color='#c8ff00'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.4)'}>{n}</a>
        ))}
      </div>
    </nav>
  );
}

// ─── SCROLL ZOOM INTRO ────────────────────────────────────────────────────────
function ScrollZoomIntro() {
  const secRef  = useRef();
  const zoomRef = useRef();
  const cardRef = useRef();
  const veilRef = useRef();

  useGSAP(()=>{
    gsap.from(zoomRef.current.querySelectorAll('.zc'),{y:110,opacity:0,duration:1.1,stagger:0.065,ease:'power4.out',delay:0.15});
    gsap.from(zoomRef.current.querySelector('.zsub'),{y:24,opacity:0,duration:0.85,delay:1,ease:'power3.out'});

    const tl = gsap.timeline({ scrollTrigger:{ trigger:secRef.current, start:'top top', end:'bottom bottom', scrub:1.4 }});
    tl.to(zoomRef.current,{scale:22,opacity:0,duration:3,ease:'power2.in'})
      .to(veilRef.current,{opacity:0,duration:1.2},'-=2')
      .from(cardRef.current,{scale:0.72,opacity:0,y:50,duration:2,ease:'power3.out'},'-=0.6');
  },{scope:secRef});

  return (
    <section ref={secRef} style={{height:'310vh',position:'relative'}}>
      <div style={{position:'sticky',top:0,height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',perspective:'1400px'}}>
        {/* 도트 그리드 */}
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.055) 1px,transparent 1px)',backgroundSize:'44px 44px'}}/>

        {/* 줌인 텍스트 */}
        <div ref={zoomRef} style={{position:'absolute',textAlign:'center',zIndex:10,transformStyle:'preserve-3d'}}>
          <div style={{display:'flex',justifyContent:'center',fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'clamp(4.5rem,16vw,14rem)',fontWeight:900,letterSpacing:'-0.02em',lineHeight:0.88}}>
            {"WONJUN".split('').map((c,i)=>(<span key={i} className="zc" style={{display:'inline-block',color:i%2===0?'#fff':'#c8ff00'}}>{c}</span>))}
          </div>
          <p className="zsub" style={{marginTop:'28px',fontSize:'11px',letterSpacing:'5px',color:'rgba(255,255,255,0.32)',fontFamily:'var(--font-mono)'}}>SCROLL TO ENTER</p>
        </div>

        {/* 프로필 카드 */}
        <div ref={cardRef} style={{position:'absolute',zIndex:5,width:'min(680px,88vw)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'20px',background:'rgba(13,13,15,0.9)',backdropFilter:'blur(30px)',padding:'clamp(24px,4.5vw,48px)',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'28px 36px'}}>
          <div style={{gridColumn:'1 / -1',borderBottom:'1px solid rgba(255,255,255,0.07)',paddingBottom:'22px'}}>
            <p style={{margin:'0 0 10px',fontSize:'10px',letterSpacing:'3px',color:'rgba(255,255,255,0.28)'}}>PROFILE</p>
            <h2 style={{margin:0,fontSize:'clamp(1.7rem,4vw,2.8rem)',fontWeight:800,color:'#fff',letterSpacing:'-0.03em',lineHeight:1.15}}>
              정원준 &nbsp;<span style={{color:'rgba(255,255,255,0.28)',fontSize:'0.52em',fontWeight:400,letterSpacing:'0.08em'}}>JEONG WONJUN</span>
            </h2>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>
            {[{label:'BORN',val:'2000.08.28'},{label:'EDUCATION',val:'진위고 졸업\n한국교통대 기계항공 중퇴'}].map(r=>(
              <div key={r.label}>
                <p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:'rgba(255,255,255,0.28)'}}>{r.label}</p>
                <p style={{margin:0,fontSize:'13px',color:'rgba(255,255,255,0.68)',fontFamily:'var(--font-mono)',lineHeight:1.65,whiteSpace:'pre-line'}}>{r.val}</p>
              </div>
            ))}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'18px'}}>
            <div><p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:'rgba(255,255,255,0.28)'}}>ROLE</p><p style={{margin:0,fontSize:'14px',color:'#c8ff00',fontWeight:700}}>Full-Stack Developer</p></div>
            <div><p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:'rgba(255,255,255,0.28)'}}>CONTACT</p><p style={{margin:0,fontSize:'12px',color:'rgba(255,255,255,0.65)',fontFamily:'var(--font-mono)',wordBreak:'break-all'}}>xpbpq9981@gmail.com</p></div>
            <div>
              <p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:'rgba(255,255,255,0.28)'}}>STATUS</p>
              <span style={{display:'inline-flex',alignItems:'center',gap:'7px',fontSize:'11px',color:'#c8ff00',fontFamily:'var(--font-mono)'}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#c8ff00',display:'inline-block',animation:'blink 1.5s ease-in-out infinite'}}/>
                OPEN TO WORK
              </span>
            </div>
          </div>
        </div>

        {/* 베일 */}
        <div ref={veilRef} style={{position:'absolute',inset:0,zIndex:8,pointerEvents:'none',background:'radial-gradient(ellipse at center,transparent 15%,#0d0d0f 72%)'}}/>

        {/* 스크롤 인디케이터 */}
        <div style={{position:'absolute',bottom:'5vh',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',zIndex:20}}>
          <div style={{width:1,height:56,background:'linear-gradient(to bottom,#c8ff00,transparent)',animation:'scrollPulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:'9px',letterSpacing:'3px',color:'rgba(255,255,255,0.22)',fontFamily:'var(--font-mono)'}}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const ref = useRef();
  useGSAP(()=>{
    gsap.from(ref.current.querySelectorAll('.rev'),{y:50,opacity:0,duration:0.85,stagger:0.12,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 76%'}});
  },{scope:ref});
  return (
    <section id="about" ref={ref} style={{padding:'13vh 6vw',display:'grid',gridTemplateColumns:'1fr 1.1fr',gap:'6vw',alignItems:'center',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
      <div>
        <p className="rev" style={{fontSize:'11px',letterSpacing:'3px',color:'rgba(255,255,255,0.28)',marginBottom:'26px'}}>ABOUT</p>
        <h2 className="rev" style={{fontSize:'clamp(2.2rem,4.5vw,4.5rem)',fontWeight:800,color:'#fff',lineHeight:1.1,margin:0,letterSpacing:'-0.035em'}}>
          만드는 것에<br/><span style={{color:'#c8ff00'}}>진심인</span><br/>개발자입니다.
        </h2>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'22px'}}>
        <p className="rev" style={{fontSize:'16px',lineHeight:1.85,color:'rgba(255,255,255,0.52)',margin:0,borderLeft:'2px solid rgba(200,255,0,0.55)',paddingLeft:'20px'}}>
          단순히 동작하는 코드가 아니라, <strong style={{color:'#e8e8e8'}}>완성도 있는 제품</strong>을 만드는 것에 집중합니다.
          3D 시뮬레이션부터 ERP 시스템까지, 기술의 경계를 넓히며 성장하고 있습니다.
        </p>
        <div className="rev" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'11px'}}>
          {[{label:'Projects',value:'4+'},{label:'Stacks',value:'12+'},{label:'Location',value:'Seoul'},{label:'Status',value:'Open'}].map(item=>(
            <div key={item.label} style={{border:'1px solid rgba(255,255,255,0.08)',borderRadius:'12px',padding:'17px 19px',background:'rgba(255,255,255,0.03)'}}>
              <p style={{margin:'0 0 4px',fontSize:'9px',letterSpacing:'2px',color:'rgba(255,255,255,0.3)'}}>{item.label.toUpperCase()}</p>
              <p style={{margin:0,fontSize:'24px',fontWeight:700,color:'#fff'}}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS (아이콘 그리드) ───────────────────────────────────────────────────
function Skills() {
  const ref = useRef();
  useGSAP(()=>{
    gsap.from(ref.current.querySelectorAll('.skill-icon'),{
      scale:0.5,opacity:0,duration:0.55,stagger:0.05,ease:'back.out(1.7)',
      scrollTrigger:{trigger:ref.current,start:'top 78%'}
    });
  },{scope:ref});

  return (
    <section ref={ref} style={{padding:'10vh 6vw',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:'rgba(255,255,255,0.28)',marginBottom:'50px'}}>SKILLS & STACK</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))',gap:'16px'}}>
        {skills.map(s=>(
          <div key={s.name} className="skill-icon" style={{
            display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',
            padding:'22px 12px',borderRadius:'14px',
            border:'1px solid rgba(255,255,255,0.07)',
            background:'rgba(255,255,255,0.03)',
            transition:'border-color 0.3s,background 0.3s,transform 0.25s',
            cursor:'default'
          }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor='rgba(200,255,0,0.35)';
              e.currentTarget.style.background='rgba(200,255,0,0.05)';
              e.currentTarget.style.transform='translateY(-5px)';
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';
              e.currentTarget.style.background='rgba(255,255,255,0.03)';
              e.currentTarget.style.transform='translateY(0)';
            }}
          >
            <img src={s.icon} alt={s.name} style={{width:38,height:38,objectFit:'contain'}} onError={e=>{e.target.style.display='none';}}/>
            <span style={{fontSize:'11px',color:'rgba(255,255,255,0.45)',fontFamily:'var(--font-mono)',letterSpacing:'0.5px',textAlign:'center'}}>{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── HOLO PROJECT CARD ────────────────────────────────────────────────────────
// 포켓몬 카드처럼 마우스 위치 따라 3D 틸트 + 홀로그램 shimmer
function HoloCard({ project }) {
  const cardRef  = useRef();
  const glareRef = useRef();
  const foilRef  = useRef();

  useGSAP(()=>{
    gsap.from(cardRef.current,{y:70,opacity:0,duration:0.9,ease:'power3.out',scrollTrigger:{trigger:cardRef.current,start:'top 88%'}});
  },{scope:cardRef});

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width  / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;  // -1 ~ 1
    const dy = (y - cy) / cy;

    const rotY =  dx * 14;
    const rotX = -dy * 10;

    gsap.to(card, { rotationY: rotY, rotationX: rotX, transformPerspective: 900, ease: 'power2.out', duration: 0.35 });

    // 광택 위치
    const px = (x / rect.width)  * 100;
    const py = (y / rect.height) * 100;

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.22) 0%, transparent 65%)`;
    }
    if (foilRef.current) {
      // 홀로 foil: 마우스 위치 따라 hue shift
      const hue = Math.round(((x / rect.width) * 360 + (y / rect.height) * 120)) % 360;
      foilRef.current.style.background =
        `linear-gradient(${115 + dx * 30}deg,
          hsla(${hue},100%,70%,0.13) 0%,
          hsla(${(hue+60)%360},100%,65%,0.10) 25%,
          hsla(${(hue+140)%360},100%,70%,0.13) 50%,
          hsla(${(hue+220)%360},100%,65%,0.10) 75%,
          hsla(${(hue+300)%360},100%,70%,0.08) 100%)`;
      foilRef.current.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    gsap.to(card, { rotationY: 0, rotationX: 0, ease: 'power3.out', duration: 0.7 });
    if (glareRef.current) glareRef.current.style.background = 'transparent';
    if (foilRef.current)  foilRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      data-cursor="card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative', borderRadius: '20px', overflow: 'hidden',
        border: `1px solid rgba(${project.shine},0.18)`,
        background: `linear-gradient(135deg, rgba(${project.shine},0.06) 0%, rgba(13,13,15,0.95) 60%)`,
        padding: 'clamp(24px,3.5vw,40px)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'box-shadow 0.3s',
        cursor: 'default'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(${project.shine},0.2), 0 0 0 1px rgba(${project.shine},0.3)`;
      }}
      onMouseLeave2={e => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 홀로 포일 레이어 */}
      <div ref={foilRef} style={{position:'absolute',inset:0,opacity:0,transition:'opacity 0.2s',pointerEvents:'none',zIndex:2,borderRadius:'20px',mixBlendMode:'screen'}}/>
      {/* 글레어 레이어 */}
      <div ref={glareRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:3,borderRadius:'20px'}}/>

      {/* 카드 내용 */}
      <div style={{position:'relative',zIndex:4}}>
        {/* 상단 메타 */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'28px'}}>
          <div style={{display:'flex',gap:'8px'}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',letterSpacing:'1px',padding:'3px 9px',borderRadius:'4px',border:`1px solid rgba(${project.shine},0.4)`,color:project.accent}}>{project.year}</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',letterSpacing:'1px',padding:'3px 9px',borderRadius:'4px',border:'1px solid rgba(255,255,255,0.08)',color:'rgba(255,255,255,0.35)'}}>{project.role}</span>
          </div>
          <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:`rgba(${project.shine},0.4)`}}>{project.index}</span>
        </div>

        {/* 제목 */}
        <h3 style={{fontSize:'clamp(1.6rem,3vw,2.6rem)',fontWeight:800,color:'#fff',margin:'0 0 16px',letterSpacing:'-0.03em',lineHeight:1.1,whiteSpace:'pre-line'}}>{project.title}</h3>

        {/* 설명 */}
        <p style={{fontSize:'14px',lineHeight:1.8,color:'rgba(255,255,255,0.48)',margin:'0 0 28px',maxWidth:'440px'}}>{project.description}</p>

        {/* 태그 */}
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'28px'}}>
          {project.tags.map(t=>(
            <span key={t} style={{fontFamily:'var(--font-mono)',fontSize:'10px',padding:'3px 8px',borderRadius:'4px',background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.07)'}}>{t}</span>
          ))}
        </div>

        {/* 링크 */}
        <div style={{display:'flex',gap:'20px',borderTop:'1px solid rgba(255,255,255,0.07)',paddingTop:'20px'}}>
          <a href={project.github} target="_blank" rel="noreferrer" data-cursor="link" onClick={e=>e.stopPropagation()}
            style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:project.accent,textDecoration:'none',letterSpacing:'1px',transition:'opacity 0.2s'}}
            onMouseEnter={e=>e.target.style.opacity='0.6'} onMouseLeave={e=>e.target.style.opacity='1'}>
            GitHub ↗
          </a>
          {project.demo&&(
            <a href={project.demo} target="_blank" rel="noreferrer" data-cursor="link" onClick={e=>e.stopPropagation()}
              style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'rgba(255,255,255,0.5)',textDecoration:'none',letterSpacing:'1px',transition:'color 0.2s'}}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.5)'}>
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function Projects() {
  const ref = useRef();
  return (
    <section id="works" ref={ref} style={{padding:'10vh 6vw',borderTop:'1px solid rgba(255,255,255,0.07)'}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:'rgba(255,255,255,0.28)',marginBottom:'48px'}}>SELECTED WORKS</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,480px),1fr))',gap:'20px'}}>
        {myProjects.map(p=><HoloCard key={p.id} project={p}/>)}
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef();
  useGSAP(()=>{
    gsap.from(ref.current.querySelector('.cta'),{y:70,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:ref.current,start:'top 72%'}});
  },{scope:ref});
  return (
    <section id="contact" ref={ref} style={{padding:'14vh 6vw 12vh',borderTop:'1px solid rgba(255,255,255,0.07)',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center'}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:'rgba(255,255,255,0.28)',marginBottom:'34px'}}>LET'S BUILD TOGETHER</p>
      <div style={{overflow:'hidden'}}>
        <a href="mailto:xpbpq9981@gmail.com" className="cta" data-cursor="link"
          style={{display:'block',fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'clamp(2.8rem,8vw,9rem)',fontWeight:900,color:'#fff',textDecoration:'none',letterSpacing:'-0.03em',lineHeight:1,transition:'color 0.3s'}}
          onMouseEnter={e=>e.currentTarget.style.color='#c8ff00'} onMouseLeave={e=>e.currentTarget.style.color='#fff'}>
          GET IN TOUCH ↗
        </a>
      </div>
      <p style={{marginTop:'32px',fontSize:'13px',color:'rgba(255,255,255,0.28)',fontFamily:'var(--font-mono)'}}>xpbpq9981@gmail.com</p>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{padding:'34px 6vw',borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'rgba(255,255,255,0.18)'}}>© 2026 JEONG WONJUN</span>
    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'rgba(255,255,255,0.18)'}}>SEOUL, KR</span>
  </footer>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{background:'#0d0d0f',minHeight:'100vh',cursor:'none'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap');
        :root { --font-mono:'JetBrains Mono',monospace; }
        *{box-sizing:border-box;}
        body{margin:0;overflow-x:hidden;background:#0d0d0f;}
        ::selection{background:#c8ff00;color:#0d0d0f;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#c8ff00;}
        @keyframes scrollPulse{0%,100%{opacity:.22;}50%{opacity:1;}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.15;}}
      `}</style>
      <Cursor/>
      <Noise/>
      <Navbar/>
      <ScrollZoomIntro/>
      <About/>
      <Skills/>
      <Projects/>
      <Contact/>
      <Footer/>
    </div>
  );
}