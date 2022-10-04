enterSearch.onclick = function () {
    if (searchBrand.value == "五月花") {
        document.location.href= "../Product Page/Page search by brand/index.html";
    }  else {
        Swal.fire(`本店鋪還沒有進"${searchBrand.value}"這品牌，<BR>請到<近期消息區><BR>以掌握最新消息，謝謝!`);
    }
}