export default class ServiceFeaturesIPO {
  constructor() {
    this._$statistics = $('[ipo-services]');
    this._init();
  }

  _init() {
    if (this._$statistics.length) {
      const mql = window.matchMedia("(max-width: 960px)");

      mql.onchange = (e) => {
        if (mql.matches) {
          this._isMobile = true;
        } else {
          this._isMobile = false;
        }
      };

      mql.onchange();

      this._$statistics.each((index, element) => {
        const $element = $(element);
        const $cards = $element.find('[ipo-services-cards]');
        const $items = $cards.find('li');
        const $progress = $element.find('[ipo-services-progress]');

        const observer = new IntersectionObserver((entries, observer) => {
          // find the entry with the largest intersection ratio
          const activated = entries.reduce(function (max, entry) {
            return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
          });

          const ratio = this._isMobile ? .75 : .5;

          if (activated.intersectionRatio >= ratio) {
            this._computeProgressBarWidth($items.index(activated.target), $items.length, $progress);
          }
        }, {
          root:$cards.get(0), threshold:0.8
        });

        $items.each((index, element) => {
          observer.observe(element);
        });
      });
    }
  }

  _computeProgressBarWidth(currentSlide, slideCount, $progressBar) {
    const progress = (currentSlide + 1) / slideCount * 100;

    $progressBar.css('width', `${progress}%`);
  }
}
