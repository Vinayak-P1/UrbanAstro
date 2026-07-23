import React, { useMemo } from "react";

// Helper for deterministic pseudo-random values to keep hydration consistent
function pseudoRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const CosmicBackground = () => {
  // Generate 60 HTML span star elements matching Astrotalk's exact structure
  const stars = useMemo(() => {
    const starList = [];
    for (let i = 0; i < 60; i++) {
      const seed = i * 13 + 7;
      const top = (pseudoRandom(seed) * 100).toFixed(4);
      const left = (pseudoRandom(seed + 1) * 100).toFixed(4);
      const duration = (2 + pseudoRandom(seed + 2) * 3).toFixed(2); // 2s to 5s
      const delay = (pseudoRandom(seed + 3) * 5).toFixed(2); // 0s to 5s
      const isGold = pseudoRandom(seed + 4) > 0.75;
      const isBig = pseudoRandom(seed + 5) > 0.85;

      let className = "v2-star";
      if (isGold) className += " v2-star-gold";
      if (isBig) className += " v2-star-big";

      starList.push({
        id: i,
        className,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        },
      });
    }
    return starList;
  }, []);

  return (
    <div
      aria-hidden="true"
      className="stars-container"
    >
      {stars.map((star) => (
        <span key={star.id} className={star.className} style={star.style} />
      ))}

      <style>{`
        /* Main background container with Astrotalk's exact atmospheric gradients */
        .stars-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          background-color: rgb(14, 10, 6);
          background-image: 
            radial-gradient(900px 500px at 90% 20%, rgba(217, 138, 68, 0.35), rgba(0, 0, 0, 0) 60%), 
            radial-gradient(700px 400px at 0% 80%, rgba(240, 138, 44, 0.25), rgba(0, 0, 0, 0) 65%), 
            radial-gradient(1100px 600px at 50% 0%, rgba(255, 170, 80, 0.18), rgba(0, 0, 0, 0) 55%), 
            radial-gradient(800px 500px at 100% 60%, rgba(201, 122, 61, 0.2), rgba(0, 0, 0, 0) 60%), 
            radial-gradient(600px 400px at 20% 40%, rgba(255, 214, 110, 0.1), rgba(0, 0, 0, 0) 60%), 
            linear-gradient(rgb(14, 10, 6) 0%, rgb(26, 20, 12) 40%, rgb(18, 12, 6) 70%, rgb(14, 10, 6) 100%);
        }

        /* Star base styling - Astrotalk exact */
        .v2-star {
          position: absolute;
          display: block;
          width: 2px;
          height: 2px;
          background-color: #ffffff;
          border-radius: 50%;
          animation: v2-twinkle ease-in-out infinite;
        }

        /* Star variants */
        .v2-star-gold {
          background-color: rgb(232, 196, 112);
        }

        .v2-star-big {
          width: 3px;
          height: 3px;
        }

        /* Twinkle keyframe animation - Astrotalk exact */
        @keyframes v2-twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default CosmicBackground;
