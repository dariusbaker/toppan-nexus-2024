const CLASSES = {
  DRAWER_OPEN: 'drawer-open',
  SUBNAV_DRAWER_OPEN: 'subnav-drawer-open',
  SCROLLING: 'scrolling',
  SCROLLED: 'scrolled',
  ANIMATING: 'animating',
  SHOW_HEADER: 'header--show',
  SUBMENU_TOGGLER: 'header__nav__submenu-toggler',
};

const IDS = {
  NAV_TOGGLER: 'nav-menu-toggle',
  HEADER: 'toppan-header',
};

export default class Header {
  constructor() {
    this._drawerOpen = false;
    this._animating = false;
    this._scrolling = false;
    this._scrollRAF = null;
    this._lastScrollY = 0;
    this._isAtTop = true;
    this._scrolled = false;
    this._show = true;

    this._$header = $(`#${IDS.HEADER}`);
    this._$navToggleBtn = $(`#${IDS.NAV_TOGGLER}`);
    this._$submenuTogglers = $(`.${CLASSES.SUBMENU_TOGGLER}`);
    this._$lastSubMenuDrawer = null;

    this._init();
  }

  _init() {
    this._initSubmenuTogglers();
    this._initNavToggleBtn();
    this._initPeekableHeader();
  }

  _initPeekableHeader() {
    if (!this._$header) {
      return;
    }

    this._$header.on('transitionend', this._handleTransitionEnd);
    $(window).on('scroll', this._handleScrollThrottling);
  }

  _handleTransitionEnd = () => {
    this._animating = false;

    if (this._$header) {
      if (this._drawerOpen) {
        this._$header.addClass(CLASSES.DRAWER_OPEN);
      } else {
        this._$header.removeClass(CLASSES.DRAWER_OPEN);
      }
    }
  }

  _showNav = () => {
    if (!this._$header) {
      return;
    }

    this._animating = true;

    this._scrolled = false;
    this._show = true;

    this._$header.addClass(CLASSES.SHOW_HEADER);
    this._$header.removeClass(CLASSES.SCROLLED);
  }

  _hideNav = () => {
    if (!this._$header) {
      return;
    }

    this._animating = true;

    this._scrolled = true;
    this._show = false;

    this._$header.removeClass(CLASSES.SHOW_HEADER);
    this._$header.addClass(CLASSES.SCROLLED);
  };

  _scrollHandler = () => {
    if (!this._$header) {
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDirection = this._lastScrollY >= currentScrollY ? 'up' : 'down';

    // Need to set a threshold to avoid browser elastic scrolling triggering
    // nav hide
    const nearBottom =
      document.body.clientHeight - currentScrollY - window.innerHeight <= 50;

    // hide the nav once scrolling down
    if (
      !this._isAtTop &&
      scrollDirection === 'down' &&
      // if reduced motion is enabled, we should hide the nav
      !this._scrolled && !this._animating
    ) {
      if (currentScrollY > this._$header.get(0).clientHeight) {
        this._hideNav();
      }
    }
    // This is for scrolling up and not at the top of the page.
    else if (
      !this._isAtTop &&
      scrollDirection === 'up' &&
      // if reduced motion is enabled, we should show the nav
      (this._scrolled && !this.animating) &&
      !nearBottom
    ) {
      // This fix a bug in some mobile safari browsers. It randomly causes
      // this block to run while scrolling down
      if (this._lastScrollY - currentScrollY !== 0) {
        this._showNav();
      }
      // This is for preventing the nav from getting lock in a hidden state.
    } else if (
      this._isAtTop &&
      (!this._animating && this._scrolled)
    ) {
      this._showNav();
    }

    this._isAtTop = window.scrollY <= 0;
    this._lastScrollY = window.scrollY;
  };

  _handleScrollThrottling = () => {
    if (!this._scrolling) {
      this._scrollRAF = window.requestAnimationFrame(() => {
        this._scrollHandler();
        this._scrolling = false;
        this._$header.removeClass(CLASSES.SCROLLING);
      });

      this._scrolling = true;
      this._$header.addClass(CLASSES.SCROLLING);
    }
  };

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

      const open = hidden === 'false';

      $elem.attr('aria-hidden', hidden);
      $toggler.attr('aria-expanded', open);

      if (open) {
        this._$header.addClass(CLASSES.SUBNAV_DRAWER_OPEN);
        this._$lastSubMenuDrawer = $elem;
      } else {
        this._$header.removeClass(CLASSES.SUBNAV_DRAWER_OPEN);
      }
    }, 100);
  };
}
