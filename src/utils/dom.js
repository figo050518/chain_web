export function watchSizeChange(element, onChange) {
    if (window.ResizeObserver)
        return new ResizeObserver(onChange).observe(element)
}

export function unwatchSizeChange(watcher, element) {
    if (window.ResizeObserver) {
        if (watcher instanceof window.ResizeObserver) {
            if (element) watcher.unobserve(element);
            else watcher.disconnect();
        }
    }
}
