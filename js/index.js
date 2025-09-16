  const container = document.querySelector('.home-coin-sub');
  const words = container.querySelectorAll('[aria-hidden="true"]');

  window.addEventListener('scroll', () => {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const visible = Math.min(Math.max((windowHeight - rect.top) / (windowHeight + rect.height), 0), 1);

    words.forEach((el, index) => {
      let opacity;

      if (index < 4) {
        opacity = 1;
      } else {
        const relativeIndex = index - 4;
        opacity = Math.max(1 - relativeIndex * 0.08 * (1 - visible), 0.2);
      }

      el.style.opacity = opacity;
    });
  });