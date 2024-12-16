// Access the DOM elements

const drawer = document.querySelector(".backdrop");
const cartItemList = document.querySelector("#cart-item-list");
const cartTotalDiv = document.querySelector("#cart-total");
const cartItemCountDiv = document.querySelector("#cart-item-count");
const step2ProgressDiv = document.querySelector("#step-2-progress");
const step3ProgressDiv = document.querySelector("#step-3-progress");
const footerTotal = document.querySelector("#footer-total");

let cart = [];

// Update the Cart list HTML
const setFormatCartData = (cartDataList) => {
  const formatted = cartDataList
    ?.map((cartItem) => {
      return `
      <div class="cart-item-card">
        <!-- Image -->  
        <img
          src="${cartItem?.featured_image}"
          alt=""
        />

        <!-- Details --> 
        <div class="flex-1 flex-col p-lg">
          <div class="flex-1 flex gap-lg text-md">
            <div class="flex-1">${cartItem?.title}</div>

            <div class="font-bold no-wrap">Rs ${cartItem?.price} /-</div>
          </div>

          <div  class="flex justify-between items-end">
            <i onclick="handleRemoveItem(${cartItem?.id})" class="fa-regular fa-trash-can text-lg cursor-pointer"></i>

            <div class="qty-box">
              <div onclick="handleDecrement(${cartItem?.id}, ${cartItem?.quantity})" class="qty-btn cursor-pointer">
                <i class="text-xs fa-solid fa-minus"></i>
              </div>

              <div>${cartItem?.quantity}</div>
              <div onclick="handleIncrement(${cartItem?.id})" class="qty-btn cursor-pointer">
                <i class="text-xs fa-solid fa-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    })
    .join("");

  cartItemList.innerHTML = formatted;
};

// Updates the shipping bar based on the cart total
const updateShippingBar = (cartTotal) => {
  const eligibleDiscountSteps = document.querySelectorAll(".step");
  if (cartTotal > 1000 && cartTotal <= 2000) {
    const width = (100 * cartTotal) / 2000;
    step2ProgressDiv.style.setProperty("width", `${width}%`);
    step3ProgressDiv.style.setProperty("width", `0%`);

    Array.from(eligibleDiscountSteps)?.map((step, index) => {
      if (index === 0) {
        step.innerHTML = `<i class="fa-solid fa-check"></i>`;
        step.style.setProperty("background-color", "black");
        step.style.setProperty("color", "white");
      } else {
        step.innerHTML = `${index + 1}`;
        step.style.setProperty("background-color", "white");
        step.style.setProperty("color", "black");
      }
    });

    eligibleDiscountSteps[0].innerHTML = `<i class="fa-solid fa-check"></i>`;
    eligibleDiscountSteps[0].style.setProperty("background-color", "black");
    eligibleDiscountSteps[0].style.setProperty("color", "white");
  } else if (cartTotal > 2000) {
    const width = Math.min((100 * (cartTotal - 2000)) / 2000, 100);
    step2ProgressDiv.style.setProperty("width", `100%`);
    step3ProgressDiv.style.setProperty("width", `${width}%`);
    Array.from(eligibleDiscountSteps)?.map((step, index) => {
      if (index === 2) {
        step.innerHTML = `3`;
        step.style.setProperty("background-color", "white");
        step.style.setProperty("color", "black");
      } else {
        step.innerHTML = `<i class="fa-solid fa-check"></i>`;
        step.style.setProperty("background-color", "black");
        step.style.setProperty("color", "white");
      }
    });

    if (cartTotal > 4000) {
      eligibleDiscountSteps[2].innerHTML = `<i class="fa-solid fa-check"></i>`;
      eligibleDiscountSteps[2].style.setProperty("background-color", "black");
      eligibleDiscountSteps[2].style.setProperty("color", "white");
    }
  } else {
    step2ProgressDiv.style.setProperty("width", `0%`);
    step3ProgressDiv.style.setProperty("width", `0%`);

    Array.from(eligibleDiscountSteps)?.map((step, index) => {
      step.innerHTML = `${index + 1}`;
      step.style.setProperty("background-color", "white");
      step.style.setProperty("color", "black");
    });
  }
};

// Update the UI based on cart chanages
const renderCartSumAndCount = (cart) => {
  const sum = cart?.reduce((acc, cartItem) => {
    return acc + cartItem?.price * cartItem?.quantity;
  }, 0);

  cartTotalDiv.innerText = `Rs ${sum} /-`;
  cartItemCountDiv.innerText = `${cart?.length}`;
  footerTotal.innerText = `${sum}`;
  updateShippingBar(sum);
};

// Open the drawer
const handleOpenCart = () => {
  drawer.style?.setProperty("display", "flex");
};

// Close the drawer
const handleCloseCart = () => {
  drawer.style?.setProperty("display", "none");
};

// Handle the quantity Increment and update the cart value and UI
const handleIncrement = (productId) => {
  const newCart = cart?.map((cartItem) => {
    if (cartItem?.id === productId) {
      return {
        ...cartItem,
        quantity: cartItem.quantity + 1,
      };
    } else {
      return cartItem;
    }
  });

  cart = newCart;
  setFormatCartData(newCart);
  renderCartSumAndCount(newCart);
};

// Handle the quantity Decrement and update the cart value and UI
const handleDecrement = (productId, currentQty) => {
  if (currentQty > 1) {
    const newCart = cart?.map((cartItem) => {
      if (cartItem?.id === productId) {
        return {
          ...cartItem,
          quantity: cartItem.quantity - 1,
        };
      } else {
        return cartItem;
      }
    });

    cart = newCart;
    setFormatCartData(newCart);
    renderCartSumAndCount(newCart);
  }
};

// Handle the remove cart button click and update the UI
const handleRemoveItem = (productId) => {
  const newCart = cart?.filter((cartItem) => {
    return cartItem?.id !== productId;
  });

  cart = newCart;
  setFormatCartData(newCart);
  renderCartSumAndCount(newCart);
};

// Fetches the cart initial data
const getCartData = async () => {
  try {
    const result = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/productData_a1bbdeec-6a18-4b00-8249-b3b92969e1c1.json?v=1733470145"
    );

    const data = await result?.text();

    const cleanedData = data.replace(/^\/\/.*|\/\*[\s\S]*?\*\//g, "");

    cart = JSON.parse(cleanedData)?.product_list?.map((product) => ({
      ...product,
      quantity: 1,
    }));

    setFormatCartData(cart);
    renderCartSumAndCount(cart);
  } catch (err) {
    console.log(err);
  }
};

getCartData();
