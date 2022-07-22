import  { Dayjs } from 'dayjs';
import {
  parseFile,
  getAllIntervals,
  getEarliestInterval,
  getLatestInterval
} from "./helpers";

export interface Interval {
  start: Dayjs;
  end: Dayjs;
}

export interface WorkerList {
  workerID: number;
  intervals: Interval[];
}

// What is the starting date and time (in UTC) of the earliest interval where any of the workers are free?
export async function solveFirstQuestion(
  inputFilePath: string
): Promise<string> {
  // TODO: Solve me!
  const workerList = parseFile(inputFilePath);
  const allIntervals = getAllIntervals(workerList);
  const earliestInterval = getEarliestInterval(allIntervals);
  return earliestInterval.start.toISOString();
}

// What is the ending date and time (in UTC) of the latest interval where any of the workers are free?
export async function solveSecondQuestion(
  inputFilePath: string
): Promise<string> {
  // TODO: Solve me!
  const workerList = parseFile(inputFilePath);
  const allIntervals = getAllIntervals(workerList);
  const latestInterval = getLatestInterval(allIntervals);
  return latestInterval.end.toISOString();
}

//What are the intervals of date and times (in UTC) where there are at least 2 workers free? Order your results in ascending order starting from the interval with the earliest start date and time and ensure your results are continuous, merging any overlapping intervals into a single interval where required.
export async function solveThirdQuestion(
  inputFilePath: string
): Promise<string[]> {
  // TODO: Solve me!

  
  return [];
}
