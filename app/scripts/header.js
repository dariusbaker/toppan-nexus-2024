const CLASSES = {
  DRAWER_OPEN: 'header-drawer-open',
  SCROLLING: 'header-scrolling',
  SUBMENU_TOGGLER: 'header__nav__submenu-toggler',
};

const IDS = {
  NAV_TOGGLER: 'nav-menu-toggle',
  HEADER: 'toppan-header',
};

export default class Header {
  constructor() {
    this._drawerOpen = false;
    this._$header = $(`#${IDS.HEADER}`);
    this._$navToggleBtn = $(`#${IDS.NAV_TOGGLER}`);
    this._$submenuTogglers = $(`.${CLASSES.SUBMENU_TOGGLER}`);
    this._$lastSubMenuDrawer = null;

    this._init();
  }

  _init() {
    this._initSubmenuTogglers();
    this._initNavToggleBtn();
  }

  _initNavToggleBtn() {
    if (this._$navToggleBtn) {
      this._$navToggleBtn.on('click', () => {
        this._$header.toggleClass(CLASSES.DRAWER_OPEN);
        this._drawerOpen = !this._drawerOpen;

        // lock body scroll
        $('body').css('overflow-y', this._drawerOpen ? 'hidden' : 'auto');
      });
    }
  }

  _initSubmenuTogglers() {
    if (this._$submenuTogglers) {
      this._$submenuTogglers.each((i, toggler) => {
        const $toggler = $(toggler);
        const $submenu = $toggler.next('.header__nav__submenu');

        // add click event to show/hide submenu
        // this is to support bare minimum keyboard accessibility
        $toggler.on('click', () => {
          this._showSubMenu($submenu, $submenu.attr('aria-hidden') === 'true' ? 'false' : 'true', $toggler);
        });

        $toggler.on('mouseenter', () => {
          this._showSubMenu($submenu, 'false', $toggler);
        });

        $toggler.on('mouseleave', () => {
          this._showSubMenu($submenu, 'true', $toggler);
        });

        $submenu.on('mouseenter', () => {
          this._showSubMenu($submenu, 'false', $toggler);
        });

        $submenu.on('mouseleave', () => {
          this._showSubMenu($submenu, 'true', $toggler);
        });
      });
    }
  }

  _showSubMenu($elem, hidden, $toggler) {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }

    this._timeout = setTimeout(() => {
      if (this._$lastSubMenuDrawer) {
        this._$lastSubMenuDrawer.attr('aria-hidden', 'true');
      }

      $elem.attr('aria-hidden', hidden);
      $toggler.attr('aria-expanded', hidden === 'false');

      if (hidden === 'false') {
        this._$lastSubMenuDrawer = $elem;
      }
    }, 100);
  };
}
