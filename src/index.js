import './css/style.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;
const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.search-form input'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();
  const pictureName = refs.input.value;
  if (pictureName === '') {
    return;
  }
  getPictureArray(pictureName);
}
async function getPictureArray(name) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=32890609-fac98cfe2238792085833a9d0&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`
    );

    if (response.data.hits.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.error(error);
  }
}
