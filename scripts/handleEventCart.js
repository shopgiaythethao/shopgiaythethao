const suggestions = [
    { keyword:"nam", text:"Giày Nam", link:"trangchugiaynam.html" },
    { keyword:"nam", text:"Vớ Nam", link:"trangchuvonguoilon.html" },
    { keyword:"nữ", text:"Giày Nữ", link:"trangchugiaynu.html" },
    { keyword:"trẻ em", text:"Giày Bé Trai", link:"trangchugiaytreemnam.html" },
    { keyword:"trẻ em", text:"Giày Bé Gái", link:"trangchugiaytreemnu.html" }
];

function showSuggestions(){
    let input = document.getElementById("search-input").value.toLowerCase();
    let box = document.getElementById("suggestionsBox");
    box.innerHTML = "";

    if(input.trim() === ""){
        box.style.display = "none";
        return;
    }

    let found = false;
    suggestions.forEach(item => {
        if(item.keyword.includes(input)){
            found = true;
            box.innerHTML += `
                <div class="suggestion-item" onclick="goToPage('${item.link}')">
                    ${item.text}
                </div>
            `;
        }
    });

    if(found){
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

function goToPage(link){
    window.location.href = link;
}

function executeSearch(){
    let input = document.getElementById("search-input").value.toLowerCase();
    suggestions.forEach(item => {
        if(item.keyword.includes(input)){
            window.location.href = item.link;
        }
    });
}

window.onclick = function(event){
    if(!event.target.matches("#search-input")){
        let box = document.getElementById("suggestionsBox");
        if(box) box.style.display = "none";
    }
}

// ==========================================
// TỰ ĐỘNG PHÂN TÁCH GIỎ HÀNG THEO TÀI KHOẢN MỚI
// ==========================================
function getCartKey() {
    let user = localStorage.getItem("currentUser");
    if (user && user.trim() !== "") {
        return "cart_" + user.trim().toLowerCase();
    } else {
        return "cart_guest";
    }
}

// KHỞI TẠO BIẾN SẢN PHẨM HIỆN TẠI
let currentProduct = null;

function openPopup(name, price, img){
    currentProduct = { name, price, img };
    document.getElementById("productSize").value = "";
    document.getElementById("productQuantity").value = "1";
    document.getElementById("popupCart").style.display = "block";
}

function closePopup(){
    currentProduct = null;
    document.getElementById("popupCart").style.display = "none";
}

function confirmAddCart(){
    let size = document.getElementById("productSize").value;
    let quantity = parseInt(document.getElementById("productQuantity").value);

    if(size == ""){
        alert("Vui lòng chọn size!");
        return;
    }

    if(isNaN(quantity) || quantity <= 0){
        alert("Vui lòng chọn số lượng!");
        return;
    }

    // ĐỒNG BỘ: Ghép size trực tiếp vào chuỗi tên và đẩy thẳng số lượng sang hàm xử lý dữ liệu
    if(currentProduct){
        addToCart(`${currentProduct.name} (Size ${size})`, currentProduct.price, currentProduct.img, quantity);
    }

    alert("Thêm vào giỏ hàng thành công!");
    closePopup();
}

// ĐỒNG BỘ: Nhận tham số số lượng mới (qtyToAdd) và lưu vào LocalStorage theo key động phân tách tài khoản
function addToCart(name, price, img, qtyToAdd){
    // let cartKey = getCartKey();
    // let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    // let index = cart.findIndex(item => item.name === name);

    // if(index !== -1){
    //     cart[index].qty += qtyToAdd;
    // } else {
    //     cart.push({
    //         name: name,
    //         price: Number(price),
    //         img: img,
    //         qty: qtyToAdd
    //     });
    // }

    // localStorage.setItem(cartKey, JSON.stringify(cart));
    var allOrders = getOrderLists(getCurrentUser());
    var existingOrder = allOrders.find(order => order.name === name);
    if (existingOrder) {
        existingOrder.qty += qtyToAdd;
    } else {
        allOrders.push({
            name: name,
            price: Number(price),
            img: img,
            qty: qtyToAdd
        });

        
    }

    saveOrderLists(getCurrentUser(), allOrders);
    renderCart();
}

// ĐỒNG BỘ: Đọc dữ liệu từ key động của tài khoản hiện hành
function renderCart(){

    let cart = getOrderLists(getCurrentUser());
    let html = "";
    let total = 0;

    if(cart.length === 0){
        html = "Chưa có sản phẩm";
    } else {
        cart.forEach(function(item, index){
            let itemTotal = item.price * item.qty;
            total += itemTotal;

            html += `
            <div style="display:flex; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px; color:#000;">
                <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:5px; margin-right:10px;">
                <div style="flex:1; text-align: left;">
                    <b>${item.name}</b><br>
                    ${item.price.toLocaleString()}đ x ${item.qty}
                    <br><b>${itemTotal.toLocaleString()}đ</b>
                    <br>
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button onclick="removeItem(${index})">X</button>
                </div>
            </div>
            `;
        });

        html += `<hr><b style="color:#000;">Tổng cộng: ${total.toLocaleString()}đ</b>`;
    }

    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("cart-count").innerText = cart.length;
}

// ĐỒNG BỘ: Sử dụng khóa động getCartKey()
function changeQty(index, change){
    
    let cart = getOrderLists(getCurrentUser());
    cart[index].qty += change;

    if(cart[index].qty <= 0){
        cart.splice(index, 1);
    }

    saveOrderLists(getCurrentUser(), cart);
    renderCart();
}

// ĐỒNG BỘ: Sử dụng khóa động getCartKey()
function removeItem(index){

    let cart = getOrderLists(getCurrentUser());
    cart.splice(index, 1);

    saveOrderLists(getCurrentUser(), cart);
    renderCart();
}

// Chạy hàm render khi tải xong trang
renderCart();