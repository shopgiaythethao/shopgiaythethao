// JavaScript Document
<script>
function subscribe() {
 let email = document.getElementById("emailInput ").value;

    if (email === "") {
        alert("Vui lòng nhập email!");
    } else if (!email.includes("@")) {
        alert("Email không hợp lệ!");
    } else {
        alert("Đăng ký thành công 🎉");
    }
}

</script>// 