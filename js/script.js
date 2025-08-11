document.addEventListener('DOMContentLoaded', function() {
    const portfolioImages = [
        { src: 'img/татупервое.jpg', caption: 'Суворот' },
        { src: 'img/тату2.jpg', caption: 'Тестовое' },
        { src: 'img/тату3.jpg', caption: 'FromBoxer' },
        { src: 'img/тату4.jpg', caption: 'Лягуна I' },
        { src: 'img/тату5.jpg', caption: 'SPECEX' },
        { src: 'img/тату6.jpg', caption: 'Design_C' },
        { src: 'img/тату7.jpg', caption: 'Суворот' },
        { src: 'img/тату8.jpg', caption: 'Тестовое' },
        { src: 'img/тату9.jpg', caption: 'FromBoxer' },
        { src: 'img/тату10.jpg', caption: 'Лягуна I' },
        { src: 'img/тату11.jpg', caption: 'SPECEX' },
        { src: 'img/тату12.jpg', caption: 'Суворот' },
        { src: 'img/тату13.jpg', caption: 'Тестовое' },
        { src: 'img/тату14.jpg', caption: 'FromBoxer' },
        { src: 'img/тату15.jpg', caption: 'Лягуна I' },
        { src: 'img/тату16.jpg', caption: 'SPECEX' },
        { src: 'img/тату17.jpg', caption: 'Суворот' },
        { src: 'img/тату18.jpg', caption: 'Тестовое' },
        { src: 'img/тату1.jpg', caption: 'FromBoxer' },
        { src: 'img/тату20.jpg', caption: 'Лягуна I' },
        
    ];

    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-image');
    const modalCaption = document.querySelector('.modal-caption');
    const closeModal = document.querySelector('.close-modal');

    let currentIndex = 0;
    const slideWidth = 315; // 300px ширина + 15px отступ

    // Создаем слайды
    portfolioImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.dataset.index = index;

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.caption;

        slide.appendChild(img);
        carouselTrack.appendChild(slide);
    });

    function updateCarousel() {
        carouselTrack.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < portfolioImages.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    carouselTrack.addEventListener('click', function(e) {
        const slide = e.target.closest('.carousel-slide');
        if (!slide) return;
        const index = parseInt(slide.dataset.index);
        modalImg.src = portfolioImages[index].src;
        modalCaption.textContent = portfolioImages[index].caption;
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    updateCarousel();
});


window.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.nav-menu'),
    menuItem = document.querySelectorAll('.nav-menu__list-item'),
    hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('hamburger_active');
        menu.classList.toggle('nav-menu_active');
    });

    menuItem.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.toggle('hamburger_active');
            menu.classList.toggle('nav-menu_active');
        })
    })
})



document.addEventListener('DOMContentLoaded', function() {
    const questionImages = [
        { src: 'img/ques1.JPG', caption: 'Суворот' },
        { src: 'img/ques2.JPG', caption: 'Тестовое' },
        { src: 'img/ques3.JPG', caption: 'FromBoxer' },
        { src: 'img/ques4.JPG', caption: 'Лягуна I' },
        { src: 'img/ques5.JPG', caption: 'SPECEX' },
        { src: 'img/ques6.JPG', caption: 'Design_C' },
        { src: 'img/ques7.JPG', caption: 'Design_C' },
    ];

    const carouselTrack = document.querySelector('.carousel-tracks');
    const prevButton = document.querySelector('.carousel-buttons.prev');
    const nextButton = document.querySelector('.carousel-buttons.next');
    

    let currentIndex = 0;
    const slideWidth = 315; // 300px ширина + 15px отступ

    // Создаем слайды
    questionImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slides';
        slide.dataset.index = index;

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.caption;

        slide.appendChild(img);
        carouselTrack.appendChild(slide);
    });

    function updateCarousel() {
        carouselTrack.style.transform = "translateX(" + (-currentIndex * slideWidth) + "px)";
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < questionImages.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    carouselTrack.addEventListener('click', function(e) {
        const slide = e.target.closest('.carousel-slides');
        if (!slide) return;
        const index = parseInt(slide.dataset.index);
        modalImg.src = questionImages[index].src;
        modalCaption.textContent = questionImages[index].caption;
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    updateCarousel();
});

