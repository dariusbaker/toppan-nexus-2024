export default class Marquee {
  constructor() {
    this._$marquees = $('[marquee]');
    this._PIXELS_PER_SECOND = parseInt(this._$marquees.attr('data-pixel-per-second'));
    this._init();
  }

  _init() {
    if (this._$marquees.length) {
      this._$marquees.each((index, marquee) => {
        const $marquee = $(marquee);
        const $marqueeItems = $marquee.find('[marquee-items]');

        const count =
          Math.ceil(
            $marquee.get(0).offsetWidth / $marqueeItems.get(0).offsetWidth
          ) + 1;
        const marqueeWidth = count * $marqueeItems.get(0).offsetWidth;
        const duration = Math.round(
          (marqueeWidth - $marquee.get(0).offsetWidth) / this._PIXELS_PER_SECOND
        );

        $marqueeItems.css('animation-duration', `${duration}s`);

        for (let i = 0; i < count; i++) {
          const $marqueeItemsClone = $marqueeItems.clone();
          $marqueeItemsClone.attr('aria-hidden', 'true');
          $marquee.append($marqueeItemsClone);
        }
      });
    }
  }
}