let selectedClasses = new Set();

          function searchClasses() {
            var input, filter, ul, li, a, i, txtValue;
            input = document.getElementById('search-class-input');
            filter = input.value.toUpperCase();
            ul = document.getElementById('all-class-list');
            li = ul.getElementsByTagName('li');

            // Hide the list by default
            if (input.value.length < 2) {
              ul.style.display = 'none';
              return;
            } else {
              ul.style.display = '';
            }

            for (i = 0; i < li.length; i++) {
              a = li[i].getElementsByTagName('a')[0];
              txtValue = a.textContent || a.innerText;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
              } else {
                li[i].style.display = "none";
              }
            }
          }

          function selectClass(button) {
            const listItem = button.parentElement;
            const className = listItem.querySelector('a').textContent;
            if (!selectedClasses.has(className)) {
                selectedClasses.add(className);
                button.textContent = 'Added';
                button.classList.add('selected');
                button.style.backgroundColor = '#7192d4';
                button.disabled = true;
            }
            updateSelectedClassesList();
          }

          function updateSelectedClassesList() {
            const selectedList = document.getElementById('selected-class-list');
            selectedList.innerHTML = ''; // Clear current list
            
            const hiddenDiv = document.getElementById('selected-classes-hidden');
            hiddenDiv.innerHTML = '';

            if (selectedClasses.size === 0) {
              const li = document.createElement('li');
              li.style.cssText = "padding: 2px;";
              li.innerHTML = '<a>N/A</a>';
              selectedList.appendChild(li);
            }

            selectedClasses.forEach(className => {
              const li = document.createElement('li');
              li.className = 'selected-class-item';
              li.innerHTML = `
                <input type="number" name="priority_rank" step="1" min="1" max="${selectedClasses.size}">
                ${className}
                <button type="button" class="add-class-btn selected" onclick="removeSelectedClass('${className}')">Remove</button>
              `;
              selectedList.appendChild(li);

              // Add hidden input for form submission
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = 'subjects';
              input.value = className;
              hiddenDiv.appendChild(input);
            });
          }

          function removeSelectedClass(className) {
            selectedClasses.delete(className);
            updateSelectedClassesList();
            // Reset the button in the main list
            const allListItems = document.querySelectorAll('#all-class-list li');
            allListItems.forEach(item => {
                if (item.querySelector('a').textContent === className) {
                    const button = item.querySelector('.add-class-btn');
                    button.textContent = 'Add Class';
                    button.classList.remove('selected');
                    button.style.backgroundColor = '#11264f';
                    button.disabled = false;
                }
            });
          }

