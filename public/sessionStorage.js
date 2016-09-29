var pillsLi = $('.pills li');
function getPillActive() {
    var pillActiveIndex;
    pillsLi.each(function (index) {
        var element = $(this);
        var isElementActive = element.hasClass("active");
        if (isElementActive) {
            pillActiveIndex = index;
        }
    });
    return pillActiveIndex;
}

function setActivePill(indexOfPill) {
        
        if (!indexOfPill || indexOfPill == 0) {
            $('.pills a[href="#home"]').tab('show');
            
        } else if (indexOfPill == 1) {
            $('.pills a[href="#profile"]').tab('show');
            
        } 
}

window.onbeforeunload = function (e) {
    var activeIndex = getPillActive();
    localStorage.setItem('whichPillActive', activeIndex);
}

window.onload = function () {
    
    var activePill = localStorage.getItem('whichPillActive');
    
    setActivePill(activePill);
    document.body.style.display = "block";
}

