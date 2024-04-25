// import plugin
import './polyfill/ie';

// Initializations
import './cores/prototype';
import Header from './header';
import LogoMarquee from './logo-marquee';
import ProfileCarousel from './profile-carousel';
import CultureCarousel from './culture-carousel';

const DEFAULT_FADE_UP_ANIMATION = {
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

$(document).ready(() => {
  // init header
  new Header();

  // init logo marquee component
  new LogoMarquee();

  // init profile carousel component
  new ProfileCarousel();

  // init culture carousel component
  new CultureCarousel();

  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(ScrollToPlugin);

  $('[animate-stagger]').each(function() {
    const $this = $(this);
    const $items = $this.find('[animate-fade-up]');
    let tl = gsap.timeline({ paused: true });

    tl.from($items, DEFAULT_FADE_UP_ANIMATION);

    createScrollTrigger($this, tl);
  });

  $('.partner-grid').each(function() {
    initPartnerGrid($(this));
  });
});
