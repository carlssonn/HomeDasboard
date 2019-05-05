import moment from 'moment';
import 'moment/locale/sv';

export const parseDepartures = response => {
  var numberOfMetros = 2;
  const departure = { deviations: [], times: [] };
  var metros = response.Metros;
  if (metros && metros.length > 0) {
    metros.forEach(metroDeparture => {
      if (numberOfMetros > 0) {
        var time = metroDeparture.TimeTabledDateTime;
        var departureDisplayTime = metroDeparture.DisplayTime;

        time = new moment(time);
        const timeLTFormatted = time.format('LT');

        const successfulMinDiffParse =
          numberOfMetros === 2 && timeLTFormatted !== departureDisplayTime;

        // console.log('diff', moment(time).diff(moment(), 'minutes'));

        var timeFormatted = successfulMinDiffParse
          ? ` (${departureDisplayTime})`
          : moment(time).diff(moment(), 'minutes')
          ? ` (${moment(time).diff(moment(), 'minutes')} min)`
          : '(0 min)';
        departure.times.push(timeLTFormatted);
        if (numberOfMetros === 2) {
          departure.times.push(timeFormatted);
        }
        departure.deviations = metros.Deviations
          ? metros.Deviations.map(d => {
              return { text: d.Text };
            })
          : [];
        numberOfMetros--;
      }
    });
  }

  return departure;
};
