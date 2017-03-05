(function(){
    
    let offset500;

    window.addEventListener('scroll',function(e){
        let ht = document.getElementById('header_title')
        if(window.pageYOffset > 500 && !offset500){
            ht.style.left = "500px";
            ht.style.opacity = "0";
            offset500 = true;
        }
        if(window.pageYOffset < 500 && offset500){
            ht.style.left = "0px";
            ht.style.opacity = "1";
            offset500 = false;
        }
        document.getElementById('main_header').style.backgroundPositionY = window.pageYOffset/7 *-1 + 'px';
    })
})()