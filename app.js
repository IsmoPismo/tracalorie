// -- Storage Constroller --
const StorageCtrl = (function(){

  // PUBLIC METHODS
  return {
    storeItem: function(item){

    let items;

    if(localStorage.getItem('items') === null){
      items = [];
      items.push(item)
      localStorage.setItem('items', JSON.stringify(items))
      console.log(items);
    } else {
      items = JSON.parse(localStorage.getItem('items'))
      items.push(item);
      localStorage.setItem('items', JSON.stringify(items))
    }
  },
  getItemsFromStorage: function(){
    let items;
    if(localStorage.getItem('items') === null){
      items = [];
    } else {
      items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
  },
  updateItemStorage: function(updatedItem){
    let items = JSON.parse(localStorage.getItem('items'))

    items.forEach(function(item, index){
      if(updatedItem.id === item.id){
        items.splice(index, 1, updatedItem)
      }
    })
    localStorage.setItem('items', JSON.stringify(items));
  },
  deleteItemFromStorage: function(id){
    let items = JSON.parse(localStorage.getItem('items'))

    items.forEach(function(item, index){
      if(id === item.id){
        items.splice(index, 1)
      }
    })
    localStorage.setItem('items', JSON.stringify(items));
  },
  clearItemsFromStorage: function(){
    localStorage.removeItem('items')
  }
}
})();


// -- Item Conroller --
const ItemCtrl = (function(){
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories= calories;
  }

  //Initializing
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // PUBLIC METHODS
  return {
    getItems: function(){
      return data.items
    },
    addItem: function(name, cal){
      let ID;
      if(data.items.length <= 0){
        ID = 0;
      } else {
        ID = data.items[data.items.length - 1].id + 1
      }
      cal = parseInt(cal);
      let newItem = new Item(ID, name, cal);
      data.items.push(newItem);
      return newItem
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(item => {
        total += item.calories
      })
      data.totalCalories = total;
      return total
    },
    getItemById: function(id){
      return data.items.find(item => item.id === id)
    },
    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item){
      data.currentItem = item
    },
    getCurrentItem: function(){
      return data.currentItem
    },
    deleteItem: function(id){
      const ids = data.items.map(item => item.id)
      const index = ids.indexOf(id);
      if(index !== -1){
        data.items.splice(index, 1);
      }
      UICtrl.clearEditState();
    },
    clearAllItems: function(){
      data.items = [];
    },
    logData: function(){
      return data
    }
  }
})()


// -- UI Conroller --
const UICtrl = (function(){
  const UISelector = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    listItems: '#item-list li',
    clearBtn: '.clear-btn'
  }
  // PUBLIC METHODS
  return {
    populateItemList: function(items){
      let html = ``;

      items.forEach((item) => {
        html += `<li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong>
          <em>${item.calories} kCal</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>
        </li>`
      })
      document.querySelector(UISelector.itemList).innerHTML = html;
    },
    hideList: function(){
      document.querySelector(UISelector.itemList).style.display = 'none';
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelector.itemNameInput).value,
        calories: document.querySelector(UISelector.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Go from hidden to shown list
      document.querySelector(UISelector.itemList).style.display = 'block'

      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`
      li.innerHTML = `<strong>${item.name}: </strong>
      <em>${item.calories} kCal</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend', li)
    },
    showTotalCalories: function(){
      document.querySelector(UISelector.totalCalories).innerText = ItemCtrl.getTotalCalories()
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong>
           <em> ${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(id){
      const itemID = `#item-${id}`
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function(){
      document.querySelector(UISelector.itemNameInput).value = '';
      document.querySelector(UISelector.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelector.addBtn).style.display = 'inline'
      document.querySelector(UISelector.updateBtn).style.display = 'none'
      document.querySelector(UISelector.deleteBtn).style.display = 'none'
      document.querySelector(UISelector.backBtn).style.display = 'inline'
    },
    showEditState: function(){
      document.querySelector(UISelector.addBtn).style.display = 'none'
      document.querySelector(UISelector.updateBtn).style.display = 'inline'
      document.querySelector(UISelector.deleteBtn).style.display = 'inline'
      document.querySelector(UISelector.backBtn).style.display = 'inline'
      document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
    },
    getUISelector: function(){
      return UISelector
    },
    clearAllItems: function(){
      document.querySelectorAll(UISelector.listItems).forEach(item => {
        item.remove();
      })
    }
  }
})()


// -- App Conroller --
const App = (function(ItemCtrl, UICtrl){
  // Gets the selectors and adds 2 click-events
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getUISelector();
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAll);
    document.querySelector(UISelectors.backBtn).addEventListener('click', (e) => {
      e.preventDefault();
      UICtrl.clearEditState();
    });

    //disable 'enter' on Input
    document.addEventListener('keypress', e => {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false
      }
    })
  }

  // Three Functions waiting for a click
  const itemAddSubmit = function(e){
    // Get Form input from UICtrl
    const input = UICtrl.getItemInput();

    if(input.name !== '' && input.calories !== ''){
      // Adds item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Adding a new Item to the UI
      UICtrl.addListItem(newItem);
      // Calculate and Display Total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      // Store in Local Storage
      StorageCtrl.storeItem(newItem);

      UICtrl.clearInput();
    }
    e.preventDefault()
  }

  const itemEditClick = function(e){
      if(e.target.classList.contains('edit-item')){
        // Turn id into number
        const itemId = e.target.parentNode.parentNode.id;
        const id = parseInt((itemId.split('-')[1]));
        const itemToEdit = ItemCtrl.getItemById(id)

        //Sets the Item and adds it to the Edit Form
        ItemCtrl.setCurrentItem(itemToEdit);
        UICtrl.addItemToForm();

        // Shows the edit and delete button
        UICtrl.showEditState();
      }
      e.preventDefault()
  }

  const itemUpdateSubmit = function(e){
    // Gets the input and updates the item and ui controlers
    const input = UICtrl.getItemInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    StorageCtrl.updateItemStorage(updatedItem);

    // UICtrl.updateListItem(updatedItem); didn't work so I used theese two
    const items = ItemCtrl.getItems()
    UICtrl.populateItemList(items);

    //Updates the total
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.clearEditState();
    e.preventDefault();
  }

  const itemDeleteSubmit = function(e){
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id)
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    //Updates the total
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    e.preventDefault()
  }

  const clearAll = function(e){
    ItemCtrl.clearAllItems();
    UICtrl.clearAllItems();
    UICtrl.hideList();
    StorageCtrl.clearItemsFromStorage();

    //Updates the total
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    e.preventDefault()
  }

  // PUBLIC METHODS
  return {
    init: function(){
      //Sets initial state and fetches the items
      UICtrl.clearEditState();
      const items = ItemCtrl.getItems();

      //ITEMS ? 0
      if(items.length === 0){
        UICtrl.hideList()
      } else {
        UICtrl.populateItemList(items);
      }

      // Calculate and Display Total calories than it loads Event Listeners
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl)

App.init()
