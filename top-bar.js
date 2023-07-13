let switch_buttons = document.getElementsByClassName("switch-button");
for (const switch_button of switch_buttons) {
    switch_button.addEventListener("click", (e) => { window.location.replace(switch_button.dataset.path) });
}