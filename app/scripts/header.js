const CLASSES = {
  DRAWER_OPEN: 'drawer-open',
  SCROLLING: 'scrolling',
  SUBMENU_TOGGLER: 'header__nav__submenu-toggler',
};

export default class Header {
  constructor() {
    this.header = document.querySelector('.header');
    this.nav = this.header.querySelector('.header__nav');
    this._$submenuTogglers = $(`.${CLASSES.SUBMENU_TOGGLER}`);
    this._$lastSubMenuDrawer = null;

    this._init();
  }

  _init = () => {
    if (this._$submenuTogglers) {
      this._$submenuTogglers.each((i, toggler) => {
        const $toggler = $(toggler);
        const $submenu = $toggler.next('.header__nav__submenu');

        // add click event to show/hide submenu
        // this is to support bare minimum keyboard accessibility
        $toggler.on('click', () => {
          $submenu.attr('aria-hidden', $submenu.attr('aria-hidden') === 'true' ? 'false' : 'true');
        });

        $toggler.on('mouseenter', () => {
          this._showSubMenu($submenu, 'false');
        });

        $toggler.on('mouseleave', () => {
          this._showSubMenu($submenu, 'true');
        });

        $submenu.on('mouseenter', () => {
          this._showSubMenu($submenu, 'false');
        });

        $submenu.on('mouseleave', () => {
          this._showSubMenu($submenu, 'true');
        });
      });
    }
  }

  _showSubMenu = ($elem, hidden) => {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      if (this._$lastSubMenuDrawer) {
        this._$lastSubMenuDrawer.attr('aria-hidden', 'true');
      }

      $elem.attr('aria-hidden', hidden);

      if (hidden === 'false') {
        this._$lastSubMenuDrawer = $elem;
      }
    }, 100);
  };
}
