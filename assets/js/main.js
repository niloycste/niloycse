/**
 * Portfolio interactions for Niloy CSE.
 * The page remains fully usable without JavaScript; these enhancements add
 * smooth navigation, mobile navigation, filters, and optional plug-ins.
 */
!(function($) {
  "use strict";

  function closeMobileNav() {
    $('body').removeClass('mobile-nav-active');
    $('.mobile-nav-toggle').attr('aria-expanded', 'false').find('i')
      .removeClass('icofont-close').addClass('icofont-navigation-menu');
    $('.mobile-nav-overly').removeClass('is-visible');
  }

  function setActiveNav(id) {
    var $links = $('#site-nav a[href^="#"]');
    $links.removeClass('active');
    $links.closest('li').removeClass('active');
    $links.filter('[href="#' + id + '"]').addClass('active').closest('li').addClass('active');
  }

  function setupNavigation() {
    var $nav = $('#site-nav');
    if (!$nav.length) return;

    if (!$('#mobile-navigation').length) {
      var $mobileNav = $nav.find('ul').first().clone().attr({
        id: 'mobile-navigation',
        class: 'mobile-nav d-lg-none'
      });
      $('body').append($mobileNav);
      $('body').append('<button type="button" class="mobile-nav-toggle d-lg-none" aria-label="Open navigation" aria-controls="mobile-navigation" aria-expanded="false"><i class="icofont-navigation-menu"></i></button>');
      $('body').append('<div class="mobile-nav-overly" aria-hidden="true"></div>');
    }

    $(document).on('click', '.mobile-nav-toggle', function() {
      var isOpen = $('body').toggleClass('mobile-nav-active').hasClass('mobile-nav-active');
      $(this).attr('aria-expanded', isOpen ? 'true' : 'false');
      $(this).attr('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      $(this).find('i').toggleClass('icofont-navigation-menu', !isOpen).toggleClass('icofont-close', isOpen);
      $('.mobile-nav-overly').toggleClass('is-visible', isOpen);
    });

    $(document).on('click', '.mobile-nav-overly', closeMobileNav);

    $(document).on('click', '#site-nav a[href^="#"], #mobile-navigation a[href^="#"]', function(e) {
      var hash = this.getAttribute('href');
      var target = hash && document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', hash);
      }
      setActiveNav(hash.substring(1));
      closeMobileNav();
    });

    var updateNavState = function() {
      $nav.toggleClass('is-scrolled', window.scrollY > 24);
    };
    updateNavState();
    window.addEventListener('scroll', updateNavState, { passive: true });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
      document.querySelectorAll('header[id], section[id]').forEach(function(section) {
        observer.observe(section);
      });
    }
  }

  function setupPublicationFilters() {
    var $filters = $('.publication-filter');
    var $cards = $('.publication-card');
    if (!$filters.length || !$cards.length) return;

    $filters.on('click', function() {
      var filter = $(this).data('publication-filter');
      $filters.removeClass('is-active').attr('aria-selected', 'false');
      $(this).addClass('is-active').attr('aria-selected', 'true');

      $cards.each(function() {
        var show = filter === 'all' || $(this).hasClass('publication-filter-' + filter);
        $(this).prop('hidden', !show).toggleClass('is-filtered-out', !show);
      });
    });
  }

  function setupPortfolio() {
    var $container = $('.portfolio-container');
    var $controls = $('#portfolio-flters button');
    if (!$container.length || !$.fn.isotope) return;

    var portfolioIsotope = $container.isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $controls.on('click', function() {
      var filter = $(this).data('filter');
      $controls.removeClass('filter-active').attr('aria-pressed', 'false');
      $(this).addClass('filter-active').attr('aria-pressed', 'true');
      portfolioIsotope.isotope({ filter: filter });
    });
  }

  function setupOptionalPlugins() {
    if ($.fn.counterUp) {
      $('[data-toggle="counter-up"]').counterUp({ delay: 10, time: 1000 });
    }

    if ($.fn.waypoint) {
      $('.skills-content').waypoint(function() {
        $('.progress .progress-bar').each(function() {
          $(this).css('width', $(this).attr('aria-valuenow') + '%');
        });
      }, { offset: '80%' });
    }

    if ($.fn.owlCarousel && $('.testimonials-carousel').length) {
      $('.testimonials-carousel').owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: { 0: { items: 1 }, 768: { items: 2 }, 900: { items: 3 } }
      });
    }

    if ($.fn.venobox && $('.venobox').length) {
      $('.venobox').venobox();
    }
  }

  $(function() {
    setupNavigation();
    setupPublicationFilters();
    setupOptionalPlugins();
  });

  $(window).on('load', setupPortfolio);
})(jQuery);
