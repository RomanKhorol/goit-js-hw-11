import './css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),

  //   btnLoadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
// refs.btnLoadMore.addEventListener('click', onBtnKoadMoreClick);
refs.input.addEventListener('input', onInputChange);

let numberPage = 1;

function onFormSubmit(evt) {
  evt.preventDefault();
  refs.gallery.innerHTML = '';

  const pictureName = refs.input.value.trim();
  if (pictureName === '') {
    return;
  }
  getPictureArray(pictureName).then(imageProcessing);
}

async function getPictureArray(name) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=32890609-fac98cfe2238792085833a9d0&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${numberPage}`
    );

    return response;
  } catch (error) {
    Notiflix.Notify.warning(
      'Were sorry, but youve reached the end of search results.'
    );
  }
}

function imageProcessing(response) {
  if (response.data.hits.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  let numberOfHits = response.data.totalHits;
  if (numberPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${numberOfHits} images.`);
  }
  const pictures = response.data.hits;
  const renPict = renderPictures(pictures);
  refs.gallery.insertAdjacentHTML('beforeend', renPict);

  var lightbox = new SimpleLightbox('div.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();

  numberPage += 1;
  let target = document.querySelector('.gallery >a:last-child');
  infScroll(target);
}

function renderPictures(pictures) {
  return pictures
    .map(picture => {
      return `
      <a class="galleryLink" href=${picture.largeImageURL}><div class="photo-card">
  <img src=${picture.webformatURL} alt='${picture.tags}' loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: 
      ${picture.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: 
      ${picture.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: 
      ${picture.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: 
      ${picture.downloads}</b>
    </p>
  </div>
</div></a>`;
    })
    .join('');
}

function onInputChange(e) {
  numberPage = 1;
}
function infScroll(target) {
  let observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && numberPage > 1) {
          console.log(entry);
          const pictureName = refs.input.value.trim();
          getPictureArray(pictureName).then(imageProcessing);
        }
      });
    },
    { threshold: 0.5 }
  );
  observer.observe(target);
  console.log(target);
}
