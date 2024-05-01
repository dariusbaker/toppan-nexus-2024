const CLASSES = {
  MEDIA: 'people-carousel__media',
  SLIDES: 'people-carousel__slides',
  IMG_WRAPPER: 'people-carousel__img-wrapper',
  IMG_WRAPPER_ACTIVE: 'people-carousel__img-wrapper--active',
  SLIDE: 'people-carousel__slide',
  SLIDE_ACTIVE: 'people-carousel__slide--active',
};

export default class PeopleCarousel {
  constructor() {
    this._$peopleCarousels = $('[people-carousel]');

    this._init();
  }

  _init() {
    if (this._$peopleCarousels.length) {
      this._$peopleCarousels.each((i, carousel) => {
        const $status = $(carousel).find('[people-carousel-status]');
        const $slides = $(carousel).find(`.${CLASSES.SLIDE}`);
        const $imgWrappers = $(carousel).find(`.${CLASSES.IMG_WRAPPER}`);

        const $media = $(carousel).find(`.${CLASSES.MEDIA}`);
        const $panes = $(carousel).find(`.${CLASSES.SLIDES}`);

        const $next = $(carousel).find('[people-carousel-next]');
        const $prev = $(carousel).find('[people-carousel-prev]');

        $next.on('click', () => {
          let activeSlide = $(carousel).data('active-slide');

          if (activeSlide < $slides.length - 1) {
            activeSlide++;
          }

          this._updateStatus(
            $next,
            $prev,
            $status,
            $(carousel),
            activeSlide,
            $slides.length
          );

          this._updateSlide(
            $slides,
            $imgWrappers,
            $media,
            $panes,
            activeSlide
          );
        });

        $prev.on('click', () => {
          let activeSlide = $(carousel).data('active-slide');

          if (activeSlide > 0) {
            activeSlide--;
          }

          this._updateStatus(
            $next,
            $prev,
            $status,
            $(carousel),
            activeSlide,
            $slides.length
          );

          this._updateSlide(
            $slides,
            $imgWrappers,
            $media,
            $panes,
            activeSlide
          );
        });
      });
    }
  }

  _updateSlide($slides, $imgWrappers, $media, $panes, activeSlide) {
    $slides.removeClass(CLASSES.SLIDE_ACTIVE);
    $slides.eq(activeSlide).addClass(CLASSES.SLIDE_ACTIVE);

    $imgWrappers.removeClass(CLASSES.IMG_WRAPPER_ACTIVE);
    $imgWrappers.eq(activeSlide).addClass(CLASSES.IMG_WRAPPER_ACTIVE);

    $media.css('transform', `translateX(${activeSlide * -100}%)`);
    $panes.css('transform', `translateX(${activeSlide * -100}%)`);
  }

  _updateStatus(
    $next,
    $prev,
    $status,
    $carousel,
    activeSlide,
    totalSlides
  ) {
    $carousel.data('active-slide', activeSlide);
    $status.text(`${activeSlide + 1} of ${totalSlides}`);

    if (activeSlide === totalSlides - 1) {
      $next.attr('disabled', true);
    } else {
      $next.removeAttr('disabled');
    }

    if (activeSlide === 0) {
      $prev.attr('disabled', true);
    } else {
      $prev.removeAttr('disabled');
    }
  }
}