import { TASK_STATUES } from "../config.mjs"

export const getNameFromValue = (choices, value) => choices.find(p => p.value === value).name

export const getBoldText = text => `*${text}*`

export const getTaskLink = url => ` ([Task](${url}))`

export const getTasksText = (taskOutput, tasks, isBlocked) =>
    tasks.reduce((acum, task) =>
        acum += `\n${task.taskStatus && !isBlocked ? getNameFromValue(TASK_STATUES, task.taskStatus) : ''} - ${capatiliseFirstWord(task.taskDescription)}${task.taskUrl ? getTaskLink(task.taskUrl) : ''}${isBlocked ? ': ' + task.blocked : ''}`
    , taskOutput)

export const getOrderFromValue = val => TASK_STATUES.find(ts => ts.value === val).order

export const isValidUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

const capatiliseFirstWord = (string) => string[0].toUpperCase() + string.substring(1, string.length)

