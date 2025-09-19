import { TASK_STATUES } from "../config.mjs"

export const getNameFromValue = (choices, value) => choices.find(p => p.value === value).name
export const getBoldText = text => `*${text}*`
export const getTaskLink = url => ` ([Task](${url}))`
export const getTasksText = (taskOutput, tasks, isTabbed, isBlocked) =>
    tasks.reduce((acum, task) =>
        acum += `\n${isTabbed ? '\t' : ''} - ${task.taskDescription}${task.taskUrl ? getTaskLink(task.taskUrl) : ''}${isBlocked ? ': '+ task.blocked : ''}`
    , taskOutput)
export const getOrderFromValue = val => TASK_STATUES.find(ts => ts.value === val).order

