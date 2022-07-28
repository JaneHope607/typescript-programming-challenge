import dayjs from "dayjs";
import * as fs from "fs";
import { Interval, WorkerList } from "./index";

// parse input file
export const parseFile = (
    inputFilePath: string
): WorkerList[] => {
    // read file
    const fileContent = fs.readFileSync(inputFilePath, "utf8");
    const formattedContent = fileContent.split("\n");
    const workerAvailableList = formattedContent.map((line) => getWorkers(line));
    return workerAvailableList;
}

//  build worker object (worker ID and worker intervals)
export const getWorkers = (
    line: string
): WorkerList => {
    //separate worker ID from string
    const workerID = parseInt(line.substring(0, line.indexOf("@")));
    // separate intervals from rest of string into array of intervals
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

// get earliest interval by start date/time
export const getEarliestInterval = (
    allIntervals: Interval[]
) => {
    return allIntervals.reduce((previous, current) => {
        return previous.start > current.start ? current : previous;
    });
}

// get latest interval by start date/time
export const getLatestInterval = (
    allIntervals: Interval[]
) => {
    return allIntervals.reduce((previous, current) => {
        return previous.end > current.end ? previous : current;
    });
}

// takes two intervals and if any overlap between them then  - if so reutrn these 
export const getOverlappingIntervals = (
    interval1: Interval,
    interval2: Interval
  ) => {
        const intervalStart =  interval1.start > interval2.start ? interval1 : interval2;
        const intervalEnd = interval1.end < interval2.end ? interval1 : interval2;
        if (intervalStart.start >= intervalEnd.end || interval1 === interval2) 
            return null;
        
        return { start: intervalStart.start, end: intervalEnd.end };    
};

export const mergeOverlappingIntervals = (
    intervals: Interval[]
) => {
    // sort all overlapping intervals from the earliest to latest datetime 
    const sortedOverlappingIntervals = intervals.sort((interval1, interval2) => (interval2.start < interval1.start ? 1 : -1));
	let currentInterval = sortedOverlappingIntervals[0];
    const overlappingIntervals: Interval[] = [];

    // merge overlapping intervals to one interval
    for (let i = 1; i < sortedOverlappingIntervals.length; i+=1 ) {
        if (sortedOverlappingIntervals[i].start.isSame(currentInterval.end) || sortedOverlappingIntervals[i].start.isBefore(currentInterval.end)) {
            currentInterval.end = !sortedOverlappingIntervals[i] || currentInterval.end.isAfter(sortedOverlappingIntervals[i].end) ? currentInterval.end : sortedOverlappingIntervals[i].end;
        } else {
            overlappingIntervals.push(currentInterval);
            currentInterval = sortedOverlappingIntervals[i];
        }
    }
    overlappingIntervals.push(currentInterval);
    return overlappingIntervals;
};

// format for third question to string
export const formatIntervalsToString = (
    formattedInterval: Interval
): string => {
    const startInterval = formattedInterval.start.toISOString();
    const endInterval = formattedInterval.end.toISOString();
    return `${startInterval}/${endInterval}`;
};