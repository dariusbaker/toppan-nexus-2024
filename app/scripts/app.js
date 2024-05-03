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
import TimelineCarousel from './timeline-carousel';
import TestimonialsCarousel from './testimonials-carousel';
import IPOProcess from './ipo-process';
import ServiceFeaturesIPO from './service-features-ipo';

const DEBOUNCE_DELAY = 250;

const DEFAULT_FADE_UP_ANIMATION = {
  delay: .25,
  duration: .75,
  ease: 'expo.out',
  opacity: 0,
  stagger: .25,
  y: 50,
};

let triggerDebounceTimer = 0;

/**
 *
 * @param {ScrollTrigger[]} $triggers
 */
function debounceTriggerRefresh(triggers) {
  if (triggerDebounceTimer > 0) {
    clearTimeout(triggerDebounceTimer);
  }

  triggerDebounceTimer = setTimeout(() => {
    triggers.forEach((trigger) => trigger.refresh(true));
  }, DEBOUNCE_DELAY);
}

/**
 *
 * @param {HTMLElement} $card
 * @param {HTMLElement} $line
 * @returns {Object}
 */
function getCardTravelDistance($card, $line) {
  const br1 = $line.getBoundingClientRect();
  const br2 = $card.getBoundingClientRect();

  return {
    x: '+=' + Math.floor(br1.left - br2.left - ($card.offsetWidth / 2)),
    y: '+=' + Math.floor(br1.top - br2.bottom + ($card.offsetHeight / 2))
  }
}

function initHomeHero() {
  const $hero = $('.hero-home');
  const $cards = $('.hero-home__card');
  const $headers = $hero.find('h2');
  const $startMarkers = $('circle.line-start');

  if ($hero.length === 0) {
    return;
  }

  const tlCards = gsap.timeline({
    scrollTrigger: {
      trigger: $hero,
      start: 'top',
      end: 'center',
      //markers: true,
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });

  $cards.each((index) => {
    tlCards.to(
      $cards[index],
      {
        ...getCardTravelDistance($cards[index], $startMarkers[index]),
        scale: .84,
        rotationY: 12
      },
    0);
  });

  const tlHeaders = gsap.timeline();

  tlHeaders.set($headers[1], {opacity: 0, y: '+=24'});
  tlHeaders.set($headers[2], {opacity: 0, y: '+=24'});
  tlHeaders.to($headers[0], {duration: .25, opacity: 0, y: '-=24', ease: 'expo.out', delay: 2});
  tlHeaders.to($headers[1], {duration: .25, opacity: 1, y: '-=24', ease: 'expo.out'});
  tlHeaders.to($headers[1], {duration: .25, opacity: 0, y: '-=24', ease: 'expo.out', delay: 2});
  tlHeaders.to($headers[2], {duration: .25, opacity: 1, y: '-=24', ease: 'expo.out'});
}

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
    const $main = $('.partner-grid__main', $grid);
    const $active = $('.active', $grid);
    const $activeButton = $('button.active', $grid);

    if ($active.length) {
      $active.removeClass('active');
    }

    $activeButton.attr('aria-selected', 'false');

    const index = $this.data('index') * 1;
    const $content = $(`#content-${index}`, $grid);

    $content.addClass('active');
    $main.attr('data-selected', index);
    $this.addClass('active').attr('aria-selected', 'true');
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
 * @returns {ScrollTrigger}
 */
function initServiceFeature($service) {
  const $scroller = $('.service-feature__content', $service);
  const tween = gsap.to($scroller, {
    x: () => calcScrollAmount($scroller[0]),
    duration: 3,
    ease: 'none',
  });

  return ScrollTrigger.create({
    trigger: $service,
    start: 'top 24px',
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
  const trackedTriggers = [];
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);

  $('.partner-grid').each(function() {
    initPartnerGrid($(this));
  });

  $('.service-feature').each(function() {
    trackedTriggers.push(initServiceFeature($(this)));
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
    const $body = $this.find('.features__body');
    const $content = $this.find('.features__content');
    const $header = $this.find('.features__header');
    const $nav = $this.find('.features__nav');
    const $title = $this.find('.features__title');

    ScrollTrigger.matchMedia({
      '(min-width: 1024px)'() {
        let tl = gsap.timeline({ paused: true });

        tl.to($title, {fontSize: 20, ease: 'expo.out', duration: .25});
        tl.to($body, {opacity: 0, duration: .25}, 0);

        trackedTriggers.push(
          ScrollTrigger.create({
            trigger: $this,
            pin: $header,
            start: 'top top',
            end: 'bottom bottom',
            pinSpacing: false,
          })
        );

        trackedTriggers.push(
          ScrollTrigger.create({
            trigger: $content,
            start: 'top 300px',
            onEnter: () => tl.play(),
            onLeaveBack: () => tl.reverse(),
          })
        );

        trackedTriggers.push(
          ScrollTrigger.create({
            trigger: $content,
            pin: $nav,
            start: 'top top',
            end: 'bottom bottom',
          })
        );
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

  // init timeline carousel component
  new TimelineCarousel();

  // init testimonials carousel component
  new TestimonialsCarousel();

  // init IPO process component
  new IPOProcess();

  // init ipo services
  new ServiceFeaturesIPO();

  // init home hero animation
  initHomeHero();

  debounceTriggerRefresh(trackedTriggers);

  window.addEventListener('resize', () => {
    debounceTriggerRefresh(trackedTriggers);
  }, {passive: true});
});
