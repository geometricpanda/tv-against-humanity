export function throttle(delay) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), delay);
    });
}
