const ce_main_container = document.createElement('DIV');
const ce_name = document.createElement('DIV');
const ce_input = document.createElement('INPUT');
const ce_button = document.createElement('DIV');

ce_main_container.classList.add('ce_main');
ce_name.id = 'ce_name';
ce_input.id = 'ce_input';
ce_button.id = 'ce_button';

ce_name.innerHTML = `Website is Unsecure`;
ce_button.innerHTML = `Select`;

ce_main_container.appendChild(ce_name);
ce_main_container.appendChild(ce_input);
ce_main_container.appendChild(ce_button);


document.querySelector('body').appendChild(ce_main_container);

chrome.runtime.sendMessage({ 
    message: "get_user_status"
}, response => {
    if (response.message === 'success') {
        ce_name.innerHTML = `This website is asking for sensitive information. Do you wish to continue? Type 'yes' to continue`;
    }
});

ce_button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ 
        message: "change_status",
        payload: ce_input.value
    }, response => {
        if (response.message === 'success' && ce_input.value == 'yes') {
            ce_name.innerHTML = `User wants to continue on this webpage`;
            ce_button.remove();
            ce_input.remove();
            ce_name.remove();
            ce_main_container.remove();

            
        }
    });
});
