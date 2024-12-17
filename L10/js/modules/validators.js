function formatTime(datetime) {
    if (!datetime) return "";
    const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    };
    let date = new Date();
    date.setHours(...datetime.split(':'));
    return date.toLocaleTimeString(undefined, options);
}

function formatDateTime(datetime) {
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    };
    let date = new Date(datetime);
    return date.toLocaleDateString("de-DE", options).replace(',', '');
}

function isOrderTimeValid(time) {
    try {
        // let [hours, minutes] = time.split(':');
        // hours = +hours;
        // minutes = +minutes;
        
        // let date = new Date();

        // if (!hours || hours < 7 || hours > 23) return false;
        // if (minutes < 0 || minutes >= 60 || minutes % 5 != 0
        //     || (hours == 23 && minutes != 0)
        // ) return false;

        // let now = new Date();
        // if (hours < now.getHours() 
        //     || (hours == now.getHours() && minutes < now.getMinutes())
        // ) return false;

        let [hours, minutes] = time.split(':');
        if (!hours || !minutes) return false;
        if (Number(minutes) % 5 != 0) return false;

        let start = new Date();
        start.setHours("7", "00");
        let end = new Date();
        end.setHours("23", "00");

        let date = new Date();
        date.setHours(hours, minutes);

        if (!(start <= date && date <= end) || date < new Date()) return false;

        return true;
    } catch {
        return false;
    }
}

export {
    formatTime,
    formatDateTime,
    isOrderTimeValid,
};