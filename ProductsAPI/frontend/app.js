// Fetch and display the product list
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to display products on the page
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock}</p>
            <button class="view-btn" data-id="${product.id}">View</button>
            <button class="edit-btn" data-id="${product.id}">Edit</button>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
        `;

        productList.appendChild(productDiv);
    });

    // Attach event listeners after rendering products
    attachButtonListeners();
}

// Attach event listeners to buttons
function attachButtonListeners() {
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            await viewProduct(productId);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            await showEditForm(productId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.getAttribute('data-id');
            await deleteProduct(productId);
            fetchProducts(); // Refresh the product list after deletion
        });
    });
}

// Function to open the modal with dynamic content
function openModal(content) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = content; // Insert the provided content
    modal.style.display = 'block'; // Show the modal
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Hide the modal
}

// Close the modal if the user clicks on the "close" button or outside the modal
document.getElementById('close-modal').addEventListener('click', closeModal);
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
};

// Function to handle "Add Product" form
function showAddProductForm() {
    document.getElementById('add-product-btn').addEventListener('click', () => {
        const addFormHtml = `
            <form id="add-product-form">
                <label>Name:</label>
                <input type="text" id="name" placeholder="Name" required />
                
                <label>Description:</label>
                <input type="text" id="description" placeholder="Description" required />
                
                <label>Price:</label>
                <input type="number" id="price" placeholder="Price" required />
                
                <label>Category:</label>
                <input type="text" id="category" placeholder="Category" required />
                
                <label>Stock:</label>
                <input type="number" id="stock" placeholder="Stock" required />
                
                <button type="submit">Add Product</button>
            </form>
        `;
        openModal(addFormHtml); // Open the modal with the add product form

        document.getElementById('add-product-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const newProduct = {
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                category: document.getElementById('category').value,
                stock: document.getElementById('stock').value
            };

            await addProduct(newProduct); // Send new product data to the server
            closeModal(); // Close the modal after adding the product
            fetchProducts(); // Refresh the product list
        });
    });
}

// Function to display a product's details (View Product)
async function viewProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        const product = await response.json();

        const productDetailsHtml = `
            <h2>${product.name}</h2>
            <p>Description: ${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock}</p>
        `;

        openModal(productDetailsHtml); // Open the modal with product details
    } catch (error) {
        console.error('Error fetching product details:', error);
    }
}

// Function to display the edit form for a product (Edit Product)
async function showEditForm(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        const product = await response.json();

        const editFormHtml = `
            <form id="edit-product-form">
                <label>Name:</label>
                <input type="text" id="edit-name" value="${product.name}" required />
                
                <label>Description:</label>
                <input type="text" id="edit-description" value="${product.description}" required />
                
                <label>Price:</label>
                <input type="number" id="edit-price" value="${product.price}" required />
                
                <label>Category:</label>
                <input type="text" id="edit-category" value="${product.category}" required />
                
                <label>Stock:</label>
                <input type="number" id="edit-stock" value="${product.stock}" required />
                
                <button type="submit">Save Changes</button>
            </form>
        `;
        openModal(editFormHtml); // Open the modal with the edit form

        document.getElementById('edit-product-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedProduct = {
                name: document.getElementById('edit-name').value,
                description: document.getElementById('edit-description').value,
                price: parseFloat(document.getElementById('edit-price').value),
                category: document.getElementById('edit-category').value,
                stock: parseInt(document.getElementById('edit-stock').value, 10)
            };

            await editProduct(productId, updatedProduct); // Send updated product data to the server
            closeModal(); // Close the modal after editing the product
            fetchProducts(); // Refresh the product list after editing
        });
    } catch (error) {
        console.error('Error fetching product for edit:', error);
    }
}

// Adding a new product (POST request)
async function addProduct(newProduct) {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct)
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Editing an existing product (PUT request)
async function editProduct(productId, updatedProduct) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct)
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error editing product:', error);
    }
}

// Deleting a product (DELETE request)
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error deleting product:', error);
    }
}

// Initialize page on load
window.onload = () => {
    fetchProducts(); // Fetch and display products
    showAddProductForm(); // Set up the Add Product form
};
