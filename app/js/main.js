'use strict';

const body = document.body;
const headerBlock = document.querySelector('.header');
const blockMenu = document.querySelector('.header__menu');
const openMenu = document.querySelector('.open-menu');
const closeMenu = document.querySelector('.close-menu');


/* Кнопки Показать/Скрыть меню на мобильных */
openMenu.addEventListener('click', function() {
  blockMenu.classList.add('show');
  headerBlock.setAttribute('aria-expanded', 'true');

  cancelScroll(); // Отключение скролла
});

closeMenu.addEventListener('click', function() {
  blockMenu.classList.remove('show');
  headerBlock.setAttribute('aria-expanded', 'false');

  startScroll(); // Включение скролла
});


/* Нажатие кнопки Esc */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {

    // if(!modalOverlay.classList.contains('hidden')){
    //   modalOverlay.classList.add('hidden');
    //   modalWraps.forEach(function (wrap) {
    //     wrap.classList.add('hidden');
    //   });

    //   startScroll(); // Включение скролла
    // }

    if(blockMenu.classList.contains('show')){
      blockMenu.classList.remove('show');
      headerBlock.setAttribute('aria-expanded', 'false');

      startScroll(); // Включение скролла
    }
  }
});


/* Функции для модальных окон и отмена прокрутки документа */
const cancelScroll = () => {
  let scrollY = document.documentElement.style.getPropertyValue('--scroll-y');

  body.style.position = 'fixed';
  body.style.top = `-${scrollY}`;
  body.style.overflowY = `hidden`;
};

const startScroll = () => {
  let scrollY = body.style.top;

  body.style.position = '';
  body.style.top = '';
  body.style.overflowY = ``;

  window.scrollTo(0, parseInt(scrollY || '0') * -1);
};

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty(
    '--scroll-y',
    `${window.scrollY}px`
  );
});



/* Up button */
const btnUp = document.querySelector('.btn-up');
const offsetBtnUp = 1000;

if (btnUp) {
  btnUp.addEventListener('click', (event) => {
    let target = event.currentTarget;

    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });

    target.classList.add('btn-up--top');
  });
}


/* Функция для высоты прокрутки */
let getTop = function getTop() {
  return window.pageYOffset || document.documentElement.scrollTop;
};


/* Условие для элементов при прокрутке */
let offset = 0;

window.addEventListener('scroll', function () {
  let scrolled = getTop();
  let scrollUp = scrolled - offset;

  if (scrollUp > 0) {
    if (headerBlock) {
      headerBlock.classList.add('header--hide');
      headerBlock.classList.add('header--scroll');
    }
  } else {
    if (headerBlock) {
      headerBlock.classList.remove('header--hide');
    } 
  }

  if (scrolled > 10) {
    if (headerBlock) {
      headerBlock.classList.add('header--scroll');
    }
  } else {
    if (headerBlock) {
      headerBlock.classList.remove('header--scroll');
    }
  }

  offset = scrolled;


  if (scrolled > offsetBtnUp) {
    if (btnUp) {
      btnUp.classList.add('btn-up--show');
    }
  } else {
    if (btnUp) {
      btnUp.classList.remove('btn-up--show');
      btnUp.classList.remove('btn-up--top');
    }
  }
});


/* GSAP animation */
if (body.classList.contains('home')) {

  var tl = gsap.timeline();
  tl.from(".top__hello", {duration: 0.7, delay: 1, opacity: 0, y: 70, ease: "power1"});
  tl.from(".top__profession", {duration: 0.6, opacity: 0, y: 70, ease: "power1"});
  tl.from(".top__text", {duration: 0.6, opacity: 0, y: 70, ease: "power1"});

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".advantages__item", {
    scrollTrigger: {
      trigger: ".advantages",
      toggleActions: "play none none none",
      start: "top 50%",
    }, 
    duration: 1.2,
    y: 250,
    opacity: 0,
    stagger: 0.3,
    ease: "power1",
  });

  gsap.from(".infographic__item", {
    scrollTrigger: {
      trigger: ".infographic",
      toggleActions: "play none none none",
      start: "top 60%",
    }, 
    duration: 1.2,
    y: 200,
    opacity: 0,
    stagger: 0.4,
    ease: "power1",
  });

  gsap.from(".examples__item", {
    scrollTrigger: {
      trigger: ".examples",
      toggleActions: "play none none none",
      start: "top 50%",
    }, 
    duration: 1,
    y: 250,
    opacity: 0,
    stagger: 0.2,
    ease: "power1",
  });
}

if (body.classList.contains('page-portfolio')) {

  gsap.from(".portfolio__item", {
    scrollTrigger: {
      trigger: ".portfolio",
      toggleActions: "play none none none",
      start: "top 70%",
    }, 
    duration: 1.5,
    y: 250,
    opacity: 0,
    stagger: 0.4,
    ease: "power1",
  });
  
}

// Swiper Works
var swiper_works = new Swiper('.swiper-works', {
  speed: 1000,
  spaceBetween: 0,
  loop: true,

  autoplay: {
    delay: 5000,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

  breakpoints: {
    320: { 
      slidesPerView: 1,
      centeredSlides: true,
    }, 
    576: { 
      slidesPerView: 2,
      centeredSlides: false,
    },
    992: { 
      slidesPerView: 3,
      centeredSlides: true,
    }, 
  },
});