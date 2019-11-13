function Master() {
    let mediaPositionControl = document.querySelector('#media-position');

    let config = {
        selectors: {
            parent: 'ul',
            children: 'li',
            mediaControl: '#media-control'
        },

        content: {
            video: 'video.html',
            presentation: 'presentation.html'
        }
    };

    let items = [];

    this.setItems = function(menu) {
        items = menu;

        renderMenu();
    };

    function renderMenu() {
        document.querySelector(config.selectors.parent).querySelectorAll(config.selectors.children).forEach(function(el) {
            el.remove();
        });

        const menuWrapper = document.querySelector(config.selectors.parent);

        // render items links
        items.map((item, idx) => {
            let el = document.createElement(config.selectors.children);
            el.textContent = item.name;
            el.setAttribute('data-idx', idx);

            if(undefined === item.type && undefined === item.audio) {
                el.setAttribute("class", "no-action");
            }

            menuWrapper.appendChild(el);
        });
    }

    let slave = null;

    let handleMenuClicked = function(e) {
        let idx = e.target.getAttribute('data-idx'),
            item = items[idx];

        document.querySelectorAll('.current').forEach(e => helper.removeClass('current', e));
        helper.addClass('current', e.target);

        slave.postMessage({action: 'content', data: item}, '*');
    }.bind(this);

    let handleControlsClicked = function(e) {
        let action = e.target.getAttribute('data-action'),
            value = e.target.getAttribute('data-value');

        if('volume' === action) {
            value = e.target.value / 100;
        } else if('rewind' === action) {
            value = e.target.value;

            console.log(value);
        }

        let message = {
            action: 'command',
            command: action
        };

        if(undefined !== value) {
            message.value = value;
        }

        if(action) {
            slave.postMessage(message, '*');
        }
    }.bind(this);

    let handleMessageFromSlave = function(e) {
        switch(e.data.key) {
            case 'mediaPosition':
                mediaPositionControl.value = e.data.value;
                break;
        }
    };

    this.openSlave = () => {
        //// init
        slave = window.open();
        slave.location.href = 'slave.html';
        slave.allow = ['autoplay', 'fullscreen'];
    };

    // add handler
    document.querySelector(config.selectors.parent).addEventListener('click', handleMenuClicked);
    document.querySelector(config.selectors.mediaControl).addEventListener('click', handleControlsClicked);
    document.querySelector(config.selectors.mediaControl).addEventListener('change', handleControlsClicked);

    window.addEventListener('message', handleMessageFromSlave)
}


