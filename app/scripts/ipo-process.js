export default class IPOProcess {
  _spacer = 100;
  constructor() {
    this._$section = $('[ipo-process]');
    this._$cards = this._$section.find('[ipo-process-card]');
    this._totalCards = this._$cards.length;

    this._init();
  }

  _init() {
    if (this._$cards.length) {
      this._$cards.each((index, card) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            scrub: true,
            start: `top top`,
            end: 'bottom bottom',
            endTrigger: '.ipo-process',
            pin: true,
            pinSpacing: false,
            markers: false,
            id: 'ipo-card-pin',
            invalidateOnRefresh: true,
          },
          scale: () => index < this._totalCards - 1 ? 1 - (this._totalCards - index) * 0.1 : 1,
          opacity: () => index < this._totalCards - 1 ? .3 : 1
        });
      });
    }
  }
}