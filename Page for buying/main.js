

/* ===== Variables ===== */
// 從local storage取值計算出購物籃裡小計
document.getElementById('ProductTTL').innerText = 
`$${
  parseInt(localStorage.getItem('ProductA'))*460+
  parseInt(localStorage.getItem('ProductB'))*695+
  parseInt(localStorage.getItem('ProductC'))*640
}`

// 判斷local storage是否有值, 如有值則放進products陣列中
var products = [];
if (parseInt(localStorage.getItem('ProductA')) > 0) {
  products.push(
    {
      id: 1,
      name: '五月花 高吸力柔韌雙層擦手紙',
      img: "../Product Page/Image/Tissue Ten.jpg",
      tag: `$${parseInt(localStorage.getItem('ProductA')) * 460}`,
      price: 460,
      quantity: parseInt(localStorage.getItem('ProductA'))
    }
  )  
}

if (parseInt(localStorage.getItem('ProductB')) > 0) {
  products.push(
    {
      id: 2,
      name: '五月花 雙層單抽 多用途衛生紙',
      img: "../Product Page/Image/Tissue Three.png",
      tag: `$${parseInt(localStorage.getItem('ProductB')) * 695}`,
      price: 695,
      quantity: parseInt(localStorage.getItem('ProductB'))
    }
  )
}

if (parseInt(localStorage.getItem('ProductC')) > 0) {
  products.push(
    {
      id: 3,
      name: '五月花迷你擦手紙',
      img: "../Product Page/Image/Tissue Five.jpeg",
      tag: `$${parseInt(localStorage.getItem('ProductC')) * 640}`,
      price: 640,
      quantity: parseInt(localStorage.getItem('ProductC'))
    }
  )
}


// 原設計者程式碼
// const products = [
//   {
//     id: 1,
//     name: '五月花 高吸力柔韌雙層擦手紙',
//     img: './images/Tissue One.jpeg',
//     tag: parseInt(localStorage.getItem('ProductA'))*460,
//     price: 460,
//     quantity: parseInt(localStorage.getItem('ProductA')) 
//   },
// ]

/* ===== Nodes ===== */
const cartItems = document.getElementById('cart__items')
const form = document.getElementById('form')
const formParts = form.querySelectorAll('.form__part')
const stepControl = document.getElementById('stepper')
const steps = stepControl.querySelectorAll('.step')
const btnPanel = document.querySelector('.form__btn')
const prevBtn = btnPanel.querySelector('.form__btn--previous')
const nextBtn = btnPanel.querySelector('.form__btn--next')
const cart = document.getElementById('cart')
const darkModeBtn = document.querySelector('.nav__icon--mode')

let currentStep = 0
let currentShippingFee = 0

/* ===== Functions ===== */
// 0. 轉換 $$ 符號
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

  // formatter.format(2500)
  // 1. 載入購物車商品
  ; (function () {
    products.forEach((product) => {
      cartItems.innerHTML += `
      <div class="cart__item" data-id="${product.id}">
        <img src="${product.img}" alt="product image" class="item__img">
        <div class="item__info">
          <div class="item__detail">
            <span class="item__name">${product.name}</span>
            <div class="item__quantity">
              <div class="item__quantity--btn item__quantity--minus">－</div>
              <span class="item__quantity--number">${product.quantity}</span>
              <div class="item__quantity--btn item__quantity--plus">＋</div>
            </div>
          </div>
          <span class="item__price" data-price="${product.price}">${product.tag}</span>
        </div>
      </div>
    `
    })
  })()

// 2. 切換 step 順序 & 表單內容
function switchFormStep(e) {
  e.preventDefault()
  const thisStep = steps[currentStep]
  const nextStep = steps[currentStep + 1]
  const prevStep = steps[currentStep - 1]
  const thisPart = formParts[currentStep]
  const nextPart = formParts[currentStep + 1]
  const prevPart = formParts[currentStep - 1]

  if (e.target.classList.contains('form__btn--next')) {
    if (currentStep === 2) {
      return checkOut()
    }
    thisStep.classList.toggle('active')
    thisStep.classList.toggle('checked')
    nextStep.classList.toggle('active')
    thisPart.classList.toggle('d-none')
    nextPart.classList.toggle('d-none')
    currentStep += 1
  } else if (e.target.classList.contains('form__btn--previous')) {
    thisStep.classList.toggle('active')
    prevStep.classList.toggle('checked')
    prevStep.classList.toggle('active')
    thisPart.classList.toggle('d-none')
    prevPart.classList.toggle('d-none')
    currentStep -= 1
  }

  switchBtnStyle()
}

// 3. 修改 button 寬度 & 文字內容
function switchBtnStyle() {
  if (currentStep === 0) {
    prevBtn.setAttribute('disabled', true)
    nextBtn.classList.add('first-step')
  } else {
    prevBtn.removeAttribute('disabled')
    nextBtn.classList.remove('first-step')
  }

  if (currentStep === 2) {
    nextBtn.innerHTML = '確認下單'
  } else {
    nextBtn.innerHTML = '下一步 &longrightarrow;'
  }
}

// 4. 調整購物車商品數量 & item 小計
function cartItemQty(e) {
  if (e.target.classList.contains('item__quantity--btn')) {
    const thisItem = e.target.closest('.cart__item')
    const qtyNode = thisItem.querySelector('.item__quantity--number')
    const priceNode = thisItem.querySelector('.item__price')
    const thisPrice = priceNode.dataset.price
    let thisQty = qtyNode.innerHTML

    if (e.target.classList.contains('item__quantity--minus') && thisQty > 0) {
      thisQty--
    } else if (e.target.classList.contains('item__quantity--plus')) {
      thisQty++
    }
    qtyNode.innerHTML = thisQty
    priceNode.innerHTML = formatter.format(Number(thisPrice) * Number(thisQty))
  }
  totalAmount()
}

// 5. 運費計算
function deliveryFee(e) {
  if (e.target.type === 'radio') {
    const fee = Number(e.target.dataset.fee)
    if (fee === 0) {
      cart.querySelector('.cart__shipping--fee').innerHTML = '免費'
      currentShippingFee = 0
    } else if (fee === 500) {
      cart.querySelector('.cart__shipping--fee').innerHTML = '$500'
      currentShippingFee = 500
    }
    totalAmount()
  }
}

// 6. 總價計算
function totalAmount() {
  const cartItem = cart.querySelectorAll('.cart__item')
  const sumPrice = cart.querySelector('.cart__sum--price')
  let sum = 0

  cartItem.forEach(item => {
    const itemPrice = item.querySelector('.item__price')
    sum += Number(itemPrice.innerHTML.split('$')[1].split(',').join(''))
  })
  sumPrice.innerHTML = formatter.format(sum + currentShippingFee)
}

// 7. 暗黑模式
function darkModeToggle(e) {
  if (!e.target.classList.contains('dark-mode')) {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
  e.target.classList.toggle('dark-mode')
}

// 8. 送出結帳
function checkOut() {
  Swal.fire('您的消費金額為 ' + cart.querySelector('.cart__sum--price').innerHTML + ' 元，<BR><BR>謝謝您的消費！').then(function () {
    document.location.href = "../Main page/Index.HTML";
  });

}


/* ===== Event Listener ===== */
btnPanel.addEventListener('click', switchFormStep)
cart.addEventListener('click', cartItemQty)
form.addEventListener('click', deliveryFee)
// darkModeBtn.addEventListener('click', darkModeToggle)
