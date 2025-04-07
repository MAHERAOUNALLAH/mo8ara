// ===== MO8ARA - Gaming Marketplace Scripts =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM Elements =====
    const filterGame = document.querySelector('.filter-select:nth-of-type(1)');
    const filterPlatform = document.querySelector('.filter-select:nth-of-type(2)');
    const filterSort = document.querySelector('.filter-select:nth-of-type(3)');
    const listingsContainer = document.querySelector('.listings');
    const listings = Array.from(document.querySelectorAll('.listing-card'));
    const sellNowBtn = document.querySelector('.cta-button.primary');
    
    // ===== Filter & Sort Functionality =====
    function filterAndSortListings() {
        const gameValue = filterGame.value;
        const platformValue = filterPlatform.value;
        const sortValue = filterSort.value;
        
        // Filter listings
        let filtered = listings.filter(listing => {
            const gameMatch = gameValue === 'all' || 
                listing.querySelector('.game-title').textContent.toLowerCase().includes(gameValue);
            
            const platformMatch = platformValue === 'all' || 
                listing.querySelector('.platform').textContent.toLowerCase() === platformValue;
            
            return gameMatch && platformMatch;
        });
        
        // Sort listings
        filtered.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price').textContent);
            const priceB = parseFloat(b.querySelector('.price').textContent);
            
            switch(sortValue) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'newest': return 0; // Add timestamp data for proper sorting
                default: return 0;
            }
        });
        
        // Clear and re-render
        listingsContainer.innerHTML = '';
        filtered.forEach(listing => listingsContainer.appendChild(listing));
    }
    
    // ===== Event Listeners =====
    filterGame.addEventListener('change', filterAndSortListings);
    filterPlatform.addEventListener('change', filterAndSortListings);
    filterSort.addEventListener('change', filterAndSortListings);
    
    // ===== Sell Now Modal =====
    sellNowBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showSellModal();
    });
    
    function showSellModal() {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Sell Your Gaming Account</h2>
                    <form id="sell-form">
                        <div class="form-group">
                            <label for="game-title">Game Title</label>
                            <select id="game-title" required>
                                <option value="">Select Game</option>
                                <option value="Free Fire">Free Fire</option>
                                <option value="Fortnite">Fortnite</option>
                                <option value="FIFA">FIFA</option>
                                <option value="Valorant">Valorant</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="platform">Platform</label>
                            <select id="platform" required>
                                <option value="">Select Platform</option>
                                <option value="Mobile">Mobile</option>
                                <option value="PC">PC</option>
                                <option value="PS5">PlayStation 5</option>
                                <option value="Xbox">Xbox</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="price">Price (TND)</label>
                            <input type="number" id="price" min="1" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Account Details</label>
                            <textarea id="description" rows="4" required placeholder="Level, skins, rank, special items, etc."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact">Contact Info (WhatsApp Number)</label>
                            <input type="tel" id="contact" placeholder="21612345678" required>
                        </div>
                        
                        <button type="submit" class="submit-btn">List My Account</button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Modal close functionality
        const modalOverlay = document.querySelector('.modal-overlay');
        const closeModal = document.querySelector('.close-modal');
        
        closeModal.addEventListener('click', function() {
            modalOverlay.remove();
        });
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
        
        // Form submission
        const sellForm = document.getElementById('sell-form');
        sellForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }
    
    function handleFormSubmission() {
        const gameTitle = document.getElementById('game-title').value;
        const platform = document.getElementById('platform').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const contact = document.getElementById('contact').value;
        
        // Create new listing
        const newListing = document.createElement('div');
        newListing.className = 'listing-card';
        newListing.innerHTML = `
            <div class="listing-image" style="background-image: url('https://i.ibb.co/0jq6R0B/freefire.jpg');"></div>
            <div class="listing-details">
                <h3 class="game-title">${gameTitle.toUpperCase()}</h3>
                <span class="platform">${platform.toUpperCase()}</span>
                <p>${description}</p>
                <div class="price">${price} TND</div>
                <div class="contact-buttons">
                    <a href="https://wa.me/${contact}" class="whatsapp-btn">
                        <i class="fab fa-whatsapp"></i> WHATSAPP
                    </a>
                    <a href="mailto:seller@example.com" class="email-btn">
                        <i class="fas fa-envelope"></i> EMAIL
                    </a>
                </div>
            </div>
        `;
        
        // Add to DOM
        listingsContainer.prepend(newListing);
        listings.unshift(newListing); // Add to our listings array
        
        // Close modal and show success message
        document.querySelector('.modal-overlay').remove();
        showToast('Your account has been listed successfully!');
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // ===== Add some sample animations =====
    function initAnimations() {
        // Animate listings on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.listing-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease-out';
            observer.observe(card);
        });
    }
    
    initAnimations();
});

// ===== Add some CSS for the modal and toast =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 34, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: linear-gradient(145deg, #0a0a1a, #000022);
        padding: 2rem;
        border-radius: 0;
        width: 90%;
        max-width: 600px;
        border: 1px solid var(--cyber-blue);
        box-shadow: 0 0 30px rgba(0, 247, 255, 0.2);
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--neon-pink);
        transition: all 0.3s;
    }
    
    .close-modal:hover {
        transform: rotate(90deg);
        color: var(--cyber-blue);
    }
    
    .modal-content h2 {
        margin-bottom: 1.5rem;
        font-family: 'Orbitron', sans-serif;
        background: linear-gradient(45deg, var(--cyber-blue), var(--neon-pink));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
    }
    
    .form-group select, 
    .form-group input, 
    .form-group textarea {
        width: 100%;
        padding: 0.8rem;
        background: rgba(10, 10, 26, 0.7);
        border: 1px solid var(--deep-purple);
        color: white;
        font-family: 'Rajdhani', sans-serif;
    }
    
    .form-group textarea {
        min-height: 100px;
        resize: vertical;
    }
    
    .submit-btn {
        background: var(--deep-purple);
        color: white;
        border: none;
        padding: 1rem 2rem;
        width: 100%;
        font-family: 'Orbitron', sans-serif;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s;
        margin-top: 1rem;
    }
    
    .submit-btn:hover {
        background: var(--neon-pink);
        box-shadow: 0 0 20px rgba(255, 0, 247, 0.3);
    }
    
    /* Toast Message */
    .toast-message {
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: var(--matrix-green);
        color: var(--void-black);
        padding: 1rem 2rem;
        border-radius: 0;
        font-family: 'Orbitron', sans-serif;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1001;
        border-left: 5px solid var(--cyber-blue);
    }
    
    .toast-message.show {
        opacity: 1;
    }
`;
document.head.appendChild(dynamicStyles);
