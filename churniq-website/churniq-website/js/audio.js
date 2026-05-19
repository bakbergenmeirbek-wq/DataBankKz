(function () {
  let audio, analyser, ctx, animId, playing = false;

  function initAudio() {
    const playBtn = document.getElementById('audio-play');
    const stopBtn = document.getElementById('audio-stop');
    const vol = document.getElementById('audio-volume');
    const canvas = document.getElementById('audio-viz');
    if (!playBtn) return;

    audio = new Audio('music.mp3');
    audio.loop = true;
    audio.volume = 0.7;

    playBtn.addEventListener('click', startAudio);
    stopBtn?.addEventListener('click', stopAudio);
    vol?.addEventListener('input', (e) => {
      if (audio) audio.volume = parseFloat(e.target.value);
    });

    if (canvas) initVisualizer(canvas);
  }

  function startAudio() {
    if (playing) return;
    audio.play();
    playing = true;
    document.getElementById('audio-viz')?.dispatchEvent(new CustomEvent('audio-start'));
  }

  function stopAudio() {
    if (!playing) return;
    audio.pause();
    audio.currentTime = 0;
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