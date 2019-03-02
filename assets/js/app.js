'use strict';

// document.addEventListener('DOMContentLoaded', function () {
//   var elems = document.querySelectorAll('.sidenav');
//   var instances = M.Sidenav.init(elems, options);
// });

const StorageCtrl = (() => {
  // Public methods
  return {
    storeItem: (item) => {
      let items;
      // Check if any items in ls
      if(localStorage.getItem('items') === null){
        items = [];
        // Push new item
        items.push(item);
        // Set ls
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Re set ls
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: () => {
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: (updatedItem) => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: (id) => {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach((item, index) => {
        if(id === item.id){
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: () => {
      localStorage.removeItem('items');
    }
  }
})();


const CalorieItemsController = (() => {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  const itemData = {
    // items : [
    //   { id: 0, name: 'Amala', calories: 300},
    //   { id: 1, name: 'Eba', calories: 300},
    //   { id: 2, name: 'Iyan', calories: 300},

    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    getItems: () => {
      return itemData.items;
    },

    addItem: (name, calories) => {
      let ID;

      if (itemData.items.length > 0) {
        ID = itemData.items[itemData.items.length - 1].id + 1;
      } else {
        ID = 0;

      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      const newItem = new Item(ID, name, calories);

      // Add to items array
      itemData.items.push(newItem);

      return newItem;
    },

    getItemById: (id) => {

      let foundItem = null;

      itemData.items.forEach((item) => {
        if (item.id === id) {
          foundItem = item;
        }
      });
      return foundItem;
    },

    updateItem: (name, calories) => {

      let foundItem = null;

      itemData.items.forEach((item) => {
        if (item.id === items.currentItem.id) {
          item.name = name;
          item.calories = calories;
          foundItem = item;
        };

        return foundItem;
      });
    },

    deleteItem: (id) => {
      const itemsId = itemData.items.map((item) => {
        return item.id;
      })

      const idIndex = itemsId.indexOf(id);

      itemData.items.splice(idIndex, 1);
    },

    clearAllItems: () => {
      itemData.items = [];
    },

    setCurrentItem: (item) => {
      itemData.currentItem = item;

    },

    getCurrentItem: () => {
      return itemData.currentItem;
    },

    getTotalCalories: () => {
      let total = 0;

      itemData.items.forEach((item) => {
        total += item.calories;
      });

      itemData.totalCalories = total;

      return itemData.totalCalories;
    },

    returnItemData: () => {
      return itemData
    },

    returnItems: () => {
      return itemData.items;
    }
  }
})();


const UIController = (() => {

  const UISelectors = {
    itemList: '#collections',
    listedItems: '#collections li',
    addBtn: '.btn-add',
    deleteBtn: '.btn-delete',
    updateBtn: '.btn-update',
    backBtn: '.btn-back',
    clearBtn: '.btn-clear',
    itemNameInput: '#meal',
    itemCaloriesInput: '#calories',
    totalCalories: '.calories-no'
  }

  return {
    createItemList: (items) => {
      let content = '';

      items.forEach((item) => {
        content += ` <li class="calorie-item z-depth-2" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="">
            <i class="calorie-edit material-icons right icon-color">edit</i>
        </a>
    </li>`;
      });

      document.querySelector(UISelectors.itemList).innerHTML = content;

    },

    getItemInput: () => {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function (item) {

      document.querySelector(UISelectors.itemList).style.display = 'block';

      const li = document.createElement('li');

      li.className = 'calorie-item z-depth-2';

      li.id = `item-${item.id}`;

      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="">
        <i class="calorie-edit material-icons right icon-color">edit</i>
      </a>`;
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },

    updateListItem: (item) => {
      let listItems = document.querySelectorAll(UISelectors.listedItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = 
          `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="">
            <i class="calorie-edit material-icons right icon-color">edit</i>
          </a>`;
        }
      });
    },

    deleteListItem: (id) => {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: () => {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    addItemToForm: () => {
      document.querySelector(UISelectors.itemNameInput).value = CalorieItemsController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = CalorieItemsController.getCurrentItem().calories;
      UIController.showEditState();
    },

    removeItems: () => {
      let listItems = document.querySelectorAll(UISelectors.listedItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach((item) => {
        item.remove();
      });
    },

    hideList: () => {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: (totalCalories) => {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: () => {
      UIController.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: () => {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: () => {
      return UISelectors;
    }
  }

})();



// App Controller
const App = ((CalorieItemsController, StorageCtrl, UIController) => {
  // Load event listeners
  const loadEventListeners = () => {
    // Get UI selectors
    const UISelectors = UIController.getSelectors();

    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', (e) => {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

     // Back button event
     document.querySelector(UISelectors.backBtn).addEventListener('click', UIController.clearEditState);

     // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  }

  // Add item submit
  const itemAddSubmit = (e) => {
    // Get form input from UI Controller
    const input = UIController.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== ''){
      // Add item
      const newItem = CalorieItemsController.addItem(input.name, input.calories);

      // Add item to UI list
      UIController.addListItem(newItem);

      // Get total calories
      const totalCalories = CalorieItemsController.getTotalCalories();
      // Add total calories to UI
      UIController.showTotalCalories(totalCalories);

      //Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UIController.clearInput();
    }

    e.preventDefault();
  }

  // Click edit item
  const itemEditClick = (e) => {
    if(e.target.classList.contains('calorie-edit')){
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArr = listId.split('-');

      // Get the actual id
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = CalorieItemsController.getItemById(id);

      // Set current item
      CalorieItemsController.setCurrentItem(itemToEdit);

      // Add item to form
      UIController.addItemToForm();
    }

    e.preventDefault();
  }

  // Update item submit
  const itemUpdateSubmit = (e) => {
    // Get item input
    const input = UIController.getItemInput();

    // Update item
    const updatedItem = CalorieItemsController.updateItem(input.name, input.calories);

    // Update UI
    UIController.updateListItem(updatedItem);

     // Get total calories
     const totalCalories = CalorieItemsController.getTotalCalories();
     // Add total calories to UI
     UIController.showTotalCalories(totalCalories);

     // Update local storage
     StorageCtrl.updateItemStorage(updatedItem);

     UIController.clearEditState();

    e.preventDefault();
  }

  // Delete button event
  const itemDeleteSubmit = (e) => {
    // Get current item
    const currentItem = CalorieItemsController.getCurrentItem();

    // Delete from data structure
    CalorieItemsController.deleteItem(clientInformation);

    // Delete from UI
    UIController.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = CalorieItemsController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UIController.clearEditState();

    e.preventDefault();
  }


  // Clear items event
  const clearAllItemsClick = () => {
    // Delete all items from data structure
    CalorieItemsController.clearAllItems();

    // Get total calories
    const totalCalories = CalorieItemsController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);

    // Remove from UI
    UIController.removeItems();

    // Clear from local storage
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UIController.hideList();

  }

  // Public methods
  return {
    init: () => {
      // Clear edit state / set initial set
      UIController.clearEditState();

      // Fetch items from data structure
      const items = CalorieItemsController.getItems();

      // Check if any items
      if(items.length === 0){
        UIController.hideList();
      } else {
        // Populate list with items
        UIController.createItemList(items);
      }

      // Get total calories
      const totalCalories = CalorieItemsController.getTotalCalories();
      // Add total calories to UI
      UIController.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  }

})(CalorieItemsController, StorageCtrl, UIController);

// Initialize App
App.init();
