/* ===================================================================
   MnL Help — docs behaviour

   No dependencies. Everything degrades to a working static page:
   the sidebar is a plain <nav> and every anchor resolves without JS.
=================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ===============================================
           Theme toggle (light / dark)

           <html data-theme> is already set by the inline bootstrap script
           in <head> (localStorage 'lw-theme', else prefers-color-scheme)
           before first paint — this only wires the button and keeps it in
           sync. Same localStorage key as the main site's lw-main.js, so a
           choice made on either side of a click-through carries over.
           =============================================== */
        var root = document.documentElement;
        var toggles = [].slice.call(document.querySelectorAll('.lw-theme-toggle'));

        function paintToggles(theme) {
            var isDark = theme === 'dark';

            toggles.forEach(function (btn) {
                btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
                btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');

                var icon = btn.querySelector('i');

                if (icon) {
                    icon.className = isDark ? 'fa fa-sun' : 'fa fa-moon';
                }
            });
        }

        paintToggles(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

        toggles.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';

                root.setAttribute('data-theme', next);

                try {
                    localStorage.setItem('lw-theme', next);
                } catch (e) {
                    // private browsing / storage disabled — theme still applies for this load
                }

                paintToggles(next);
            });
        });

        /* ===============================================
           Sidebar drawer (below 1024px)
           =============================================== */
        var rail = document.querySelector('.help-rail');
        var scrim = document.querySelector('.help-scrim');
        var toggle = document.querySelector('.help-menu-toggle');

        function setDrawer(open) {
            if (!rail) {
                return;
            }

            rail.classList.toggle('is-open', open);

            if (scrim) {
                scrim.classList.toggle('is-open', open);
            }

            if (toggle) {
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            }
        }

        if (toggle) {
            toggle.addEventListener('click', function () {
                setDrawer(!rail.classList.contains('is-open'));
            });
        }

        if (scrim) {
            scrim.addEventListener('click', function () {
                setDrawer(false);
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setDrawer(false);
            }
        });

        // close the drawer after jumping to an in-page anchor
        if (rail) {
            rail.addEventListener('click', function (event) {
                var link = event.target.closest('a');

                if (link && link.getAttribute('href').indexOf('#') === 0) {
                    setDrawer(false);
                }
            });
        }

        /* ===============================================
           Highlight the visible section in the sub-nav
           =============================================== */
        var subLinks = [].slice.call(document.querySelectorAll('.help-subnav a[href^="#"]'));

        if (!subLinks.length || !('IntersectionObserver' in window)) {
            return;
        }

        var byId = {};
        var targets = [];

        subLinks.forEach(function (link) {
            var id = link.getAttribute('href').slice(1);
            var el = document.getElementById(id);

            if (el) {
                byId[id] = link;
                targets.push(el);
            }
        });

        var visible = new Set();

        function paint() {
            // the topmost visible section wins
            var winner = null;

            targets.forEach(function (el) {
                if (visible.has(el.id) && !winner) {
                    winner = el.id;
                }
            });

            subLinks.forEach(function (link) {
                link.classList.remove('is-active');
            });

            if (winner && byId[winner]) {
                byId[winner].classList.add('is-active');
            }
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    visible.add(entry.target.id);
                } else {
                    visible.delete(entry.target.id);
                }
            });

            paint();
        }, { rootMargin: '-72px 0px -68% 0px', threshold: 0 });

        targets.forEach(function (el) {
            observer.observe(el);
        });
    });
}());
