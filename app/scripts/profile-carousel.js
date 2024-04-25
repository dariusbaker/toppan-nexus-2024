export default class ProfileCarousel {
  constructor() {
    this._$profileCarousels = $('[profile-carousel]');
    this._init();
  }

  _init() {
    if (this._$profileCarousels) {
      this._$profileCarousels.each((index, profileCarousel) => {
        const $profileCarousel = $(profileCarousel);
        const $viewport = $profileCarousel.find('[profile-carousel-viewport]');
        const $prevButton = $profileCarousel.find('[profile-carousel-prev]');
        const $nextButton = $profileCarousel.find('[profile-carousel-next]');

        $viewport.slick({
          dots: false,
          infinite: false,
          speed: 300,
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
          nextArrow: $nextButton,
          prevArrow: $prevButton,
        });
      });
    }
  }
}