import fs from 'fs';

let code = fs.readFileSync('src/app/about/page.tsx', 'utf8');

// 1. Add GSAP imports
if (!code.includes('import { gsap }')) {
  code = code.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { gsap } from "gsap";\nimport { ScrollTrigger } from "gsap/ScrollTrigger";');
}

// 2. Remove useReveal and RevealSection from imports/functions
code = code.replace(/function useReveal[\s\S]*?return <div ref=\{ref\} className=\{`ab-reveal \$\{className\}`\}>\{children\}<\/div>;\n}/g, '');

// 3. Remove CSS for .ab-reveal from the <style> block
code = code.replace(/\.ab-reveal \{ opacity: 0;[^]*?\.ab-reveal\.ab-visible \.ab-img-wrap img \{\n\s*transform: scale\(1\);\n\s*\}/g, '');

// 4. Inject GSAP hook into AboutPage
const gsapHook = `
    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      // Text reveals
      gsap.utils.toArray(".gsap-reveal-text").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" }
          }
        );
      });

      // Image wrapper reveals
      gsap.utils.toArray(".gsap-reveal-img-wrap").forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: { trigger: wrap, start: "top 85%" }
          }
        );

        const img = wrap.querySelector("img");
        if (img) {
          gsap.fromTo(img, { scale: 1.2 }, {
            scale: 1, duration: 1.8, ease: "power3.out",
            scrollTrigger: { trigger: wrap, start: "top 85%" }
          });
          gsap.fromTo(img, { yPercent: -5 }, {
            yPercent: 5, ease: "none",
            scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true }
          });
        }
      });

      // Founder circle reveal
      const founderWrap = document.querySelector(".gsap-reveal-founder");
      if (founderWrap) {
        gsap.fromTo(founderWrap, { opacity: 0, scale: 0.8 }, {
          opacity: 1, scale: 1, duration: 1.2, ease: "back.out(1.2)",
          scrollTrigger: { trigger: founderWrap, start: "top 85%" }
        });
      }
    }, heroRef); // We'll wrap the main inside heroRef or attach a new ref. Actually let's use document.body for now or a mainRef.
`;

// Insert the GSAP hook after `useReveal(heroRef);`
code = code.replace(/useReveal\(heroRef\);/, \`
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
\${gsapHook}
    return () => ctx.revert();
  }, []);
\`);

// Add mainRef to the <main> element
code = code.replace(/<main style=\{\{ position: "relative"/, '<main ref={mainRef} style={{ position: "relative"');

// 5. Replace RevealSection with div.gsap-reveal-text
code = code.replace(/<RevealSection>/g, '<div className="gsap-reveal-text">');
code = code.replace(/<RevealSection className="([^"]+)">/g, '<div className="gsap-reveal-text $1">');
code = code.replace(/<RevealSection key=\{([^\}]+)\} className=\{([^}]+)\}>/g, '<div key={$1} className={`gsap-reveal-text ${$2}`}>');
code = code.replace(/<\/RevealSection>/g, '</div>');

// Remove abstract delays if any (ab-reveal-delay-...)
code = code.replace(/ab-reveal-delay-\d/g, '');

// 6. Fix image wraps to trigger parallax
code = code.replace(/className="ab-img-wrap"/g, 'className="gsap-reveal-img-wrap" style={{ overflow: "hidden", borderRadius: "2px" }}');

// 7. Fix founder circle
code = code.replace(/<div style=\{\{ position: "relative", width: "clamp\(200px, 25vw, 320px\)", aspectRatio: "1\/1", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba\(255,255,255,0.08\)" \}\}>/, 
  '<div className="gsap-reveal-founder" style={{ position: "relative", width: "clamp(200px, 25vw, 320px)", aspectRatio: "1/1", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>');

fs.writeFileSync('src/app/about/page.tsx', code);
console.log("Refactor complete.");
