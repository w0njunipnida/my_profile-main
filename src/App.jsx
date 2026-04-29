import { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, PresentationControls } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── THEME ───────────────────────────────────────────────────────────────────
const LIGHT = {
  bg:'#f0f0eb', bgCard:'#ffffff', bgMuted:'#e8e8e3',
  border:'rgba(0,0,0,0.08)', text:'#0a0a0a', textSub:'#555550',
  textMute:'#999990', lime:'#9dff00', limeText:'#2a4a00',
};
const DARK = {
  bg:'#111114', bgCard:'#1a1a1e', bgMuted:'#222226',
  border:'rgba(255,255,255,0.08)', text:'#f0f0ec', textSub:'#aaaaaa',
  textMute:'#555555', lime:'#c8ff00', limeText:'#0a0a0a',
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const myProjects = [
  {
    id:1, index:"01", title:"Eyewear\nShopping Mall",
    image:"/eye.png", imagePosition:"center 24%",
    period:"2025.12.01 – 12.12", duration:"2주 · 100h · 팀", role:"Full-Stack Dev",
    description:"아이웨어 브랜드 커머스 플랫폼. Full-Stack의 기반을 완성한 첫 팀 프로젝트로, 데이터 흐름 설계부터 UI 구현까지 전 영역을 담당했습니다.",
    github:"https://github.com/jiwoong-0708/team3file.git",
    pdf:"/EYE_PDF.pdf",
    tags:["HTML5","CSS3","Node.js","Express","MySQL"],
    accent:"#9dff00", shine:"157,255,0", ongoing:false,
  },
  {
    id:2, index:"02", title:"TopGun\nFlight Sim",
    image:"/topgun.png", imagePosition:"center 92%",
    period:"2026.01.26 – 02.02", duration:"1주 · 40h · 단독", role:"Creative Dev",
    description:"Three.js 기반 3D 공중전 시뮬레이션. 복잡한 비행 물리 로직을 구현하고 Firebase / Capacitor로 웹·앱 동시 배포까지 완성한 단독 프로젝트.",
    github:"https://github.com/w0njunipnida/dogfight-simulation.git",
    demo:"https://dogfight-32b50.web.app",
    tags:["Three.js","TypeScript","Firebase","Capacitor"],
    accent:"#ff6b35", shine:"255,107,53", ongoing:false,
  },
  {
    id:3, index:"03", title:"Accounting\nRPA System",
    image:"/rpa.png", imagePosition:"center center",
    period:"2026.02.27 – 03.09", duration:"10일 · 60h · 팀", role:"Automation Dev",
    description:"Samsung Brity RPA + Python(Pandas)로 구축한 회계 자동화 시스템. 반복 업무를 제거하고 처리 효율을 극대화한 기업형 솔루션.",
    github:"https://github.com/w0njunipnida/AAS_accounting_automation_system.git",
    pdf:"/RPA_PDF.pdf",
    tags:["Brity RPA","Python","Pandas","Openpyxl"],
    accent:"#00d4ff", shine:"0,212,255", ongoing:false,
  },
  {
    id:4, index:"04", title:"Logistics\nERP System",
    image:"/erp.png", imagePosition:"center 18%",
    period:"2026.03.11 – 04.30", duration:"7주 · 280h · 팀", role:"Backend Dev",
    description:"Spring Boot + MyBatis 기반 기업형 물류 관리 ERP. FastAPI + Python으로 재무 분석 엔진을 구축하고, Scikit-learn·Statsmodels Holt-Winters로 60일·12개월 AI 매출 예측을 구현했습니다.",
    github:"https://github.com/san123452/ESS_ERP.git",
    pdf:"/ESS_PDF.pdf",
    tags:["Java","Spring Boot","MyBatis","MariaDB","Python","FastAPI","Pandas","Scikit-learn","Brity RPA"],
    accent:"#bf5fff", shine:"191,95,255", ongoing:false,
  }
];

const skills = [
  {name:"Java",        icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"},
  {name:"JavaScript",  icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"},
  {name:"TypeScript",  icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"},
  {name:"Python",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"},
  {name:"Spring",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"},
  {name:"FastAPI",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg"},
  {name:"React",       icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"},
  {name:"Node.js",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"},
  {name:"Three.js",    icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", inv:true},
  {name:"Pandas",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg"},
  {name:"NumPy",       icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg"},
  {name:"Scikit-learn",icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg"},
  {name:"MySQL",       icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"},
  {name:"MariaDB",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg"},
  {name:"Android",     icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg"},
  {name:"Firebase",    icon:"/firebase.svg"},
  {name:"GitHub",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", inv:true},
  {name:"Vercel",      icon:"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg", inv:true},
  {name:"Brity RPA",   icon:"/samsung-brity-automation-rpa.PNG"},
];

function useTheme() {
  const [dark,setDark]=useState(false);
  return {T:dark?DARK:LIGHT, dark, toggle:()=>setDark(p=>!p)};
}

// ─── MACBOOK 3D MODEL ─────────────────────────────────────────────────────────
function MacBookModel({ isOpen, onOpenComplete }) {
  const group = useRef();
  const lidRef = useRef(null);
  const zoomStartedRef = useRef(false);
  const { scene } = useGLTF('/macbook.glb');
  const plainScreenMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#050505',
    toneMapped: false,
    side: THREE.DoubleSide,
  }), []);

  // 1) 뚜껑 파트 캐싱 — useEffect는 항상 위에
  useEffect(() => {
    scene.traverse((child) => {
      // 파트명 확인 결과: 화면부 = Bevels_2
      if (!lidRef.current && child.name === 'Bevels_2') {
        lidRef.current = child;
      }
      if (child.isMesh && child.material?.name === 'Material.002') {
        child.material = plainScreenMaterial;
      }
    });
  }, [scene, plainScreenMaterial]);

  // 2) 뚜껑 열기
  useEffect(() => {
    if (!isOpen) return;
    zoomStartedRef.current = false;
    const startZoom = () => {
      if (zoomStartedRef.current) return;
      zoomStartedRef.current = true;
      onOpenComplete();
    };
    if (lidRef.current) {
      gsap.to(lidRef.current.rotation, {
        x: -Math.PI * 0.72,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (lidRef.current.rotation.x < -1.45) startZoom();
        },
        onComplete: startZoom,
      });
    } else {
      setTimeout(startZoom, 1000);
    }
  }, [isOpen]);

  // 3) float + 마우스 틸트
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.y = isOpen ? 0 : Math.sin(t * 0.7) * 0.04;
    const tx = (state.mouse.x * Math.PI) / 16;
    const ty = (state.mouse.y * Math.PI) / 24;
    const targetY = isOpen ? 0 : tx;
    const targetX = isOpen ? 0 : -ty * 0.25;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} scale={3.05} position={[0, -0.05, 0]} />
    </group>
  );
}

// ─── MACBOOK SCREEN CONTENT (맥북 화면 안에 표시될 내용) ────────────────────
function MacBookScreen() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '12px', overflow: 'hidden',
      fontFamily: '"Bebas Neue", Impact, sans-serif',
    }}>
      {/* 메뉴바 */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '20px', background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', padding: '0 10px', gap: '5px',
      }}>
        {['#ff5f57','#febc2e','#28c840'].map((c,i) => (
          <div key={i} style={{width:8,height:8,borderRadius:'50%',background:c}}/>
        ))}
        <span style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          fontSize: '8px', color: 'rgba(255,255,255,0.4)',
          fontFamily: 'monospace', letterSpacing: '2px',
        }}>wonjun.dev</span>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{fontSize:'clamp(1.8rem,5vw,4rem)',fontWeight:900,letterSpacing:'-0.02em',color:'#fff',lineHeight:0.9,textAlign:'center'}}>
        WONJUN<span style={{color:'#9dff00'}}>.</span>DEV
      </div>
      <div style={{fontFamily:'monospace',fontSize:'clamp(6px,1.2vw,11px)',color:'rgba(255,255,255,0.35)',letterSpacing:'3px'}}>
        FULL-STACK DEVELOPER
      </div>
      {/* 로딩바 */}
      <div style={{width:'80px',height:'2px',background:'rgba(255,255,255,0.1)',borderRadius:1,overflow:'hidden',marginTop:'8px'}}>
        <div style={{height:'100%',background:'#9dff00',borderRadius:1,animation:'loadBar 1.5s ease-out forwards'}}/>
      </div>
    </div>
  );
}

// ─── MACBOOK INTRO SCENE ──────────────────────────────────────────────────────
function MacBookIntroScene({ onComplete }) {
  const [phase, setPhase] = useState('idle');
  const [showHint, setShowHint] = useState(true);
  const overlayRef = useRef();
  const hintRef = useRef();
  const canvasWrapRef = useRef();

  useEffect(() => {
    if (hintRef.current) {
      gsap.from(hintRef.current, { opacity: 0, y: 10, duration: 1, delay: 1.2 });
    }
  }, []);

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('opening');
    setShowHint(false);
    if (hintRef.current) gsap.to(hintRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleOpenComplete = () => {
    setPhase('zooming');
    gsap.timeline()
      .to(canvasWrapRef.current, {
        scale: 7.4,
        y: '48vh',
        duration: 1.6,
        ease: 'power3.inOut',
      })
      .to(overlayRef.current, {
        opacity: 0, duration: 0.6, ease: 'power2.out',
        onComplete: () => { setPhase('done'); onComplete(); }
      }, '-=0.3');
  };

  if (phase === 'done') return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        // 밝은 크림/웜 그레이 배경
        background: 'radial-gradient(ellipse at 50% 40%, #f5f0ea 0%, #ede8e0 50%, #e5dfd6 100%)',
        cursor: phase === 'idle' ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
    >
      {/* 미세 도트 그리드 — 어두운 배경에선 밝게, 밝은 배경에선 어둡게 */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        pointerEvents: 'none',
      }}/>
      {/* 중앙 vignette (가장자리 살짝 어둡게) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.08) 100%)',
        pointerEvents: 'none',
      }}/>

      {/* 3D Canvas */}
      <div ref={canvasWrapRef} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 39%' }}>
        <Canvas
          camera={{ position: [0, 0.62, 3.35], fov: 38 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          onCreated={({ gl }) => {
            // Context Lost 복구 핸들러
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              console.warn('WebGL context lost, attempting restore...');
            });
            gl.domElement.addEventListener('webglcontextrestored', () => {
              console.log('WebGL context restored');
            });
          }}
        >
          <Suspense fallback={null}>
            {/* 가벼운 조명만 — ContactShadows/Environment 제거로 Context Lost 방지 */}
            <ambientLight intensity={1.8} />
            <directionalLight position={[5, 8, 5]} intensity={2.0} />
            <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#e8f0ff" />
            <hemisphereLight
              skyColor="#ffffff"
              groundColor="#d0c8b8"
              intensity={0.6}
            />

            <PresentationControls
              global
              enabled={phase === 'idle'}
              snap={{ mass: 2, tension: 400 }}
              rotation={[0.08, 0.1, 0]}
              polar={[-Math.PI / 8, Math.PI / 8]}
              azimuth={[-Math.PI / 6, Math.PI / 6]}
              config={{ mass: 2, tension: 400 }}
            >
              <MacBookModel
                isOpen={phase === 'opening' || phase === 'zooming'}
                onOpenComplete={handleOpenComplete}
              />
            </PresentationControls>
          </Suspense>
        </Canvas>
      </div>

      {/* CLICK TO OPEN 힌트 */}
      {showHint && (
        <div ref={hintRef} style={{
          position: 'absolute', bottom: '8vh', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          pointerEvents: 'none',
        }}>
          <p style={{
            margin: 0, fontFamily: 'monospace', fontSize: '11px',
            letterSpacing: '4px', color: 'rgba(0,0,0,0.35)',
            animation: 'fadeFloat 2.5s ease-in-out infinite',
          }}>
            CLICK TO OPEN
          </p>
          <div style={{
            width: 1, height: 44,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}/>
        </div>
      )}

      {/* 모델 로딩 전 LOADING 표시 */}
      <Suspense fallback={
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <p style={{
            fontFamily: 'monospace', fontSize: '12px',
            letterSpacing: '4px', color: 'rgba(0,0,0,0.3)', margin: 0,
          }}>LOADING...</p>
        </div>
      }>
        <></>
      </Suspense>
    </div>
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor({T}) {
  const rRef=useRef(), dRef=useRef();
  useEffect(()=>{
    let mx=0,my=0,rx=0,ry=0,raf;
    const mv=e=>{mx=e.clientX;my=e.clientY;gsap.to(dRef.current,{x:mx,y:my,duration:0.04});};
    const ov=e=>{
      const t=e.target.closest('[data-cursor]')?.dataset.cursor;
      if(t==='link') gsap.to(rRef.current,{scale:2.2,backgroundColor:T.lime,duration:0.3});
      else gsap.to(rRef.current,{scale:1,backgroundColor:'transparent',duration:0.3});
    };
    const tick=()=>{rx+=(mx-rx)*0.09;ry+=(my-ry)*0.09;gsap.set(rRef.current,{x:rx,y:ry});raf=requestAnimationFrame(tick);};
    window.addEventListener('mousemove',mv);window.addEventListener('mouseover',ov);tick();
    return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseover',ov);cancelAnimationFrame(raf);};
  },[T.lime]);
  return(<>
    <div ref={rRef} style={{position:'fixed',top:-20,left:-20,width:36,height:36,borderRadius:'50%',border:`1.5px solid ${T.text}`,backgroundColor:'transparent',pointerEvents:'none',zIndex:9999,transform:'translate(-50%,-50%)',mixBlendMode:'multiply',opacity:0.5}}/>
    <div ref={dRef} style={{position:'fixed',top:0,left:0,width:6,height:6,borderRadius:'50%',backgroundColor:T.lime,pointerEvents:'none',zIndex:10000,transform:'translate(-50%,-50%)'}}/>
  </>);
}

const Noise=()=><div style={{position:'fixed',inset:0,zIndex:2,pointerEvents:'none',opacity:0.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`}}/>;

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({T,dark,toggle}) {
  const [sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>50);window.addEventListener('scroll',h);return()=>window.removeEventListener('scroll',h);},[]);
  return(
    <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:200,padding:'18px 6vw',display:'flex',justifyContent:'space-between',alignItems:'center',
      background:sc?(dark?'rgba(17,17,20,0.85)':'rgba(240,240,235,0.85)'):'transparent',
      backdropFilter:sc?'blur(20px)':'none',transition:'background 0.4s'}}>
      <span style={{fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'18px',color:T.text,letterSpacing:'1px'}}>
        WONJUN<span style={{color:T.lime}}>.</span>DEV
      </span>
      <div style={{display:'flex',gap:'24px',alignItems:'center'}}>
        {['About','Works','Contact'].map(n=>(
          <a key={n} href={`#${n.toLowerCase()}`} data-cursor="link"
            style={{fontSize:'12px',letterSpacing:'1px',color:T.textSub,textDecoration:'none',transition:'color 0.2s',fontWeight:500}}
            onMouseEnter={e=>e.target.style.color=T.text} onMouseLeave={e=>e.target.style.color=T.textSub}>{n}</a>
        ))}
        <button onClick={toggle} data-cursor="link" style={{width:36,height:20,borderRadius:10,border:`1.5px solid ${T.border}`,background:dark?T.lime:T.bgMuted,cursor:'pointer',position:'relative',transition:'background 0.3s',padding:0}}>
          <span style={{position:'absolute',top:2,left:dark?'calc(100% - 18px)':'2px',width:14,height:14,borderRadius:'50%',background:dark?T.limeText:T.textSub,transition:'left 0.3s',display:'block'}}/>
        </button>
      </div>
    </nav>
  );
}

// ─── SCROLL HERO ──────────────────────────────────────────────────────────────
function ScrollHero({T}) {
  const secRef=useRef(), nameRef=useRef(), cardRef=useRef(), veilRef=useRef();
  useGSAP(()=>{
    gsap.from(nameRef.current.querySelectorAll('.zc'),{y:110,opacity:0,duration:1,stagger:0.06,ease:'power4.out',delay:0.1});
    gsap.from(nameRef.current.querySelector('.zsub'),{y:20,opacity:0,duration:0.8,delay:0.9,ease:'power3.out'});
    gsap.set(cardRef.current,{opacity:0,scale:0.75,y:60});
    const tl=gsap.timeline({scrollTrigger:{trigger:secRef.current,start:'top top',end:'bottom bottom',scrub:1.2}});
    tl.to(nameRef.current,{scale:20,opacity:0,duration:2.5,ease:'power2.in'})
      .to(veilRef.current,{opacity:0,duration:1.0},'-=1.8')
      .fromTo(cardRef.current,{scale:0.75,opacity:0,y:60},{scale:1,opacity:1,y:0,duration:2,ease:'power3.out'},'-=0.4');
  },{scope:secRef});

  return(
    <section ref={secRef} style={{height:'320vh',position:'relative'}}>
      <div style={{position:'sticky',top:0,height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:T.bg}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`radial-gradient(${T.textMute} 1px,transparent 1px)`,backgroundSize:'44px 44px',opacity:0.18}}/>
        <div ref={nameRef} style={{position:'absolute',textAlign:'center',zIndex:10,transformStyle:'preserve-3d'}}>
          <div style={{display:'flex',justifyContent:'center',fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'clamp(4.5rem,16vw,14rem)',fontWeight:900,letterSpacing:'-0.02em',lineHeight:0.88}}>
            {"WONJUN".split('').map((c,i)=>(
              <span key={i} className="zc" style={{display:'inline-block',color:i%2===0?T.text:T.lime}}>{c}</span>
            ))}
          </div>
          <p className="zsub" style={{marginTop:'28px',fontSize:'11px',letterSpacing:'5px',color:T.textMute,fontFamily:'var(--font-mono)'}}>SCROLL TO EXPLORE</p>
        </div>
        <ProfileCard T={T} cardRef={cardRef}/>
        <div ref={veilRef} style={{position:'absolute',inset:0,zIndex:8,pointerEvents:'none',background:`radial-gradient(ellipse at center,transparent 15%,${T.bg} 72%)`}}/>
        <div style={{position:'absolute',bottom:'5vh',left:'50%',transform:'translateX(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',zIndex:20}}>
          <div style={{width:1,height:56,background:`linear-gradient(to bottom,${T.lime},transparent)`,animation:'scrollPulse 2s ease-in-out infinite'}}/>
          <span style={{fontSize:'9px',letterSpacing:'3px',color:T.textMute,fontFamily:'var(--font-mono)'}}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}

// ─── PROFILE CARD ─────────────────────────────────────────────────────────────
function ProfileCard({T,cardRef}) {
  return(
    <div ref={cardRef} style={{position:'absolute',zIndex:5,width:'min(780px,92vw)',border:`1px solid ${T.border}`,borderRadius:'22px',background:T.bgCard,boxShadow:`0 24px 80px rgba(0,0,0,${T===LIGHT?'0.12':'0.45'})`,padding:'clamp(20px,4vw,40px)',display:'grid',gridTemplateColumns:'auto 1fr 1fr',gap:'0 clamp(18px,3vw,32px)',alignItems:'start'}}>
      <div style={{gridRow:'1/3',display:'flex',flexDirection:'column',alignItems:'center',gap:'10px'}}>
        <div style={{width:'clamp(90px,12vw,130px)',aspectRatio:'3/4',borderRadius:'14px',overflow:'hidden',border:`2px solid ${T.lime}`,boxShadow:`0 8px 28px rgba(0,0,0,0.15)`}}>
          <img src="/profile.jpg" alt="정원준" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top'}}/>
        </div>
        <span style={{display:'inline-flex',alignItems:'center',gap:'5px',fontSize:'10px',color:T===LIGHT?T.limeText:T.lime,background:T===LIGHT?'rgba(157,255,0,0.18)':'rgba(200,255,0,0.1)',border:`1px solid ${T===LIGHT?'rgba(100,180,0,0.28)':'rgba(200,255,0,0.22)'}`,padding:'3px 9px',borderRadius:'20px',fontFamily:'var(--font-mono)',whiteSpace:'nowrap'}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:T.lime,display:'inline-block',animation:'blink 1.5s ease-in-out infinite'}}/>OPEN TO WORK
        </span>
      </div>
      <div style={{gridColumn:'2/-1',borderBottom:`1px solid ${T.border}`,paddingBottom:'16px',marginBottom:'4px'}}>
        <p style={{margin:'0 0 6px',fontSize:'10px',letterSpacing:'3px',color:T.textMute}}>PROFILE</p>
        <div style={{display:'flex',alignItems:'baseline',gap:'12px',flexWrap:'wrap'}}>
          <h2 style={{margin:0,fontSize:'clamp(1.5rem,3.5vw,2.4rem)',fontWeight:800,color:T.text,letterSpacing:'-0.03em',lineHeight:1.15}}>정원준</h2>
          <span style={{fontSize:'clamp(0.8rem,1.5vw,1rem)',color:T.textMute,fontWeight:400,letterSpacing:'0.06em'}}>JEONG WONJUN</span>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
        {[{l:'BORN',v:'2000.08.28'},{l:'LOCATION',v:'경기 평택'},{l:'EDUCATION',v:'진위고등학교 졸업'}].map(r=>(
          <div key={r.l}><p style={{margin:'0 0 4px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>{r.l}</p><p style={{margin:0,fontSize:'12px',color:T.textSub,fontFamily:'var(--font-mono)',lineHeight:1.65,whiteSpace:'pre-line'}}>{r.v}</p></div>
        ))}
        <div>
          <p style={{margin:'0 0 5px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>CERTIFICATES</p>
          {['운전면허 1종보통 · 취득','프로그래밍기능사 · 취득'].map(c=>(
            <p key={c} style={{margin:'0 0 2px',fontSize:'11px',color:T.textSub,fontFamily:'var(--font-mono)',lineHeight:1.7}}>{c}</p>
          ))}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
        <div>
          <p style={{margin:'0 0 6px',fontSize:'9px',letterSpacing:'2px',color:T.textMute}}>ROLE</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
            {['Full-Stack','Front-End','Back-End','ERP','Samsung Brity RPA'].map(r=>(
              <span key={r} style={{fontSize:'10px',padding:'3px 8px',borderRadius:'5px',background:'rgba(157,255,0,0.12)',color:T===LIGHT?T.limeText:'#7acc00',border:'1px solid rgba(100,180,0,0.22)',fontFamily:'var(--font-mono)',fontWeight:600}}>{r}</span>
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
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee({T}) {
  const tags=skills.map(s=>s.name);
  const doubled=[...tags,...tags];
  return(
    <div style={{overflow:'hidden',borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:'14px 0',background:T.bgMuted}}>
      <div style={{display:'flex',animation:'marquee 28s linear infinite',width:'max-content'}}>
        {doubled.map((name,i)=>(
          <span key={i} style={{fontFamily:'var(--font-mono)',fontSize:'12px',fontWeight:600,color:i%3===0?T.lime:T.textMute,padding:'0 28px',whiteSpace:'nowrap',letterSpacing:'1px'}}>
            {name} <span style={{color:T.lime,opacity:0.4}}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About({T}) {
  const ref=useRef();
  useGSAP(()=>{gsap.from(ref.current.querySelectorAll('.rev'),{y:45,opacity:0,duration:0.8,stagger:0.11,ease:'power3.out',scrollTrigger:{trigger:ref.current,start:'top 76%'}});},{scope:ref});
  return(
    <section id="about" ref={ref} style={{padding:'13vh 6vw',display:'grid',gridTemplateColumns:'1fr 1.1fr',gap:'6vw',alignItems:'center',borderTop:`1px solid ${T.border}`,background:T.bg}}>
      <div>
        <p className="rev" style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'24px'}}>ABOUT</p>
        <h2 className="rev" style={{fontFamily:'var(--font-soft)',fontSize:'clamp(2.2rem,4.5vw,4.5rem)',fontWeight:800,color:T.text,lineHeight:1.12,margin:0,letterSpacing:'0'}}>
          만드는 것에<br/><span style={{color:T.lime}}>진심인</span><br/>개발자입니다.
        </h2>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
        <p className="rev" style={{fontSize:'16px',lineHeight:1.85,color:T.textSub,margin:0,borderLeft:`3px solid ${T.lime}`,paddingLeft:'20px'}}>
          단순히 동작하는 코드가 아니라, <strong style={{color:T.text}}>완성도 있는 제품</strong>을 만드는 것에 집중합니다.
          3D 시뮬레이션부터 AI 예측 ERP까지, 기술의 경계를 넓히며 성장 중입니다.
        </p>
        <div className="rev" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
          {[{label:'Projects',value:'4+'},{label:'Stacks',value:'19+'},{label:'Location',value:'평택'},{label:'Status',value:'Open'}].map(item=>(
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
function Skills({T}) {
  const ref=useRef();
  useGSAP(()=>{gsap.from(ref.current.querySelectorAll('.si'),{scale:0.5,opacity:0,duration:0.5,stagger:0.04,ease:'back.out(1.7)',scrollTrigger:{trigger:ref.current,start:'top 78%'}});},{scope:ref});
  return(
    <section ref={ref} style={{padding:'10vh 6vw',borderTop:`1px solid ${T.border}`,background:T.bg}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'44px'}}>SKILLS & STACK</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(86px,1fr))',gap:'12px'}}>
        {skills.map(s=>(
          <div key={s.name} className="si"
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'10px',padding:'20px 10px',borderRadius:'14px',border:`1px solid ${T.border}`,background:T.bgCard,transition:'border-color 0.25s,box-shadow 0.25s,transform 0.22s',cursor:'default'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.lime;e.currentTarget.style.boxShadow=`0 6px 24px rgba(157,255,0,0.18)`;e.currentTarget.style.transform='translateY(-5px)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow='none';e.currentTarget.style.transform='translateY(0)';}}>
            {s.icon?(
              <img src={s.icon} alt={s.name} style={{width:36,height:36,objectFit:'contain',filter:(()=>{if(T===LIGHT&&s.inv)return 'invert(0.15) brightness(0.3)';if(T===DARK&&s.inv)return 'invert(1) brightness(1.1)';return 'none';})()}} onError={e=>{e.target.style.display='none';}}/>
            ):(
              <div style={{width:36,height:36,borderRadius:'8px',background:'rgba(157,255,0,0.15)',border:'1px solid rgba(157,255,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px'}}>{s.emoji||'🔧'}</div>
            )}
            <span style={{fontSize:'11px',color:T.textSub,fontFamily:'var(--font-mono)',letterSpacing:'0.3px',textAlign:'center'}}>{s.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── FLIP PROJECT CARD ────────────────────────────────────────────────────────
function FlipCard({project,T}) {
  const [flipped,setFlipped]=useState(false);
  const cardRef=useRef(),glareRef=useRef(),foilRef=useRef();
  useGSAP(()=>{gsap.from(cardRef.current,{y:65,opacity:0,duration:0.85,ease:'power3.out',scrollTrigger:{trigger:cardRef.current,start:'top 88%'}});},{scope:cardRef});
  const onMove=e=>{
    if(flipped)return;
    const r=cardRef.current.getBoundingClientRect();
    const x=e.clientX-r.left,y=e.clientY-r.top;
    const dx=(x-r.width/2)/(r.width/2),dy=(y-r.height/2)/(r.height/2);
    gsap.to(cardRef.current,{rotationY:dx*10,rotationX:-dy*7,transformPerspective:900,ease:'power2.out',duration:0.3});
    const px=(x/r.width)*100,py=(y/r.height)*100;
    if(glareRef.current)glareRef.current.style.background=`radial-gradient(circle at ${px}% ${py}%,rgba(255,255,255,0.22) 0%,transparent 60%)`;
    if(foilRef.current){const hue=Math.round(((x/r.width)*360+(y/r.height)*120))%360;foilRef.current.style.background=`linear-gradient(${115+dx*30}deg,hsla(${hue},100%,65%,0.13) 0%,hsla(${(hue+80)%360},100%,60%,0.10) 50%,hsla(${(hue+200)%360},100%,65%,0.13) 100%)`;foilRef.current.style.opacity='1';}
  };
  const onLeave=()=>{
    if(flipped)return;
    gsap.to(cardRef.current,{rotationY:0,rotationX:0,ease:'power3.out',duration:0.7});
    if(glareRef.current)glareRef.current.style.background='transparent';
    if(foilRef.current)foilRef.current.style.opacity='0';
    cardRef.current.style.boxShadow='';
  };
  const ignoreFlipClick=e=>e.target.closest('[data-no-flip]');
  const handleFlip=e=>{
    if(ignoreFlipClick(e))return;
    if(!flipped){gsap.timeline().to(cardRef.current,{scale:1.05,y:-12,duration:0.2,ease:'power2.out'}).to(cardRef.current,{rotationY:180,duration:0.55,ease:'power2.inOut'},'-=0.05').to(cardRef.current,{scale:1,y:0,duration:0.2});}
    else{gsap.timeline().to(cardRef.current,{scale:1.05,y:-12,duration:0.2,ease:'power2.out'}).to(cardRef.current,{rotationY:0,duration:0.55,ease:'power2.inOut'},'-=0.05').to(cardRef.current,{scale:1,y:0,duration:0.2});}
    if(glareRef.current)glareRef.current.style.background='transparent';
    if(foilRef.current)foilRef.current.style.opacity='0';
    gsap.to(cardRef.current,{rotationX:0,duration:0.3});
    setFlipped(p=>!p);
  };
  return(
    <div ref={cardRef} onMouseMove={onMove} onMouseLeave={onLeave}
      onMouseEnter={e=>{if(!flipped)e.currentTarget.style.boxShadow=`0 20px 50px rgba(${project.shine},0.22), 0 0 0 1px rgba(${project.shine},0.28)`;}}
      onClick={handleFlip}
      style={{position:'relative',height:'clamp(340px,44vw,420px)',cursor:'pointer',transformStyle:'preserve-3d',willChange:'transform',borderRadius:'18px',boxShadow:T===LIGHT?'0 2px 16px rgba(0,0,0,0.08)':'0 2px 20px rgba(0,0,0,0.35)',transition:'box-shadow 0.3s'}}>
      <div style={{position:'absolute',inset:0,borderRadius:'18px',overflow:'hidden',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',pointerEvents:flipped?'none':'auto',border:`1px solid ${T.border}`,background:T.bgCard}}>
        <div ref={foilRef} style={{position:'absolute',inset:0,opacity:0,transition:'opacity 0.15s',pointerEvents:'none',zIndex:2,borderRadius:'18px',mixBlendMode:'screen'}}/>
        <div ref={glareRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:3,borderRadius:'18px'}}/>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'45%',background:T.bgMuted,overflow:'hidden'}}>
          <img src={project.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:project.imagePosition||'center',display:'block',filter:T===LIGHT?'saturate(0.82) contrast(0.96) brightness(1.03)':'saturate(0.86) contrast(0.98) brightness(0.88)',opacity:T===LIGHT?0.86:0.78}}/>
          <div style={{position:'absolute',inset:0,background:T===LIGHT?'linear-gradient(180deg,rgba(245,245,240,0.1),rgba(245,245,240,0.26))':'linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.36))',pointerEvents:'none'}}/>
          <span style={{position:'absolute',top:'18px',right:'22px',fontFamily:'"Bebas Neue",Impact,sans-serif',fontSize:'clamp(2.5rem,6vw,4.8rem)',color:T.textSub,opacity:0.46,letterSpacing:'0.05em',textShadow:T===LIGHT?'0 1px 14px rgba(255,255,255,0.75)':'0 1px 18px rgba(0,0,0,0.65)'}}>{project.index}</span>
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'20px',zIndex:4}}>
          {project.ongoing&&(<span style={{display:'inline-flex',alignItems:'center',gap:'5px',fontSize:'9px',fontFamily:'var(--font-mono)',padding:'2px 8px',borderRadius:'4px',background:T.bgMuted,color:T.textSub,border:`1px solid ${T.border}`,marginBottom:'10px'}}><span style={{width:5,height:5,borderRadius:'50%',background:T.textMute,display:'inline-block',animation:'blink 1.2s ease-in-out infinite'}}/>IN PROGRESS</span>)}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}}>
            <div>
              <p style={{margin:'0 0 4px',fontSize:'9px',letterSpacing:'2px',color:T.textMute,fontFamily:'var(--font-mono)'}}>{project.period}</p>
              <h3 style={{margin:0,fontFamily:'var(--font-soft)',fontSize:'clamp(1.3rem,2.5vw,2rem)',fontWeight:800,color:T.text,letterSpacing:'0',lineHeight:1.12,whiteSpace:'pre-line'}}>{project.title}</h3>
            </div>
            <span style={{fontSize:'10px',fontFamily:'var(--font-mono)',color:T.textMute,paddingBottom:'4px'}}>{project.role}</span>
          </div>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap',marginTop:'12px'}}>
            {project.tags.slice(0,4).map(t=>(<span key={t} style={{fontFamily:'var(--font-mono)',fontSize:'9px',padding:'2px 7px',borderRadius:'3px',background:T.bgMuted,color:T.textSub,border:`1px solid ${T.border}`}}>{t}</span>))}
            {project.tags.length>4&&<span style={{fontFamily:'var(--font-mono)',fontSize:'9px',padding:'2px 7px',color:T.textMute}}>+{project.tags.length-4}</span>}
          </div>
          <p style={{margin:'12px 0 0',fontSize:'9px',letterSpacing:'2px',color:T.textMute,fontFamily:'var(--font-mono)',textAlign:'right'}}>CLICK TO FLIP ↩</p>
        </div>
      </div>
      <div style={{position:'absolute',inset:0,borderRadius:'18px',overflow:'hidden',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',pointerEvents:flipped?'auto':'none',transform:'rotateY(180deg)',background:T.bgCard,border:`1px solid ${T.border}`,padding:'24px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:T.textMute,letterSpacing:'2px'}}>{project.index} / DETAIL</span>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:T.textMute}}>{project.duration}</span>
          </div>
          <h3 style={{margin:'0 0 12px',fontFamily:'var(--font-soft)',fontSize:'clamp(1.1rem,2.2vw,1.7rem)',fontWeight:800,color:T.text,letterSpacing:'0',lineHeight:1.18,whiteSpace:'pre-line'}}>{project.title}</h3>
          <p style={{margin:'0 0 16px',fontSize:'13px',lineHeight:1.75,color:T.textSub}}>{project.description}</p>
          <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
            {project.tags.map(t=>(<span key={t} style={{fontFamily:'var(--font-mono)',fontSize:'9px',padding:'2px 7px',borderRadius:'3px',background:T.bgMuted,color:T.textSub,border:`1px solid ${T.border}`}}>{t}</span>))}
          </div>
        </div>
        <div data-no-flip="true" onClick={e=>e.stopPropagation()} onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()} style={{display:'flex',gap:'12px',borderTop:`1px solid ${T.border}`,paddingTop:'16px',flexWrap:'wrap',alignItems:'center',position:'relative',zIndex:10}}>
          <a href={project.github} target="_blank" rel="noreferrer" data-cursor="link" data-no-flip="true" onClick={e=>e.stopPropagation()}
            style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.text,textDecoration:'none',fontWeight:700,padding:'6px 14px',border:`1px solid ${T.border}`,borderRadius:'6px',background:T.bgMuted}}
            onMouseEnter={e=>{e.target.style.borderColor=T.textMute;e.target.style.background=T===LIGHT?'#ecece6':'#242427';}} onMouseLeave={e=>{e.target.style.borderColor=T.border;e.target.style.background=T.bgMuted;}}>
            GitHub ↗
          </a>
          {project.pdf&&(<a href={project.pdf} target="_blank" rel="noreferrer" data-cursor="link" data-no-flip="true" onClick={e=>e.stopPropagation()} style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textSub,textDecoration:'none',padding:'6px 14px',border:`1px solid ${T.border}`,borderRadius:'6px',background:T.bgMuted}} onMouseEnter={e=>{e.target.style.color=T.text;e.target.style.borderColor=T.textMute;e.target.style.background=T===LIGHT?'#ecece6':'#242427';}} onMouseLeave={e=>{e.target.style.color=T.textSub;e.target.style.borderColor=T.border;e.target.style.background=T.bgMuted;}}>PDF ↗</a>)}
          {project.demo&&(<a href={project.demo} target="_blank" rel="noreferrer" data-cursor="link" data-no-flip="true" onClick={e=>e.stopPropagation()} style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textSub,textDecoration:'none',padding:'6px 14px',border:`1px solid ${T.border}`,borderRadius:'6px',background:T.bgMuted}} onMouseEnter={e=>{e.target.style.color=T.text;e.target.style.borderColor=T.textMute;e.target.style.background=T===LIGHT?'#ecece6':'#242427';}} onMouseLeave={e=>{e.target.style.color=T.textSub;e.target.style.borderColor=T.border;e.target.style.background=T.bgMuted;}}>Live Demo ↗</a>)}
          <span style={{fontFamily:'var(--font-mono)',fontSize:'9px',color:T.textMute,marginLeft:'auto'}}>CLICK TO FLIP ↩</span>
        </div>
      </div>
    </div>
  );
}

function Projects({T}) {
  return(
    <section id="works" style={{padding:'10vh 6vw',borderTop:`1px solid ${T.border}`,background:T.bg}}>
      <p style={{fontSize:'11px',letterSpacing:'3px',color:T.textMute,marginBottom:'12px'}}>SELECTED WORKS</p>
      <p style={{fontSize:'13px',color:T.textMute,marginBottom:'44px',fontFamily:'var(--font-mono)'}}>카드를 클릭하면 뒤집어서 상세 내용을 볼 수 있어요</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,440px),1fr))',gap:'18px'}}>
        {myProjects.map(p=><FlipCard key={p.id} project={p} T={T}/>)}
      </div>
    </section>
  );
}

function Contact({T}) {
  const ref=useRef();
  useGSAP(()=>{gsap.from(ref.current.querySelector('.cta'),{y:70,opacity:0,duration:1,ease:'power4.out',scrollTrigger:{trigger:ref.current,start:'top 72%'}});},{scope:ref});
  return(
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

const Footer=({T})=>(
  <footer style={{padding:'32px 6vw',borderTop:`1px solid ${T.border}`,background:T.bg,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textMute}}>© 2026 JEONG WONJUN</span>
    <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:T.textMute}}>PYEONGTAEK · KR</span>
  </footer>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const {T,dark,toggle}=useTheme();
  const [introComplete,setIntroComplete]=useState(false);

  return(
    <div style={{background:T.bg,minHeight:'100vh',cursor:'none',transition:'background 0.4s'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        :root{--font-mono:'JetBrains Mono',monospace;--font-soft:'Pretendard',system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;}
        *{box-sizing:border-box;}
        body{margin:0;overflow-x:hidden;overflow-y:${introComplete?'auto':'hidden'};}
        ::selection{background:#9dff00;color:#0a0a0a;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#9dff00;border-radius:2px;}
        @keyframes scrollPulse{0%,100%{opacity:.3;}50%{opacity:1;}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:.2;}}
        @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes loadBar{0%{width:0%;}100%{width:100%;}}
        @keyframes fadeFloat{0%,100%{opacity:0.4;transform:translateY(0);}50%{opacity:0.9;transform:translateY(-6px);}}
      `}</style>

      <Cursor T={T}/>
      <Noise/>

      {!introComplete && (
        <MacBookIntroScene onComplete={()=>setIntroComplete(true)}/>
      )}

      {introComplete && (
        <>
          <Navbar T={T} dark={dark} toggle={toggle}/>
          <ScrollHero T={T}/>
          <Marquee T={T}/>
          <About T={T}/>
          <Skills T={T}/>
          <Projects T={T}/>
          <Contact T={T}/>
          <Footer T={T}/>
        </>
      )}
    </div>
  );
}

// GLB preload
useGLTF.preload('/macbook.glb');
