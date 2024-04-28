// import plugin
import './polyfill/ie';

// Initializations
import './cores/prototype';
import Header from './header';
import LogoMarquee from './logo-marquee';
import ProfileCarousel from './profile-carousel';
import CultureCarousel from './culture-carousel';
import PeopleCarousel from './people-carousel';
import GalleryCarousel from './gallery-carousel';
import Stastistics from './statistics';

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

function initAnimateNumber() {
  $('[animate-number]').each(function () {
    const t = $(this);
    const n = t.attr('animate-number');

    let tl = gsap.timeline({ paused: true });
    tl.to(t, { innerText: n, snap: { innerText: n.includes('.') ? .1 : 1 }, duration: 3 });
    createScrollTrigger(t, tl);
  });
}

$(document).ready(() => {
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

  $('[animate-wipe]').each(function() {
    const $this = $(this);
    const $mask = $('.image-wiper__mask', this);

    let tl = gsap.timeline({ paused: true });
    tl.from($this, { y: 50, opacity: 0 });
    tl.to($mask, { ease: 'power1.out', scaleX: 0, duration: 0.25 }, 0.5);

    createScrollTrigger($this, tl);
  });

  $('.features').each(function() {
    const $this = $(this);
    const $header = $this.find('.features__header');
    const $title = $this.find('.features__title');
    const $body = $this.find('.features__body');
    const $nav = $this.find('.features__nav');
    const $content = $this.find('.features__content');

    ScrollTrigger.matchMedia({
      '(min-width: 1024px)'() {
        let tl = gsap.timeline({ paused: true });

        tl.to($title, {fontSize: 20, ease: 'expo.easeOut', duration: .25});
        tl.to($body, {opacity: 0, duration: .25}, 0);

        ScrollTrigger.create({
          trigger: $this,
          pin: $header,
          start: 'top top',
          end: 'bottom bottom',
          pinSpacing: false,
        });

        ScrollTrigger.create({
          trigger: $content,
          start: 'top 300px',
          onEnter: () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        });

        ScrollTrigger.create({
          trigger: $content,
          pin: $nav,
          start: 'top top',
          end: 'bottom bottom',
        });
      },
    });
  });

  // init header
  new Header();

  // init logo marquee component
  new LogoMarquee();

  // init profile carousel component
  new ProfileCarousel();

  // init culture carousel component
  new CultureCarousel();

  // init people carousel component
  new PeopleCarousel();

  // init gallery carousel component
  new GalleryCarousel();

  // init statistics component
  new Stastistics();

  // init animate number
  initAnimateNumber();
});
