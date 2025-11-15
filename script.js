document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('message-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function showModal(title, message) {
        if (!modal) return;
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }

    function hideModal() {
        if (!modal) return;
        modal.classList.add('hidden');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', hideModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
    }

    let cart = JSON.parse(localStorage.getItem('apparelCart')) || [];

    function saveCart() {
        localStorage.setItem('apparelCart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const cartLink = document.getElementById('cart-link');
        if (cartLink) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartLink.textContent = `Cart (${totalItems})`;
        }
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const nameInput = loginForm.querySelector('input[type="text"]');
            const name = nameInput.value || 'User';
            
            showModal('Welcome!', `You are now logged in, ${name.split(' ')[0]}.`);
            loginForm.reset();
            
            setTimeout(() => {
                hideModal();
                window.location.href = 'index.html'; 
            }, 2000);
        });
    }

    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            showModal('Thank You!', 'Your feedback has been submitted successfully.');
            feedbackForm.reset();
            setTimeout(() => {
                hideModal();
                window.location.href = 'index.html'; 
            }, 2000);
        });
    }

    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const button = e.target;
                const id = button.dataset.id;
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);

                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ id, name, price, quantity: 1 });
                }

                saveCart();
                updateCartCount();
                showModal('Added!', `${name} has been added to your cart.`);
            }
        });
    }

    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        const cartTotalEl = document.getElementById('cart-total');
        const emptyCartMsg = document.getElementById('empty-cart-msg');
        const checkoutBtn = document.getElementById('checkout-btn');

        function renderCart() {
            cartItemsContainer.innerHTML = '';

            if (cart.length === 0) {
                emptyCartMsg.classList.remove('hidden');
                checkoutBtn.classList.add('hidden');
                cartTotalEl.textContent = 'Total: $0.00';
                return;
            }

            emptyCartMsg.classList.add('hidden');
            checkoutBtn.classList.remove('hidden');
            
            let total = 0;

            cart.forEach(item => {
                total += item.price * item.quantity;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <img src="https://placehold.co/100x100/374151/FFFFFF?text=${item.name.replace(' ', '+')}" alt="${item.name}" class="w-16 h-16 md:w-24 md:h-24 rounded-md object-cover">
                    <div class="cart-item-details">
                        <h4 class="text-lg md:text-xl font-bold">${item.name}</h4>
                        <p class="text-md text-gray-300">Quantity: ${item.quantity}</p>
                    </div>
                    <p class="text-lg md:text-xl font-semibold w-24 text-right">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="cart-item-remove-btn ml-4" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(itemEl);
            });

            cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
        }

        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-item-remove-btn')) {
                const id = e.target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                saveCart();
                renderCart();
                updateCartCount();
            }
        });

        checkoutBtn.addEventListener('click', () => {
            showModal('Thank You!', 'Your order has been placed successfully.');
            cart = [];
            saveCart();
            renderCart();
            updateCartCount();
        });

        renderCart();
    }

    updateCartCount();

});