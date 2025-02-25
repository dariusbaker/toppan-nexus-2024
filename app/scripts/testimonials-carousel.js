const CLASSES = {
  MEDIA_CAROUSEL: 'testimonials-carousel__content__left',
  MEDIA_CARD: 'testimonials-carousel__content__left__card-wrapper',
  MEDIA_CARD_INACTIVE: 'testimonials-carousel__content__left__card-wrapper--inactive',
  CONTENT: 'testimonials-carousel__content__cards',
  CONTENT_CARD: 'testimonials-carousel__content__card',
  CONTENT_CARD_ACTIVE: 'testimonials-carousel__content__card--active',
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

    this._totalSlides = this._$contentCarouselCards.length;

    this._$next = this._$testimonialsCarousel.find('[testimonials-carousel-next]');
    this._$prev = this._$testimonialsCarousel.find('[testimonials-carousel-prev]');

    this._init();
  }

  _init() {
    if (this._$testimonialsCarousel.length) {
      const mql = window.matchMedia("(max-width: 960px)");

      mql.onchange = (e) => {
        if (mql.matches) {
          this._isMobile = true;
        } else {
          this._isMobile = false;
        }

        requestAnimationFrame(() => {
          this._initSlick();
        });
      };

      mql.onchange();
    }
  }

  _initSlick() {
    if (this._slickInstance) {
      this._slickInstance.slick('unslick');
    }

    const options = {
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      nextArrow: this._$next,
      prevArrow: this._$prev,
    };

    if (this._isMobile) {
      this._$mediaCarouselCards.removeClass(CLASSES.MEDIA_CARD_INACTIVE);
      this._$mediaCarousel.attr('dir', 'ltr');
      options.centerMode = true;
    } else {
      this._$mediaCarousel.attr('dir', 'rtl');
      options.rtl = true;
    }

    this._$mediaCarousel.on('afterChange', (event, slick, currentSlide, nextSlide) => {
      this._currentSlide = currentSlide;
      this._$mediaCarouselCards.eq(currentSlide).removeClass(CLASSES.MEDIA_CARD_INACTIVE);
      this._updateSlideContent();
    });

    this._$mediaCarousel.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
      if (this._isMobile) {
        return;
      }

      if (currentSlide < nextSlide) {
        this._$mediaCarouselCards.eq(currentSlide).addClass(CLASSES.MEDIA_CARD_INACTIVE);
      }
    });

    this._slickInstance = this._$mediaCarousel.slick(options);
  }

  _updateSlideContent() {
    this._$contentCarouselCards.removeClass(CLASSES.CONTENT_CARD_ACTIVE);
    this._$contentCarouselCards.eq(this._currentSlide).addClass(CLASSES.CONTENT_CARD_ACTIVE);

    this._$contentCarousel.css('transform', `translateX(${this._currentSlide * -100}%)`);
  }
}