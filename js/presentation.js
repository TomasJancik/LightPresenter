function Presentation()  {
    let photos,
        currentIdx = 0,
        imgs = [],
        target = document.querySelector('#presentation'),
        delay = 8000,
        interval;

    this.setPhotos = function(newPhotos) {
        photos = newPhotos;
    };

    function showNextPhoto() {
        let src = photos[currentIdx].src,
            text = photos[currentIdx].text,
            p = document.createElement('p'),
            img = document.createElement('img');

        p.appendChild(img);

        img.setAttribute('src', src);


        if(text) {
            let span = document.createElement('span');
            span.textContent = text;

            p.appendChild(span);
        }

        p.setAttribute('class', 'show');
        target.appendChild(p);

        console.log(imgs)

        removePreviousPhoto();
        imgs.push(p);

        currentIdx++;
        if(currentIdx === photos.length) {
            currentIdx = 0;
        }
    };

    function removePreviousPhoto() {
        if(imgs.length) {
            if(imgs.length > 1) {
                imgs[0].remove();
                imgs.shift();
            }

            imgs[0].setAttribute('class', 'hide');
        }

    }

    this.start = function() {
        showNextPhoto();
        interval = setInterval(showNextPhoto, delay);
    }
}
