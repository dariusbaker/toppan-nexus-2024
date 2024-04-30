const CLASSES = {
  TAB: 'culture-carousel__tab',
  TAB_ACTIVE: 'culture-carousel__tab--active',
  MEDIA: 'culture-carousel__media',
  PANELS: 'culture-carousel__panels',
  IMG_WRAPPER: 'culture-carousel__img-wrapper',
  IMG_WRAPPER_ACTIVE: 'culture-carousel__img-wrapper--active',
  PANEL: 'culture-carousel__panel',
  PANEL_ACTIVE: 'culture-carousel__panel--active',
};

export default class CultureCarousel {
  constructor() {
    this._$cultureCarousels = $('[culture-carousel]');

    this._init();
  }

  _init() {
    if (this._$cultureCarousels.length) {
      this._$cultureCarousels.each((i, carousel) => {
        const $tabs = $(carousel).find(`.${CLASSES.TAB}`);
        const $panels = $(carousel).find(`.${CLASSES.PANEL}`);
        const $imgWrappers = $(carousel).find(`.${CLASSES.IMG_WRAPPER}`);

        const $media = $(carousel).find(`.${CLASSES.MEDIA}`);
        const $panes = $(carousel).find(`.${CLASSES.PANELS}`);

        $tabs.on('click', function() {
          const $tab = $(this);
          const index = $tabs.index($tab);

          $tabs.removeClass(CLASSES.TAB_ACTIVE);
          $tab.addClass(CLASSES.TAB_ACTIVE);

          $panels.removeClass(CLASSES.PANEL_ACTIVE);
          $panels.eq(index).addClass(CLASSES.PANEL_ACTIVE);

          $panes.css('transform', `translateX(${index * -100}%)`);

          $imgWrappers.removeClass(CLASSES.IMG_WRAPPER_ACTIVE);
          $imgWrappers.eq(index).addClass(CLASSES.IMG_WRAPPER_ACTIVE);

          $media.css('transform', `translateX(${index * -100}%)`);


        });
      });
    }
  }
}