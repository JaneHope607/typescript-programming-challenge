import dayjs, { Dayjs } from 'dayjs';
import * as fs from 'fs';
import { Interval, WorkerList } from "./index";

// parse input file
export const parseFile = (
    inputFilePath: string
): WorkerList[] => {
    const fileContent = fs.readFileSync(inputFilePath, "utf8");
    const formattedContent = fileContent.split("\n");
    const workerAvailableList = formattedContent.map((line) => getWorkers(line));
    return workerAvailableList;
}

//  build worker object (worked ID and intervals)
export const getWorkers = (
    line: string
): WorkerList => {
    const workerID = parseInt(line.substring(0, line.indexOf("@")));
    const workerIntervals = line.substring(line.indexOf("[") + 1, line.indexOf("]")).split(",");
    const formattedIntervals = workerIntervals.map(interval =>
        interval.split("/").map((intervalString => dayjs(intervalString))));   
    const intervals = formattedIntervals.map(interval => {
        return { start: interval[0], end: interval[1] }
    })
    
    return {
        workerID: workerID,
        intervals: intervals
    };
};

export const getAllIntervals = (
    workers: WorkerList[]
) => {
    const allIntervals: Interval[] = [];
    workers.forEach((worker) => {
        worker.intervals.forEach(interval => {
            allIntervals.push(interval);
        })
    })
    return allIntervals;
};

export const getEarliestInterval = (
    allIntervals: Interval[]
) => {
    return allIntervals.reduce((previous, current) => {
        return previous.start > current.start ? current : previous;
    });
}

export const getLatestInterval = (
    allIntervals: Interval[]
) => {
    return allIntervals.reduce((previous, current) => {
        return previous.end > current.end ? previous : current;
    });
}
