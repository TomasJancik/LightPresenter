let helper = {
    addClass: function(className, e) {
        let currentClasses = e.getAttribute('class') || '';
        currentClasses = currentClasses.split(/\s/);

        if(-1 === currentClasses.indexOf(className)) {
            currentClasses.push(className)
        }

        e.setAttribute('class', currentClasses.join(' '));
    },

    removeClass: function(className, e) {
        let classes = e.getAttribute('class').split(/\s/);

        e.setAttribute('class', classes.filter(c => c !== className).join(' '));
    },


    show: function(el) {
        el.style.display = 'block';
    },

    hide: function(el) {
        el.style.display = 'none';
    }
};