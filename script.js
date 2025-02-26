document.addEventListener('DOMContentLoaded', function () {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');
    const searchInput = document.getElementById('searchInput');

    // Устанавливаем первую вкладку активной
    if (menuItems.length > 0) {
        document.getElementById(menuItems[0].getAttribute('data-section')).style.display = 'block';
        menuItems[0].classList.add('active');
    }

    // Обработчик кликов по элементам меню
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (!sectionId) return;

            // Сбрасываем поиск и восстанавливаем исходный порядок перед переключением
            searchInput.value = '';
            sections.forEach(section => {
                const container = section.querySelector('.pdf-container');
                if (container) {
                    container.innerHTML = JSON.parse(container.getAttribute('data-original-order')).join('');
                    section.style.display = 'none';
                }
            });

            // Активируем новую вкладку
            document.getElementById(sectionId).style.display = 'block';
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Сохранение исходного порядка
    const pdfContainers = document.querySelectorAll('.pdf-container');
    pdfContainers.forEach(container => {
        const originalOrder = Array.from(container.children);
        container.setAttribute('data-original-order', JSON.stringify(originalOrder.map(el => el.outerHTML)));
    });

    // Поиск с сортировкой найденных элементов только в активной вкладке
    searchInput.addEventListener('input', function () {
        const filter = searchInput.value.toLowerCase().trim();
        let activeSection = null;

        // Находим активную секцию
        sections.forEach(section => {
            if (window.getComputedStyle(section).display !== 'none') {
                activeSection = section;
            }
        });

        if (activeSection) {
            const container = activeSection.querySelector('.pdf-container');
            if (container) {
                let hasVisibleLinks = false;
                const pdfLinks = Array.from(container.querySelectorAll('.pdf-link'));

                pdfLinks.forEach(link => {
                    const spanText = link.querySelector('span').textContent.toLowerCase();
                    const isMatch = spanText.includes(filter);

                    if (isMatch) {
                        link.style.display = 'flex';
                        link.style.visibility = 'visible';
                        hasVisibleLinks = true;
                        container.prepend(link); // Перемещаем найденный элемент вверх
                    } else {
                        link.style.display = 'none';
                        link.style.visibility = 'hidden';
                    }
                });

                // Показываем или скрываем секцию в зависимости от наличия видимых ссылок
                activeSection.style.display = hasVisibleLinks ? 'block' : 'none';

                // Если инпут пустой — восстанавливаем порядок
                if (filter === '') {
                    container.innerHTML = JSON.parse(container.getAttribute('data-original-order')).join('');
                }
            }
        }
    });
});