const formateDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);

    const durationString = `${hours > 0 ? `${hours} hrs ` : ''}${
        minutes > 0 ? `${minutes} min ` : ''
    }${hours < 1 ? `${seconds} sec` : ''}`;

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
