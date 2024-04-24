// import plugin
import './polyfill/ie';

// Initializations
import './cores/prototype';

const DEFAULT_FADE_UP_ANIMATION = {
  duration: .75,
  ease: 'expo.out',
  opacity: 0,
  stagger: .25,
  y: 50,
};

function createScrollTrigger(target, timeline) {
  ScrollTrigger.create({
    trigger: target,
    start: 'top 70%',
    onEnter: () => timeline.play(),
  });
}

$(function() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);

  $('[animate-stagger]').each(function () {
    const $this = $(this);
    const $items = $this.find('[animate-fade-up]');
    let tl = gsap.timeline({ paused: true });

    tl.from($items, DEFAULT_FADE_UP_ANIMATION);

    createScrollTrigger($this, tl);
  });
});
