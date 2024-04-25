// import plugin
import './polyfill/ie';

// Initializations
import './cores/prototype';
import Header from './header';
import LogoMarquee from './logo-marquee';

const DEFAULT_FADE_UP_ANIMATION = {
  delay: .25,
  duration: .75,
  ease: 'expo.out',
  opacity: 0,
  stagger: .25,
  y: 50,
};

/**
 *
 * @param {Selector} target
 * @param {Timeline} timeline
 */
function createScrollTrigger(target, timeline) {
  ScrollTrigger.create({
    trigger: target,
    start: 'top 70%',
    onEnter: () => timeline.play(),
  });
}

/**
 * Add functionality to tab carousel for partners.
 * @param {Selector} $grid
 */
function initPartnerGrid($grid) {
  const $buttons = $('button', $grid);

  $buttons.click((e) => {
    const $this = $(e.currentTarget);
    const $active = $('.active', $grid);
    const $activeButton = $('button.active', $grid);
    const $panes = $('.partner-grid__panes', $grid);

    if ($active.length) {
      $active.removeClass('active');
    }

    $activeButton.attr('aria-selected', 'false');

    const index = $this.data('index') * 1;
    const $content = $(`#content-${index}`, $grid);
    const $logos = $(`#logos-${index}`, $grid);

    $content.addClass('active');
    $logos.addClass('active');
    $this.addClass('active').attr('aria-selected', 'true');
    $panes.css('transform', `translateX(${index * -100}%)`);
  });
}

/**
 *
 * @param {*} $element
 * @returns {number}
 */
function calcScrollAmount($element) {
  return Math.min(0, -1 * ($element.scrollWidth - $element.parentElement.offsetWidth));
}

/**
 *
 * @param {Selector} $service
 */
function initServiceFeature($service) {
  const $scroller = $('.service-feature__content', $service);
  const tween = gsap.to($scroller, {
    x: () => calcScrollAmount($scroller[0]),
    duration: 3,
    ease: 'none',
  });

  ScrollTrigger.create({
    trigger: $service,
    start: 'top',
    end: () => `+=${calcScrollAmount($scroller[0]) * -1}`,
    pin: true,
    animation: tween,
    scrub: 1,
    invalidateOnRefresh: true,
  });
}

$(document).ready(() => {
  // init header
  new Header();

  // init logo marquee component
  new LogoMarquee();

  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);

  $('.partner-grid').each(function() {
    initPartnerGrid($(this));
  });

  $('.service-feature').each(function() {
    initServiceFeature($(this));
  });

  // this has to come last otherwise they don't seem to initialise
  $('[animate-stagger]').each(function() {
    const $this = $(this);
    const $items = $this.find('[animate-fade-up]');
    let tl = gsap.timeline({ paused: true });

    tl.from($items, DEFAULT_FADE_UP_ANIMATION);

    createScrollTrigger($this, tl);
  });
});
