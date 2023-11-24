import { BOOKS_PER_PAGE, authors, genres, books } from './data.js';
//import from data.js
const getElement = (selector) => document.querySelector(selector);

const settingsButton = getElement('[data-header-settings]');
const settingsOverlay = getElement('[data-settings-overlay]');
const settingsForm = getElement('[data-settings-form]');
const settingsTheme = getElement('[data-settings-theme]');
const settingsCancel = getElement('[data-settings-cancel]');
const searchForm = getElement('[data-search-form]');
const search_Overlay = getElement('[data-search-overlay]');
const book_List_1 = getElement('[data-list-items]');
const message_List = getElement('[data-list-message]');
const data_List_Button = getElement('[data-list-button]');

settingsButton.addEventListener('click', () => {
    settingsOverlay.showModal();
});

settingsCancel.addEventListener('click', () => { 
    settingsOverlay.close();
});


const css = {
    day : ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255']
}



//adding a feature that allows you to save your theme selection.
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

let page = 1;

if (!books && !Array.isArray(books)) {throw new Error('Source required')} 
if (!page && page.length < 2) {throw new Error('Page must be an array with two numbers')}

const fragment = document.createDocumentFragment()
let start_Index = 0;                                  
let end_Index = 36;                                
const extracted = books.slice(start_Index, end_Index)

for (let i = 0; i < extracted.length; i++) {          
    const preview = document.createElement('dl')      
    preview.className = 'preview'                     
    preview.dataset.id = books[i].id
    preview.dataset.title = books[i].title
    preview.dataset.image = books[i].image
    preview.dataset.subtitle = `${authors[books[i].author]} (${(new Date(books[i].published)).getFullYear()})`
    preview.dataset.description = books[i].description
    preview.dataset.genre = books[i].genres

    preview.innerHTML= 
    `<div>
     <image class='preview__image' src="${books[i].image}" alt="book pic"}/>
     </div>
     <div class='preview__info'>
     <dt class='preview__title'>${books[i].title}<dt>
     <dt class='preview__author'> By ${authors[books[i].author]}</dt>
     </div>`

    fragment.appendChild(preview)
}

const book_list_1 = document.querySelector('[data-list-items]') 
book_list_1.appendChild(fragment)

const setting_button = document.querySelector("[data-header-settings]")
setting_button.addEventListener('click', () => {
    document.querySelector("[data-settings-overlay]").style.display = "block";
})

const setting_cancel = document.querySelector('[data-settings-cancel]')
setting_cancel.addEventListener('click', () => {
    document.querySelector("[data-settings-overlay]").style.display = "none";
})

const author_Select = document.querySelector("[data-search-authors]");
const genre_Select = document.querySelector("[data-search-genres]");

Object.entries(authors).forEach(([author_Id, author_Name]) => {
    const option_Element = createOptionElement(author_Id, author_Name);
    author_Select.appendChild(option_Element);
});

Object.entries(genres).forEach(([genreId, genreName]) => {
    const option_Element = createOptionElement(genreId, genreName);
    genre_Select.appendChild(option_Element);
});

function createOptionElement(value, text) {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.textContent = text;
    return optionElement;
}

const detailsToggle = (event) => {  
    const overlay_1 = document.querySelector('[data-list-active]');
    const title = document.querySelector('[data-list-title]')
    const subtitle = document.querySelector('[data-list-subtitle]')
    const description = document.querySelector('[data-list-description]')
    const image_Src = document.querySelector('[data-list-image]')
    const blur_List = document.querySelector('[data-list-blur]')

    event.target.dataset.id ? overlay_1.style.display = "block" : undefined;
    event.target.dataset.description ? description.innerHTML = event.target.dataset.description : undefined;
    event.target.dataset.subtitle ? subtitle.innerHTML = event.target.dataset.subtitle : undefined;
    event.target.dataset.title ? title.innerHTML = event.target.dataset.title : undefined;
    event.target.dataset.image ? image_Src.setAttribute ('src', event.target.dataset.image) : undefined;
    event.target.dataset.image ? blur_List.setAttribute ('src', event.target.dataset.image) : undefined;
};

const details_Close = document.querySelector('[data-list-close]')    
details_Close.addEventListener('click', () => {
    document.querySelector("[data-list-active]").style.display = "none";
});

const book_click = document.querySelector('[data-list-items]')
book_click.addEventListener('click', detailsToggle)

const show_More_Button = document.querySelector('[data-list-button]')

const num_Items_To_Show = Math.min(books.length - end_Index,)

const show_More_Button_Text = `Show More (${num_Items_To_Show})`

show_More_Button.textContent = show_More_Button_Text

show_More_Button.addEventListener('click', () => {         
    const fragment = document.createDocumentFragment()
    start_Index += 36;
    end_Index += 36;
    const start_Index_1 = start_Index
    const end_Index_1 = end_Index
    console.log(start_Index_1)
    console.log(end_Index_1)
    const extracted = books.slice(start_Index_1, end_Index_1)

    for (const {author ,image, title, id , description, published} of extracted) {
        const preview = document.createElement('dl')
        preview.className = 'preview'
        preview.dataset.id = id
        preview.dataset.title = title
        preview.dataset.image = image
        preview.dataset.subtitle = `${authors[author]} (${(new Date(published)).getFullYear()})`
        preview.dataset.description = description
        
        preview.innerHTML= 
        `<div>
         <image class='preview__image' src="${image}" alt="book pic"}/>
         </div>
         <div class='preview__info'>
         <dt class='preview__title'>${title}<dt>
         <dt class='preview__author'> By ${authors[author]}</dt>
         </div>`
        fragment.appendChild(preview)
    }
    
    const book_list_1 = document.querySelector('[data-list-items]') 
    book_list_1.appendChild(fragment)
});

const searchbutton = document.querySelector("[data-header-search]");
searchbutton.addEventListener('click', () => {
    document.querySelector("[data-search-overlay]").style.display = "block";
})

const searchcancel = document.querySelector("[data-search-cancel]");
searchcancel.addEventListener('click', () => {
    document.querySelector("[data-search-overlay]").style.display = "none";
})


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    book_List_1.style.display = 'none';
    message_List.innerHTML = '';
  
    const data_Form = new FormData(event.target);
    const searchQuery = data_Form.get('title').toLowerCase(); // Get the search query
  
    const filtered_Books = books.filter((book) => {
      // Filter books based on the search query
      return (
        book.title.toLowerCase().includes(searchQuery) ||
        authors[book.author].toLowerCase().includes(searchQuery) || // Search by author
        book.description.toLowerCase().includes(searchQuery) ||
        book.genres.some((genre) => genre.toLowerCase().includes(searchQuery))
      );
    });
  
    if (filtered_Books.length > 0) {
      message_List.textContent = '';
      data_List_Button.disabled = true;
    } else {
      message_List.textContent =
        'No results found. Your search criteria may be too narrow.';
      data_List_Button.disabled = true;
    }
  
    message_List.style.display = 'block';
  
    const fragment2 = document.createDocumentFragment();
    for (const { author, image, title, id, description, published } of filtered_Books) {
      const preview = document.createElement('button');
  
      preview.className = 'preview';
      preview.dataset.id = id;
      preview.dataset.title = title;
      preview.dataset.image = image;
      preview.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
      preview.dataset.description = description;
      preview.dataset.genre = genres;
  
      preview.innerHTML = `
        <div>
          <img class='preview__image' src="${image}" />
        </div>
        <div class="preview__info">
          <dt class="preview__title">${title}</dt>
          <div class="preview__author">By ${authors[author]}</div>
        </div> `;
  
      fragment2.appendChild(preview);
    }
  
    const book_List_2 = message_List;
    book_List_2.appendChild(fragment2);
    search_Form.reset();
    search_Overlay.close();
  });
  