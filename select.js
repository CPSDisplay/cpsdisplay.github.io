// function hideOnClickOutside(element) {
//     const outsideClickListener = (event) => {
//         if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
//             element.style.display = "none";
//             removeClickListener();
//         }
//     }

//     const removeClickListener = () => {
//         document.removeEventListener('click', outsideClickListener);
//     }

//     document.addEventListener('click', outsideClickListener);
// }
// const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length ); // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js

class SelectMenu {
    constructor(select_menu) {
        this.e_menu = select_menu;
        this.e_button = select_menu.querySelector(".select-button");
        
        this.e_list = select_menu.querySelector(".select-list");
        this.list = new SelectList(this.e_list);

        this.setup();
    }

    setup() {
        this.e_button.addEventListener("click", this.onSelectButtonPressed);
        this.e_list.addEventListener("selected", this.onSelected);
    }

    onSelectButtonPressed = (e) => {
        if (this.list.visible) {
            this.list.hide();
        } else {
            e.stopPropagation();
            this.list.show();
        }
    }

    onSelected = (e) => {
        this.e_button.innerHTML = e.detail.item.innerHTML;
    }

    addItem(name, id) {
        this.list.addItem(name, id);
    }
    
    getSelected() {
        return this.list.selected;
    }
}

class SelectList {
    outsideClickListener = (e) => {
        if (!this.e_list.contains(e.target) && this.visible) {
            this.hide();
            this.removeOutsideClickListener();
        }
    }

    removeOutsideClickListener = () => {
        document.removeEventListener("click", this.removeOutsideClickListener);
    }

    constructor(select_list) {
        this.selected = null;

        this.e_list = select_list;
        this.e_items = Array.from(select_list.querySelectorAll(".select-item"));
        this.setupItems();

        this.visible_display = "block";
        this.visible = true;
        this.hide();

        this.selectItem(this.e_items[0]);
    }

    setupItem(e_item) {
        e_item.onclick = this.onItemSelected;
    }

    setupItems() {
        for (const e_item of this.e_items) {
            this.setupItem(e_item);
        }
    }

    hide() {
        let current_display = this.e_list.style.display;
        if (current_display != "none") {
            this.visible_display = current_display;
        }
        this.visible = false;
        this.e_list.style.display = "none";
    }
    show() {
        this.visible = true;
        this.e_list.style.display = this.visible_display;
        document.addEventListener("click", this.outsideClickListener);
    }

    onItemSelected = (e) => {
        if (this.selectItem(e.target)) {
            var selectedEvent = new CustomEvent("selected", { detail: {"item": e.target} });
            this.e_list.dispatchEvent(selectedEvent);
        }
    }

    selectItem(e_item_to_select) {
        var succeed = false;
        for (const e_item of this.e_items) {
            if (e_item_to_select == e_item) {
                this.selected = e_item;
                e_item.classList.add("selected");
                succeed = true;
            } else if (e_item.classList.contains("selected")) {
                e_item.classList.remove("selected");
            }
        }

        return succeed;
    }

    callSelectItem(e_item_to_select) {
        let result = this.selectItem(e_item_to_select);
        if (result) {
            var selectedEvent = new CustomEvent("selected", { detail: {"item": e_item_to_select} });
            this.e_list.dispatchEvent(selectedEvent);
        }
        return result;
    }

    addItem(name, id) {
        if (this.e_items.length > 0) {
            let separator = document.createElement("div");
            separator.classList.add("select-separator");
            this.e_list.appendChild(separator);
        }

        let item = document.createElement("div");
        item.id = id;
        item.innerText = name;
        item.classList.add("select-item");

        this.e_items.push(item);
        this.setupItem(item);
        this.e_list.appendChild(item);
    }
}