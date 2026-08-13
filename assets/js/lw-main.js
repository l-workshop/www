/* ===================================================================
   L-Workshop — site script

   Replaces the template's assets/js/script.js. That file initialised
   Revolution Slider, CubePortfolio, Owl Carousel, Parallaxie, the
   TweenMax cursor and Google Maps, none of which this page uses; with
   those plugins pruned it would throw on load. Only the behaviour the
   page actually needs is kept here.
=================================================================== */

(function ($) {
    'use strict';

    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    $(function () {

        /* ===============================================
           Theme toggle (light / dark)

           The initial theme is already set on <html> by the inline
           bootstrap script in <head> (localStorage 'lw-theme', else
           prefers-color-scheme) — that runs before first paint, so
           there is no flash to fix here, only the toggle buttons and
           the one thing JS alone can update: meta[theme-color].
           =============================================== */
        var root = document.documentElement;
        var $toggles = $('.lw-theme-toggle');
        var $themeColor = $('meta[name="theme-color"]');
        var THEME_COLOR = { light: '#ffffff', dark: '#14171a' };

        function paintToggles(theme) {
            var isDark = theme === 'dark';

            $toggles
                .attr('aria-pressed', isDark ? 'true' : 'false')
                .attr('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme')
                .find('i')
                .attr('class', isDark ? 'fa fa-sun' : 'fa fa-moon');

            if ($themeColor.length) {
                $themeColor.attr('content', THEME_COLOR[theme] || THEME_COLOR.light);
            }
        }

        paintToggles(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

        $toggles.on('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

            root.setAttribute('data-theme', next);

            try {
                localStorage.setItem('lw-theme', next);
            } catch (e) {
                // private browsing / storage disabled — theme still applies for this load
            }

            paintToggles(next);
        });

        /* ===============================================
           Fixed header on scroll
           =============================================== */
        var $header = $('header');
        var $window = $(window);

        function onScroll() {
            $header.toggleClass('header-appear', $window.scrollTop() >= 80);
        }

        $window.on('scroll', onScroll);
        onScroll();

        /* ===============================================
           Smooth scroll for in-page links
           =============================================== */
        $('.scroll').on('click', function (event) {
            var $target = $(this.hash);

            if (!$target.length) {
                return;
            }

            event.preventDefault();

            var top = $target.offset().top - 70;

            if (reduceMotion) {
                window.scrollTo(0, top);
            } else {
                $('html, body').animate({ scrollTop: top }, 900);
            }

            // move keyboard focus with the viewport
            $target.attr('tabindex', '-1').get(0).focus({ preventScroll: true });
        });

        /* ===============================================
           Side menu
           =============================================== */
        var $sideMenu = $('.side-menu');
        var $overlay = $('#close_side_menu');
        var $toggles = $('.sidemenu_toggle');
        var $closeBtn = $('#btn_sideNavClose');

        function openMenu(event) {
            if (event) {
                event.preventDefault();
            }

            $sideMenu.addClass('side-menu-active');
            $overlay.fadeIn(300);
            $toggles.attr('aria-expanded', 'true');
            $closeBtn.get(0) && $closeBtn.get(0).focus();
        }

        function closeMenu(event) {
            if (event) {
                event.preventDefault();
            }

            if (!$sideMenu.hasClass('side-menu-active')) {
                return;
            }

            $sideMenu.removeClass('side-menu-active');
            $overlay.fadeOut(200);
            $toggles.attr('aria-expanded', 'false');
            $toggles.filter(':visible').first().focus();
        }

        $toggles.on('click', openMenu);
        $overlay.on('click', closeMenu);
        $closeBtn.on('click', closeMenu);
        $('.side-nav .navbar-nav .nav-link').on('click', function () {
            // let the link do its work, then close
            $sideMenu.removeClass('side-menu-active');
            $overlay.fadeOut(200);
            $toggles.attr('aria-expanded', 'false');
        });

        $(document).on('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });

        /* ===============================================
           Scroll reveals

           The hidden state is opt-in: the `lw-reveal-ready` class is only
           added when we know we can also take it away again. Without it
           the CSS leaves every section visible.
           =============================================== */
        var reveals = document.querySelectorAll('.lw-reveal');

        if (!reduceMotion && 'IntersectionObserver' in window && reveals.length) {
            document.documentElement.classList.add('lw-reveal-ready');

            Array.prototype.forEach.call(reveals, function (el) {
                var d = el.getAttribute('data-lw-delay');

                if (d) {
                    el.style.setProperty('--d', d);
                }
            });

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });

            Array.prototype.forEach.call(reveals, function (el) {
                observer.observe(el);
            });
        }

        /* ===============================================
           Rotating headline
           Left as the full static list when motion is reduced.
           =============================================== */
        if (!reduceMotion && $.fn.Morphext) {
            $('#js-rotating').Morphext({
                animation: 'fadeIn',
                separator: ',',
                speed: 3200
            });
        }

        /* ===============================================
           Lightbox
           =============================================== */
        if ($.fn.fancybox) {
            $('[data-fancybox]').fancybox({
                protect: true,
                animationEffect: reduceMotion ? false : 'fade',
                hash: false,
                loop: true
            });
        }

        /* ===============================================
           Case-study filter
           =============================================== */
        var $filters = $('.lw-filter');
        var $shots = $('#lw-gallery').children('.lw-shot');
        var $status = $('#lw-gallery-status');
        var statusDefault = $status.text();

        $filters.on('click', function () {
            var $button = $(this);
            var kind = $button.data('filter');
            var shown = 0;

            $filters.attr('aria-pressed', 'false');
            $button.attr('aria-pressed', 'true');

            $shots.each(function () {
                var $shot = $(this);
                var match = kind === 'all' || $shot.data('kind') === kind;

                $shot.toggle(match);

                if (match) {
                    shown++;
                }
            });

            $status.text(kind === 'all'
                ? statusDefault
                : 'Showing ' + shown + ' of ' + $shots.length + ' captures.');
        });
    });
}(jQuery));
