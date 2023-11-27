

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
const buttonList = getElement('[data-list-button]');
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

let page = 1
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
  
  /**
 * Renders a list of books based on the current page.
 * @param {number} page - The current page number.
 * @param {number} booksPerPage - The number of books to display per page.
 */
const renderBooks = (page, booksPerPage) => {
    const start = (page - 1) * booksPerPage;
    const end = start + booksPerPage;
    const booksToRender = books.slice(start, end);
  
    const fragmentPage = document.createDocumentFragment();
  
    booksToRender.forEach((book) => {
      const previewElement = createPreviewElement(book);
      fragmentPage.appendChild(previewElement);
    });
  
    dataList.innerHTML = ''; // Clear existing content
    dataList.appendChild(fragmentPage);
  };
  
  /**
 * Appends a list of books to the dataList element.
 * @param {Array} booksToAppend - Array of books to append.
 */
const appendBooks = (booksToAppend) => {
    const fragmentPage = document.createDocumentFragment();
  
    booksToAppend.forEach((book) => {
      const previewElement = createPreviewElement(book);
      fragmentPage.appendChild(previewElement);
    });
  
    dataList.appendChild(fragmentPage);
  };
  
  /**
   * Updates the "Show more" button based on the remaining books.
   * @param {number} remainingBooks - The number of remaining books.
   */
  const updateShowMoreButton = (remainingBooks) => {
    if (remainingBooks <= 0) {
      buttonList.disabled = true;
      buttonList.textContent = `Show more (0)`;
    } else {
      buttonList.textContent = `Show more (${remainingBooks})`;
      buttonList.disabled = false;
    }
  };
  
  /**
   * Handles the "Show more" button click.
   */
  const handleShowMoreClick = () => {
    const start = page * BOOKS_PER_PAGE;
    const end = start + BOOKS_PER_PAGE;
    const booksToAppend = books.slice(start, end);
  
    appendBooks(booksToAppend);
  
    // Update remaining books and button state
    const remainingBooks = books.length - end;
    updateShowMoreButton(remainingBooks);
  
    // Increment page
    page++;
  };
  
  // Initial rendering of books and "Show more" button
  const initialBooks = books.slice(0, BOOKS_PER_PAGE);
  appendBooks(initialBooks);
  updateShowMoreButton(books.length - BOOKS_PER_PAGE);
  
  // Event listener for "Show more" button click
  buttonList.addEventListener('click', handleShowMoreClick);
  