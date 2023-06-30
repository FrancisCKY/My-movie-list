const Base_URL = 'https://webdev.alphacamp.io'
const Index_URL = Base_URL + '/api/movies/'
const Poster_URL = Base_URL + '/posters/'

const movies = []
let filtermovies = []

const datapanel = document.querySelector("#data-panel")
const searchform = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")

const movie_per_page = 12


// 渲染電影清單
function rendermovies(data) {
  // 製作template
  let rawHTML = ''
  // 將資料逐筆放入參數，並實作網頁卡片
  data.forEach(item => {
    rawHTML += `<div class="card" style="width: 18rem;">
        <img
          src="${Poster_URL + item.image}"
          class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
            data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>`
  });
  // 取得的資料，放回HTML
  datapanel.innerHTML = rawHTML
}

// 渲染分頁
function renderpaginator(amount) {
  // 計算總頁數，透過Math.ceil函式，直接無條件進位
  const numberofpages = Math.ceil(amount / movie_per_page)
  // 製作template
  let rawHTML = ''

  // 迴圈從1開始計算，以動態產生頁面
  for (let page = 1; page <= numberofpages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }
  // 取得的資料，放回HTML
  paginator.innerHTML = rawHTML
}


// 取得單一網頁
function getmoviesbypage(page) {
  // 建立起點
  const data = filtermovies.length ? filtermovies : movies
  const startIndex = (page - 1) * movie_per_page
  // 將movies陣列資料進行切割
  return data.slice(startIndex, startIndex + movie_per_page)
}


function showmoviemodal(id) {
  const modaltitle = document.querySelector('#movie-modal-title')
  const modalimage = document.querySelector('#movie-modal-image')
  const modaldate = document.querySelector('#movie-modal-date')
  const modaldescription = document.querySelector('#movie-modal-description')

  axios.get(Index_URL + id)
    .then((response) => {
      // 將response.data.results設定為一變數，方便使用
      const data = response.data.results
      modaltitle.innerText = data.title
      modaldate.innerText = "Rlease date:" + data.release_date
      modaldescription.innerText = data.description
      modalimage.innerHTML = `<img
      src="${Poster_URL + data.image}"
      alt="moveie-poster" class="img-fluid">`
    })

}

function addtofavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoritemovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏名單中")
  }
  list.push(movie)
  localStorage.setItem('favoritemovies', JSON.stringify(list))
}


// 進行點擊more按鈕之式件委託
datapanel.addEventListener('click', function OnPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {                 /* 點擊MORE按鈕觸發事件*/
    showmoviemodal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {        /*  點擊+按鈕觸發事件*/
    addtofavorite(Number(event.target.dataset.id))
  }
})

// 針對搜尋按鈕設置監聽事件
searchform.addEventListener('submit', function onbuttonsubit(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()


  // if (keyword.length === 0) {
  //   return alert("Please enter a vaild string.")
  // }

  // 使用filter函式
  filtermovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filtermovies.length === 0) {
    return alert(`您輸入的關鍵字:${keyword}沒有符合條件的電影`)
  }

  // 使用迴圈，針對配對成功之資料，進行渲染網頁動作
  //   for (const movie of movies) {
  //     if (movie.title.toLowerCase().includes(keyword)) {
  //       filtermovies.push(movie)
  //     }
  //   }
  // 重製分頁器
  renderpaginator(filtermovies.length)
  // 預設採第一頁
  rendermovies(getmoviesbypage(1))
})

// 在分頁器上，設置監聽器
paginator.addEventListener('click', function onpaginator(event) {
  // 如果點擊的名稱不是<a>超連結，則立即中斷程式碼
  if (event.target.tagName !== 'A') return
  // 此處有使用到dataset，因此在建立<li>標籤時，就會將data標籤放入進去
  const page = Number(event.target.dataset.page)
  // 先使用getmoviesbypage函式，取得單一網頁資料，再利用它，將網頁重新渲染
  rendermovies(getmoviesbypage(page))
})

// 進行網路連線
axios
  .get(Index_URL)
  .then((response) => {
    // 在response前面加...(稱為展開運算子)可以直接取出陣列裏頭的值，取出來的值放到movies陣列中
    movies.push(...response.data.results)
    // 呼叫函式
    renderpaginator(movies.length)
    rendermovies(getmoviesbypage(1))  /* 原先參數為movies(全部)，後續改成取得單一網頁 */
  })
  .catch((error) => {
    console.log(error)
  })