const CLASSES = {
  MEDIA_CAROUSEL: 'testimonials-carousel__content__left',
  MEDIA_CAROUSEL_LEFT: 'testimonials-carousel__content__left--left',
  MEDIA_CARD: 'testimonials-carousel__content__left__card',
  CONTENT: 'testimonials-carousel__content__cards',
  CONTENT_CARD: 'testimonials-carousel__content__card',
  CONTENT_CARD_ACTIVE: 'testimonials-carousel__content__card--active',
  MEDIA_CARD_ACTIVE: 'testimonials-carousel__content__left__card--active',
  MEDIA_CARD_RIGHT: 'testimonials-carousel__content__left__card--right',
  MEDIA_CARD_INACTIVE: 'testimonials-carousel__content__left__card--inactive',
};

export default class TestimonialsCarousel {
  constructor() {
    this._currentSlide = 0;
    this._moveLeft = true;

    this._$testimonialsCarousel = $('[testimonials-carousel]');
    this._$mediaCarousel = this._$testimonialsCarousel.find(`.${CLASSES.MEDIA_CAROUSEL}`);
    this._$mediaCarouselCards = this._$mediaCarousel.find(`.${CLASSES.MEDIA_CARD}`);

    this._$contentCarousel = this._$testimonialsCarousel.find(`.${CLASSES.CONTENT}`);

    this._$contentCarouselCards = this._$testimonialsCarousel.find(`.${CLASSES.CONTENT_CARD}`);

    this._totalSlides = this._$mediaCarouselCards.length;

    this._$next = this._$testimonialsCarousel.find('[testimonials-carousel-next]');
    this._$prev = this._$testimonialsCarousel.find('[testimonials-carousel-prev]');

    this._init();
  }

  _init() {
    if (this._$testimonialsCarousel) {
      this._$next.on('click', this._handleNext);

      this._$prev.on('click', this._handlePrev);

      const mql = window.matchMedia("(max-width: 960px)");

      mql.onchange = (e) => {
        if (mql.matches) {
          this._isMobile = true;
        } else {
          this._isMobile = false;
        }

        requestAnimationFrame(() => {
          this._updateSlide();
        });
      };

      mql.onchange();
    }
  }

  _handleNext = () => {
    if (this._currentSlide < this._totalSlides - 1) {
      this._currentSlide++;
    }

    this._moveLeft = true;

    this._updateSlide();
    this._updateSlideContent();
    this._updateNav();
  }

  _handlePrev = () => {
    if (this._currentSlide > 0) {
      this._currentSlide--;
    }

    this._moveLeft = false;

    this._updateSlide();
    this._updateSlideContent();
    this._updateNav();
  }

  _updateNav() {
    this._$prev.attr('disabled', this._currentSlide === 0 ? true : false);
    this._$next.attr('disabled', this._currentSlide === this._totalSlides - 1 ? true : false);
  }

  _updateSlideContent() {
    this._$contentCarouselCards.removeClass(CLASSES.CONTENT_CARD_ACTIVE);
    this._$contentCarouselCards.eq(this._currentSlide).addClass(CLASSES.CONTENT_CARD_ACTIVE);

    this._$contentCarousel.css('transform', `translateX(${this._currentSlide * -100}%)`);
  }

  _updateSlide() {
    this._$mediaCarouselCards.removeClass(CLASSES.MEDIA_CARD_IDLE);
    this._$mediaCarouselCards.removeClass(CLASSES.MEDIA_CARD_INACTIVE);
    this._$mediaCarouselCards.removeClass(CLASSES.MEDIA_CARD_RIGHT);
    this._$mediaCarousel.removeClass(CLASSES.MEDIA_CAROUSEL_LEFT);

    this._$mediaCarouselCards.removeClass(CLASSES.MEDIA_CARD_ACTIVE);

    if (this._moveLeft) {
      this._$mediaCarousel.addClass(CLASSES.MEDIA_CAROUSEL_LEFT);
    }

    this._$mediaCarouselCards.eq(this._currentSlide).addClass(CLASSES.MEDIA_CARD_ACTIVE);

    if (!this._isMobile) {
      // Hide all cards to the right of the current slide
      let temp = this._currentSlide - 1;

      while (temp > -1) {
        this._$mediaCarouselCards.eq(temp).addClass(CLASSES.MEDIA_CARD_INACTIVE);
        temp--;
      }
    }

    requestAnimationFrame(() => {
      this._currentMediaSlideWidth = this._$mediaCarouselCards.eq(this._currentSlide).width();

      if (!this._isMobile) {
        this._$mediaCarousel.css('transform', `translateX(${(this._currentSlide * this._currentMediaSlideWidth) + (this._currentSlide * 24)}px)`);
      } else {
        this._$mediaCarousel.css('transform', `translateX(${(this._currentSlide * -this._currentMediaSlideWidth) + (this._currentSlide * -24)}px)`);
      }
    });
  }
}