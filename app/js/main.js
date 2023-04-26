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

if (getTop() > 0) {
  headerBlock.classList.add('header--scroll');
}



/* Анимация изображения макета на странице Проект */
const projectDesigns = document.querySelectorAll('.project__design');

if (projectDesigns.length > 0) {

  window.onload = function(){

    projectDesigns.forEach(item => {
      const itemWrapHeight = item.querySelector('.project__image').clientHeight;
      
      const itemBtnUp = item.querySelector('.project__btn--up');
      const itemBtnDown = item.querySelector('.project__btn--down');

      const itemImage = item.querySelector('img');
      const itemImageClient = itemImage.getBoundingClientRect();
      const itemImageHeight = itemImageClient.height;


      let startPos = 0;
      let motion = null;
      let motionOver = null;

      function motionUp() {
        if(startPos <= 0) {
          startPos = startPos + 1;
          itemImage.style.transform = `translateY(${startPos}px)`;
        }
      }

      function motionDown() {
        if(Math.abs(startPos) <= (itemImageHeight - itemWrapHeight)) {
          startPos = startPos - 1;
          itemImage.style.transform = `translateY(${startPos}px)`;
        }
      }

      itemBtnUp.addEventListener('mousedown', (event) => {
        event.preventDefault();
        motion = setInterval(motionUp, 5);
      });
      itemBtnUp.addEventListener('mouseup', () => {
        clearInterval(motion);
      });

      itemBtnDown.addEventListener('mousedown', (event) => {
        event.preventDefault();
        motion = setInterval(motionDown, 5);
      });
      itemBtnDown.addEventListener('mouseup', () => {
        clearInterval(motion);
      });

      itemBtnUp.addEventListener('mouseover', (event) => {
        event.preventDefault();
        motionOver = setInterval(motionUp, 5);
      });
      itemBtnUp.addEventListener('mouseout', () => {
        clearInterval(motionOver);
      });

      itemBtnDown.addEventListener('mouseover', (event) => {
        event.preventDefault();
        motionOver = setInterval(motionDown, 5);
      });
      itemBtnDown.addEventListener('mouseout', () => {
        clearInterval(motionOver);
      });
    });
  
  };
}



/* GSAP animation */
if (body.classList.contains('home')) {

  let tl = gsap.timeline();
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



/* Swiper related project */
let swiper_works = new Swiper('.swiper-works', {
  spaceBetween: 10,
  touchRatio: 1,
  observer: true,
  observeParents: true,
  loop: true,
  speed: 1000,

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


/* Маска для поля телефон (защита от "дурака") подмена +7 - 8 */
const inputPhones = document.querySelectorAll('input[type=tel]');

if(inputPhones.length > 0) {

  inputPhones.forEach(input => {

    input.addEventListener('input', ()=> {
      let phoneMaskOutput = phoneMask(input.value);
      input.value = phoneMaskOutput.str;
    });

  });

  function phoneMask(str) { //Функция для автозаполнения поля 
    let outputStr = '';
    let strNum = str.replace(/[^0-9]/gim, '');

    let literalPattern = /[0\*]/;
    let numberPattern = /[0-9]/;

    let mask = ['+7 (000) 000 - 0000', '8 (000) 000 - 0000'];
    let maskType = 0;
    let maxLength = 19;

    if (strNum.length >= 1 && strNum[0] == 8) {
      str = str.replace(/^8/, '7');
    }

    for (var strIndex = 0, maskIndex = 0; maskIndex < mask[maskType].length; ) {
      if (maskIndex >= str.length) break;

      if (
        mask[maskType][maskIndex] == '0' &&
        str[strIndex].match(numberPattern) == null
      )
        break;

      while (mask[maskType][maskIndex].match(literalPattern) == null) {
        if (str[strIndex] == mask[maskType][maskIndex]) break;

        outputStr += mask[maskType][maskIndex++];
      }

      outputStr += str[strIndex++];
      maskIndex++;
    }

    return {
      str: outputStr,
      maxLength: maxLength,
      curLength: str.replace(/[^0-9]/gim, '').length,
    };
  }
}