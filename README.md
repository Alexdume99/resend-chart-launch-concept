# Resend Chart Component — concept launch video

A 25s launch video for Resend's new Chart Component, built entirely in code
with Remotion. One composition renders landscape (16:9), square (1:1) and
vertical (9:16) from the same source.

Concept work. Not affiliated with Resend.

**Stack:** Remotion 4, React, TypeScript. Springs for the type animation,
SVG paths for the chart draws, seeded randomness for the background pulses.
Month labels are rendered as HTML rather than SVG text: SVG text positioning
proved non-deterministic across Remotion's parallel render tabs.

## Run it

    npm i
    npx remotion studio
    npx remotion render ChartLaunch-Landscape out/landscape.mp4

---

I build launch videos like this for SaaS teams. Hook, script, video,
three formats from one build, delivered in 48h.
Contact: alex@ades-studio.fr
