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
function showAddProductForm() {
    document.getElementById('add-product-btn').addEventListener('click', () => {
        document.getElementById('add-product-form').style.display = 'flex';
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
    // Display the product in a modal or popup (you can implement this)
    alert(JSON.stringify(product)); // Just for testing, replace with actual UI code
}
async function showEditForm(productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const product = await response.json();

    // Dynamically create and display an edit form pre-filled with product data
    const editFormHtml = `
        <form id="edit-form" >Edit Product 
            <label>Name</label><input type="text" id="name" value="${product.name}" />
            <label>Description</label><input type="text" id="description" value="${product.description}" />
            <label>Price</label><input type="number" id="price" value="${product.price}" />
            <label>Category</label><input type="text" id="category" value="${product.category}" />
            <label>Stock</label><input type="number" id="stock" value="${product.stock}" />
            <button type="submit">Save Changes</button>
        </form>
    `;

    document.getElementById('product-list').innerHTML = editFormHtml;

    document.getElementById('edit-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const updatedProduct = {
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            price: parseFloat(document.getElementById('price').value),   
            category: document.getElementById('category').value,
            stock: parseInt(document.getElementById('stock').value, 10)        };

        await editProduct(productId, updatedProduct);
        fetchProducts(); // Refresh the product list after editing

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
