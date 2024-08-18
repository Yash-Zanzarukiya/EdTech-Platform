const formateDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const durationString = `${hours > 0 ? `${hours} hrs ` : ''}${
        minutes > 0 ? `${minutes}:mins ` : ''
    }${hours < 1 ? `${seconds} secs` : ''}`;

    return durationString;
};

const formate = {
    formateDuration,
};

export default formate;
