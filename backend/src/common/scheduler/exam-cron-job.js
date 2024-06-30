const cron = require('node-cron');
const fs = require('fs');
const distributeExamPapers = require('./exam-service.js');

// Function to generate cron expression for 10 minute before given time
function getCronExpressionForOneMinuteBefore(hour, minute, date = '*', month = '*') {
    let newMinute = minute - 10;
    let newHour = hour;
    let newDate = date;
    let newMonth = month;

    if (newMinute < 0) {
        newMinute = 59;
        newHour = hour - 1;
        if (newHour < 0) {
            newHour = 23;
        }
    }

    return `${newMinute} ${newHour} ${newDate} ${newMonth} *`;
}

const examPapers = [
    { id: 'paper1', filePath: '/paper1.pdf' },
    { id: 'paper2', filePath: '/paper2.pdf' }
];

const invigilators = [
    { id: 'inv1', email: 'inv1@example.com' },
    { id: 'inv2', email: 'inv2@example.com' }
];

const setupCronJobs = (jobTimes) => {

    Object.entries(jobTimes).forEach(([jobName, jobTime]) => {
        const cronExpression = getCronExpressionForOneMinuteBefore(
            jobTime.hour,
            jobTime.minute,
            jobTime.date,
            jobTime.month
        );
        cron.schedule(cronExpression, () => {
            const data = `${jobName} is running ${new Date()}\n`;
            fs.appendFile('logs.txt', data, (err) => {
                if (err) {
                    console.log('Error appending to file:', err);
                } else {
                    console.log(`Data added to file at time ${new Date()}`);
                }
            });
            console.log(`Running ${jobName}`);
            distributeExamPapers(examPapers, invigilators);
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata"
        });
    });
};

module.exports = setupCronJobs;