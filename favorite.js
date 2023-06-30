const Base_URL = 'https://webdev.alphacamp.io'
const Index_URL = Base_URL + '/api/movies/'
const Poster_URL = Base_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoritemovies')) || []  /* 透過localStorage的讀取功能，將收藏資料儲存至一變數中，以進行閱覽*/

const datapanel = document.querySelector("#data-panel")
const searchform = document.querySelector("#search-form")

const searchInput = document.querySelector("#search-input")


// 渲染電影清單
function rendermovies(data) {
  let rawHTML = ''

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
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>`
  });

  datapanel.innerHTML = rawHTML
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

// function addtofavorite(id) {
//   const list = JSON.parse(localStorage.getItem('favoritemovies')) || []
//   const movie = movies.find((movie) => movie.id === id)
//   if (list.some((movie) => movie.id === id)) {
//     return alert("此電影已經在收藏名單中")
//   }
//   list.push(movie)
//   localStorage.setItem('favoritemovies', JSON.stringify(list))
// }


function removeFromFavorite(id) {                                   /*  刪除收藏名單函式*/
  const movieindex = movies.findIndex((movie) => movie.id === id)   /*  輸入(點擊)的id，如果和movies中的id符合，則此id會被傳入movieindex中*/
  // console.log(movieindex)
  movies.splice(movieindex, 1)                                      /*  使用splice功能，刪除符合id之資料*/
  localStorage.setItem('favoritemovies', JSON.stringify(movies))    /*  將刪除後資料，再寫進localstorage中*/
  rendermovies(movies)                                              /*  最後呼叫rendermovies函式，重新渲染網頁*/
}

// 進行點擊more按鈕之式件委託
datapanel.addEventListener('click', function OnPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {                    /* 點擊MORE按鈕觸發事件*/
    showmoviemodal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {        /*  點擊X按鈕觸發事件*/
    removeFromFavorite(Number(event.target.dataset.id))             /*  呼叫函式，並傳入id作為參數*/
  }
})

rendermovies(movies)

// 針對搜尋按鈕設置監聽事件
// searchform.addEventListener('submit', function onbuttonsubit(event) {
//   event.preventDefault()
//   const keyword = searchInput.value.trim().toLowerCase()
//   let filtermovies = []

//   // if (keyword.length === 0) {
//   //   return alert("Please enter a vaild string.")
//   // }

//   // 使用filter函式
//   filtermovies = movies.filter((movie) =>
//     movie.title.toLowerCase().includes(keyword)
//   )

//   if (filtermovies.length === 0) {
//     return alert(`您輸入的關鍵字:${keyword}沒有符合條件的電影`)
//   }

//   // 使用迴圈，針對配對成功之資料，進行渲染網頁動作
//   //   for (const movie of movies) {
//   //     if (movie.title.toLowerCase().includes(keyword)) {
//   //       filtermovies.push(movie)
//   //     }
//   //   }


//   rendermovies(filtermovies)
// })

// 進行網路連線
// axios
//   .get(Index_URL)
//   .then((response) => {
//     // 在response前面加...(稱為展開運算子)可以直接取出陣列裏頭的值，取出來的值放到movies陣列中
//     movies.push(...response.data.results)
//     // 呼叫函式
//     rendermovies(movies)
//   })
//   .catch((error) => {
//     console.log(error)
//   })