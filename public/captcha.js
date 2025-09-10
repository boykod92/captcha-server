<script src="https://openfpcdn.io/fingerprintjs/v3"></script>
<script>
(function () {
  const config = {
    serverUrl: 'https://captcha-server-snowy.vercel.app/api/validate-captcha',
    apiKey: 'prj_PdKIsJzxmXqfuFk2Xq6OLfUtrj1Z',
    imgSrc: 'https://i.ibb.co/v6DsFWLq/captcha.png',
    minMousePoints: 10,
    maxSpeed: 500,
    minVisibleTime: 1500, // минимум 1.5с до клика
    metrikaCounterId: '88094270',
  };

  const styles = `
    body.locked { overflow: hidden; }
    .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; backdrop-filter: blur(8px); background: rgba(255, 255, 255, 0.3); z-index: 9998; }
    .click-img { width: 180px; user-select: none; cursor: pointer; position: fixed; z-index: 9999; }
    .honeypot { display: none !important; }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  function getCookie(name) {
    const matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  function setCookie(name, value, options = {}) {
    options = { path: '/', ...options };
    if (options.expires instanceof Date) options.expires = options.expires.toUTCString();
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    for (let optionKey in options) {
      updatedCookie += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) updatedCookie += "=" + optionValue;
    }
    document.cookie = updatedCookie;
  }
  function randomName() { return Math.random().toString(36).substring(2, 10); }
  function placeBlock(el) {
    const maxX = window.innerWidth - el.offsetWidth - 20;
    const maxY = window.innerHeight - el.offsetHeight - 20;
    el.style.left = Math.floor(Math.random() * maxX) + 10 + "px";
    el.style.top = Math.floor(Math.random() * maxY) + 10 + "px";
  }

  window.addEventListener('load', async () => {
    if (navigator.userAgent.toLowerCase().indexOf('headless') > -1 || !navigator.userAgent) return;

    const captchaCookie = getCookie('captcha_visits');
    if (captchaCookie) {
      if (typeof ym !== 'undefined') {
        ym(config.metrikaCounterId, 'reachGoal', 'repeat_user', { visit_num: parseInt(captchaCookie) });
      }
      setCookie('captcha_visits', parseInt(captchaCookie) + 1, { expires: new Date(Date.now() + 365*24*60*60*1000) });
      return;
    }

    document.body.classList.add('locked');
    const wrapper = document.createElement('div');
    wrapper.id = 'rand-wrapper';
    document.body.appendChild(wrapper);

    const randClass = randomName();
    wrapper.innerHTML = `
      <div class="overlay"></div>
      <input type="text" class="honeypot" name="honeypot_field" value="">
      <img src="${config.imgSrc}" alt="Captcha" class="click-img ${randClass}">
    `;
    const block = wrapper.querySelector(`.${randClass}`);

    let mousePath = [];
    let lastTime = Date.now();
    let showTime = 0;
    let fingerprint = 'unknown';
    let imageLoaded = false;

    if (typeof FingerprintJS !== 'undefined') {
      FingerprintJS.load().then(fp => fp.get().then(result => { fingerprint = result.visitorId; }));
    }

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0 && dt < 500) {
        const dx = e.clientX - (mousePath.length ? mousePath[mousePath.length - 1].x : e.clientX);
        const dy = e.clientY - (mousePath.length ? mousePath[mousePath.length - 1].y : e.clientY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = dist / (dt / 1000);
        if (speed <= config.maxSpeed) {
          mousePath.push({ x: e.clientX, y: e.clientY, t: now });
        }
      }
      lastTime = now;
    });

    block.addEventListener('load', () => {
      imageLoaded = true;
      placeBlock(block);
      showTime = Date.now();
    });

    block.addEventListener('click', async () => {
      const clickTime = Date.now();
      const honeypotValue = wrapper.querySelector('.honeypot').value;

      if (!imageLoaded || honeypotValue || mousePath.length < config.minMousePoints || clickTime - showTime < config.minVisibleTime) {
        console.warn('Bot detected or premature click');
        return;
      }

      try {
        const res = await fetch(config.serverUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fingerprint,
            mousePath,
            time: clickTime - showTime,
            api_key: config.apiKey,
            honeypot: honeypotValue,
          }),
        });
        const data = await res.json();
        console.log('Captcha response:', data);
        if (res.ok && data.status === 'OK') {
          document.body.classList.remove('locked');
          wrapper.remove();
          if (typeof ym !== 'undefined') {
            ym(config.metrikaCounterId, 'reachGoal', 'passed_captcha', { human_score: data.human_score });
          }
          setCookie('captcha_visits', 1, { expires: new Date(Date.now() + 365*24*60*60*1000) });
        } else {
          console.warn('Validation failed:', data.error);
        }
      } catch (e) {
        console.error('Fetch error:', e);
      }
    });
  });
})();
</script>
