

// Import from data.js
import { BOOKS_PER_PAGE, authors, genres, books  } from './data.js';



// data types from html
const getElement = (selector) => document.querySelector(selector);

const activeList = document.querySelector("[data-list-active]");
const dataList = document.querySelector("[data-list-items]");
const settingsButton = getElement('[data-header-settings]');
const settingsOverlay = getElement('[data-settings-overlay]');
const settingsForm = getElement('[data-settings-form]');
const settingsTheme = getElement('[data-settings-theme]');
const settingsCancel = getElement('[data-settings-cancel]');
const searchForm = getElement('[data-search-form]');
const searchOverlay = getElement('[data-search-overlay]');
const bookList1 = getElement('[data-list-items]');
const messageList = getElement('[data-list-message]');
const dataListButton = getElement('[data-list-button]');
const bookPicture = getElement("[data-list-image]");
const bookTitle = getElement("[data-list-title]");
const bookSubtitle =  getElement("[data-list-subtitle]");
const blurryBookPic = getElement("[data-list-blur]");
const closeButton = getElement("[data-list-close]")
const bookDescription = getElement("[data-list-description]")

settingsButton.addEventListener('click', () => {
    settingsOverlay.showModal();
});

settingsCancel.addEventListener('click', () => {
    settingsOverlay.close();
});



const css = {
    day: ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255'],
};

// Adding a feature that allows you to save your theme selection.
const savedTheme = localStorage.getItem('theme') || 'day';
settingsTheme.value = savedTheme;

// Set the initial theme based on the saved value
document.documentElement.style.setProperty('--color-light', css[savedTheme][0]);
document.documentElement.style.setProperty('--color-dark', css[savedTheme][1]);

settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formSubmit = new FormData(event.target);
    const selected = Object.fromEntries(formSubmit);

    // Updated the theme based on user selection
    document.documentElement.style.setProperty('--color-light', css[selected.theme][0]);
    document.documentElement.style.setProperty('--color-dark', css[selected.theme][1]);

    // Saved the selected theme to localStorage
    localStorage.setItem('theme', selected.theme);

    settingsOverlay.close();
});

const range = [0, BOOKS_PER_PAGE]

if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

   /**
 * Creates a preview element for a single book.
 * @param {Object} book - The book object.
 * @returns {HTMLButtonElement} - The created preview button.
 */
const createPreviewElement = (book) => {
    const previewButton = document.createElement("button");
    previewButton.className = "preview";
    previewButton.setAttribute("id", book.id);
  
    previewButton.innerHTML = `
      <img class="preview__image" src="${book.image}" />
      <div class="preview__info">
        <h3 class="preview__title">${book.title}</h3>
        <div class="preview__author">${authors[book.author]}</div>
      </div>
    `;
  
    return previewButton;
  };
  
  /**
   * Creates a preview fragment for an array of books and appends it to the dataList element.
   * @param {Array} bookExtract - Array of books to create previews for.
   */
  const createPreviewFragment = (bookExtract) => {
    const fragmentPage = document.createDocumentFragment();
  
    bookExtract.forEach((book) => {
      const previewElement = createPreviewElement(book);
      fragmentPage.appendChild(previewElement);
    });
  
    dataList.appendChild(fragmentPage);
  };
  
  // Initial rendering of previews
  createPreviewFragment(books.slice(0, BOOKS_PER_PAGE));
  
  // Event listener for dataList clicks
  dataList.addEventListener("click", function (event) {
    activeList.show();
  
    const previewElement = event.target.closest(".preview");
  
    if (previewElement) {
      const bookView = books.find((book) => book.id === previewElement.id);
  
      if (bookView) {
        // Update details based on the selected book
        bookPicture.src = bookView.image;
        blurryBookPic.src = bookView.image;
        bookTitle.innerHTML = bookView.title;
        bookSubtitle.innerHTML = `${authors[bookView.author]} (${bookView.published.slice(0, 4)})`;
        bookDescription.innerHTML = bookView.description;
  
        // Event listener for close button
        closeButton.addEventListener("click", function (event) {
          activeList.close();
        });
      }
    }
  });
  