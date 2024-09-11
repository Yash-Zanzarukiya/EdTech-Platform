const formateDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const durationString = `${hours > 0 ? `${hours} h ` : ''}${
        minutes > 0
            ? (hours > 1 && minutes < 10 ? `0` : ``) + `${minutes} m `
            : ''
    }${hours < 1 ? (seconds < 10 ? `0` : ``) + `${seconds} s` : ''}`;

    return durationString;
};

const formateMonthNameYear = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
};

const formateDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString();
};

const formate = {
    formateDuration,
    formateMonthNameYear,
    formateDate,
};

export default formate;
