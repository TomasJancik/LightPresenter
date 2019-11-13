let video = document.querySelector('video');

window.addEventListener('message', function(e) {
    let data = e.data;

    switch(data.key) {
        case 'src':
            video.setAttribute('src', data.value);
            break;
        default:
            videoControls[data.key].call()
    }
});

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