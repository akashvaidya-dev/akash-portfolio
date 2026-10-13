import * as THREE from 'three';

/**
 * Procedural HTML5 Canvas Texture Generator for Death Note 3D Book
 * Renders high-resolution (1024x1368) authentic parchment, leather covers,
 * and case file details matching the 1.28 x 1.71 page aspect ratio.
 */

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 1368;

/** Helper to wrap text into lines on canvas */
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 12) {
  const words = text.split(' ');
  let line = '';
  let linesDrawn = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      linesDrawn++;
      if (linesDrawn >= maxLines) {
        ctx.fillText('...', x, y);
        return y;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y + lineHeight;
}

/** Draws leather texture with grain noise and dark borders */
function drawLeatherBackground(ctx, isFront = true) {
  // Rich obsidian/charcoal matte leather background (clean & smooth, zero visual noise)
  const grad = ctx.createRadialGradient(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    150,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH * 0.9
  );
  grad.addColorStop(0, '#131720');
  grad.addColorStop(0.5, '#0d1017');
  grad.addColorStop(1, '#06080c');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Soft worn edge vignette
  const edgeGrad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, 0);
  if (isFront) {
    edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)'); // spine side is darker
    edgeGrad.addColorStop(0.08, 'rgba(0, 0, 0, 0.05)');
    edgeGrad.addColorStop(0.92, 'rgba(0, 0, 0, 0.05)');
    edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  } else {
    edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    edgeGrad.addColorStop(0.08, 'rgba(0, 0, 0, 0.05)');
    edgeGrad.addColorStop(0.92, 'rgba(0, 0, 0, 0.05)');
    edgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
  }
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Outer border embossing (crisp double line)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.strokeRect(32, 32, CANVAS_WIDTH - 64, CANVAS_HEIGHT - 64);

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, CANVAS_WIDTH - 76, CANVAS_HEIGHT - 76);
}

/** Draws aged parchment paper with ruled lines and subtle stains */
function drawParchmentBackground(ctx, isLeft = false) {
  // Warm aged sepia gradient
  const grad = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  grad.addColorStop(0, '#f7f2e7');
  grad.addColorStop(0.5, '#f4ece0');
  grad.addColorStop(1, '#ebe0cf');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Subtle paper fibers/noise
  ctx.fillStyle = 'rgba(100, 70, 40, 0.015)';
  for (let i = 0; i < 3000; i++) {
    const rx = Math.random() * CANVAS_WIDTH;
    const ry = Math.random() * CANVAS_HEIGHT;
    ctx.fillRect(rx, ry, Math.random() * 3 + 1, 1);
  }

  // Ruled horizontal ledger lines
  ctx.strokeStyle = 'rgba(120, 130, 150, 0.18)';
  ctx.lineWidth = 1;
  const startY = 140;
  const lineSpacing = 34;
  for (let y = startY; y < CANVAS_HEIGHT - 60; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(isLeft ? 50 : 80, y);
    ctx.lineTo(isLeft ? CANVAS_WIDTH - 80 : CANVAS_WIDTH - 50, y);
    ctx.stroke();
  }

  // Vertical margin guide line (Death Note style margin)
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.25)';
  ctx.lineWidth = 1.5;
  const marginX = isLeft ? CANVAS_WIDTH - 110 : 110;
  ctx.beginPath();
  ctx.moveTo(marginX, 70);
  ctx.lineTo(marginX, CANVAS_HEIGHT - 70);
  ctx.stroke();

  // Spine shadow (deep fold shadow on inner binding edge)
  const spineGrad = ctx.createLinearGradient(
    isLeft ? CANVAS_WIDTH - 80 : 0,
    0,
    isLeft ? CANVAS_WIDTH : 80,
    0
  );
  if (isLeft) {
    spineGrad.addColorStop(0, 'rgba(0,0,0,0)');
    spineGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  } else {
    spineGrad.addColorStop(0, 'rgba(0,0,0,0.35)');
    spineGrad.addColorStop(1, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = spineGrad;
  ctx.fillRect(isLeft ? CANVAS_WIDTH - 80 : 0, 0, 80, CANVAS_HEIGHT);
}

/** Draws crimson ELIMINATED stamp */
function drawEliminatedStamp(ctx, x, y, dateStr = 'OCT 2024') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.18); // angled stamp

  // Outer distressed box
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 6;
  ctx.strokeRect(-150, -45, 300, 90);

  // Inner thin border
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 2;
  ctx.strokeRect(-142, -37, 284, 74);

  // Text
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 36px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ELIMINATED', 0, -8);

  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText(`DATE: ${dateStr} · 0.00% REGRESS`, 0, 20);

  ctx.restore();
}

/** 1. FRONT COVER TEXTURE */
export function createCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  drawLeatherBackground(ctx, true);

  ctx.textAlign = 'center';

  // Death Note Gothic Capitals - Clean, bold, unmistakable clarity
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;
  ctx.font = 'bold 94px "Cinzel", "Times New Roman", Georgia, serif';
  ctx.fillText('D E A T H   N O T E', CANVAS_WIDTH / 2, 490);

  // Reset shadow immediately so subsequent text remains pin-sharp
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Horizontal filigree divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 260, 535);
  ctx.lineTo(CANVAS_WIDTH / 2 + 260, 535);
  ctx.stroke();

  // Diamond centerpiece
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(CANVAS_WIDTH / 2, 535, 6, 0, Math.PI * 2);
  ctx.fill();

  // Subtitle
  ctx.font = '700 30px "JetBrains Mono", monospace';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('THE BUG LOG', CANVAS_WIDTH / 2, 595);

  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('CLASSIFIED ENGINEERING DEFECTS', CANVAS_WIDTH / 2, 640);
  ctx.fillText('INSCRIBED & EXTERMINATED IN PRODUCTION', CANVAS_WIDTH / 2, 670);

  // Author seal at bottom
  ctx.font = '700 22px "JetBrains Mono", monospace';
  ctx.fillStyle = '#f8fafc';
  ctx.fillText('< AKASH VAIDYA />', CANVAS_WIDTH / 2, 1140);

  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText('SENIOR FLUTTER DEVELOPER & REACT ARCHITECT', CANVAS_WIDTH / 2, 1175);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 2. INSIDE FRONT COVER TEXTURE */
export function createInsideCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  // Dark endpaper background
  ctx.fillStyle = '#11151f';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 100);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 32px "Times New Roman", serif';
  ctx.fillText('NOTEBOOK OF ELIMINATED DEFECTS', CANVAS_WIDTH / 2, 280);

  ctx.font = 'italic 20px Georgia, serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('“Every bug inscribed within has met its final fix.”', CANVAS_WIDTH / 2, 330);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.moveTo(250, 370);
  ctx.lineTo(CANVAS_WIDTH - 250, 370);
  ctx.stroke();

  // Inscription text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '19px "Inter", sans-serif';

  const intro =
    'This grimoire chronicles actual commercial battleground bugs encountered across Flutter mobile applications, hardware ESC/POS thermal printing integrations, Riverpod state flows, and full-stack real-time WebSockets.\n\nHere, each defect is stripped of ambiguity, named accurately, traced to its exact root invariant, and sealed with a deterministic architectural resolution.';

  const paragraphs = intro.split('\n\n');
  let curY = 440;
  paragraphs.forEach((p) => {
    curY = wrapText(ctx, p, 160, curY, CANVAS_WIDTH - 320, 32);
    curY += 20;
  });

  // Stamp of Ownership
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.font = 'bold 72px "JetBrains Mono", monospace';
  ctx.fillText('VERIFIED 0-DEFECT', CANVAS_WIDTH / 2, 1020);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 20px "JetBrains Mono", monospace';
  ctx.fillText('SEAL OF ARCHITECTURAL INTEGRITY', CANVAS_WIDTH / 2, 1080);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 3. RULES SPREAD (PART 1) */
export function createRulesTexturePart1() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  drawParchmentBackground(ctx, false);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 44px "Times New Roman", Georgia, serif';
  ctx.fillText('HOW TO USE IT', CANVAS_WIDTH / 2 + 20, 160);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 140, 185);
  ctx.lineTo(CANVAS_WIDTH / 2 + 180, 185);
  ctx.stroke();

  ctx.textAlign = 'left';
  let curY = 270;

  // Rule I
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 26px "Times New Roman", serif';
  ctx.fillText('I', 150, curY);
  ctx.fillStyle = '#1e293b';
  ctx.font = '600 20px "Inter", sans-serif';
  curY = wrapText(
    ctx,
    'The bug whose root cause is accurately inscribed in this notebook shall never crash production again.',
    200,
    curY,
    CANVAS_WIDTH - 280,
    34
  );
  curY += 60;

  // Rule II
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 26px "Times New Roman", serif';
  ctx.fillText('II', 150, curY);
  ctx.fillStyle = '#1e293b';
  ctx.font = '600 20px "Inter", sans-serif';
  curY = wrapText(
    ctx,
    'This log takes effect only when the engineer holds both the reproduction stack trace and the failing invariant in mind while writing the fix.',
    200,
    curY,
    CANVAS_WIDTH - 280,
    34
  );
  curY += 70;

  // Commentary
  ctx.fillStyle = '#475569';
  ctx.font = 'italic 18px Georgia, serif';
  wrapText(
    ctx,
    '“A bug whose symptoms are masked with empty catch blocks without addressing root cause will reincarnate under Sev-1 pager alerts at 3:00 AM.”',
    180,
    curY,
    CANVAS_WIDTH - 260,
    28
  );

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 4. RULES SPREAD (PART 2) */
export function createRulesTexturePart2() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  drawParchmentBackground(ctx, true);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 36px "Times New Roman", Georgia, serif';
  ctx.fillText('HOW TO USE IT (CONTINUED)', CANVAS_WIDTH / 2 - 20, 160);

  ctx.textAlign = 'left';
  let curY = 270;

  // Rule III
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 26px "Times New Roman", serif';
  ctx.fillText('III', 120, curY);
  ctx.fillStyle = '#1e293b';
  ctx.font = '600 20px "Inter", sans-serif';
  curY = wrapText(
    ctx,
    'If a regression test is committed alongside the resolution within 40 minutes, the defect is eliminated permanently across all branches.',
    170,
    curY,
    CANVAS_WIDTH - 260,
    34
  );
  curY += 60;

  // Rule IV
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 26px "Times New Roman", serif';
  ctx.fillText('IV', 120, curY);
  ctx.fillStyle = '#1e293b';
  ctx.font = '600 20px "Inter", sans-serif';
  curY = wrapText(
    ctx,
    'A patched bug whose underlying architectural anti-pattern remains unaddressed will reincarnate under another ticket number.',
    170,
    curY,
    CANVAS_WIDTH - 260,
    34
  );
  curY += 80;

  // Signature line
  ctx.font = 'bold 18px "JetBrains Mono", monospace';
  ctx.fillStyle = '#0f172a';
  ctx.fillText('AUTHORITATIVE SIGNATURE:', 120, curY);
  ctx.font = 'italic 28px Georgia, serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('Akash Vaidya', 120, curY + 45);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 5. BUG CASE LEFT PAGE (Incident & Culprit) */
export function createCaseLeftPageTexture(bugCase) {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  drawParchmentBackground(ctx, false);

  // Case Number & Date
  ctx.textAlign = 'left';
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText(`CASE FILE ${bugCase.caseNumber}`, 140, 130);

  ctx.fillStyle = '#64748b';
  ctx.font = '700 16px "JetBrains Mono", monospace';
  ctx.fillText(`ELIMINATED: ${bugCase.dateEliminated}`, 420, 130);

  // Title
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 30px "Times New Roman", Georgia, serif';
  const afterTitleY = wrapText(
    ctx,
    bugCase.title,
    140,
    180,
    CANVAS_WIDTH - 240,
    38,
    3
  );

  // Subsystem & Project tag
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillText(`// Project: ${bugCase.project}`, 140, afterTitleY + 15);
  ctx.fillStyle = '#475569';
  ctx.fillText(`// Subsystem: ${bugCase.subsystem}`, 140, afterTitleY + 40);

  let curY = afterTitleY + 90;

  // Section 1: The Incident (Crime Scene)
  ctx.fillStyle = '#dc2626';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('🩸 THE INCIDENT (WHAT BROKE):', 140, curY);
  curY += 32;

  ctx.fillStyle = '#1e293b';
  ctx.font = '500 18px "Inter", sans-serif';
  curY = wrapText(ctx, bugCase.incident, 140, curY, CANVAS_WIDTH - 240, 30, 8);
  curY += 45;

  // Section 2: The Culprit (Root Cause)
  ctx.fillStyle = '#d97706';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('🔍 THE CULPRIT (ROOT CAUSE):', 140, curY);
  curY += 32;

  ctx.fillStyle = '#1e293b';
  ctx.font = '500 18px "Inter", sans-serif';
  wrapText(ctx, bugCase.culprit, 140, curY, CANVAS_WIDTH - 240, 30, 6);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 6. BUG CASE RIGHT PAGE (Verdict, Code, Law & Stamp) */
export function createCaseRightPageTexture(bugCase) {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  drawParchmentBackground(ctx, true);

  // Section: The Verdict
  ctx.textAlign = 'left';
  ctx.fillStyle = '#059669';
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText('⚡ THE VERDICT (ARCHITECTURAL FIX):', 100, 130);

  ctx.fillStyle = '#1e293b';
  ctx.font = '500 18px "Inter", sans-serif';
  let curY = wrapText(
    ctx,
    bugCase.verdict,
    100,
    170,
    CANVAS_WIDTH - 220,
    30,
    5
  );
  curY += 40;

  // Code Snippet Terminal Box
  ctx.fillStyle = '#090d14';
  const boxHeight = 440;
  ctx.fillRect(80, curY, CANVAS_WIDTH - 180, boxHeight);

  // Terminal titlebar
  ctx.fillStyle = '#161d28';
  ctx.fillRect(80, curY, CANVAS_WIDTH - 180, 32);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 14px "JetBrains Mono", monospace';
  ctx.fillText('// INSCRIBED CODE RESOLUTION', 100, curY + 22);

  // Code lines
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px "JetBrains Mono", monospace';
  const lines = bugCase.codeSnippet.split('\n');
  let codeY = curY + 60;
  for (let i = 0; i < Math.min(lines.length, 16); i++) {
    // Syntax highlight comments
    if (lines[i].trim().startsWith('//')) {
      ctx.fillStyle = '#10b981';
    } else if (
      lines[i].includes('class ') ||
      lines[i].includes('const ') ||
      lines[i].includes('function ') ||
      lines[i].includes('Future<')
    ) {
      ctx.fillStyle = '#38bdf8';
    } else {
      ctx.fillStyle = '#e2e8f0';
    }
    ctx.fillText(lines[i], 100, codeY);
    codeY += 23;
  }

  curY += boxHeight + 40;

  // The Architectural Law
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px "JetBrains Mono", monospace';
  ctx.fillText('📜 ARCHITECTURAL LAW INSCRIBED:', 100, curY);
  curY += 30;

  ctx.fillStyle = '#0f172a';
  ctx.font = 'italic 19px Georgia, serif';
  curY = wrapText(ctx, `“${bugCase.rule}”`, 100, curY, CANVAS_WIDTH - 220, 28, 3);
  curY += 20;

  ctx.fillStyle = '#64748b';
  ctx.font = '600 15px "JetBrains Mono", monospace';
  ctx.fillText(`IMPACT: ${bugCase.impact}`, 100, curY);

  // Crimson ELIMINATED stamp at top right
  drawEliminatedStamp(ctx, CANVAS_WIDTH - 260, 220, bugCase.dateEliminated);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 7. BACK COVER TEXTURE */
export function createBackCoverTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  drawLeatherBackground(ctx, false);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'bold 28px "JetBrains Mono", monospace';
  ctx.fillText('< AKASH VAIDYA />', CANVAS_WIDTH / 2, 600);

  ctx.font = '600 18px "Inter", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('ZERO REGRESSIONS · MAXIMUM RESILIENCE', CANVAS_WIDTH / 2, 640);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH / 2 - 160, 680);
  ctx.lineTo(CANVAS_WIDTH / 2 + 160, 680);
  ctx.stroke();

  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText('ALL CASES VERIFIED IN PRODUCTION', CANVAS_WIDTH / 2, 720);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
