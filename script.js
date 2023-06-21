// Shopping List Project
// - 0 Add items to list via form || Done
// - 1 Remove items form list by clicking the "X" button || Done
// - 2 Clear All items with "clear" button || Done
// - 3 Filter the items by typing in the field || Done
// - 4 add localStorage to persists items || Done
// - 5 click on an item to put into "edit-mode" and add to form update item

// Storing Variables
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => addItemToDOM(item));
	checkUI();
}

function onAddItemSubmit(e) {
	e.preventDefault();
	const newItem = itemInput.value;

	// Validate Input
	if (newItem === '') {
		alert('Please add an item');
		return;
	}

	// Check For Edit Mode
	if(isEditMode){
		const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromStorage(itemToEdit.textContent);

		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove()
		isEditMode = false;
	}else{
		if(checkIfItemExists(newItem)){
			alert('The item is already exists!')
			itemInput.value = '';
			return;
		}
	}



	// create item DOM Element
	addItemToDOM(newItem);

	//add item to local storage
	addItemToStorage(newItem);

	checkUI();

	itemInput.value = '';
}

// Adding Item to the DOM
function addItemToDOM(item) {
	// Create List Item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	// Add li to the DOM
	itemList.appendChild(li);
}

function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	// add new item to array
	itemsFromStorage.push(item);

	//  convert to JSON string and set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

function checkIfItemExists(item){
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}


function setItemToEdit(item) {
	isEditMode = true;

	itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'))

	item.classList.add('edit-mode');
	formBtn.innerHTML = ' <i class="fa-solid fa-pen"></i>  Update Item';
	formBtn.style.backgroundColor = '#228b22';
	itemInput.value = item.textContent;
}

function removeItem(item) {
	if (confirm('Are you sure?')) {
		// remove item from DOM
		item.remove();

		// remove item from storage
		removeItemFromStorage(item.textContent);

		checkUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	// filter out items to be removed

	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	// Reset to localStorage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e) {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	// clear from localStorage
	localStorage.removeItem('items');
	checkUI();
}

function filterItems(e) {
	const items = itemList.querySelectorAll('li');
	const text = e.target.value.toLowerCase();

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();
		// console.log(itemName);

		if (itemName.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

function checkUI() {
	itemInput.value = '';
	const items = itemList.querySelectorAll('li');
	if (items.length === 0) {
		clearBtn.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearBtn.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	formBtn.innerHTML = '  <i class="fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = '#333';

	isEditMode = false
}

// initialize app
function init() {
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onClickItem);
	clearBtn.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);
}

// Event Listeners

checkUI();

init();
