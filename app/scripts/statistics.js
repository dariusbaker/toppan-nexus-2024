export default class Stastistics {
  constructor() {
    this._$statistics = $('[statistics]');
    this._init();
  }

  _init() {
    if (this._$statistics.length) {
      this._$statistics.each((index, element) => {
        const $element = $(element);
        const $stats = $element.find('[statistics-stats]');
        const $statsItems = $stats.find('li');
        const $progress = $element.find('[statistics-progress]');

        const observer = new IntersectionObserver((entries, observer) => {
          // find the entry with the largest intersection ratio
          const activated = entries.reduce(function (max, entry) {
            return (entry.intersectionRatio > max.intersectionRatio) ? entry : max;
          });

          if (activated.intersectionRatio > 0) {
            this._computeProgressBarWidth($statsItems.index(activated.target), $statsItems.length, $progress);
          }
        }, {
          root:$stats.get(0), threshold:0.8
        });

        $statsItems.each((index, element) => {
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
