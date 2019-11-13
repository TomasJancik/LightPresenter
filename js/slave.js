function Slave() {
    let video = document.querySelector('video'),
        audio = document.querySelector('audio'),
        iframe = document.querySelector('iframe'),
        presentation = document.querySelector('#presentation'),
        messagePostingDelay = 500,
        messagePostingInterval,
        onVideoEnd = false;

    this.hideAll = function() {
        video.pause();
        helper.hide(video);
        helper.hide(iframe);
        helper.hide(presentation);
    };

    this.switchTo = function(target) {
        this.hideAll();
        helper.show(target);
    };

    this.showSlide = function(type, value, aud, loop, videoEnd) {
        console.log('Show slide', arguments);

        switch(type) {
            case 'video':
                onVideoEnd = videoEnd || false;
                video.setAttribute('src', value);
                this.switchTo(video);
                video.play();
                messagePostingInterval = setInterval(sendMediaPosition, messagePostingDelay);

                break;
            case 'url':
                iframe.src = value;
                this.switchTo(iframe);
                clearInterval(messagePostingInterval);

                break;
        }

        if(aud) {
            console.log('Audio request', aud);
            if('stop' === aud) {
                console.log('Audio stop');
                audio.pause();
                audio.removeAttribute('loop')
            } else {
                console.log('Audio change', aud);
                audio.setAttribute('src', aud);
                audio.play();
                if(loop) {
                    audio.setAttribute('loop', true);
                } else {
                    audio.removeAttribute('loop');
                }

                messagePostingInterval = setInterval(sendMediaPosition, messagePostingDelay);
            }
        }
    };

    let getMedia = function() {
        return video.style.display === 'block' ? video : audio;
    };

    let sendMediaPosition = function() {
        let position = Math.floor(getMedia().currentTime / (getMedia().duration / 1000));

        window.opener.postMessage({key: 'mediaPosition', value: position}, '*');
    };

    let handleMessage = (data) => {
        console.log("handleMessage", data);

        switch(data.action) {
            case 'content':
                this.showSlide(data.data.type, data.data.value, data.data.audio || false, data.data.loop || false, data.data.videoEnd || false);
                break;
            case 'command':
                switch(data.command) {
                    case 'play':
                        getMedia().play();
                        messagePostingInterval = setInterval(sendMediaPosition, messagePostingDelay);
                        break;
                    case 'pause':
                        getMedia().pause();
                        clearInterval(messagePostingInterval);
                        break;
                    case 'restart':
                        getMedia().currentTime = 0;
                        clearInterval(messagePostingInterval);
                        break;
                    case 'volume':
                        getMedia().volume = data.value;
                        clearInterval(messagePostingInterval);
                        break;
                    case 'rewind':
                        getMedia().currentTime = (getMedia().duration / 1000) * data.value;
                        getMedia().play();
                        messagePostingInterval = setInterval(sendMediaPosition, messagePostingDelay);
                        break;
                }

        }
    };

    let handleVideoEnd = () => {
        console.log("video ended", {
            action: "content",
            data: onVideoEnd,
        });

        if(false !== onVideoEnd) {
            handleMessage({
                action: "content",
                data: onVideoEnd,
            })
        }
    };

    // init
    // hide everything
    this.hideAll();

    //show logo
    this.showSlide('url', 'slides/blank/index.html');

    // add handler
    window.addEventListener('message', function(e) {
        let data = e.data;

        handleMessage(data);
    }.bind(this));
    video.addEventListener("ended", () => {
        if(onVideoEnd) {
            handleVideoEnd();
        }
    })
}

let s = new Slave();



let videoControls = {
    play: function() {
        video.play();
    },

    pause: function() {
        video.pause();
    },

    restart: function() {
        video.currentTime = 0;
    }
};