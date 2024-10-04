// Fetch and display the product list
async function fetchProducts() {
    const response = await fetch('http://localhost:3000/api/products');
    const products = await response.json();
    displayProducts(products);
}
// Function to display products on the page
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

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

    // Attach event listeners to the buttons
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

// Function to close the modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Event listener for closing the modal
document.getElementById('close-modal').addEventListener('click', closeModal);

// Close the modal if user clicks outside of the modal content
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
};

function showAddProductForm() {
    document.getElementById('add-product-btn').addEventListener('click', () => {
        const addFormHTML = document.getElementById('add-product-form').style.display = 'flex';
        openModal(addFormHTML)
    });
    document.getElementById('add-product-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const newProduct = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: document.getElementById('price').value,
            category: document.getElementById('category').value,
            stock: document.getElementById('stock').value
        };

        await addProduct(newProduct);
        closeModal
        fetchProducts(); // Refresh the product list after adding
        document.getElementById('add-product-form').reset(); // Clear form
    });

}
// send data from form
async function addProduct(newProduct) {
    const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });
    const result = await response.json();
    console.log(result);
}
// get data after clicking view
async function viewProduct(productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const product = await response.json();

    const productDetails = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <p>Category: ${product.category}</p>
        <p>Stock: ${product.stock}</p>
    `;

    openModal(productDetails);  // Open the modal with product details
}

async function showEditForm(productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const product = await response.json();

    const editFormHtml = `
        <form id="edit-form">Edit Product
            <label>Name</label><input type="text" id="edit-name" value="${product.name}" />
            <label>Description</label><input type="text" id="edit-description" value="${product.description}" />
            <label>Price</label><input type="number" id="edit-price" value="${product.price}" />
            <label>Category</label><input type="text" id="edit-category" value="${product.category}" />
            <label>Stock</label><input type="number" id="edit-stock" value="${product.stock}" />
            <button type="submit">Save Changes</button>
        </form>
    `;

    openModal(editFormHtml);  // Open the modal with the edit form

    document.getElementById('edit-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedProduct = {
            name: document.getElementById('edit-name').value,
            description: document.getElementById('edit-description').value,
            price: parseFloat(document.getElementById('edit-price').value),
            category: document.getElementById('edit-category').value,
            stock: parseInt(document.getElementById('edit-stock').value, 10)
        };

        await editProduct(productId, updatedProduct);
        closeModal();  // Close modal after submitting changes
        fetchProducts();  // Refresh the product list
    });
}

// submitting editted product
async function editProduct(productId, updatedProduct) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
    });
    const result = await response.json();
    console.log(result);
}

// to delete a product
async function deleteProduct(productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    console.log(result);
}

window.onload = () => {
    fetchProducts();
    showAddProductForm();
};
