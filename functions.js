// Create new elements

function createElement(tag, props, ...children) {
  const element = document.createElement(tag);
  Object.keys(props).forEach(key => (element[key] = props[key]));
  if (children.length > 0) {
    children.forEach(child => {
      if (typeof child === "string") {
        child = document.createTextNode(child);
      }
      element.appendChild(child);
    });
  }
  return element;
}

// Create new list item

function createTodoItem(title, key) {
  const checkbox = createElement(
    "i",
    { className: "material-icons" },
    "check_box_outline_blank"
  );
  const checkboxDiv = createElement("div", { className: "checkbox" }, checkbox);
  checkboxDiv.dataset.key = key;
  const label = createElement("label", {}, title);
  const editInput = createElement("input", {
    type: "text",
    className: "textfield"
  });
  const editIcon = createElement(
    "i",
    { className: "material-icons material-edit" },
    "edit"
  );
  const deleteIcon = createElement(
    "i",
    { className: "material-icons material-delete" },
    "delete"
  );
  const editBtn = createElement(
    "button",
    { className: "editBtn button" },
    editIcon
  );
  editBtn.dataset.key = key;

  const deleteBtn = createElement(
    "button",
    { className: "deleteBtn button" },
    deleteIcon
  );
  deleteBtn.dataset.key = key;
  const buttonsDiv = createElement(
    "div",
    { className: "buttons" },
    editBtn,
    deleteBtn
  );

  const listItem = createElement(
    "li",
    {
      className:
        "list-group-item justify-content-between align-items-center my-1"
    },
    checkboxDiv,
    label,
    editInput,
    buttonsDiv
  );
  //   bindEvents(listItem);
  return listItem;
}

// Bind events to buttons and checkbox

function bindEvents(todo) {
  const checkboxDiv = todo.querySelector("div.checkbox");
  const deleteBtn = todo.querySelector(".deleteBtn");
  const editBtn = todo.querySelector(".editBtn");

  checkboxDiv.addEventListener("click", toggleTodoItem);
  deleteBtn.addEventListener("click", deleteTodoItem);
  editBtn.addEventListener("click", editTodoItem);
}

function toggleTodoItem() {
  const listItem = this.parentNode;

  const completedList = document.querySelector("#completed");
  listItem.classList.toggle("completed")
    ? completedList.insertAdjacentElement("afterBegin", listItem)
    : todoList.insertAdjacentElement("beforeEnd", listItem);
  listItem.classList.contains("completed")
    ? (listItem.querySelector("i.material-icons").innerText = "check_box")
    : (listItem.querySelector("i.material-icons").innerText =
        "check_box_outline_blank");
}
function deleteTodoItem() {
  const listItem = this.parentNode.parentNode;
  listItem.parentNode.removeChild(listItem);
}
function editTodoItem(el) {
  const listItem = el.parentNode.parentNode;
  const label = listItem.querySelector("label");
  const icon = listItem.querySelector("i.material-edit");
  const editInput = listItem.querySelector(".textfield");
  const editMode = listItem.classList.contains("editMode");

  if (editMode) {
    label.innerText = editInput.value;
    icon.innerHTML = '<i class="material-icons material-edit">edit</i>';
  } else {
    editInput.value = label.innerText;
    icon.innerHTML = '<i class="material-icons material-save">save</i>';
  }
  listItem.classList.toggle("editMode");
}

function searchList() {
  const allListItems = todoList.children;

  Array.from(allListItems).forEach(el => {
    const labels = el.querySelector("label").innerText.toLowerCase();
    const inputValue = this.value.toLowerCase();
    if (labels.indexOf(inputValue) !== -1) {
      //   el.style.display = "";
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });
}

function toggleTodoFirebase(el) {
  const completedList = document.querySelector("#completed");
  el.classList.toggle("completed")
    ? completedList.insertAdjacentElement("afterBegin", el)
    : todoList.insertAdjacentElement("beforeEnd", el);
  el.classList.contains("completed")
    ? (el.querySelector("i.material-icons").innerText = "check_box")
    : (el.querySelector("i.material-icons").innerText =
        "check_box_outline_blank");
}
