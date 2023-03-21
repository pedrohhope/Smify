const musiccards = document.querySelectorAll('.boxes')
const usercontainers = document.querySelectorAll('.users-container')
const homebutton = document.querySelector('.home-button')
const menu = document.querySelector('.menu')
const openmenu = document.querySelector('.open-menu')
const closemenu = document.querySelector('.close-menu')


async function getUsers(){
    const users = await fetch("users.json")
    const usersData = await users.json()
    return usersData
}


async function loadDisplay(){
    const users = await getUsers()
    const usersDiv = document.getElementById("users")
    const usersMenuDiv = document.querySelector(".users-menu")
    const navcontainer = document.querySelector('nav')


    
    function navconfigure(nav,close,open){
        nav.classList.toggle('active')
        close.classList.toggle('active')
        open.classList.toggle('active')
     }


    closemenu.addEventListener('click', () =>{
        navconfigure(navcontainer,closemenu,openmenu)
    })

    openmenu.addEventListener('click', () =>{
        navconfigure(navcontainer,closemenu,openmenu)
    })

    navcontainer.addEventListener('click', () =>{
        navconfigure(navcontainer,closemenu,openmenu)
    })
    

    function Renderizar(user) {
        const musics = user.playlist.musics.map((music) => `
            <div class="box">
                <div class="box-container">
                    <img src="${music.image}" alt="" class="music-image">
                    <div class="play-button" id="${music.title}-play" onclick="audioplay(${music.title})"><img src="images/play-button.png" alt=""></div>
                    <div class="stop-button" id="${music.title}-stop" onclick="audiostop(${music.title})"><img src="images/stop-button.png" alt=""></div>
                    <audio src="${music.audio}" id="${music.title}"></audio>
                    <h2>${music.title}</h2>
                    <p>${music.artist}</p>
                </div>
            </div> `
            );

        usersDiv.insertAdjacentHTML("beforeend", `
            <div class="users-container" id="${user.name}">
                <div class="user-musics">
                    <div>
                        <h1>${user.name} PlayList</h1>
                    </div>
                    <div class="boxes">
                        ${musics.join("")}
                    </div>
                </div>
            </div>
        `);
    

    }

    users.forEach((user) => {
        usersMenuDiv.insertAdjacentHTML("beforeend", `
            <li class="UsersMenuList" playlist-id="${user.name}" id="${user.name}-button">PlayList Do ${user.name}</li>
        `)

        const buttonclick = document.querySelector(`#${user.name}-button`)
        

        buttonclick.addEventListener('click', (event) =>{
            const playlist = document.getElementById(event.target.getAttribute('playlist-id'))
            const playlistheight = playlist.offsetTop
            smoothScrollTo(0, playlistheight)
        })

        const homebutton = document.querySelector('.home-button')

        homebutton.addEventListener('click', () =>{
            smoothScrollTo(0,0)
        })


        /**
 * 
 * @param {int} endX: 
 * @param {int} endY:
 * @param {int} duration: 
 */
function smoothScrollTo(endX, endY, duration) {
    const startX = window.scrollX || window.pageXOffset;
    const startY = window.scrollY || window.pageYOffset;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const startTime = new Date().getTime();
  
    duration = typeof duration !== 'undefined' ? duration : 600;
  
    const easeInOutQuart = (time, from, distance, duration) => {
      if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
      return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
    };
  
    const timer = setInterval(() => {
      const time = new Date().getTime() - startTime;
      const newX = easeInOutQuart(time, startX, distanceX, duration);
      const newY = easeInOutQuart(time, startY, distanceY, duration);
      if (time >= duration) {
        clearInterval(timer);
      }
      window.scroll(newX, newY);
    }, 1000 / 60); // 60 fps
  };

        Renderizar(user)
    });
}




function audioplay(song) {
    const playbutton = document.getElementById(`${song.getAttribute('id')}-play`)
    const stopbutton = document.getElementById(`${song.getAttribute('id')}-stop`)

    stopbutton.style.display = 'flex'
    playbutton.style.display = 'none'
    

    const audio = document.querySelectorAll('audio')

    audio.forEach((musics) =>{
        if(musics.play()){
            musics.pause()
        }
        var elms = document.querySelectorAll("*[style]");
        elms.forEach((a) =>{
            if(a.outerHTML.search('flex') > 0){
                const musicname = a.id.split('-')
                if(musicname[0] !== song.id){
                    let play
                    let stop
                    if(musicname[1] == "stop"){
                        stop = a.id.toString()
                        play = musicname[0] + "-play"
                    }
                    if(musicname[1] == "play"){
                        play = a.id.toString()
                        stop = musicname[0] + "-stop"
                    }

                    const playbtn = document.getElementById(play)
                    const stopbtn = document.getElementById(stop)

    
                    stopbtn.style.display = 'none'
                    playbtn.style.display = 'flex'
        
                }
            }
        })
    })

    song.play()

}

function audiostop(song){

    const playbutton = document.getElementById(`${song.getAttribute('id')}-play`)
    const stopbutton = document.getElementById(`${song.getAttribute('id')}-stop`)

    stopbutton.style.display = 'none'
    playbutton.style.display = 'flex'
    
    
    
    const audio = document.querySelectorAll('audio')

    song.pause()
}


loadDisplay() 
