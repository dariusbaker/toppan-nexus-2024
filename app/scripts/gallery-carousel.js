export default class GalleryCarousel {
  constructor() {
    this._$galleryCarousels = $('[gallery-carousel]');
    this._init();
  }

  _init() {
    if (this._$galleryCarousels.length) {
      this._$galleryCarousels.each((index, galleryCarousel) => {
        const $galleryCarousel = $(galleryCarousel);
        const $viewport = $galleryCarousel.find('[gallery-carousel-viewport]');
        const $prevButton = $galleryCarousel.find('[gallery-carousel-prev]');
        const $nextButton = $galleryCarousel.find('[gallery-carousel-next]');
        const $progressBar = $galleryCarousel.find('[gallery-carousel-progress-bar]');

        $viewport.on('init', (event, slick) => {
          this._computeProgressBarWidth(0, slick.slideCount, $progressBar);
        });

        $viewport.on('afterChange', (event, slick, currentSlide, nextSlide) => {
          this._computeProgressBarWidth(currentSlide, slick.slideCount, $progressBar);
        });

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

  _computeProgressBarWidth(currentSlide, slideCount, $progressBar) {
    const progress = (currentSlide + 1) / slideCount * 100;

    $progressBar.css('width', `${progress}%`);
  }
}