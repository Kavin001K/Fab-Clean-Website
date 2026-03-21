import { useSteamCursor } from "@/hooks/use-cursor";

export function SteamCursor() {
  useSteamCursor();

  return (
    <>
      {/* Outer spring-lag ring */}
      <div
        id="fc-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid #8DC63F",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform",
          transition:
            "width 0.3s cubic-bezier(0.16,1,0.3,1), " +
            "height 0.3s cubic-bezier(0.16,1,0.3,1), " +
            "border-color 0.3s ease, " +
            "opacity 0.3s ease",
          mixBlendMode: "difference",
        }}
      />

      {/* Inner dot — snaps to mouse */}
      <div
        id="fc-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#8DC63F",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: 0,
          willChange: "transform",
          transition: "opacity 0.3s ease, background 0.3s ease",
        }}
      />
    </>
  );
}
