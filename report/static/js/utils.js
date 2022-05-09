function debounce(fn, timeout) {
    let timer = null;

    return function(...args) {
        clearInterval(timer);

        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, timeout)
    }
}