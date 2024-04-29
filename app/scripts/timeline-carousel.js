import Hammer from 'hammerjs';

const CLASSES = {
  CARD: 'timeline-carousel__content__card',
  CARD_LEFT: 'timeline-carousel__content__card--left',
  CARD_INACTIVE: 'timeline-carousel__content__card--inactive',
  CONTENT_LEFT: 'timeline-carousel__content--left',
  CONTENT: 'timeline-carousel__content',
};

export default class TimelineCarousel {
  constructor() {
    this._currentSlide = 0;
    this._moveLeft = true;
    this._$timelineCarousel = $('[timeline-carousel]');
    this._$timelineCarouselContent = this._$timelineCarousel.find(`.${CLASSES.CONTENT}`);
    this._$timelineCards = this._$timelineCarousel.find(`.${CLASSES.CARD}`);
    this._totalSlides = this._$timelineCards.length;

    this._$next = this._$timelineCarousel.find('[timeline-carousel-next]');
    this._$prev = this._$timelineCarousel.find('[timeline-carousel-prev]');

    this._currentSlideWidth = this._$timelineCards.eq(this._currentSlide).width();

    this._init();
  }

  _init() {
    if (this._$timelineCarousel) {
      this._hammerInstance = new Hammer(this._$timelineCarouselContent.get(0));

      this._hammerInstance.on('swipeleft', this._handleNext);

      this._hammerInstance.on('swiperight', this._handlePrev);

      this._$next.on('click', this._handleNext);

      this._$prev.on('click', this._handlePrev);
    }
  }

  _handleNext = () => {
    if (this._currentSlide < this._totalSlides - 1) {
      this._currentSlide++;
    }

    this._moveLeft = true;

    this._updateSlide();
    this._updateNav();
  }

  _handlePrev = () => {
    if (this._currentSlide > 0) {
      this._currentSlide--;
    }

    this._moveLeft = false;

    this._updateSlide();
    this._updateNav();
  }

  _updateNav() {
    this._$prev.attr('disabled', this._currentSlide === 0 ? true : false);
    this._$next.attr('disabled', this._currentSlide === this._totalSlides - 1 ? true : false);
  }

  _updateSlide() {
    this._$timelineCards.removeClass(CLASSES.CARD_INACTIVE);
    this._$timelineCards.removeClass(CLASSES.CARD_LEFT);
    this._$timelineCarouselContent.removeClass(CLASSES.CONTENT_LEFT);

    if (this._moveLeft) {
      this._$timelineCards.eq(this._currentSlide).addClass(CLASSES.CARD_LEFT);
      this._$timelineCarouselContent.addClass(CLASSES.CONTENT_LEFT);
    }

    let temp = this._currentSlide - 1;

    while (temp > -1) {
      this._$timelineCards.eq(temp).addClass(CLASSES.CARD_INACTIVE);
      temp--;
    }

    // 24 is the gap between each card
    this._$timelineCarouselContent.css('transform', `translateX(${(this._currentSlide * -this._currentSlideWidth) + (this._currentSlide * -24)}px)`);
  }
}