import galleryImg from './js/gallery-items.js';

const galleryList = document.querySelector('ul.js-gallery');
const lightBoxDiv = document.querySelector('.js-lightbox');
const lightBoxImg = lightBoxDiv.querySelector('img.lightbox__image');

//объект для хранения данных о картинке в модалке
const modal = {
  ImageUrl: '',
  ImageAlt: '',
};

//создание картинок
const newListImg = galleryImg.map(
  ({ preview, description, original }) =>
    `<li class="gallery__item"><a class="gallery__link" href="${original}"><img class="gallery__image" src="${preview}" data-source="${original}" alt="${description}"/></a></li>`,
);

galleryList.insertAdjacentHTML('afterbegin', newListImg.join('')); ///Добавление картинок

//Функция вызывающаяся если была нажата картинка в галереи
function onClickGalleryList(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  openModal(event.target);
}

// открываю модальное окно
function openModal(target) {
  setAtribute(target.dataset.source, target.getAttribute('alt'));
  lightBoxDiv.classList.add('is-open');
  window.addEventListener('keydown', pressKeyInModal);
}

//Сортировщик событий в модальном окне.
function pressKeyInModal(event) {
  if (event.key === 'Escape' || event.key === 'Esc') closeModal();
  console.log(event.key);
  if (event.key === 'ArrowRight') changePicture('ArrowRight');
  if (event.key === 'ArrowLeft') changePicture('ArrowLeft');
}

//меняю картинку в модалке, в side записываю в какую сторону повернуть.
function changePicture(side) {
  const arrImg = galleryList.querySelectorAll('.gallery__image');

  for (let i = 0; i < arrImg.length; i += 1) {
    if (arrImg[i].dataset.source === modal.ImageUrl) {
      if (side === 'ArrowRight' ? i + 1 < arrImg.length : i - 1 >= 0) {
        setAtribute(
          arrImg[side === 'ArrowRight' ? i + 1 : i - 1].dataset.source,
          arrImg[side === 'ArrowRight' ? i + 1 : i - 1].getAttribute('alt'),
        );
      } else {
        setAtribute(
          arrImg[side === 'ArrowRight' ? 0 : arrImg.length - 1].dataset.source,
          arrImg[side === 'ArrowRight' ? 0 : arrImg.length - 1].getAttribute(
            'alt',
          ),
        );
      }
      break;
    }
  }
}

//вызываю если нужно закрыть модальное окно
function closeModal() {
  lightBoxDiv.classList.remove('is-open');
  setAtribute('', '');
  window.removeEventListener('keydown', pressKeyInModal);
}

//установка атрибутов
function setAtribute(src, alt) {
  lightBoxImg.setAttribute('src', src);
  lightBoxImg.setAttribute('alt', alt);
  modal.ImageUrl = src;
  modal.ImageAlt = alt;
}

// функция которое проверяет, нужно ли закрыть модальное окно.
function disableModal(event) {
  const classClick = event.target.classList.value;

  if (classClick !== 'lightbox__overlay' && classClick !== 'lightbox__button')
    return;
  closeModal();
}

galleryList.addEventListener('click', onClickGalleryList);
lightBoxDiv.addEventListener('click', disableModal);
