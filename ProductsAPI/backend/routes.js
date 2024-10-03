import fs from 'fs';
import path from 'path'

const __dirname = path.resolve();
const filePath = path.join(__dirname, 'db.json');

// Function to read data from the JSON file
const readDataFromFile = () => {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData); 
};

// Function to write data to the JSON file
const writeDataToFile = (data) => {
    const jsonData = JSON.stringify(data, null, 2); // Stringify the data
    fs.writeFileSync(filePath, jsonData, 'utf8'); // Synchronously write to the file
};

let productsListData = readDataFromFile(); // Load initial products data

const router = async (req, res) => {
    const { url, method } = req;

    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const sendJSONResponse = (statusCode, data) => {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(statusCode);
        res.end(JSON.stringify(data));
    };

    // GET all products
    if (url === "/api/products" && method === "GET") {
        if (productsListData.length > 0) {
            sendJSONResponse(200, productsListData);
        } else {
            sendJSONResponse(400, { message: "Products store is empty" });
        }
    }

    // GET a single product by ID
    else if (url.match(/\/api\/products\/\d+/) && method === "GET") {
        const id = url.split("/").pop();
        const product = productsListData.find(product => product.id === id);

        if (product) {
            sendJSONResponse(200, product);
        } else {
            sendJSONResponse(404, { message: "Product not found" });
        }
    }

    // POST a new product
    else if (url === '/api/products' && method === "POST") {
        let body = "";
        req.on("data", chunk => { body += chunk.toString(); });
        req.on("end", () => {
            const { name, description, price, category, stock } = JSON.parse(body);


            const newId = (productsListData.length + 1).toString().padStart(3, '0');
            const newProduct = { id: newId, name, description, price, category, stock };

            productsListData.push(newProduct);

            // Write updated data to the file
            writeDataToFile(productsListData);

            sendJSONResponse(201, { message: 'New product added', product: newProduct });
        });
    }

    // PUT (Update) a product
    else if (url.startsWith('/api/products/') && method === "PUT") {
        const productId = url.split('/')[3]; // Get product ID from URL
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const updatedProduct = JSON.parse(body);

            // Read the latest products data from file
            productsListData = readDataFromFile();

            const productIndex = productsListData.findIndex(p => p.id == productId);
            if (productIndex !== -1) {
                productsListData[productIndex] = {
                    ...productsListData[productIndex],  // Keep existing data
                    ...updatedProduct                  // Update only the fields passed in
                };
                // Write updated data to the file
                writeDataToFile(productsListData);

                sendJSONResponse(200, { message: 'Product updated', product: productsListData[productIndex] });
            } else {
                sendJSONResponse(404, { message: 'Product not found' });
            }
        });
    }

    // DELETE a product
    else if (url.match(/\/api\/products\/\w+/) && method === "DELETE") {
        const id = url.split("/").pop();
        const productIndex = productsListData.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            productsListData.splice(productIndex, 1);
            // Write updated data to the file
            writeDataToFile(productsListData);

            sendJSONResponse(200, { message: 'Product deleted' });
        } else {
            sendJSONResponse(404, { message: 'Product not found' });
        }
    }
};

export default router;

