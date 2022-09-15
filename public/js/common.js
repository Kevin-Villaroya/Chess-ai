reduceRightHeader('friends-header-container');
reduceRightHeader('notifications-header-container');

function reduceHeaderLeft(){
    let headerLeft = document.getElementById("header-left");
    let elements = getElementsToReduce(headerLeft);

    for(let element of elements){
        element.classList.toggle("reduce-header-left");
    }

    headerLeft.classList.toggle("reduce-header-left");
}

function reduceRightHeader(idRightContainer){
    let headerRight = document.getElementById(idRightContainer);
    let elements = getElementsToReduce(headerRight);

    for(let element of elements){
        element.classList.toggle("reduce-right-header");
    }

    headerRight.classList.toggle("reduce-right-header");
}

function getElementsToReduce(element){
    if(element == null || element == undefined){
        return;
    }

    let elements = new Array();
    let children = element.children;

    for(let child of children){
        elements.push(child);

        let array = getElementsToReduce(child);

        if(array != null && array != undefined){
            elements = elements.concat(array);
        }
        
    }

    return elements;
}