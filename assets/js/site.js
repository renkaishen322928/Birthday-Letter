    const stage = document.getElementById('stage');
    const cover = document.querySelector('.cover');
    const letter = document.getElementById('letter');
    const openButton = document.getElementById('open');
    document.getElementById('open').addEventListener('click', () => {
      birthdaySong.currentTime = 0;
      Promise.resolve(birthdaySong.play()).then(updateSongControl).catch(updateSongControl);
      openButton.disabled = true;
      stage.classList.add('opening');
      const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 850;
      window.setTimeout(() => {
        stage.classList.add('open');
        cover.setAttribute('aria-hidden', 'true');
        letter.setAttribute('aria-hidden', 'false');
        document.getElementById('letter-title').focus({ preventScroll: true });
      }, delay);
    });
    document.getElementById('again').addEventListener('click', () => {
      stage.classList.remove('open', 'opening');
      cover.setAttribute('aria-hidden', 'false');
      letter.setAttribute('aria-hidden', 'true');
      openButton.disabled = false;
      openButton.focus({ preventScroll: true });
    });

    document.documentElement.classList.add('js');
    const photoDialog = document.getElementById('photo-dialog');
    document.querySelectorAll('.scatter-shot').forEach(button => button.addEventListener('click', () => {
      const picture = button.classList.contains('clip-shot') ? null : button.querySelector('img');
      const photo = photoDialog.querySelector('img');
      const clip = photoDialog.querySelector('video');
      photo.hidden = !picture;
      clip.hidden = !!picture;
      if (picture) { photo.src = picture.src; photo.alt = picture.alt; }
      else { clip.src = button.dataset.clip; if (typeof birthdaySong !== 'undefined') birthdaySong.pause(); }
      photoDialog.showModal();
      if (!picture) clip.play().catch(() => {});
    }));
    photoDialog.addEventListener('close', () => { const clip = photoDialog.querySelector('video'); clip.pause(); clip.removeAttribute('src'); clip.load(); });
    photoDialog.querySelector('.close-photo').addEventListener('click', () => photoDialog.close());
    photoDialog.addEventListener('click', event => { if (event.target === photoDialog) photoDialog.close(); });
    const scatterObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); scatterObserver.unobserve(entry.target); } });
    }, { rootMargin: '0px 0px -3% 0px', threshold: .05 }) : null;
    document.querySelectorAll('.photo-scatter').forEach(group => scatterObserver ? scatterObserver.observe(group) : group.classList.add('is-visible'));

    const birthdaySong = document.getElementById('birthday-song');
    const songToggle = document.getElementById('song-toggle');
    const songLabel = document.getElementById('song-label');
    birthdaySong.volume = .45;
    function updateSongControl() {
      const playing = !birthdaySong.paused && !birthdaySong.ended;
      const label = playing ? 'Pause song' : birthdaySong.ended ? 'Replay song' : 'Play song';
      songLabel.textContent = label;
      songToggle.setAttribute('aria-label', label);
      songToggle.setAttribute('aria-pressed', String(playing));
    }
    ['play','pause','ended','error'].forEach(event => birthdaySong.addEventListener(event, updateSongControl));
    songToggle.addEventListener('click', () => {
      if (birthdaySong.paused || birthdaySong.ended) {
        if (birthdaySong.ended) birthdaySong.currentTime = 0;
        Promise.resolve(birthdaySong.play()).then(updateSongControl).catch(updateSongControl);
      } else birthdaySong.pause();
    });
    document.getElementById('again').addEventListener('click', () => {
      birthdaySong.pause();
      birthdaySong.currentTime = 0;
      updateSongControl();
    });
