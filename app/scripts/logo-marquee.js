const PIXELS_PER_SECOND = 200;

export default class LogoMarquee {
  constructor() {
    this._$logoMarquees = $('[logo-marquee]');
    this._init();
  }

  _init() {
    if (this._$logoMarquees.length) {
      this._$logoMarquees.each((index, logoMarquee) => {
        const $logoMarquee = $(logoMarquee);
        const $logoMarqueeItems = $logoMarquee.find('[logo-marquee-items]');

        const count =
          Math.ceil(
            $logoMarquee.get(0).offsetWidth / $logoMarqueeItems.get(0).offsetWidth
          ) + 1;
        const marqueeWidth = count * $logoMarqueeItems.get(0).offsetWidth;
        const duration = Math.round(
          (marqueeWidth - $logoMarquee.get(0).offsetWidth) / PIXELS_PER_SECOND
        );

        $logoMarqueeItems.css('animation-duration', `${duration}s`);

        for (let i = 0; i < count; i++) {
          const $logoMarqueeItemsClone = $logoMarqueeItems.clone();
          $logoMarqueeItemsClone.attr('aria-hidden', 'true');
          $logoMarquee.append($logoMarqueeItemsClone);
        }
      });
    }
  }
}