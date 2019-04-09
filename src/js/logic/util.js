function random(from, to) {
    to++;
    return Math.floor(from + (Math.random() * (to - from)));
}


export {random};