const products = [
    { id: "Product_A", price: 20, count: 0 },
    { id: "Product_B", price: 40, count: 0 },
    { id: "Product_C", price: 50, count: 0 }
];

cartCount = {
    Product_A: 0,
    Product_B: 0,
    Product_C: 0
};

const tableBody = document.querySelector("#productTable tbody");
const totalPrice = document.querySelector("#totalPrice");
const totalQuantity = document.querySelector("#totalQuantity");
const totalPriceWithGiftWrap = document.querySelector("#totalPriceWithGiftWrap");
const totalPriceWithShipping = document.querySelector("#totalPriceWithShipping");
const totalPriceWithDiscount = document.querySelector("#totalPriceWithDiscount");
const cartSummary = document.querySelector("#cartSummary");

// Function to create a table row for a product
function createTableRow(product) {
    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = product.id;

    const priceCell = document.createElement('td');
    priceCell.textContent = product.price;

    const actionCell = document.createElement('td');
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => addToCart(product));

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeFromCart(product));

    const countCell = document.createElement('td');

    actionCell.appendChild(addButton);
    actionCell.appendChild(removeButton);

    row.appendChild(idCell);
    row.appendChild(priceCell);
    row.appendChild(actionCell);

    return row;
}

products.forEach((product) => {
    const row = createTableRow(product);
    tableBody.appendChild(row);
});

totalCost = 0;
totalCount = 0;
giftWrap = false;


function addToCart(product) {
    console.log(`Added product ${product.id} with price ${product.price} to cart.`);
    cartCount[product.id] += 1;
    totalCost += product.price;
    totalPrice.textContent = totalCost;
    totalCount += 1;
    totalQuantity.textContent = totalCount;
    calculateEveryCost();
}



function removeFromCart(product) {


    if (cartCount[product.id] > 0) {
        cartCount[product.id] -= 1;
        totalCost -= product.price;
        totalPrice.textContent = totalCost;
        console.log(`Total Cost: ${totalCost}`);
        totalCount -= 1;
        totalQuantity.textContent = totalCount;
        calculateEveryCost();
    }
    else {
        console.log(`No product ${product.id} in cart.`);
    }

}

function calculateEveryCost() {
    totalCost = Number(totalPrice.textContent);
    totalPriceWithGiftWrap.textContent = checkGiftWrapAndCalculateCost();
    totalPriceWithShipping.textContent = calculateShippingPrice();
    totalCost = calculateShippingPrice();
    totalPriceWithDiscount.textContent = totalCost - CalculateDiscount();
    if(totalCount==0){
        totalPriceWithDiscount.textContent = 0;
        totalPriceWithShipping.textContent = 0;
        totalPriceWithGiftWrap.textContent = 0;
        totalPrice.textContent = 0;
        totalCost = 0;
    }

    cartSummary.textContent = `You have ${totalCount} items in your cart. With ${giftWrap ? 'gift wrap' : 'no gift wrap'}, your total cost is $${totalCost}. With discount, your total cost is $${totalCost - CalculateDiscount()}.
    Your total savings is $${CalculateDiscount()}.
    You have Product_A: ${cartCount.Product_A}, Product_B: ${cartCount.Product_B}, Product_C: ${cartCount.Product_C}.`
    // totalCost = totalCost - CalculateDiscount();

}

function giftWrapYes() {
    console.log(`Gift Wrap: Yes`);
    giftWrap = true;
    calculateEveryCost();

}

function giftWrapNo() {
    console.log(`Gift Wrap: No`);
    giftWrap = false;
    calculateEveryCost();
}

checkGiftWrapAndCalculateCost = () => {
    if (giftWrap) {
        cost = totalCost + totalCount * 1;
    }
    else {
        cost = totalCost;
    }
    return cost;
}

calculateShippingPrice = () => {
    numberOfPackages = Math.ceil(totalCount / 10);
    cost = Number(totalPriceWithGiftWrap.textContent) + numberOfPackages * 5;
    return cost;

}

flat10PercentDiscount = () => {
    if (totalCost > 200) {
        discount = 10;
    }
    else {
        discount = 0;
    }
    return discount;
}

bulk5Discount = () => {
    discountA = 0;
    discountB = 0;
    discountC = 0;
    if (cartCount.Product_A > 10) {
        discountA = cartCount.Product_A * 20 * 0.05;
    }
    else if (cartCount.Product_B > 10) {
        discountB = cartCount.Product_B * 40 * 0.05;
    }
    else if (cartCount.Product_C > 10) {
        discountC = cartCount.Product_C * 50 * 0.05;
    }
    else {
        discount = 0;
    }
    discount = Math.max(discountA, discountB, discountC);
    return discount;
}

bulk10Discount = () => {
    if (totalCount > 20) {
        discount = calculateShippingPrice() * 0.1;
    }
    else {
        discount = 0;
    }
    return discount;
}

tieredDiscount = () => {
    costA = Number.MAX_SAFE_INTEGER;
    costB = Number.MAX_SAFE_INTEGER;
    costC = Number.MAX_SAFE_INTEGER;
    costD = Number.MAX_SAFE_INTEGER;
    if (totalQuantity > 30) {
        if (cartCount.Product_A > 15) {
            costA = (totalCost - cartCount.Product_A * 20) + 15 * 20 + (cartCount.Product_A - 15) * 10;
        }
        else if (cartCount.Product_B > 15) {
            costB = (totalCost - cartCount.Product_B * 40) + 15 * 40 + (cartCount.Product_B - 15) * 20;
        }
        else if (cartCount.Product_C > 15) {
            costC = (totalCost - cartCount.Product_C * 50) + 15 * 50 + (cartCount.Product_C - 15) * 25;
        }
    } else {
        costD = totalCost;
    }
    cost = Math.min(costA, costB, costC, costD);
    discount = totalCost - cost;
    return discount;
}

function CalculateDiscount() {
    discount = Math.max(flat10PercentDiscount(), bulk5Discount(), bulk10Discount(), tieredDiscount());
    return discount;
}