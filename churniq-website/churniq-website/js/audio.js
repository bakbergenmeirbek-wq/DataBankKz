/* Web Audio API ambient player */
(function () {
  let ctx, masterGain, delayNode, feedbackGain, playing = false;
  let osc1, osc2, osc3, noiseNode, lfo;
  let animId;

  function initAudio() {
    const playBtn = document.getElementById('audio-play');
    const stopBtn = document.getElementById('audio-stop');
    const vol = document.getElementById('audio-volume');
    const canvas = document.getElementById('audio-viz');
    if (!playBtn) return;

    playBtn.addEventListener('click', startAudio);
    stopBtn?.addEventListener('click', stopAudio);
    vol?.addEventListener('input', (e) => {
      if (masterGain) masterGain.gain.value = parseFloat(e.target.value);
    });

    if (canvas) initVisualizer(canvas);
  }

  function startAudio() {
    if (playing) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = parseFloat(document.getElementById('audio-volume')?.value || 0.3);

    delayNode = ctx.createDelay(2);
    delayNode.delayTime.value = 0.4;
    feedbackGain = ctx.createGain();
    feedbackGain.gain.value = 0.35;

    osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 60;

    osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 120;

    osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 180;

    lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 15;
    lfo.connect(lfoGain);
    lfoGain.connect(osc2.frequency);
    lfoGain.connect(osc3.frequency);

    const padGain = ctx.createGain();
    padGain.gain.value = 0.12;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
    noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 800;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.03;

    osc1.connect(padGain);
    osc2.connect(padGain);
    osc3.connect(padGain);
    padGain.connect(masterGain);
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    masterGain.connect(delayNode);
    delayNode.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayNode.connect(ctx.destination);
    masterGain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();
    noiseNode.start();
    playing = true;
    document.getElementById('audio-viz')?.dispatchEvent(new CustomEvent('audio-start'));
  }

  function stopAudio() {
    if (!playing || !ctx) return;
    try {
      osc1?.stop();
      osc2?.stop();
      osc3?.stop();
      lfo?.stop();
      noiseNode?.stop();
      ctx.close();
    } catch (_) {}
    playing = false;
    cancelAnimationFrame(animId);
    document.getElementById('audio-viz')?.dispatchEvent(new CustomEvent('audio-stop'));
  }

  function initVisualizer(canvas) {
    const c = canvas.getContext('2d');
    let phase = 0;

    function draw() {
      const w = canvas.width = canvas.offsetWidth;
      const h = canvas.height = canvas.offsetHeight;
      c.fillStyle = '#1A1A1A';
      c.fillRect(0, 0, w, h);
      if (playing) phase += 0.05;
      const bars = 48;
      for (let i = 0; i < bars; i++) {
        const bh = playing
          ? (Math.sin(phase + i * 0.3) * 0.5 + 0.5) * h * 0.7 + 8
          : 4 + Math.sin(phase * 0.2 + i) * 2;
        const x = (i / bars) * w;
        const bw = w / bars - 2;
        const grd = c.createLinearGradient(0, h - bh, 0, h);
        grd.addColorStop(0, '#4f8ef7');
        grd.addColorStop(1, '#7c3aed');
        c.fillStyle = grd;
        c.fillRect(x, h - bh, bw, bh);
      }
      animId = requestAnimationFrame(draw);
    }
    canvas.addEventListener('audio-start', draw);
    canvas.addEventListener('audio-stop', draw);
    draw();
  }

  document.addEventListener('DOMContentLoaded', initAudio);
})();
