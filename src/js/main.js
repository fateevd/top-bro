import Swiper from 'swiper';
import SwiperCore, {Autoplay, Navigation, Scrollbar} from 'swiper/core';

SwiperCore.use([Autoplay, Scrollbar, Navigation]);
//custom select

let headerSelector = document.querySelectorAll('.select-header');
let selectItem = document.querySelectorAll('.select-body__list');
headerSelector.forEach(item => {
    item.addEventListener('click', function () {
        this.parentElement.classList.toggle('select-active');
    });
});

selectItem.forEach(item => {
    item.addEventListener('click', function () {
        let text = this.innerText,
            select = this.closest('.select'),
            currentText = select.querySelector('.select-header-current');
        currentText.innerText = text;
        select.classList.remove('select-active');
    });
});

//swiper


const swiper = new Swiper('.swiper', {
    slidesPerView: 4,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    scrollbar: {
        el: ".swiper-scrollbar",
    },
    breakpoints: {
        300: {
            slidesPerView: 1,

        },
        500: {
            slidesPerView: 1,

        },
        600: {
            slidesPerView: 2,
        },
        950: {
            slidesPerView: 3,
        },
        1200: {
            slidesPerView: 3,
        },
        1250: {
            slidesPerView: 4,
        },
    }

});


//about blogger
let blogger = document.querySelectorAll('.blogger-item__list');

blogger.forEach(item => {
    item.addEventListener('click', () => {
        location.href = "https://fateevd.github.io/top-bro/current-blogger.html";
    })
})
//burger menu
document.querySelector('.header__burger').onclick = () => {
    document.querySelector('.header__burger').classList.toggle('active');
    document.querySelector('.header__menu').classList.toggle('active');
    document.body.classList.toggle('active');
}