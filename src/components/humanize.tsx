export function humanize(x, d = 2) {
    return x.toFixed(d).replace(/\.?0*$/, '');
}